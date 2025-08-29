export default defineAppConfig({
	// https://ui.nuxt.com/getting-started/theme#design-system
	ui: {
		card: {
			slots: {
				body: "p-0 sm:p-0"
			}
		},
		button: {
			slots: {
				base: [
					'rounded-md font-medium inline-flex items-center cursor-pointer disabled:cursor-not-allowed aria-disabled:cursor-not-allowed disabled:opacity-75 aria-disabled:opacity-75',
					'transition-colors'
				]
			}
		},
		radioGroup: {
			slots:{
				item: "flex items-center gap-2",
				container: "flex items-center"
			}
		}
	}
})
