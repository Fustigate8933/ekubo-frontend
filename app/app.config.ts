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
		},
		tooltip: {
			slots: {
				content: 'h-auto flex items-center gap-1 bg-default text-highlighted shadow-sm rounded-sm ring ring-default px-2.5 py-1 text-xs select-none data-[state=delayed-open]:animate-[scale-in_100ms_ease-out] data-[state=closed]:animate-[scale-out_100ms_ease-in] origin-(--reka-tooltip-content-transform-origin) pointer-events-auto max-w-[18rem]',
				arrow: 'fill-default',
				text: 'whitespace-normal break-words',
				kbds: "hidden lg:inline-flex items-center shrink-0 gap-0.5 not-first-of-type:before:content-['·'] not-first-of-type:before:me-0.5",
				kbdsSize: 'sm'
			}
		}
	}
})
