import instruments from '../instruments'
import { actions } from '../store'

import './Track.css'

const Track = (props) => {
  const { track } = props
  const instrument = instruments[track.instrument] || { name: 'Missing' }

  const trackLetter = String.fromCharCode(track.id + 97)
  const shortName = instrument.shortName || instrument.name.replace(' ', '')

  return (
    <>
      <div
        class="track-info"
        onClick={() => {
          actions.toggleMute(track.id)
        }}
      >
        <span class="full">
          {trackLetter}: {instrument.name}: {track.note}
        </span>
        <span class="tiny">{shortName}</span>
      </div>
      <div class={props.class}>{props.children}</div>
    </>
  )
}

export default Track
