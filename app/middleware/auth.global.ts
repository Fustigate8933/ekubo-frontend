export default defineNuxtRouteMiddleware((to) => {
  const token = import.meta.client ? localStorage.getItem("token") : null

  // only protect certain routes
  const protectedRoutes = ["/song", "/create"]

  if (!token && protectedRoutes.includes(to.path)) {
    return navigateTo(`/login?redirect=${to.fullPath}`)
  }
})
