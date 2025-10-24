<template>
  <div class="w-full h-full flex flex-col gap-10 py-10">
    <div class="flex justify-between">
      <div class="p-2">
        <h1 class="font-bold text-2xl">Add a new song</h1>
        <p>Search for a Japanese song to add to your practice library</p>
      </div>
      <UButton
        class="self-center flex justify-center items-center"
        icon="material-symbols:arrow-left-alt-rounded"
        to="/"
        size="md"
        color="neutral"
        variant="outline"
        >Return home</UButton
      >
    </div>
    <div class="flex flex-col gap-3 w-full rounded-xl p-5 bg-secondary/20">
      <h1 class="text-lg font-semibold">Search songs</h1>
      <div class="w-full flex gap-3" @keydown.enter="handleSearch">
        <UInput
          v-model="search"
          class="w-full"
          icon="i-lucide-search"
          size="lg"
          variant="subtle"
					placeholder="Search by song or artist"
				>
					<template #trailing>
						<UTooltip :delay-duration="0" text="Tip: Try to use the same name as you would see on music streaming websites (i.e. with kanji, romaji, spaces, etc.)">
							<UButton
								color="neutral"
								variant="link"
								size="sm"
								icon="i-lucide-help-circle"
								aria-label="Search tip"
								tabindex="-1"
								class="cursor-pointer"
							/>
						</UTooltip>
					</template>
				</UInput>
        <UButton
          class="flex justify-center items-center"
          icon="material-symbols:search"
          size="md"
          color="secondary"
          variant="solid"
          :loading="loading"
          :disabled="loading || !search || search === ''"
          @click="handleSearch"
          >Search</UButton
        >
      </div>
      <div class="flex items-center gap-3">
        <p class="text-sm text-gray-600 dark:text-gray-300">
          Recommendations:
        </p>
        <UButton
          class="self-start"
          variant="soft"
          color="neutral"
          size="sm"
          @click="handleSearchFromPopular('きみにとどけ')"
          >きみにとどけ</UButton
        >
        <UButton
          class="self-start"
          variant="soft"
          color="neutral"
          size="sm"
          @click="handleSearchFromPopular('言葉にせずとも')"
          >言葉にせずとも</UButton
        >
        <UButton
          class="self-start"
          variant="soft"
          color="neutral"
          size="sm"
          @click="handleSearchFromPopular('宇宙の季節')"
          >宇宙の季節</UButton
        >
      </div>
    </div>

		<!-- Already matched songs -->
		<UCard
			v-for="match in matchedResults"
			:key="match.song.id"
			variant="outline"
		>
			<template #footer>
				<div class="flex flex-col gap-2">
					<div class="flex justify-between items-center">
						<h1 class="font-bold text-lg">
							{{ match.song.title }}
						</h1>
						<UBadge class="self-start" color="success">
							Matched
						</UBadge>
					</div>
					<UBadge class="self-start" color="secondary">
						{{ secondsToMinAndSec(match.song.duration) }}
					</UBadge>
					<div class="flex justify-between">
						<p>
							{{ match.song.artist }}
						</p>
						<div class="flex gap-2">
							<UButton color="info" :disabled="addingSong" :loading="addingSong" @click="addMatchedSong(match)">
								<h1>Add Track</h1>
							</UButton>
						</div>
					</div>
				</div>
			</template>
		</UCard>

    <UCard
      v-for="song in filteredSearchResults"
      :key="song.id"
      variant="outline"
    >
      <template #footer>
        <div class="flex flex-col gap-2">
          <h1 class="font-bold text-lg">
            {{ song.trackName }}
          </h1>
          <UBadge class="self-start" color="secondary">
            {{ secondsToMinAndSec(song.duration) }}
          </UBadge>
          <div class="flex justify-between">
            <p>
              {{ song.artistName }}
            </p>
						<div class="flex gap-2">
							<UButton color="primary" @click="trackSelectModalOpen(song)">
								<h1>Add Track</h1>
							</UButton>
						</div>
          </div>
        </div>
      </template>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import type { SongResponse } from '@/types/song'
import TrackSelectModal from '@/components/TrackSelectModal.vue';
import { UButton } from '#components';

const search = ref<string | null>(null)
const loading = ref<boolean>(false)
const searchResults = ref<SongResponse[]>([])
const filteredSearchResults = computed(() =>
  searchResults.value.filter((result) => result.syncedLyrics),
	// console.log(searchResults.value)
); // only want the synced lyrics
const matchedResults = ref<any[]>([])
const overlay = useOverlay()
const trackSelectModal = overlay.create(TrackSelectModal)
const userData = useUserData()
const addingSong = ref(false)
const toast = useToast()

const trackSelectModalOpen = async (songData: SongResponse) => {
	trackSelectModal.open({ 
		songData,
		onClose: () => {
		}
	})
}

const handleSearch = async () => {
  loading.value = true;

  try {
    const params = {
      q: search.value ?? "",
    };

		const { data: matchedData, error: matchedError } = await useFetch("/api/matched", { params })
    if (matchedError.value) {
      console.error(matchedError.value)
      toast.add({ title: 'Matched search failed', description: String(matchedError.value?.message ?? matchedError.value), color: 'error' })
    } else {
      matchedResults.value = matchedData.value as any[]
    }

    const { data, error } = await useFetch<SongResponse[]>("/api/searchSongs", { params });
    if (error.value) {
      console.error(error.value);
      toast.add({ title: 'Song search failed', description: String(error.value?.message ?? error.value), color: 'error' })
    } else {
      searchResults.value = data.value ?? [];
    }
  } catch (e) {
    console.error(e);
    toast.add({ title: 'Search error', description: String((e as any)?.message ?? e ?? 'Search failed'), color: 'error' })
  } finally {
    loading.value = false;
  }
};

const handleSearchFromPopular = (name: string) => {
	const variations = getNameVariations(name)
	for (let i = 0; i < variations.length; i++) {
		search.value = name;
		handleSearch();
		if (searchResults.value.length > 0) {
			break
		}
	}
};

const addMatchedSong = async (match: any) => {
	addingSong.value = true

	if (!userData.value?.id) {
    addingSong.value = false
    toast.add({
      title: 'Login required',
      description: 'Please log in to add songs to your library.',
      color: 'warning',
    })
    return
  }

	try {
		await $fetch('/api/library', {
			method: 'POST',
			body: {
				user_id: userData.value.id,
				matched_song_id: match.id
			}
		})

		await navigateTo('/')
	} catch (error) {
    // Show a user-friendly toast when the backend reports the song already exists
    const e = error as any
    const status = e?.statusCode ?? e?.status ?? e?.response?.status ?? null
    const detail = e?.data?.detail ?? e?.data?.message ?? e?.message ?? ''

    if (status === 400 || /already in library/i.test(String(detail))) {
      toast.add({
        title: 'Already in library',
        description: detail || 'This song is already in your library.',
        color: 'warning',
      })
    } else {
      toast.add({
        title: 'Error adding track',
        description: detail || 'Failed to add the song. Please try again later.',
        color: 'error',
      })
    }
    console.error('Error adding song to library:', error)
	} finally {
		addingSong.value = false
	}
}
</script>

<style scoped>
</style>
