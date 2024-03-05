import instruments from '../instruments'

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
