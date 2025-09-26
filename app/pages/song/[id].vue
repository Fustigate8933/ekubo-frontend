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
              />
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
                class=""
                :variant="spotifyIsPlaying ? 'solid' : 'outline'"
                size="xl"
                :disabled="!canPlay && !spotifyIsPlaying"
                @click="togglePlayback"
              >
                <UIcon
                  :name="spotifyIsPlaying ? 'i-lucide-pause' : 'i-lucide-play'"
                  class="text-xl"
                />
              </UButton>

              <UButton
                variant="outline"
                size="lg"
                @click="restartLine"
                title="Restart current line"
              >
                <UIcon name="i-lucide-rotate-ccw" />
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
              <li class="flex items-start gap-3">
                <span
                  class="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium"
                  >1</span
                >
                <span>Click the play button to listen to the current line</span>
              </li>
              <li class="flex items-start gap-3">
                <span
                  class="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium"
                  >2</span
                >
                <span>Type what you hear in Japanese characters</span>
              </li>
              <li class="flex items-start gap-3">
                <span
                  class="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium"
                  >3</span
                >
                <span>Click "Check Answer" to see how you did</span>
              </li>
              <li class="flex items-start gap-3">
                <span
                  class="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium"
                  >4</span
                >
                <span>Continue to the next line and repeat</span>
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
const spotifyIsPlaying = ref(false)
const currentPosition = ref(0)
const isAutoPaused = ref(false)
let autoPauseTimer: NodeJS.Timeout | null = null
let lastPlayTime = ref(0)

// Practice state
const currentLine = ref(1)
const userInput = ref('')

// Lyrics parsing state
const lyricsLines = ref<Array<{ text: string; timestamp: number }>>([])
const totalLines = ref(0)
const currentLineText = ref('')

// Parse synced lyrics into lines with timestamps
const parseLyrics = (syncedLyrics: string) => {
  const lines: Array<{ text: string; timestamp: number }> = []
  const rawLines = syncedLyrics.split('\n').filter(line => line.trim())

  rawLines.forEach(line => {
    const timestampMatch = line.match(/^\[(\d{2}):(\d{2})(?:\.(\d{2}))?\]/)
    if (timestampMatch) {
      const minutes = parseInt(timestampMatch[1])
      const seconds = parseInt(timestampMatch[2])
      const milliseconds = timestampMatch[3] ? parseInt(timestampMatch[3]) * 10 : 0
      const totalSeconds = minutes * 60 + seconds + milliseconds / 1000
      const text = line.replace(/^\[\d{2}:\d{2}(?:\.\d{2})?\]\s*/, '').trim()

      if (text) {
        lines.push({ text, timestamp: totalSeconds })
      }
    }
  })

  return lines
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
      if (lyricsLines.value.length > 0) {
        currentLineText.value = lyricsLines.value[0].text
      }
    } else {
      // Fallback mock data
      lyricsLines.value = []
      totalLines.value = 4
      currentLineText.value = '最初からもう間に合わない場所に居たんだ'
    }
  } catch (err) {
    console.error('Error fetching song data:', err)
    error.value = 'Failed to load song data'
  } finally {
    loading.value = false
  }
}

// Playback controls
const togglePlayback = async () => {
  if (!songData.value?.matched_song?.song?.spotify_id) {
    console.error('No Spotify ID available for this song')
    return
  }
  if (!embedController || !IFrameReady.value) {
    console.warn('Spotify player not ready')
    return
  }

  if (!spotifyIsPlaying.value) {
    if (isWithinCurrentLineBounds()) {
      embedController.play()
      isAutoPaused.value = false
    } else {
      console.log('Cannot play: not within current line bounds')
    }
  } else {
    embedController.pause()
  }
}

const previousLine = () => {
  if (currentLine.value > 1) {
    currentLine.value--
    userInput.value = ''
    isAutoPaused.value = false

    if (lyricsLines.value.length > 0 && currentLine.value <= lyricsLines.value.length) {
      currentLineText.value = lyricsLines.value[currentLine.value - 1].text
    }
    seekToLine(currentLine.value)
  }
}

const nextLine = () => {
  if (currentLine.value < totalLines.value) {
    currentLine.value++
    userInput.value = ''
    isAutoPaused.value = false

    if (lyricsLines.value.length > 0 && currentLine.value <= lyricsLines.value.length) {
      currentLineText.value = lyricsLines.value[currentLine.value - 1].text
    }
    seekToLine(currentLine.value)
  }
}

const replayLine = () => {
  seekToLine(currentLine.value)
}

const restartLine = () => {
  console.log('Restarting current line')
  seekToLine(currentLine.value)
  isAutoPaused.value = false
}

const seekToLine = (lineNumber: number) => {
  if (!embedController || !IFrameReady.value || lyricsLines.value.length === 0) {
    console.warn('Cannot seek: player not ready or no lyrics available')
    return
  }

  const lineIndex = lineNumber - 1
  if (lineIndex >= 0 && lineIndex < lyricsLines.value.length) {
    const timestamp = lyricsLines.value[lineIndex].timestamp
    console.log(`Seeking to line ${lineNumber} at ${timestamp}s`)
    embedController.seek(timestamp)
    isAutoPaused.value = false

    setTimeout(() => {
      if (spotifyIsPlaying.value && !isAutoPaused.value) {
        console.log('Timeout-based auto pause triggered')
        embedController?.pause()
        isAutoPaused.value = true
      }
    }, 5000)
  }
}

const isWithinCurrentLineBounds = () => {
  if (lyricsLines.value.length === 0) return true

  const lineIndex = currentLine.value - 1
  const currentLineStart = lyricsLines.value[lineIndex]?.timestamp || 0
  const nextLineStart =
    lineIndex + 1 < lyricsLines.value.length
      ? lyricsLines.value[lineIndex + 1].timestamp
      : currentLineStart + 10

  const isWithin =
    currentPosition.value >= currentLineStart &&
    currentPosition.value < nextLineStart

  console.log(
    `Line ${currentLine.value}: pos=${currentPosition.value.toFixed(
      2
    )}s, start=${currentLineStart}s, end=${nextLineStart}s, within=${isWithin}`
  )

  return isWithin
}

// Computed for play button state
const canPlay = computed(() => {
  return isWithinCurrentLineBounds() && !spotifyIsPlaying.value
})

// Auto-pause logic
const checkForLineEnd = () => {
  if (lyricsLines.value.length === 0) return

  const lineIndex = currentLine.value - 1
  const currentLineStart = lyricsLines.value[lineIndex]?.timestamp || 0
  const nextLineStart =
    lineIndex + 1 < lyricsLines.value.length
      ? lyricsLines.value[lineIndex + 1].timestamp
      : currentLineStart + 10

  if (currentPosition.value >= nextLineStart) {
    console.log('Reached end of current line, pausing')
    embedController?.pause()
    isAutoPaused.value = true
  }
}

const startAutoPauseMonitoring = () => {
  if (autoPauseTimer) clearInterval(autoPauseTimer)
  autoPauseTimer = setInterval(() => {
    if (spotifyIsPlaying.value && !isAutoPaused.value) {
      checkForLineEnd()
    }
  }, 1000)
}

const stopAutoPauseMonitoring = () => {
  if (autoPauseTimer) {
    clearInterval(autoPauseTimer)
    autoPauseTimer = null
  }
}

// Navigation
const goToLine = (lineNum: number) => {
  currentLine.value = lineNum
  userInput.value = ''
  isAutoPaused.value = false

  if (lyricsLines.value.length > 0 && lineNum <= lyricsLines.value.length) {
    currentLineText.value = lyricsLines.value[lineNum - 1].text
  }
  seekToLine(lineNum)
}

// Answer checking
const checkAnswer = () => {
  console.log(
    'Checking answer for line:',
    currentLine.value,
    'Input:',
    userInput.value
  )
}

// Debug
const testAutoPause = () => {
  console.log('Testing auto-pause...')
  embedController?.pause()
  isAutoPaused.value = true
}

const resetAutoPause = () => {
  console.log('Resetting auto-pause state...')
  isAutoPaused.value = false
  lastPlayTime.value = Date.now()
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
        const wasPlaying = spotifyIsPlaying.value
        spotifyIsPlaying.value = !state.paused
        currentPosition.value = state.position / 1000

        if (spotifyIsPlaying.value && !wasPlaying) {
          startAutoPauseMonitoring()
        } else if (!spotifyIsPlaying.value && wasPlaying) {
          stopAutoPauseMonitoring()
        }
      })

      embedController.addListener('playback_started', (e: any) => {
        console.log('Playback started for:', e.data?.playingURI)
        spotifyIsPlaying.value = true
        isAutoPaused.value = false
        startAutoPauseMonitoring()
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
  stopAutoPauseMonitoring()
})
</script>

<style scoped>
/* Custom styles if needed */
</style>
