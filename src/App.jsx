import * as Tone from 'tone'
import { createStore, produce } from 'solid-js/store'
import {
  createEffect,
  createSignal,
  For,
  onCleanup,
  onMount,
  Show,
} from 'solid-js'

import instruments from './instruments'
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
  }

  const cleanup = () => {
    Tone.Transport.dispose()
  }

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
      </div>
    </>
  )
}

export default App
