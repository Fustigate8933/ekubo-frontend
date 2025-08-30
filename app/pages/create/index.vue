<template>
  <div class="w-full h-full flex flex-col gap-10 pt-10">
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
          Popular searches:
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
          @click="handleSearchFromPopular('好きだから')"
          >好きだから</UButton
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
							<UButton color="secondary" variant="outline">
								<h1>Preview lyrics</h1>
							</UButton>
							<UButton color="neutral" @click="trackSelectModalOpen(song)">
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
); // only want the synced lyrics
const overlay = useOverlay()
const trackSelectModal = overlay.create(TrackSelectModal)

const trackSelectModalOpen = async (songData: SongResponse) => {
	trackSelectModal.open({ songData })
}

const handleSearch = async () => {
  loading.value = true;

  try {
    const params = {
      q: search.value ?? "",
    };

    const { data, error } = await useFetch<SongResponse[]>("/api/searchSongs", {
      params,
    });

    if (error.value) {
      console.error(error.value);
    } else {
      searchResults.value = data.value ?? [];
    }
  } catch (e) {
    console.error(e);
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
</script>

<style scoped></style>
