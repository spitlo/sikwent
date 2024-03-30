import * as Tone from 'tone'
import { createEffect, For, onCleanup, onMount, untrack } from 'solid-js'
import { useKeyDownEvent } from '@solid-primitives/keyboard'
import { writeClipboard } from '@solid-primitives/clipboard'

import Help from './components/Help'
import createModal from './components/Modal'
import instruments from './instruments'
import { actions, setStore, store } from './store'
import { load, storage } from './storage'

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

  const [SaveModal, toggleSaveModal] = createModal()

  createEffect(() => {
    const e = event()
    if (e && e.key) {
      const charCode = e.key.charCodeAt()
      if (charCode > 96 && charCode < 123) {
        // Letters a-z
        const trackId = charCode - 97
        actions.toggleMute(trackId)
      } else if (charCode === 45) {
        // -
        actions.setBpm(untrack(() => store.bpm) - 1)
      } else if (charCode === 43) {
        // +
        actions.setBpm(untrack(() => store.bpm) + 1)
      }
    }
  })

  onMount(initApp)
  onCleanup(cleanup)

  return (
    <>
      <div class="container">
        <div class={`track-container count-${store.tracks.length}`}>
          <For each={store.tracks}>
            {(track, trackIndex) => {
              const { id, instrument, ticks } = track
              const trackInstrument = instruments[instrument] || {
                name: 'Missing',
              }
              const trackLetter = String.fromCharCode(id + 97)
              const shortName =
                instrument.shortName || trackInstrument.name.replace(' ', '')
              return (
                <div
                  class={`track ${track.muted ? 'muted' : ''}`}
                  data-track-letter={trackLetter}
                  data-track-note={track.note}
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
                </div>
              )
            }}
          </For>
        </div>

        <div class="grid toolbar">
          <button
            onClick={(e) => {
              actions.saveStore()
              toggleSaveModal()
            }}
            disabled={store.saved}
          >
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
        <Help />
      </div>

      <SaveModal
        title="Saved!"
        secondaryButton={{
          text: 'Copy',
          onClick: () => {
            writeClipboard(location.href)
            toggleSaveModal()
          },
        }}
      >
        <p>
          This project is now saved in the URL. You can copy the URL and share
          with a friend, or keep it for yourself. Click "Copy" to put the URL in
          your clipboard.
        </p>
        <p>
          To update the URL after you have done some changes, just hit "Save"
          again.
        </p>
      </SaveModal>
    </>
  )
}

export default App
