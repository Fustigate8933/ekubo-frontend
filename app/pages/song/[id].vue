<template>
  <div v-if="loading" class="flex justify-center items-center min-h-screen">
    <UIcon name="i-lucide-loader-2" class="animate-spin text-4xl" />
  </div>

  <div
    v-else-if="error"
    class="flex flex-col items-center justify-center min-h-screen gap-4"
  >
    <UIcon name="i-lucide-alert-circle" class="text-6xl text-red-500" />
    <h1 class="text-2xl font-bold text-red-600">Song Not Found</h1>
    <p class="text-gray-600">{{ error }}</p>
    <UButton to="/" color="primary">Back to Library</UButton>
  </div>

  <div v-else-if="songData" class="min-h-screen pt-6">
    <!-- Header Section -->
    <div class="bg-white dark:bg-gray-800 shadow-sm rounded-lg">
      <div class="max-w-6xl mx-auto px-4 py-6">
        <div class="flex items-center justify-between">
          <!-- Song Info -->
          <div class="flex items-center gap-4">
            <div
              class="w-16 h-16 rounded-lg overflow-hidden bg-gradient-to-br from-purple-400 to-pink-400"
            >
              <img
                v-if="songData.matched_song?.song?.album_image_url"
                :src="songData.matched_song.song.album_image_url"
                :alt="`${songData.matched_song?.song?.title} album cover`"
                class="w-full h-full object-cover"
              >
              <UIcon
                v-else
                name="i-lucide-music"
                class="w-full h-full text-white flex items-center justify-center"
              />
            </div>
            <div>
              <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
                {{ songData.matched_song?.song?.title || 'Unknown Title' }}
              </h1>
              <p class="text-gray-600 dark:text-gray-300">
                {{ songData.matched_song?.song?.artist || 'Unknown Artist' }}
              </p>
              <div class="mt-1">
                <span
                  class="inline-block px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full"
                >
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
        />
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-6xl mx-auto pb-8">
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
            <div class="flex items-center justify-center gap-4">
              <UButton
                variant="outline"
                size="lg"
                :disabled="currentLine <= 1"
                @click="previousLine"
              >
                <UIcon name="i-lucide-chevron-left" />
              </UButton>

              <UButton
                class=""
                :variant="isPlaying ? 'solid' : 'outline'"
                size="xl"
                :disabled="!canPlay"
                @click="togglePlayback"
              >
                <UIcon
                  :name="isPlaying ? 'i-lucide-pause' : 'i-lucide-play'"
                  class="text-xl"
                />
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
            <div
              class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4"
            >
              <p class="text-sm text-gray-600 dark:text-gray-300 mb-2">
                Current Line:
              </p>
              <p class="text-lg font-medium text-gray-900 dark:text-white">
                {{ currentLineText }}
              </p>
            </div>

            <!-- User Input Section -->
            <div class="space-y-3">
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Type what you hear:
              </label>
              <UTextarea
                v-model="userInput"
                placeholder="Listen carefully and type the Japanese lyrics..."
                :rows="3"
                class="w-full"
              />
              <UButton
                :disabled="!userInput.trim()"
                class="w-full text-center flex justify-center items-center"
                color="primary"
                @click="checkAnswer"
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
              <li class="flex items-center gap-3">
                <span
                  class="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium"
                  >1</span
                >
                <span>Click the play button to listen to the current line</span>
              </li>
              <li class="flex items-center gap-3">
                <span
                  class="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium"
                  >2</span
                >
                <span>Type what you hear in Japanese</span>
              </li>
              <li class="flex items-center gap-3">
                <span
                  class="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium"
                  >3</span
                >
                <span>Click "Check Answer" to see how you did</span>
              </li>
              <li class="flex items-center gap-3">
                <span
                  class="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium"
                  >4</span
                >
                <span>Continue to the next line and repeat</span>
              </li>
              <li class="flex items-center gap-3">
                <span
                  class="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium"
                  >💡</span
                >
                <span>If the spotify player says "preview", try logging into Spotify Web Player (no premium required) first and refresh Ekubo!</span>
              </li>
              <li class="flex items-center gap-3">
                <span
                  class="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium"
                  >❗</span
                >
                <span class="">Don't click the spotify player below, may break!</span>
              </li>
            </ol>
          </UCard>
        </div>
      </div>
    </div>

    <!-- Spotify Player Section -->
    <div
      v-if="songData?.matched_song?.song?.spotify_id"
      class="bg-white dark:bg-gray-800 shadow-lg rounded-lg mb-6"
    >
      <div class="p-4">
        <div id="song-spotify-player-iframe" class="w-full" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import type { UserLibraryWithDetails } from '~/types/user'
import type { SpotifyIFrameApi, EmbedController } from '~/types/song'
import { useUserData } from '~/composables/authStore'

// Route and data
const route = useRoute()
const songId = computed(() =>
  Array.isArray(route.params.id) ? route.params.id[0] : route.params.id
)

// State
const loading = ref(true)
const error = ref<string | null>(null)
const songData = ref<UserLibraryWithDetails | null>(null)

// Spotify iframe state
let embedController: EmbedController | null = null
let IFrameAPI: SpotifyIFrameApi | null = null
const controllerCreated = ref(false)
const IFrameReady = ref(false)

// Playback state refs
const isPlaying = ref(false)
const canPlay = ref(true)
const currentPlaybackTime = ref(0) // keep float seconds
const currentLineStartTime = ref(0) // keep float
const currentLineEndTime = ref(0)   // keep float
const isAutoPaused = ref(false)

// Practice state
const currentLine = ref(1)
const userInput = ref('')

// Lyrics parsing state
const lyricsLines = ref<Array<{ text: string; timestamp: number }>>([])
const totalLines = ref(0)
const currentLineText = ref('')

const checkAnswer = () => {
	
}

// Parse synced lyrics into lines with timestamps
const parseLyrics = (syncedLyrics: string) => {
  const lines: Array<{ text: string; timestamp: number }> = []
  const rawLines = syncedLyrics.split('\n').filter(line => line.trim())

  rawLines.forEach(line => {
    const timestampMatch = line.match(/^\[(\d{2}):(\d{2})(?:\.(\d{2}))?\]/)
    if (timestampMatch) {
      const minutes = parseInt(timestampMatch[1])
      const seconds = parseInt(timestampMatch[2])
      const centisec = timestampMatch[3] ? parseInt(timestampMatch[3]) : 0
      const totalSeconds = minutes * 60 + seconds + centisec / 100
      const text = line.replace(/^\[\d{2}:\d{2}(?:\.\d{2})?\]\s*/, '').trim()
      if (text) {
        lines.push({ text, timestamp: totalSeconds })
      }
    }
  })

  return lines
}

// Update bounds for current line (keep float seconds)
const updateBounds = () => {
  if (lyricsLines.value.length === 0) return
  const lineIndex = currentLine.value - 1
  if (lineIndex >= 0 && lineIndex < lyricsLines.value.length) {
    currentLineStartTime.value = lyricsLines.value[lineIndex].timestamp
    currentLineEndTime.value =
      lineIndex + 1 < lyricsLines.value.length
        ? lyricsLines.value[lineIndex + 1].timestamp
        : currentLineStartTime.value + 10
    currentLineText.value = lyricsLines.value[lineIndex].text

    console.log(
      `🎵 BOUNDS UPDATED - Line ${currentLine.value}: ${currentLineStartTime.value}s to ${currentLineEndTime.value}s`
    )
  }
}

// Computed
const progressPercentage = computed(() => {
  return ((currentLine.value - 1) / (totalLines.value - 1)) * 100
})

// Fetch song data
const fetchSongData = async () => {
  try {
    loading.value = true
    error.value = null

    const userData = useUserData()
    if (!userData.value?.id) {
      error.value = 'User not authenticated'
      return
    }

    const library = await $fetch(`/api/library/${userData.value.id}`)
    const foundSong = library.find(
      (item: UserLibraryWithDetails) =>
        item.matched_song?.song?.id === parseInt(songId.value)
    )

    if (!foundSong) {
      error.value = 'Song not found in your library'
      return
    }

    songData.value = foundSong

    if (foundSong.matched_song?.lyrics?.synced_lyrics) {
      lyricsLines.value = parseLyrics(foundSong.matched_song.lyrics.synced_lyrics)
      totalLines.value = lyricsLines.value.length
      updateBounds()
    } else {
      lyricsLines.value = []
      totalLines.value = 4
      currentLineText.value = 'エラーが発生しました！'
    }
  } catch (err) {
    console.error('Error fetching song data:', err)
    error.value = 'Failed to load song data'
  } finally {
    loading.value = false
  }
}

// Toggle playback
const togglePlayback = () => {
  if (!embedController || !IFrameReady.value) return

  if (isPlaying.value) {
    embedController.pause()
  } else {
    if (isAutoPaused.value) {
      seekToLineStart()
      isAutoPaused.value = false
    }
    embedController.resume()
  }
}

const previousLine = () => {
  if (currentLine.value > 1) {
    currentLine.value--
    userInput.value = ''
    isAutoPaused.value = false
    updateBounds()
    seekToLineStart()
    isPlaying.value = false
		canPlay.value = true
  }
}

const nextLine = () => {
  if (currentLine.value < totalLines.value) {
    currentLine.value++
    userInput.value = ''
    isAutoPaused.value = false
    updateBounds()
    seekToLineStart()
    isPlaying.value = false
		canPlay.value = true
  }
}

const replayLine = () => {
  seekToLineStart()
  isPlaying.value = false
  canPlay.value = true
}

const seekToLineStart = () => {
  if (!embedController || !IFrameReady.value) return
  const seekSec = Math.round(currentLineStartTime.value) // int seconds
  console.log(`🎵 SEEK - To line start: ${seekSec}s`)
  embedController.seek(seekSec)
  currentPlaybackTime.value = currentLineStartTime.value
}

// Spotify iframe setup
const initializeSpotifyPlayer = () => {
  if (!songData.value?.matched_song?.song?.spotify_id) {
    console.error('No Spotify ID available for this song')
    return
  }

  window.onSpotifyIframeApiReady = (_IFrameAPI: SpotifyIFrameApi) => {
    IFrameAPI = _IFrameAPI
    setIFrameWithID(songData.value!.matched_song!.song!.spotify_id!)
  }
}

const setIFrameWithID = (trackID: string) => {
  IFrameReady.value = false
  if (!controllerCreated.value) {
    const element = document.getElementById('song-spotify-player-iframe') as HTMLElement
    const options = { height: '152px', width: '100%' }

    const callback = (EmbedController: EmbedController) => {
      embedController = EmbedController

      embedController.addListener('ready', () => {
        IFrameReady.value = true
      })

      embedController.addListener('playback_update', (state: any) => {
        isPlaying.value = !state.data.isPaused
        currentPlaybackTime.value = state.data.position / 1000 // float seconds

        if (isPlaying.value && !isAutoPaused.value) {
          if (currentPlaybackTime.value >= currentLineEndTime.value) {
            console.log(`🎵 AUTO-PAUSE`)
            embedController.pause()
            isAutoPaused.value = true
            canPlay.value = false
          }
        }
      })

      embedController.addListener('playback_started', (e: any) => {
        console.log('Playback started for:', e.data?.playingURI)
        isPlaying.value = true
        isAutoPaused.value = false
      })
    }

    IFrameAPI!.createController(element, options, callback)
    controllerCreated.value = true

    const IFrameElements = document.getElementsByTagName('iframe')
    for (let i = 0; i < IFrameElements.length; i++) {
      const el = IFrameElements[i] as HTMLIFrameElement
      el.style.height = '152px'
      el.style.borderRadius = '12px'
      el.style.width = '100%'
    }
  }

  if (embedController) {
    embedController.loadUri(`spotify:track:${trackID}`)
  }
}

// Lifecycle
onMounted(async () => {
  await fetchSongData()
  if (songData.value) {
    initializeSpotifyPlayer()
  }
})

onUnmounted(() => {
  if (embedController) {
    embedController = null
  }
})
</script>

<style scoped>
/* Custom styles if needed */
</style>
