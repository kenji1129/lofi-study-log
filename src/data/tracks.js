import { asset } from '../lib/asset'

// Real lo-fi tracks served from /public/audio.
// Album: "Lo-Fi Night Loneliness".

const ALBUM = 'Lo-Fi Night Loneliness'

export const TRACKS = [
  { title: 'By Your Side', artist: ALBUM, src: asset('audio/by-your-side.mp3'), color: '#46e6ff' },
  { title: 'Dark In The Rainbow', artist: ALBUM, src: asset('audio/dark-in-the-rainbow.mp3'), color: '#a78bff' },
  { title: 'FIRESIDE', artist: ALBUM, src: asset('audio/fireside.mp3'), color: '#ff8a3d' },
  { title: 'FRIEND', artist: ALBUM, src: asset('audio/friend.mp3'), color: '#ffd479' },
  { title: 'Girl Knows', artist: ALBUM, src: asset('audio/girl-knows.mp3'), color: '#ff63d6' },
  { title: 'In The Gloom', artist: ALBUM, src: asset('audio/in-the-gloom.mp3'), color: '#7fd7ff' },
  { title: 'Mad Trick', artist: ALBUM, src: asset('audio/mad-trick.mp3'), color: '#ff5ed6' },
  { title: 'No Regrets', artist: ALBUM, src: asset('audio/no-regrets.mp3'), color: '#2ed07d' },
  { title: 'Shine In The Rainbow', artist: ALBUM, src: asset('audio/shine-in-the-rainbow.mp3'), color: '#ffd479' },
  { title: 'Three Keys', artist: ALBUM, src: asset('audio/three-keys.mp3'), color: '#46e6ff' },
  { title: 'Very First Time', artist: ALBUM, src: asset('audio/very-first-time.mp3'), color: '#a78bff' },
  { title: 'Waiting', artist: ALBUM, src: asset('audio/waiting.mp3'), color: '#7fd7ff' },
]
