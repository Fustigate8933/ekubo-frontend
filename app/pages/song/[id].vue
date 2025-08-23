<template>
	<div v-if="curSongId && curSongId in songStore" class="w-full h-full">
		<UCard>
			<template #header>
				<div class="flex gap-4">
					<div class="w-20 h-20">
						<img :src="songData?.src" class="w-full h-full object-cover rounded-xl" alt="song image" >
					</div>
					<div class="flex flex-col justify-center">
						<h1 class="font-bold text-xl">
							{{ songData?.title }}
						</h1>
						<p>
							{{ songData?.artist }}
						</p>
					</div>
				</div>
			</template>
		</UCard>
	</div>
	<div v-else>
		<h1>The song with id <span class="font-bold text-error">{{ curSongId }}</span> does not exist</h1>
	</div>
</template>

<script setup lang="ts">
const route = useRoute()
const songStore = useSongStore()
const curSongId = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id
const songData = curSongId && songStore.value[curSongId] ? songStore.value[curSongId] : null
</script>

<style scoped>

</style>
