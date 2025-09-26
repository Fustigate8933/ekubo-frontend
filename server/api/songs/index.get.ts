export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const title = query.title as string
  const artist = query.artist as string

  const config = useRuntimeConfig()
  const baseUrl = config.public.apiBase
  let url = `${baseUrl}/api/songs/`

  // Add query parameters if provided
  const params = new URLSearchParams()
  if (title) params.append('title', title)
  if (artist) params.append('artist', artist)
  
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
        statusMessage: `Failed to fetch songs: ${err.message}`
      })
    }
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch songs: Unknown error"
    })
  }
})
