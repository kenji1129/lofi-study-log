import { asset } from '../lib/asset'

// Built-in background scenes. Paths resolve against Vite's base URL.
export const BACKGROUNDS = [
  { id: 'bg-00', label: 'デフォルト', src: asset('scene/backgrounds/bg-00.png'), thumb: asset('scene/backgrounds/bg-00.png') },
  { id: 'bg-02', label: '夜', src: asset('scene/backgrounds/bg-02-night.jpg'), thumb: asset('scene/backgrounds/bg-02-night.jpg') },
  { id: 'bg-06', label: '朝', src: asset('scene/backgrounds/bg-06-morning.jpg'), thumb: asset('scene/backgrounds/bg-06-morning.jpg') },
  { id: 'bg-03', label: '昼', src: asset('scene/backgrounds/bg-03-day.jpg'), thumb: asset('scene/backgrounds/bg-03-day.jpg') },
  { id: 'bg-01', label: '夕方', src: asset('scene/backgrounds/bg-01-sunset.jpg'), thumb: asset('scene/backgrounds/bg-01-sunset.jpg') },
  { id: 'bg-04', label: '田舎', src: asset('scene/backgrounds/bg-04-rural.jpg'), thumb: asset('scene/backgrounds/bg-04-rural.jpg') },
  { id: 'bg-05', label: '都会', src: asset('scene/backgrounds/bg-05-city.jpg'), thumb: asset('scene/backgrounds/bg-05-city.jpg') },
  { id: 'custom', label: 'カスタム', src: null }, // user-uploaded
]
