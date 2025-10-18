<template>
	<div id="index-wrapper" class="flex flex-col items-center gap-10 py-10">

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
			<h1 class="font-bold text-4xl text-(--ui-primary)">
				Your Library
			</h1>

			<p class="text-lg max-w-3xl text-center">
				Select from your collection of Japanese songs to practice your listening skills. Each song will play line by line, allowing you to transcribe and learn at your own pace.
			</p>
			<div class="w-full flex justify-between items-center">
				<UInput v-model="filterParams.search" icon="i-lucide-search" size="lg" variant="outline" placeholder="Search by song or artist" />
				<div class="flex items-center gap-2">
					<UButton icon="mdi:resize" variant="outline" color="secondary" @click="compactCards = !compactCards" />
				</div>
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
			<div 
				v-else
				class="w-full grid gap-6" 
				:class="[
					'grid-cols-1',
					compactCards
						? ['md:grid-cols-3', 'lg:grid-cols-4']   // compact mode
						: ['md:grid-cols-2', 'lg:grid-cols-3']   // regular mode
				]"
			>
				<UCard v-for="(libraryItem, idx) in filteredSongs" :key="idx" variant="outline" class="overflow-hidden">
					<div
						class="w-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center relative overflow-hidden"
						:style="{ height: activeCardConfig.lg.imgHeight }"
					>
						<img 
							v-if="libraryItem.matched_song?.song?.album_image_url" 
							:src="libraryItem.matched_song.song.album_image_url" 
							:alt="`${libraryItem.matched_song?.song?.title} album cover`"
							class="w-full h-full object-cover"
						>
						<UIcon v-else name="i-lucide-music" class="text-white text-4xl" />
					</div>
					<template #footer>
						<div class="flex flex-col gap-2">
							<div>
								<h1 class="font-bold text-lg truncate">
									{{ libraryItem.matched_song?.song?.title || 'Unknown Title' }}
								</h1>
								<p class="text-gray-600 dark:text-gray-300">
									{{ libraryItem.matched_song?.song?.artist || 'Unknown Artist' }}
								</p>
								<p v-if="libraryItem.matched_song?.song?.album" class="text-sm text-gray-500">
									{{ libraryItem.matched_song.song.album || 'Unknown Album' }}
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
const filterParams = ref({
	search: "",
	newestFirst: true
})

// card size
const compactCards = ref(true)
const cardSizes = {
	md: {
		regular: {
			cols: 2,
			imgHeight: '16rem'
		},
		compact: {
			cols: 3,
			imgHeight: "14rem"
		}
	},
	lg: {
		regular: {
			cols: 3,
			imgHeight: '18rem'
		},
		compact: {
			cols: 4,
			imgHeight: '16rem'
		}
	}
}
const activeCardConfig = computed(() => {
  return {
    md: compactCards.value ? cardSizes.md.compact : cardSizes.md.regular,
    lg: compactCards.value ? cardSizes.lg.compact : cardSizes.lg.regular
  }
})

// Authentication
const authToken = useAuthToken()
const userData = useUserData()
const isLoggedIn = computed(() => !!authToken.value)

// Library management
const { library, loading, error, fetchUserLibrary, clearLibrary } = useLibraryStore()

// Filtered songs from library
const filteredSongs = computed(() => {
  if (!library.value) return []
	console.log(library.value)
  
  let filteredLibrary = library.value.filter(libraryItem => {
    const song = libraryItem.matched_song?.song
    if (!song) return false
    
    const searchTerm = filterParams.value.search.toLowerCase()
    return song.title.toLowerCase().includes(searchTerm) ||
           song.artist.toLowerCase().includes(searchTerm) ||
           (song.album && song.album.toLowerCase().includes(searchTerm))
  })
	
	if (filterParams.value.newestFirst) {
		filteredLibrary.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
	} else {
		filteredLibrary.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
	}

	return filteredLibrary
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
