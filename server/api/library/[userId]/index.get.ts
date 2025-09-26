export default defineEventHandler(async (event) => {
  const userId = getRouterParam(event, 'userId')
  
  if (!userId) {
    throw createError({
      statusCode: 400,
      statusMessage: "User ID is required"
    })
  }

  const config = useRuntimeConfig()
  const baseUrl = config.public.apiBase
  const url = `${baseUrl}/api/library/user/${userId}`

  try {
    const data = await $fetch(url, {
      method: "GET",
    })
    return data
  } catch (err: unknown) {
    if (err instanceof Error) {
      throw createError({
        statusCode: 500,
        statusMessage: `Failed to fetch user library: ${err.message}`
      })
    }
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch user library: Unknown error"
    })
  }
})
