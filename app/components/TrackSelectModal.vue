<template>
	<UModal description="Select an audio track. This is required since the lyrics aren't provided by the Spotify API." :ui="{ content: 'max-w-3xl h-[80vh]', footer: 'justify-end' }">
		<template #title>
			<div class="flex gap-3">
				<h1>
					{{ trackName }} ({{ artistName }})
				</h1>
				<UBadge color="secondary">{{ secondsToMinAndSec(duration) }}</UBadge>
			</div>
		</template>
    <template #body>
			<h1 v-if="loading">Loading...</h1>
			<div v-else-if="tracks.length > 0" class="flex flex-col gap-5">
				<div id="embed-iframe" />
				<URadioGroup v-model="selectedTrack" label-key="name" value-key="self" description-key="artistNames" variant="table" :items="tracksForRadio" :disabled="!IFrameReady" />
			</div>
			<h1 v-else>No tracks found!</h1>
		</template>
    <template #footer>
      <UButton 
        label="Submit" 
        color="primary" 
        :loading="submitting"
        :disabled="!selectedTrack || submitting"
        @click="handleSubmit"
      />
    </template>
  </UModal>
</template>

<script setup lang="ts">
import type { SongResponse, SpotifyIFrameApi, EmbedController, Track } from '@/types/song'

const props = defineProps<{ songData: SongResponse }>()
const emit = defineEmits<{
  close: []
}>()

const loading = ref(false)
const submitting = ref(false)
let embedController: EmbedController | null = null
let IFrameAPI: SpotifyIFrameApi | null = null
const controllerCreated = ref(false)
const IFrameReady = ref(true)
const { trackName, artistName, duration } = props.songData
const tracks = ref<Track[]>([])
const tracksForRadio = computed(() => {
	return tracks.value.map(track => {
		let artistNames = ""
		for (let i = 0; i < track.artists.length; i++) {
			if (i > 0) {
				artistNames += ", "
			}
			artistNames += track.artists[i]!.name
		}
		
		return {
			...track,
			artistNames,
			self: track
		}
	})
})
const selectedTrack = ref<Track | null>(null)

// Get user data for API calls
const userData = useUserData()
const authToken = useAuthToken()

const fetchTracks = async () => {
	loading.value = true

  try {
    const { data, error } = await useFetch<{ tracks: Track[] }>("/api/getTracks", {
      params: {
        track_name: trackName,
        artist_name: artistName,
        track_limit: 10,
      },
    });

    if (error.value) {
      console.error("Error fetching tracks:", error.value);
    } else {
      tracks.value = data.value?.tracks || [];
    }
  } catch (e) {
    console.error("Unexpected error:", e);
	} finally {
		loading.value = false
	}
};

watch(selectedTrack, (newTrack) => {
  if (newTrack && newTrack.id) {
    setIFrameWithID(newTrack.id)
  }
})

const setIFrameWithID = (trackID: string) => {
	IFrameReady.value = false

	if (!controllerCreated.value) {
		const element = document.getElementById("embed-iframe") as HTMLElement
		const options = {
			height: "200px"
		}
		const callback = (EmbedController: EmbedController) => {
			embedController = EmbedController
			embedController.addListener('ready', () => {
				IFrameReady.value = true
			});
		}

		IFrameAPI!.createController(element, options, callback)
		controllerCreated.value = true

		const IFrameElements = document.getElementsByTagName("iframe")
		for (let i = 0; i < IFrameElements.length; i++) {
			const el = IFrameElements[i] as HTMLIFrameElement;
			el.style.height = "152px"
			el.style.borderRadius = "14px"
		}
	}

	if (embedController) {
		embedController.loadUri(`spotify:track:${trackID}`)
	}
}

const handleSubmit = async () => {
  if (!selectedTrack.value || !userData.value?.id) {
    return
  }

  submitting.value = true

  try {
    // Step 1: Create or get the song in the database
    const songData = {
      title: props.songData.trackName,
      artist: props.songData.artistName,
      album: selectedTrack.value.album?.name,
      album_image_url: selectedTrack.value.album?.images?.[0]?.url,
      duration: Math.floor(selectedTrack.value.duration_ms / 1000),
      spotify_id: selectedTrack.value.id
    }

    // First, try to find existing song
    let songId: number
    try {
      const existingSong = await $fetch(`/api/songs?title=${encodeURIComponent(songData.title)}&artist=${encodeURIComponent(songData.artist)}`)
      if (existingSong && existingSong.length > 0) {
        songId = existingSong[0].id
      } else {
        // Create new song
        const newSong = await $fetch('/api/songs', {
          method: 'POST',
          body: songData
        })
        songId = newSong.id
      }
    } catch (error) {
      // If search fails, create new song
      const newSong = await $fetch('/api/songs', {
        method: 'POST',
        body: songData
      })
      songId = newSong.id
    }

    // Step 2: Create or get the lyrics
    let lyricsId: number
    try {
      const existingLyrics = await $fetch(`/api/lyrics?synced_lyrics=${encodeURIComponent(props.songData.syncedLyrics)}`)
      if (existingLyrics && existingLyrics.length > 0) {
        lyricsId = existingLyrics[0].id
      } else {
        // Create new lyrics
        const newLyrics = await $fetch('/api/lyrics', {
          method: 'POST',
          body: {
            synced_lyrics: props.songData.syncedLyrics
          }
        })
        lyricsId = newLyrics.id
      }
    } catch (error) {
      // If search fails, create new lyrics
      const newLyrics = await $fetch('/api/lyrics', {
        method: 'POST',
        body: {
          synced_lyrics: props.songData.syncedLyrics
        }
      })
      lyricsId = newLyrics.id
    }

    // Step 3: Create matched song
    const matchedSong = await $fetch('/api/matched', {
      method: 'POST',
      body: {
        song_id: songId,
        lyrics_id: lyricsId,
        created_by_user_id: userData.value.id
      }
    })

    // Step 4: Add to user's library
    await $fetch('/api/library', {
      method: 'POST',
      body: {
        user_id: userData.value.id,
        matched_song_id: matchedSong.id
      }
    })

    // Step 5: Close modal and redirect to home
    emit('close')
    await navigateTo('/')
    
  } catch (error) {
    console.error('Error adding song to library:', error)
    // You could add a toast notification here
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  fetchTracks();

	window.onSpotifyIframeApiReady = (_IFrameAPI: SpotifyIFrameApi) => {
		IFrameAPI = _IFrameAPI
	}
});
</script>

<style scoped>
iframe {
	display: block;
}
</style>
