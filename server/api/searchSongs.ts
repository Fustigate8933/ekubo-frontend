export default defineEventHandler(async (event) => {
	const query = getQuery(event)
	const userInput = query.q as string

	const config = useRuntimeConfig()
	const baseUrl = config.public.apiBase
	const url = `${baseUrl}/songs/lyrics`
	const params = new URLSearchParams({ q: userInput }).toString()

	try {
		const data = await $fetch(`${url}?${params}`, { method: "GET" })
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
	}})

