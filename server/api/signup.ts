export default defineEventHandler(async (event) => {
  const body = await readBody(event)

	const config = useRuntimeConfig()
	const baseUrl = config.public.apiBase
	const url = `${baseUrl}/auth/signup`
  try {
    return await $fetch(url, {
      method: "POST",
      body,
    })
  } catch (err: unknown) {
		if (err instanceof Error) {
			throw createError({
				statusCode: 500,
				statusMessage: `Failed to sign up: ${err.message}`
			})
		}
		throw createError({
			statusCode: 500,
			statusMessage: "Failed to signup: Unknown error"
		})
  }
})

