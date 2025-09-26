<template>
  <UApp>
		<NuxtLayout>
			<NuxtPage />
		</NuxtLayout>
  </UApp>
</template>

<script setup>
// Load Spotify Web Playback SDK
useHead({
  script: [
    {
      src: 'https://sdk.scdn.co/spotify-player.js',
      async: true
    }
  ]
})
</script>
