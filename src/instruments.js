import {
  AMSynth,
  AutoFilter,
  Destination,
  DuoSynth,
  Filter,
  FMSynth,
  MembraneSynth,
  MetalSynth,
  MonoSynth,
  NoiseSynth,
  PluckSynth,
  PolySynth,
  Reverb,
  Sampler,
  Synth,
} from 'tone'

const SAMPLE_BASE_URL = './sounds/'

// Add reverb to master channel
const destinationReverb = new Reverb({
  decay: 0.05,
  wet: 0.5,
})
Destination.chain(destinationReverb)

// Set up reverb and auto filter for DuoSynths
const duoReverb = new Reverb({
  decay: 0.3,
  wet: 0.7,
})
const duoFilter = new AutoFilter('4n').toDestination().start()

// Low pass filter for snare
const lowPass = new Filter({
  frequency: 11000,
}).toDestination()

const hihat = {
  name: 'Hi-Hat',
  shortName: 'HHat',
  engine: new NoiseSynth({ volume: -18, type: 'white' }).toDestination(),
}
hihat.engine.sync()

const snare = {
  name: 'Snare',
  shortName: 'Snre',
  engine: new NoiseSynth({
    volume: -4,
    noise: {
      type: 'pink',
      playbackRate: 3,
    },
    envelope: {
      attack: 0.001,
      decay: 0.13,
      sustain: 0,
      release: 0.03,
    },
  })
    .connect(lowPass)
    .toDestination(),
}
snare.engine.sync()

const kick = {
  name: 'Kick',
  octave: 2,
  engine: new MembraneSynth({ volume: -6 }).toDestination(),
}
kick.engine.sync()

const tom1 = {
  name: 'Tom Lo',
  shortName: 'Tom1',
  octave: 3,
  engine: new MembraneSynth({
    volume: -3,
    pitchDecay: 0.008,
    envelope: { attack: 0.01, decay: 0.5, sustain: 0 },
  }).toDestination(),
}
tom1.engine.sync()

const tom2 = {
  name: 'Tom Mid',
  shortName: 'Tom2',
  engine: new MembraneSynth({
    volume: -3,
    pitchDecay: 0.008,
    envelope: { attack: 0.01, decay: 0.5, sustain: 0 },
  }).toDestination(),
}
tom2.engine.sync()

const mono1 = {
  name: 'Mono 1',
  shortName: 'Mon1',
  engine: new MonoSynth({
    volume: -8,
    oscillator: {
      type: 'square8',
    },
    envelope: {
      attack: 0.05,
      decay: 0.3,
      sustain: 0.4,
      release: 0.8,
    },
    filterEnvelope: {
      attack: 0.001,
      decay: 0.7,
      sustain: 0.1,
      release: 0.8,
      baseFrequency: 300,
      octaves: 4,
    },
  }).toDestination(),
}
mono1.engine.sync()

const mono2 = {
  name: 'Mono 2',
  shortName: 'Mon2',
  engine: new MonoSynth({
    volume: -8,
    oscillator: {
      type: 'sine2',
    },
    envelope: {
      attack: 0.2,
      decay: 0.2,
      sustain: 0.2,
      release: 0.2,
    },
    filterEnvelope: {
      attack: 0.05,
      decay: 0.2,
      sustain: 0.1,
      release: 0.2,
      baseFrequency: 300,
      octaves: 4,
    },
  }).toDestination(),
}
mono2.engine.sync()

const fm1 = {
  name: 'FM 1',
  octave: 3,
  engine: new FMSynth({
    volume: -6,
    modulationIndex: 12.22,
    envelope: {
      attack: 0.01,
      decay: 0.2,
    },
    modulation: {
      type: 'square',
    },
    modulationEnvelope: {
      attack: 0.2,
      decay: 0.01,
    },
  }).toDestination(),
}
fm1.engine.sync()

const fm2 = {
  name: 'FM 2',
  octave: 2,
  engine: new FMSynth({
    volume: -3,
    modulationIndex: 12.22,
    envelope: {
      attack: 0.5,
      decay: 0.2,
    },
    modulation: {
      type: 'sine',
    },
    modulationEnvelope: {
      attack: 0.2,
      decay: 0.1,
    },
  }).toDestination(),
}
fm2.engine.sync()

const synth1 = {
  name: 'Synth 1',
  shortName: 'Snt1',
  octave: 1,
  engine: new Synth({
    oscillator: {
      type: 'amtriangle',
      harmonicity: 0.5,
      modulationType: 'square',
    },
    envelope: {
      attackCurve: 'exponential',
      attack: 0,
      decay: 0.3,
      sustain: 0.1,
      release: 1,
    },
    portamento: 0,
    volume: -6,
  }).toDestination(),
}
synth1.engine.sync()

const synth2 = {
  name: 'Synth 2',
  shortName: 'Snt2',
  octave: 2,
  engine: new Synth({
    oscillator: {
      type: 'amtriangle',
      harmonicity: 2.5,
      modulationType: 'sine',
    },
    envelope: {
      attackCurve: 'exponential',
      attack: 0.05,
      decay: 0.2,
      sustain: 0.2,
      release: 1.5,
    },
    portamento: 0.05,
    volume: -6,
  }).toDestination(),
}
synth2.engine.sync()

const synth3 = {
  name: 'Synth 3',
  shortName: 'Snt3',
  octave: 3,
  engine: new Synth({ volume: -6 }).toDestination(),
}
synth3.engine.sync()

const pluck1 = {
  name: 'Pluck 1',
  shortName: 'Plk1',
  engine: new PluckSynth({ volume: -6 }).toDestination(),
}
pluck1.engine.sync()

const pluck2 = {
  name: 'Pluck 2',
  shortName: 'Plk2',
  engine: new PluckSynth({ volume: -6 }).toDestination(),
}
pluck2.engine.sync()

const am1 = {
  name: 'AM 1',
  engine: new AMSynth({ volume: -3 }).toDestination(),
}
am1.engine.sync()

const am2 = {
  name: 'AM 2',
  engine: new AMSynth({
    volume: 0,
    harmonicity: 3.2,
    oscillator: {
      type: 'fatsawtooth',
    },
    envelope: {
      attack: 0,
      decay: 0.1,
      sustain: 0.1,
      release: 0.5,
    },
    modulation: {
      type: 'sine2',
    },
    modulationEnvelope: {
      attack: 0.05,
      decay: 0.01,
    },
  }).toDestination(),
}
am2.engine.sync()

const metal1 = {
  name: 'Metal 1',
  shortName: 'Mtl1',
  engine: new MetalSynth({
    harmonicity: 12,
    resonance: 1200,
    modulationIndex: 16,
    envelope: {
      decay: 0.2,
    },
    volume: -12,
  }).toDestination(),
}
metal1.engine.sync()

const metal2 = {
  name: 'Metal 2',
  shortName: 'Mtl1',
  engine: new MetalSynth({
    harmonicity: 8,
    resonance: 300,
    modulationIndex: 22,
    envelope: {
      decay: 0.5,
    },
    volume: -14,
  }).toDestination(),
}
metal2.engine.sync()

const fun1 = {
  name: 'Fun 1',
  engine: new Synth({
    volume: -6,
    oscillator: {
      type: 'fatsawtooth',
      harmonicity: 4,
      modulationType: 'amtriangle',
    },
  }).toDestination(),
}
fun1.engine.sync()

const fun2 = {
  name: 'Fun 2',
  engine: new Synth({
    volume: -6,
    oscillator: {
      type: 'sine',
      harmonicity: 0.5,
      modulationType: 'fatsawtooth',
    },
  }).toDestination(),
}
fun2.engine.sync()

const fat = {
  name: 'Fat',
  octave: 2,
  engine: new PolySynth(Synth, {
    oscillator: {
      type: 'fatsawtooth',
      count: 3,
      spread: 30,
    },
    envelope: {
      attack: 0.01,
      decay: 0.1,
      sustain: 0.5,
      release: 0.4,
      attackCurve: 'exponential',
    },
  }).toDestination(),
}
fat.engine.sync()

const sampler1 = {
  name: 'Sampler 1',
  shortName: 'Smp1',
  engine: new Sampler({
    urls: {
      C4: 'uh.mp3',
    },
    baseUrl: SAMPLE_BASE_URL,
  }).toDestination(),
}
sampler1.engine.sync()

const sampler2 = {
  name: 'Sampler 2',
  shortName: 'Smp2',
  engine: new Sampler({
    urls: {
      C4: 'yeah.mp3',
    },
    baseUrl: SAMPLE_BASE_URL,
  }).toDestination(),
}
sampler2.engine.sync()

const duo1 = {
  name: 'Duo 1',
  octave: 2,
  engine: new DuoSynth({
    volume: -6,
    portamento: 0.5,
    vibratoAmount: 1,
    vibratoRate: 1,
  }).chain(duoFilter, duoReverb, Destination),
}
duo1.engine.sync()

const duo2 = {
  name: 'Duo 2',
  octave: 1,
  engine: new DuoSynth({
    volume: -6,
    portamento: 0,
    vibratoAmount: 0.5,
    vibratoRate: 0.5,
  }).chain(duoFilter, duoReverb, Destination),
}
duo2.engine.sync()

const instruments = [
  am1,
  am2,
  duo1,
  duo2,
  fat,
  fm1,
  fm2,
  fun1,
  fun2,
  hihat,
  kick,
  metal1,
  metal2,
  mono1,
  mono2,
  pluck1,
  pluck2,
  sampler1,
  sampler2,
  snare,
  synth1,
  synth2,
  synth3,
  tom1,
  tom2,
]

export default instruments
