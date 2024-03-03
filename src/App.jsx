import * as Tone from 'tone'
import { createStore, produce } from 'solid-js/store'
import Dismiss from 'solid-dismiss'
import {
  createEffect,
  createSignal,
  For,
  onCleanup,
  onMount,
  Show,
} from 'solid-js'

import Track from './components/Track'
import { actions, setStore, store, loop } from './store'
import { load, save, stash, storage } from './storage'

import './App.css'

function App() {
  const initApp = async () => {
    load()
    if (storage && storage.bpm) {
      setStore(storage)
    }
    actions.initContext()
  }

  const cleanup = () => {
    if (store.context) {
      store.context.close()
    }
  }

  onMount(initApp)
  onCleanup(cleanup)

  let saveButtonRel
  let okButtonRel
  const [showHasSaved, setShowHasSaved] = createSignal(false)
  const closeHasSaved = () => {
    setShowHasSaved(false)
  }
  const onClickOverlay = (e) => {
    if (e.target !== e.currentTarget) return
    setShowHasSaved(false)
  }

  return (
    <>
      <div class="container">
        <div></div>
        <div></div>
        <For each={store.tracks}>
          {(track, trackIndex) => {
            const { id, ticks } = track
            return (
              <Track class="container" track={track}>
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
          <button
            onClick={() => {
              actions.saveStore()
              setShowHasSaved(true)
            }}
            disabled={store.saved}
            rel={saveButtonRel}
          >
            Save
          </button>
          <Dismiss
            focusElementOnOpen={() => okButtonRel}
            menuButton={saveButtonRel}
            modal
            open={showHasSaved}
            setOpen={setShowHasSaved}
          >
            <div
              class="modal-container"
              onClick={onClickOverlay}
              role="presentation"
            >
              <div class="modal" role="dialog" aria-modal="true" tabindex="-1">
                <h4>Saved!</h4>
                <p>
                  This project is now saved in the URL. You can copy the URL and
                  share with a friend, or keep it for yourself.
                </p>
                <p>
                  To update the URL after you have done some changes, just hit
                  "Save" again.
                </p>
                <div class="close-button">
                  <button onClick={closeHasSaved} ref={okButtonRel}>
                    Ok!
                  </button>
                </div>
                <button
                  class="x-button"
                  aria-label="Close modal"
                  onClick={closeHasSaved}
                >
                  ×
                </button>
              </div>
            </div>
          </Dismiss>
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
      </div>
    </>
  )
}

export default App
