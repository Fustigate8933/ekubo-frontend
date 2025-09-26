import { jwtDecode } from "jwt-decode"
import type { User } from "@/types/user"
import type { LoginFormData, LoginResponse } from "@/types/auth"

export const useAuthToken = () => {
  const token = useState<string | null>("auth-token", () => {
    const cookie = useCookie<string | null>("token")
    return cookie.value
  })
	parseUserData(token.value)
  return token
}
export const useUserData = () => useState<User | null>("user_data", () => null)

export const parseUserData = (token: string | null) => {
	if (!token) return null
	const userData = useUserData()
	userData.value = jwtDecode(token)
}

export const useLogout = () => {
  const authToken = useAuthToken()

  return () => {
    authToken.value = null

    const tokenCookie = useCookie("token")
    tokenCookie.value = null

    navigateTo("/login")
  }
}

export const useLogin = async () => {
	const authToken = useAuthToken()

  return async (body: LoginFormData) => {
		try {
			const res = await $fetch<LoginResponse>('/api/login', {
				method: 'POST',
				body
			})
			const token = res.token
			const tokenCookie = useCookie("token", { sameSite: "strict" })
			tokenCookie.value = token
			authToken.value = token
			parseUserData(token)
		} catch (e) {
			console.error(e)
		}
  }
}

export const useSignup = async () => {
  return async (body: LoginFormData) => {
		try {
			await $fetch<LoginResponse>('/api/signup', {
				method: 'POST',
				body
			})
		} catch (e) {
			console.error(e)
		}
  }
}
