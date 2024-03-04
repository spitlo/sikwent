import { createEffect } from 'solid-js'
import { useKeyDownEvent } from '@solid-primitives/keyboard'

import instruments from '../instruments'
import { actions, setStore, store, loop } from '../store'

const event = useKeyDownEvent()

createEffect(() => {
  const e = event()

  if (e) {
    if (e.key) {
      const charCode = e.key.charCodeAt()
      if (charCode > 96 && charCode < 123) {
        const trackId = charCode - 97
        actions.toggleMute(trackId)
      }
    }
  }
})

const Track = (props) => {
  const { track } = props
  const instrument = instruments[track.instrument] || { name: 'Missing' }

  const trackLetter = String.fromCharCode(track.id + 97)

  return (
    <>
      <div class="track-info">
        {trackLetter}: {instrument.name}: {track.note}
      </div>
      <div class={props.class}>{props.children}</div>
    </>
  )
}

export default Track
