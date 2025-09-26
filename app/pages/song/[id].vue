<template>
	<div v-if="loading" class="flex justify-center items-center min-h-screen">
		<UIcon name="i-lucide-loader-2" class="animate-spin text-4xl" />
	</div>

	<div v-else-if="error" class="flex flex-col items-center justify-center min-h-screen gap-4">
		<UIcon name="i-lucide-alert-circle" class="text-6xl text-red-500" />
		<h1 class="text-2xl font-bold text-red-600">Song Not Found</h1>
		<p class="text-gray-600">{{ error }}</p>
		<UButton to="/" color="primary">Back to Library</UButton>
	</div>

	<div v-else-if="songData" class="min-h-screen">
		<!-- Header Section -->
		<div class="bg-white dark:bg-gray-800 shadow-sm rounded-lg">
			<div class="max-w-6xl mx-auto px-4 py-6">
				<div class="flex items-center justify-between">
					<!-- Song Info -->
					<div class="flex items-center gap-4">
						<div class="w-16 h-16 rounded-lg overflow-hidden bg-gradient-to-br from-purple-400 to-pink-400">
							<img 
								v-if="songData.matched_song?.song?.album_image_url" 
								:src="songData.matched_song.song.album_image_url" 
								:alt="`${songData.matched_song?.song?.title} album cover`"
								class="w-full h-full object-cover"
							/>
							<UIcon v-else name="i-lucide-music" class="w-full h-full text-white flex items-center justify-center" />
						</div>
						<div>
							<h1 class="text-2xl font-bold text-gray-900 dark:text-white">
								{{ songData.matched_song?.song?.title || 'Unknown Title' }}
							</h1>
							<p class="text-gray-600 dark:text-gray-300">
								{{ songData.matched_song?.song?.artist || 'Unknown Artist' }}
							</p>
							<div class="mt-1">
								<span class="inline-block px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">
									J-Pop
								</span>
							</div>
						</div>
					</div>

					<!-- Back Button -->
					<UButton to="/" variant="outline" class="flex items-center gap-2">
						<UIcon name="i-lucide-arrow-left" />
						Back to Library
					</UButton>
				</div>
			</div>
		</div>

		<!-- Progress Section -->
		<div class="max-w-6xl mx-auto px-4 py-4">
			<div class="flex items-center justify-between mb-2">
				<span class="text-sm font-medium text-gray-600 dark:text-gray-300">
					Line {{ currentLine }} of {{ totalLines }}
				</span>
				<span class="text-sm font-medium text-gray-600 dark:text-gray-300">
					{{ Math.round(progressPercentage) }}% Complete
				</span>
			</div>
			<div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
				<div 
					class="bg-blue-600 h-2 rounded-full transition-all duration-300"
					:style="{ width: `${progressPercentage}%` }"
				></div>
			</div>
		</div>

		<!-- Main Content -->
		<div class="max-w-6xl mx-auto px-4 pb-8">
			<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<!-- Left Column: Listen & Transcribe -->
				<div class="space-y-6">
					<!-- Music Player Card -->
					<UCard class="p-6">
						<div class="flex items-center gap-3 mb-4">
							<UIcon name="i-lucide-speaker" class="text-xl text-blue-600" />
							<h2 class="text-xl font-semibold text-gray-900 dark:text-white">
								Listen & Transcribe
							</h2>
						</div>

						<!-- Music Player Controls -->
						<div class="flex items-center justify-center gap-4 mb-6">
							<UButton 
								variant="outline" 
								size="lg"
								:disabled="currentLine <= 1"
								@click="previousLine"
							>
								<UIcon name="i-lucide-chevron-left" />
							</UButton>

							<UButton 
								:variant="isPlaying ? 'solid' : 'outline'"
								size="xl"
								:color="isPlaying ? 'red' : 'blue'"
								@click="togglePlayback"
								class="w-16 h-16 rounded-full"
							>
								<UIcon :name="isPlaying ? 'i-lucide-pause' : 'i-lucide-play'" class="text-xl" />
							</UButton>

							<UButton 
								variant="outline" 
								size="lg"
								@click="replayLine"
							>
								<UIcon name="i-lucide-rotate-ccw" />
							</UButton>

							<UButton 
								variant="outline" 
								size="lg"
								:disabled="currentLine >= totalLines"
								@click="nextLine"
							>
								<UIcon name="i-lucide-chevron-right" />
							</UButton>
						</div>

						<!-- Current Line Display -->
						<div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4">
							<p class="text-sm text-gray-600 dark:text-gray-300 mb-2">Current Line:</p>
							<p class="text-lg font-medium text-gray-900 dark:text-white">
								{{ currentLineText }}
							</p>
						</div>

						<!-- User Input Section -->
						<div class="space-y-3">
							<label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
								Type what you hear:
							</label>
							<UTextarea
								v-model="userInput"
								placeholder="Listen carefully and type the Japanese lyrics..."
								:rows="3"
								class="w-full"
							/>
							<UButton 
								@click="checkAnswer"
								:disabled="!userInput.trim()"
								class="w-full"
								color="primary"
							>
								Check Answer
							</UButton>
						</div>
					</UCard>
				</div>

				<!-- Right Column: Instructions & Progress -->
				<div class="space-y-6">
					<!-- Instructions Card -->
					<UCard class="p-6">
						<h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
							Instructions
						</h2>
						<ol class="space-y-3 text-sm text-gray-600 dark:text-gray-300">
							<li class="flex items-start gap-3">
								<span class="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">1</span>
								<span>Click the play button to listen to the current line</span>
							</li>
							<li class="flex items-start gap-3">
								<span class="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">2</span>
								<span>Type what you hear in Japanese characters</span>
							</li>
							<li class="flex items-start gap-3">
								<span class="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">3</span>
								<span>Click "Check Answer" to see how you did</span>
							</li>
							<li class="flex items-start gap-3">
								<span class="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">4</span>
								<span>Continue to the next line and repeat</span>
							</li>
						</ol>
					</UCard>

					<!-- Progress Overview Card -->
					<UCard class="p-6">
						<h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
							Progress Overview
						</h2>
						<div class="grid grid-cols-4 gap-2">
							<UButton
								v-for="lineNum in totalLines"
								:key="lineNum"
								:variant="lineNum === currentLine ? 'solid' : 'outline'"
								:color="lineNum === currentLine ? 'blue' : 'gray'"
								@click="goToLine(lineNum)"
								class="aspect-square"
							>
								{{ lineNum }}
							</UButton>
						</div>
					</UCard>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import type { UserLibraryWithDetails } from '~/types/user'
import { useMusicPlayer } from '~/composables/useMusicPlayer'
import { useUserData } from '~/composables/authStore'

// Route and data
const route = useRoute()
const songId = computed(() => Array.isArray(route.params.id) ? route.params.id[0] : route.params.id)

// State
const loading = ref(true)
const error = ref<string | null>(null)
const songData = ref<UserLibraryWithDetails | null>(null)

// Music player
const {
  isPlaying,
  currentTrack,
  currentTime,
  duration,
  volume,
  isReady,
  progress,
  formattedTime,
  initializePlayer,
  playTrack,
  togglePlayPause,
  setVolume,
  seekTo,
  disconnect
} = useMusicPlayer()

// Practice state
const currentLine = ref(1)
const userInput = ref('')

// Mock data for now - will be replaced with actual lyrics parsing
const totalLines = ref(4)
const currentLineText = ref('最初からもう間に合わない場所に居たんだ')

// Computed
const progressPercentage = computed(() => {
	return ((currentLine.value - 1) / (totalLines.value - 1)) * 100
})

// Methods
const fetchSongData = async () => {
	try {
		loading.value = true
		error.value = null

		// Get user data to get the actual user ID
		const userData = useUserData()
		if (!userData.value?.id) {
			error.value = 'User not authenticated'
			return
		}

		// Get user library to find the song
		const library = await $fetch(`/api/library/${userData.value.id}`)
		
		const foundSong = library.find((item: UserLibraryWithDetails) => 
			item.matched_song?.song?.id === parseInt(songId.value)
		)

		if (!foundSong) {
			error.value = 'Song not found in your library'
			return
		}

		songData.value = foundSong
		
		// TODO: Parse lyrics into lines for practice
		// For now, using mock data
		
	} catch (err) {
		console.error('Error fetching song data:', err)
		error.value = 'Failed to load song data'
	} finally {
		loading.value = false
	}
}

const togglePlayback = async () => {
	if (!songData.value?.matched_song?.song?.spotify_id) {
		console.error('No Spotify ID available for this song')
		return
	}

	// Create Spotify track object
	const spotifyTrack = {
		id: songData.value.matched_song.song.spotify_id,
		name: songData.value.matched_song.song.title,
		artists: [{ name: songData.value.matched_song.song.artist }],
		album: {
			name: songData.value.matched_song.song.album || '',
			images: songData.value.matched_song.song.album_image_url ? 
				[{ url: songData.value.matched_song.song.album_image_url }] : []
		},
		duration_ms: (songData.value.matched_song.song.duration || 0) * 1000,
		preview_url: null
	}

	await togglePlayPause()
}

const previousLine = () => {
	if (currentLine.value > 1) {
		currentLine.value--
		userInput.value = ''
	}
}

const nextLine = () => {
	if (currentLine.value < totalLines.value) {
		currentLine.value++
		userInput.value = ''
	}
}

const replayLine = () => {
	// TODO: Replay current line
	console.log('Replay line:', currentLine.value)
}

const goToLine = (lineNum: number) => {
	currentLine.value = lineNum
	userInput.value = ''
}

const checkAnswer = () => {
	// TODO: Implement answer checking logic
	console.log('Checking answer for line:', currentLine.value, 'Input:', userInput.value)
}

// Lifecycle
onMounted(async () => {
	await fetchSongData()
	// Initialize music player after song data is loaded
	if (songData.value) {
		await initializePlayer()
	}
})

onUnmounted(() => {
	disconnect()
})
</script>

<style scoped>
/* Custom styles if needed */
</style>
