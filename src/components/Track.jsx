import instruments from '../instruments'

const Track = (props) => {
  const { track } = props
  const instrument = instruments[track.instrument] || { name: 'Missing' }
  if (!instrument) {
    console.log('Instrument missing for track', track) /* eslint-disable-line */
  }
  return (
    <>
      <div>
        {instrument.name}: {track.note}
      </div>
      <div>{props.children}</div>
    </>
  )
}

export default Track
