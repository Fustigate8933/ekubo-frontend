export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const config = useRuntimeConfig()
  const baseUrl = config.public.apiBase
  const url = `${baseUrl}/api/library/`

  try {
    const data = await $fetch(url, {
      method: "POST",
      body,
    })
    return data
  } catch (err: unknown) {
    // Forward backend status and message when possible so the client can react
    const e = err as any
    const statusCode = e?.statusCode ?? e?.status ?? e?.response?.status ?? 500
    // FastAPI uses `detail` for HTTPException details
    const statusMessage = e?.data?.detail ?? e?.data?.message ?? e?.message ?? "Failed to add to library"
    throw createError({
      statusCode,
      statusMessage,
    })
  }
})
