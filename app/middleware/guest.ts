export default defineNuxtRouteMiddleware((to) => {
  const token = import.meta.client ? localStorage.getItem("token") : null

  if (token && to.path === "/login") {
    return navigateTo("/")
  }
})
