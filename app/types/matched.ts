// Backend API Types (matching Pydantic schemas)
export interface MatchedResponse {
  id: number;
  song_id?: number;
  lyrics_id?: number;
  created_by_user_id?: number;
  created_at: string;
}

export interface MatchedCreate {
  song_id: number;
  lyrics_id: number;
  created_by_user_id?: number;
}

export interface MatchedWithDetails extends MatchedResponse {
  song?: {
    id: number;
    title: string;
    artist: string;
    album?: string;
    duration?: number;
    spotify_id?: string;
    created_at: string;
  };
  lyrics?: {
    id: number;
    synced_lyrics?: string;
    created_at: string;
    lyric_lines?: Array<{
      id: number;
      lyrics_id: number;
      start_time_ms?: number;
      end_time_ms?: number;
      text_content?: string;
      created_at: string;
    }>;
  };
}

// Frontend UI Types
export interface MatchedSong {
  id: number;
  song: {
    id: number;
    title: string;
    artist: string;
    album?: string;
    duration?: number;
    spotify_id?: string;
  };
  lyrics: {
    id: number;
    synced_lyrics?: string;
    lyric_lines: Array<{
      id: number;
      start_time_ms?: number;
      end_time_ms?: number;
      text_content?: string;
    }>;
  };
  created_at: string;
}


