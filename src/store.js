import * as Tone from 'tone'
import { createEffect } from 'solid-js'
import { createStore, produce } from 'solid-js/store'

import instruments from './instruments'
import { load, save, stash, storage } from './storage'
import {
  getArrayElement,
  getRandomInt,
  getRandomIntExcept,
  version,
} from './utils'

const BASE_SCALE = ['E', 'F#', 'G#', 'A', 'B', 'C', 'D'] // Aeolian Dominant scale
const INSTRUMENT_AMOUNT = instruments.length
const initialnstrument = getRandomInt(0, instruments.length - 1)

let index = 0

const [store, setStore] = createStore({
  bpm: 70,
  createdWith: version,
  playing: false,
  initiated: false,
  saved: true,
  steps: [0],
  usedInstruments: [initialnstrument],
  tracks: [
    {
      id: 0,
      instrument: initialnstrument,
      ticks: [0],
      muted: false,
      note: getArrayElement(BASE_SCALE.filter((el) => !el.includes('#'))),
    },
  ],
})

const initContext = () => {
  Tone.setContext(new Tone.Context({ latencyHint: 'playback' }))
}

const loop = (time) => {
  for (let trackId = 0; trackId < store.tracks.length; trackId++) {
    let step = index % (trackId + 1)
    const currentTrack = store.tracks[trackId]
    if (!currentTrack.muted) {
      if (currentTrack.ticks[step]) {
        const instrumentId = currentTrack.instrument
        if (instruments[instrumentId]) {
          const instrument = instruments[instrumentId]
          const engine = instrument.engine
          const octave = instrument.octave || 4
          if (engine) {
            if (engine.name === 'NoiseSynth') {
              engine.triggerAttackRelease('32n', time)
            } else {
              engine.triggerAttackRelease(
                `${currentTrack.note}${octave}`,
                '32n',
                time
              )
            }
          }
        }
      }
    }

    Tone.Draw.schedule(() => {
      const steps = store.steps
      setStore('steps', trackId, step)
    }, time)
  }

  index++
}

const addTrack = () => {
  const tracksLength = store.tracks.length
  const ticks = new Array(tracksLength + 1).fill(0)
  // Pick a random instrument, but one that is not in use already
  const instrument = getRandomIntExcept(
    0,
    instruments.length - 1,
    store.usedInstruments
  )

  setStore(
    produce((store) => {
      store.tracks.push({
        id: tracksLength,
        instrument,
        ticks,
        muted: false,
        note: getArrayElement(BASE_SCALE),
      })
      store.usedInstruments.push(instrument)
    })
  )
}

const toggleTick = (trackId, tickId) => {
  if (trackId === 0) {
    // Start playing when first checkbox is checked
    if (!store.initiated) {
      Tone.start()
      Tone.Transport.bpm.value = store.bpm
      Tone.Transport.scheduleRepeat(loop, '16n')
      Tone.Transport.start()
      setStore(
        produce((store) => {
          store.initiated = true
          store.playing = true
        })
      )
    }
  }

  setStore(
    'tracks',
    (tracks) => tracks.id === trackId,
    produce((track) => {
      track.ticks[tickId] = !track.ticks[tickId]
    })
  )
  setStore('saved', false)

  // Enable next track if possible
  // This should only happen on first click
  if (trackId < INSTRUMENT_AMOUNT - 1 && trackId === store.tracks.length - 1) {
    addTrack()
  }
}

const toggleMute = (trackId) => {
  setStore(
    'tracks',
    (tracks) => tracks.id === trackId,
    produce((track) => {
      track.muted = !track.muted
    })
  )
  setStore('saved', false)
}

const setBpm = (newBpm) => {
  Tone.Transport.bpm.value = newBpm
  setStore(
    produce((store) => {
      store.bpm = newBpm
      store.saved = false
    })
  )
}

const saveStore = () => {
  Tone.Transport.stop()
  const steps = new Array(store.steps.length).fill(0)
  setStore(
    produce((store) => {
      store.initiated = false
      store.playing = false
      store.saved = true
      store.steps = steps
    })
  )
  stash(store)
  save()
}

const initAndPlay = () => {
  Tone.start()
  Tone.Transport.bpm.value = store.bpm
  Tone.Transport.scheduleRepeat(loop, '16n')
  Tone.Transport.start()

  setStore(
    produce((store) => {
      store.initiated = true
      store.playing = true
    })
  )
}

const reset = () => {
  location.href = '.'
}

const actions = {
  addTrack,
  initAndPlay,
  initContext,
  reset,
  saveStore,
  setBpm,
  toggleMute,
  toggleTick,
}

export { actions, loop, setStore, store }
