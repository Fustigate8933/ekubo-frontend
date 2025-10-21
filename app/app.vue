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

useSeoMeta({
	title: 'Ekubo - Japanese wordle',
	ogTitle: 'Ekubo - Japanese wordle',
	description: 'Learn Japanese by practiing typing out lyrics	from your favorite J-Pop songs.',
	ogDescription: 'Learn Japanese by practiing typing out lyrics	from your favorite J-Pop songs.',
	ogImage: '/ekubo.png',
	twitterCard: 'summary_large_image'
})
</script>
