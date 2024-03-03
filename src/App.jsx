import * as Tone from 'tone'
import Track from './components/Track'
import { actions, setStore, store, loop } from './store'
import { createStore, produce } from 'solid-js/store'
import { For, createEffect, onCleanup, onMount, Show } from 'solid-js'
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
          <button onClick={actions.saveStore} disabled>
            Save
          </button>
          <button onClick={actions.togglePlay} disabled>
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
        </div>
      </div>
    </>
  )
}

export default App
