// Backend API Types (matching Pydantic schemas)
export interface UserResponse {
  id: number;
  email?: string;
  username: string;
  created_at: string;
}

export interface UserCreate {
  email?: string;
  username: string;
  password: string;
}

export interface UserUpdate {
  email?: string;
  username?: string;
  password?: string;
}

// User Library Types
export interface UserLibraryWithDetails {
  id: number;
  user_id: number;
  matched_song_id: number;
  created_at: string;
  matched_song?: {
    id: number;
    song_id: number;
    lyrics_id: number;
    created_by_user_id: number;
    created_at: string;
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
      synced_lyrics: string;
      created_at: string;
    };
  };
  user?: UserResponse;
}

// Frontend UI Types
export interface User {
  id: number;
  email: string;
  username: string;
}
