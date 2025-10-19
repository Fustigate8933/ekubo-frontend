export default defineNuxtRouteMiddleware((to) => {
  const token = useCookie<string | null>("token").value

  const protectedRoutes = ["/song", "/create"]

  if (!token && protectedRoutes.some(route => to.path.startsWith(route))) {
    return navigateTo(`/login?redirect=${to.fullPath}`)
  }
})
