export default defineNuxtRouteMiddleware((to) => {
  const token = useCookie<string | null>("token").value

  const protectedRoutes = ["/song", "/create"]

  if (!token && protectedRoutes.includes(to.path)) {
    return navigateTo(`/login?redirect=${to.fullPath}`)
  }
})
