import * as Tone from 'tone'
import {
  createEffect,
  createSignal,
  For,
  onCleanup,
  onMount,
  Show,
} from 'solid-js'
import { useKeyDownEvent } from '@solid-primitives/keyboard'

import instruments from './instruments'
import Track from './components/Track'
import { actions, setStore, store, loop } from './store'
import { load, save, stash, storage } from './storage'
import { version } from './utils'

import './App.css'

function App() {
  const initApp = async () => {
    load()
    if (storage && storage.bpm) {
      setStore(storage)
    }
  }

  const cleanup = () => {
    Tone.Transport.dispose()
  }

  const event = useKeyDownEvent()

  createEffect(() => {
    const e = event()
    if (e && e.key) {
      const charCode = e.key.charCodeAt()
      if (charCode > 96 && charCode < 123) {
        // Letters a-z
        const trackId = charCode - 97
        actions.toggleMute(trackId)
      } else if (e.key === 'ArrowUp') {
        // This triggers an infinite loop, investigate
        // actions.setBpm(store.bpm + 1)
      } else if (e.key === 'ArrowDown') {
        // actions.setBpm(store.bpm - 1)
      }
    }
  })

  onMount(initApp)
  onCleanup(cleanup)

  return (
    <>
      <div class="container">
        <div class="header">
          Track / {instruments.length - store.tracks.length}
        </div>
        <div class="header"></div>

        <For each={store.tracks}>
          {(track, trackIndex) => {
            const { id, ticks } = track
            return (
              <Track
                class={`track ${track.muted ? 'muted' : ''}`}
                track={track}
              >
                <For each={ticks}>
                  {(tick, tickIndex) => {
                    return (
                      <input
                        type="checkbox"
                        checked={tick}
                        onChange={() =>
                          actions.toggleTick(track.id, tickIndex())
                        }
                        class={`${
                          store.steps[trackIndex()] === tickIndex()
                            ? 'onstep'
                            : 'offstep'
                        }`}
                      />
                    )
                  }}
                </For>
              </Track>
            )
          }}
        </For>

        <div></div>
        <div class="grid toolbar">
          <button onClick={actions.saveStore} disabled={store.saved}>
            Save
          </button>
          <button
            onClick={actions.initAndPlay}
            disabled={store.playing || store.tracks.length === 1}
          >
            Play
          </button>
          <input
            disabled
            type="number"
            value={store.bpm}
            step="5"
            onChange={(e) => {
              actions.setBpm(e.target.value)
            }}
          />
          <button onClick={actions.reset} disabled={store.tracks.length === 1}>
            Reset
          </button>
        </div>

        <div></div>
        <div class="help">
          <h1>Help!</h1>
          <p>
            Lost? Just click the orange box and you’re off! You’ll figure it
            out.
          </p>
          <p>
            You can go back and remove a tick, but you must add at least one
            tick on each track to unlock the next track
          </p>
          <p>
            The sound for each track is picked at random on load, if you’re
            unhappy with the order of sounds, hit "Reset". Notes are also picked
            at random, but always from the Aeolian Dominant aka Hindu Scale in
            E.
          </p>
          <p>
            Use keys <code>a-y</code> to mute tracks.
          </p>
          <p>
            Save works OK but I wouldn’t trust it with my life. It saves the
            current state of your composition in the URL, just copy it from the
            address bar to share it.
          </p>
          <p>Version: {version}</p>
        </div>
      </div>
    </>
  )
}

export default App
