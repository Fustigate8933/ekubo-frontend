export interface SpotifyIFrameApi {
  createController: (
    element: HTMLElement,
    options: {
      width?: number | string
      height?: number | string
      uri?: string
    },
    callback: (controller: EmbedController) => void
  ) => void
}

declare global {
  interface Window {
    onSpotifyIframeApiReady: (api: SpotifyIFrameApi) => void;
  }
}

export interface EmbedController {
  loadUri: (uri: string) => void
  play: () => void
  pause: () => void
  resume: () => void
  togglePlay: () => void
  seek: (seconds: number) => void
  getCurrentState: (callback: (state: unknown) => void) => void
	addListener: (name: string, callback: () => void) => void
}

// Backend API Types (matching Pydantic schemas)
export interface SongResponse {
  id: number;
  title: string;
  artist: string;
  album?: string;
  duration?: number;
  spotify_id?: string;
  created_at: string;
}

export interface SongCreate {
  title: string;
  artist: string;
  album?: string;
  duration?: number;
  spotify_id?: string;
}

export interface SongUpdate {
  title?: string;
  artist?: string;
  album?: string;
  duration?: number;
  spotify_id?: string;
}

// Frontend UI Types
export interface Song {
  id: string
  title: string
  artist: string
  src: string
}

export interface Track {
  album: Album;
  artists: Artist[];
  available_markets: string[];
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_ids: {
    isrc: string;
  };
  external_urls: {
    spotify: string;
  };
  href: string;
  id: string;
  is_local: boolean;
  is_playable: boolean;
  name: string;
  popularity: number;
  preview_url: string | null;
  track_number: number;
  type: string;
  uri: string;
}

interface Album {
  album_type: string;
  artists: Artist[];
  available_markets: string[];
  external_urls: {
    spotify: string;
  };
  href: string;
  id: string;
  images: Image[];
  is_playable: boolean;
  name: string;
  release_date: string;
  release_date_precision: string;
  total_tracks: number;
  type: string;
  uri: string;
}

interface Artist {
  external_urls: {
    spotify: string;
  };
  href: string;
  id: string;
  name: string;
  type: string;
  uri: string;
}

interface Image {
  height: number;
  width: number;
  url: string;
}
