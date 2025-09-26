export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const synced_lyrics = query.synced_lyrics as string

  const config = useRuntimeConfig()
  const baseUrl = config.public.apiBase
  let url = `${baseUrl}/api/lyrics/`

  // Add query parameters if provided
  const params = new URLSearchParams()
  if (synced_lyrics) params.append('synced_lyrics', synced_lyrics)
  
  if (params.toString()) {
    url += `?${params.toString()}`
  }

  try {
    const data = await $fetch(url, {
      method: "GET",
    })
    return data
  } catch (err: unknown) {
    if (err instanceof Error) {
      throw createError({
        statusCode: 500,
        statusMessage: `Failed to fetch lyrics: ${err.message}`
      })
    }
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch lyrics: Unknown error"
    })
  }
})
