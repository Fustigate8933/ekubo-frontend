<template>
  <div class="w-full h-full flex flex-col gap-10">
    <div class="flex justify-between">
      <div>
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
      <h1 class="text-lg">Search songs</h1>
      <div class="w-full flex gap-3" @keydown.enter="handleSearch">
        <UInput
          v-model="search"
          class="w-full"
          icon="i-lucide-search"
          size="lg"
          variant="subtle"
          placeholder="Search by song or artist"
        />
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
          @click="handleSearchFromPopular('kimi ni todoke')"
          >kimi ni todoke</UButton
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
							<UButton color="secondary" variant="outline" @click="handleAddSong(song)">
								<h1>Preview lyrics</h1>
							</UButton>
							<UButton color="neutral" @click="handleAddSong(song)">
								<h1>Add song</h1>
							</UButton>
						</div>
          </div>
        </div>
      </template>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import type { SongResponse } from '@/types/song';

const search = ref<string | null>(null);
const loading = ref<boolean>(false);
const searchResults = ref<SongResponse[]>([]);
const filteredSearchResults = computed(() =>
  searchResults.value.filter((result) => result.syncedLyrics),
); // only want the synced lyrics

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
  search.value = name;
  handleSearch();
};

const handleAddSong = async (song: SongResponse) => {
  console.log(song);
};
</script>

<style scoped></style>
