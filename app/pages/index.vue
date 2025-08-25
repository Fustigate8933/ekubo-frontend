<template>
	<div id="index-wrapper" class="flex flex-col items-center gap-10">
		<h1 class="font-bold text-4xl text-(--ui-primary)">
			Choose a song to practice
		</h1>

		<p class="text-lg max-w-3xl text-center">
			Select from our collection of Japanese songs to practice your listening skills. Each song will play line by line, allowing you to transcribe and learn at your own pace.
		</p>

		<div class="flex flex-col items-center gap-10">
			<div class="w-full">
				<UInput v-model="search" icon="i-lucide-search" size="lg" variant="outline" placeholder="Search by song or artist" />
			</div>

			<div class="w-full flex gap-8">
				<UCard v-for="(song, idx) in filteredSongs" :key="idx" variant="outline">
					<div class="w-70 h-100">
						<img :src="song.src" class="w-full h-full object-cover" alt="song image" >
					</div>
					<template #footer>
						<div class="flex flex-col gap-2">
							<div>
								<h1 class="font-bold text-lg">
									{{ song.title }}
								</h1>
						<p class="">
									{{ song.artist }}
								</p>
							</div>
							<NuxtLink :to="`/song/${song.id}`">
								<UButton class="w-full justify-center items-center" variant="solid" color="neutral">
									<h1 class="text-lg font-semibold">
										Start Practice
									</h1>
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

const songStore = useSongStore()
const songCards = Object.values(songStore.value)
const filteredSongs = computed(() =>
	songCards.filter(song =>
		song.title.toLowerCase().includes(search.value.toLowerCase()) ||
			song.artist.toLowerCase().includes(search.value.toLowerCase())
	)
)
</script>
