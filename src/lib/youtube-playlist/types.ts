/** Shared contract between `/api/youtube/playlist` and the client UI. */

export type PlaylistVideoRow = {
  position: number;
  playlistIndex: number;
  videoId: string;
  title: string;
  durationSeconds: number;
  views: number;
  likes: number;
  comments: number;
  publishedAt: string;
  watchUrl: string;
};

export type SkippedPlaylistEntry = {
  playlistIndex: number;
  videoId: string | null;
  reason: "missing_video_id" | "unavailable_or_private" | "deleted";
  titleHint: string | null;
};

export type PlaylistAnalyzeSuccess = {
  ok: true;
  playlistId: string;
  playlistTitle: string | null;
  totalItemsInPlaylist: number;
  rangeFrom: number | null;
  rangeTo: number | null;
  videos: PlaylistVideoRow[];
  skipped: SkippedPlaylistEntry[];
  warnings: string[];
};

export type PlaylistAnalyzeError = {
  ok: false;
  code:
    | "invalid_url"
    | "invalid_range"
    | "missing_api_key"
    | "playlist_not_found"
    | "forbidden_or_private"
    | "quota_exceeded"
    | "no_videos"
    | "upstream_error"
    | "network_error";
  message: string;
};

export type PlaylistAnalyzeResponse = PlaylistAnalyzeSuccess | PlaylistAnalyzeError;

/** Successful API payload (optional `cached` from server memory cache). */
export type PlaylistAnalyzeApiSuccess = PlaylistAnalyzeSuccess & { cached?: boolean };
