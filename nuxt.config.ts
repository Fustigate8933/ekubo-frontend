// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: ['@nuxt/ui', '@nuxt/eslint', '@nuxt/image', '@nuxt/test-utils/module'],

  css: ['~/assets/css/main.css'],

  compatibilityDate: '2025-07-16',

	imports: {
		dirs: [
			'app/utils'
		]
	},

	runtimeConfig: {
		public: {
			apiBase: process.env.API_BASE || 'http://127.0.0.1:8000',
		},
	},

	app: {
		head: {
			script: [
				{
					src: 'https://open.spotify.com/embed/iframe-api/v1',
					async: true
				}
			]
		}
	}
})
