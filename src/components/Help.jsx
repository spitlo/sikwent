import { createEffect, createSignal, Show } from 'solid-js'
import { version } from '../utils'
import { storage } from '../storage'

import './Help.css'

const Help = () => {
  let createdWith = version

  const [showVersionWarning, setShowVersionWarning] = createSignal(false)

  createEffect(() => {
    if (storage && storage.createdWith) {
      // This is a saved composition, compare versions
      createdWith = storage.createdWith
      const createdWithParts = createdWith.split('.')
      const currentVersionParts = version.split('.')

      // Do some heavy handed semver logic
      if (currentVersionParts[1] === '0') {
        // Semver minor is still 0, warn on patch version mismatch
        if (createdWithParts[2] !== currentVersionParts[2]) {
          setShowVersionWarning(true)
        }
      } else {
        // Semver minor is > 0, show warning on minor and major mismatch.
        // This logic probably has some pitfalls but it’s good enough for us.
        if (
          createdWithParts[1] !== currentVersionParts[1] ||
          createdWithParts[0] !== currentVersionParts[0]
        ) {
          setShowVersionWarning(true)
        }
      }
    }
  })

  return (
    <div class="help">
      <h1>Help!</h1>
      <p>Lost? Just click the big box and you’re off! You’ll figure it out.</p>
      <p>
        You can go back and remove a tick, but you must add at least one tick on
        each track to unlock the next track
      </p>
      <p>
        The sound for each track is picked at random on load, if you’re unhappy
        with the order of sounds, hit "Reset". Notes are also picked at random,
        but always from the Aeolian Dominant aka Hindu Scale in E.
      </p>
      <p>To the right of each track, its note is indicated.</p>
      <p>
        Use keys <code>a</code>-<code>z</code> to mute tracks.
      </p>
      <p>To the left of each track, its mute key is indicated.</p>
      <p>
        Save works OK but I wouldn’t trust it with my life. It saves the current
        state of your composition in the URL, just copy it from the address bar
        to share it.
      </p>
      <p>Version: {version}</p>
      <Show when={showVersionWarning()}>
        <p class="warning">
          The current composition is saved with version {createdWith}. Sikwent
          is running version {version}. Some sounds may not represent what the
          original composer intended.
        </p>
      </Show>
    </div>
  )
}

export default Help
