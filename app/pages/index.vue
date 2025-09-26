<template>
	<div id="index-wrapper" class="flex flex-col items-center gap-10 py-10">
		<h1 class="font-bold text-4xl text-(--ui-primary)">
			Your Library
		</h1>

		<p class="text-lg max-w-3xl text-center">
			Select from your collection of Japanese songs to practice your listening skills. Each song will play line by line, allowing you to transcribe and learn at your own pace.
		</p>

		<!-- Not logged in state -->
		<div v-if="!isLoggedIn" class="flex flex-col items-center gap-6">
			<div class="text-center">
				<h2 class="text-2xl font-semibold mb-2">Welcome to Ekubo!</h2>
				<p class="text-gray-600 dark:text-gray-300">
					Please log in to access your practice library and start learning Japanese through music.
				</p>
			</div>
			<UButton to="/login" size="lg" color="primary">
				Login to Continue
			</UButton>
		</div>

		<!-- Logged in state -->
		<div v-else class="flex flex-col items-center gap-10 w-full">
			<div class="w-full">
				<UInput v-model="search" icon="i-lucide-search" size="lg" variant="outline" placeholder="Search by song or artist" />
			</div>

			<!-- Loading state -->
			<div v-if="loading" class="flex items-center justify-center py-8">
				<UIcon name="i-lucide-loader-2" class="animate-spin text-2xl" />
				<span class="ml-2">Loading your library...</span>
			</div>

			<!-- Error state -->
			<div v-else-if="error" class="text-center py-8">
				<UIcon name="i-lucide-alert-circle" class="text-red-500 text-2xl mb-2" />
				<p class="text-red-600 dark:text-red-400">{{ error }}</p>
				<UButton @click="refreshLibrary" class="mt-4" variant="outline">
					Try Again
				</UButton>
			</div>

			<!-- Empty library state -->
			<div v-else-if="filteredSongs.length === 0" class="text-center py-12">
				<UIcon name="i-lucide-music" class="text-gray-400 text-4xl mb-4" />
				<h3 class="text-xl font-semibold mb-2">Your library is empty</h3>
				<p class="text-gray-600 dark:text-gray-300 mb-6">
					Start building your practice collection by adding songs from our catalog.
				</p>
				<UButton to="/create" color="primary">
					Add Your First Song
				</UButton>
			</div>

			<!-- Songs grid -->
			<div v-else class="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				<UCard v-for="(libraryItem, idx) in filteredSongs" :key="idx" variant="outline" class="overflow-hidden">
					<div class="w-full h-48 bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center relative overflow-hidden">
						<img 
							v-if="libraryItem.matched_song?.song?.album_image_url" 
							:src="libraryItem.matched_song.song.album_image_url" 
							:alt="`${libraryItem.matched_song?.song?.title} album cover`"
							class="w-full h-full object-cover"
						/>
						<UIcon v-else name="i-lucide-music" class="text-white text-4xl" />
					</div>
					<template #footer>
						<div class="flex flex-col gap-2">
							<div>
								<h1 class="font-bold text-lg">
									{{ libraryItem.matched_song?.song?.title || 'Unknown Title' }}
								</h1>
								<p class="text-gray-600 dark:text-gray-300">
									{{ libraryItem.matched_song?.song?.artist || 'Unknown Artist' }}
								</p>
								<p v-if="libraryItem.matched_song?.song?.album" class="text-sm text-gray-500">
									{{ libraryItem.matched_song.song.album }}
								</p>
							</div>
							<NuxtLink :to="`/song/${libraryItem.matched_song?.song?.id}`">
								<UButton class="w-full justify-center items-center" variant="solid" color="primary">
									<UIcon name="i-lucide-play" class="mr-2" />
									Start Practice
								</UButton>
							</NuxtLink>
						</div>
					</template>
				</UCard>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
const search = ref("")

// Authentication
const authToken = useAuthToken()
const userData = useUserData()
const isLoggedIn = computed(() => !!authToken.value)

// Library management
const { library, loading, error, fetchUserLibrary, clearLibrary } = useLibraryStore()

// Filtered songs from library
const filteredSongs = computed(() => {
  if (!library.value) return []
  
  return library.value.filter(libraryItem => {
    const song = libraryItem.matched_song?.song
    if (!song) return false
    
    const searchTerm = search.value.toLowerCase()
    return song.title.toLowerCase().includes(searchTerm) ||
           song.artist.toLowerCase().includes(searchTerm) ||
           (song.album && song.album.toLowerCase().includes(searchTerm))
  })
})

// Refresh library function
const refreshLibrary = async () => {
  if (userData.value?.id) {
    await fetchUserLibrary(userData.value.id)
  }
}

// Load library when user is logged in
watch(isLoggedIn, async (loggedIn) => {
  if (loggedIn && userData.value?.id) {
    await fetchUserLibrary(userData.value.id)
  } else {
    clearLibrary()
  }
}, { immediate: true })

// Watch for user data changes
watch(userData, async (user) => {
  if (user?.id && isLoggedIn.value) {
    await fetchUserLibrary(user.id)
  }
}, { immediate: true })
</script>
