import { cleanString } from "../utils";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const trackName = query.track_name as string;
  const artistName = query.artist_name as string;

  if (!trackName || !artistName) {
    throw createError({
      statusCode: 400,
      statusMessage: "Both 'track_name' and 'artist_name' are required.",
    });
  }

  const config = useRuntimeConfig();
  const baseUrl = config.public.apiBase;
  const url = `${baseUrl}/songs/spotify-tracks`;
  const params = new URLSearchParams({
    track_name: cleanString(trackName),
    artist_name: cleanString(artistName),
    track_limit: "6",
  }).toString();

  try {
    const data = await $fetch(`${url}?${params}`, { method: "GET" });
    return data;
  } catch (err: unknown) {
    if (err instanceof Error) {
      throw createError({
        statusCode: 500,
        statusMessage: `Failed to fetch Spotify iframe: ${err.message}`,
      });
    }
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch Spotify iframe: Unknown error",
    });
  }
});
