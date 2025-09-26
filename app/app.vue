<template>
  <UApp>
		<NuxtLayout>
			<NuxtPage />
		</NuxtLayout>
  </UApp>
</template>

<script setup>
// Load Spotify Web Playback SDK and Iframe API
useHead({
  script: [
    {
      src: 'https://sdk.scdn.co/spotify-player.js',
      async: true
    },
    {
      src: 'https://open.spotify.com/embed-podcast/iframe-api/v1',
      async: true
    }
  ]
})
</script>
