import { jwtDecode } from "jwt-decode"
import type { User } from "@/types/user"
import type { LoginFormData, LoginResponse } from "@/types/auth"

export const useAuthToken = () => useState<string | null>("auth_token", () => null)
export const useUserData = () => useState<User | null>("user_data", () => null)

export const parseUserData = (token: string) => {
	if (!token) return null
	const userData = useUserData()
	userData.value = jwtDecode(token)
}

export const useLogout = () => {
  const authToken = useAuthToken()

  return () => {
    authToken.value = null
    if (import.meta.client) {
      localStorage.removeItem("token")
    }
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
			localStorage.setItem("token", token)
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
