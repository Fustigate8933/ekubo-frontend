export default defineNuxtPlugin(() => {
	const authToken = useAuthToken()
	const token = localStorage.getItem("token")

	if (token) {
		authToken.value = token
		parseUserData(token)
	}
})

