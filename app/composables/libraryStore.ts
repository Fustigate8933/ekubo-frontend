import type { UserLibraryWithDetails } from '@/types/user'

export const useLibraryStore = () => {
  const library = useState<UserLibraryWithDetails[]>('user-library', () => [])
  const loading = useState<boolean>('library-loading', () => false)
  const error = useState<string | null>('library-error', () => null)

  const fetchUserLibrary = async (userId: number) => {
    loading.value = true
    error.value = null
    
    try {
      const data = await $fetch<UserLibraryWithDetails[]>(`/api/library/${userId}`)
			console.log("User library store fetch: ", data)
      library.value = data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch library'
      console.error('Error fetching library:', err)
    } finally {
      loading.value = false
    }
  }

  const clearLibrary = () => {
    library.value = []
    error.value = null
  }

  return {
    library: readonly(library),
    loading: readonly(loading),
    error: readonly(error),
    fetchUserLibrary,
    clearLibrary
  }
}
