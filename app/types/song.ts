export interface SongResponse {
  id: number;
  name: string;
  trackName: string;
  artistName: string;
  albumName: string;
  duration: number;
  instrumental: boolean;
  plainLyrics: string;
  syncedLyrics: string | null;
}


export interface Song {
  id: string
  title: string
  artist: string
  src: string
}

