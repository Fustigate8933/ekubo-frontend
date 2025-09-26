export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const config = useRuntimeConfig()
  const baseUrl = config.public.apiBase
  const url = `${baseUrl}/api/matched/`

  try {
    const data = await $fetch(url, {
      method: "POST",
      body,
    })
    return data
  } catch (err: unknown) {
    if (err instanceof Error) {
      throw createError({
        statusCode: 500,
        statusMessage: `Failed to create matched song: ${err.message}`
      })
    }
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to create matched song: Unknown error"
    })
  }
})
