export default defineNuxtRouteMiddleware((to) => {
  const token = useCookie<string | null>("token").value

  if (token && to.path === "/login") {
    const redirect = to.query.redirect as string
    return navigateTo(redirect || "/")
  }
})
