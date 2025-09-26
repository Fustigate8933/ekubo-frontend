// Backend API Types (matching Pydantic schemas)
export interface LyricsResponse {
  id: number;
  synced_lyrics?: string;
  created_at: string;
}

export interface LyricsCreate {
  synced_lyrics: string;
}

export interface LyricsWithLines extends LyricsResponse {
  lyric_lines: LyricLineResponse[];
}

export interface LyricLineResponse {
  id: number;
  lyrics_id: number;
  start_time_ms?: number;
  end_time_ms?: number;
  text_content?: string;
  created_at: string;
}

export interface LyricLineCreate {
  lyrics_id: number;
  start_time_ms?: number;
  end_time_ms?: number;
  text_content: string;
}

// Frontend UI Types
export interface ParsedLyricLine {
  id: number;
  startTime: number; // in seconds
  endTime: number; // in seconds
  text: string;
  isCompleted?: boolean;
  userInput?: string;
  isCorrect?: boolean;
}

export interface PracticeSession {
  currentLineIndex: number;
  totalLines: number;
  correctLines: number;
  startTime: Date;
  isActive: boolean;
}


