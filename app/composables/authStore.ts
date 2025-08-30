export const useAuthToken = () => useState<string | null>("auth_token", () => null)

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
