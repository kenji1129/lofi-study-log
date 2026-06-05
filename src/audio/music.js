// Singleton <audio> element for real mp3 playback (shared by AudioController
// for transport + PlayerBar for the progress/seek bar).
export const music = new Audio()
music.preload = 'auto'
