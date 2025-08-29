import { toRomaji, toKana } from 'wanakana'

export const secondsToMinAndSec = (totalSeconds: number) => {
	const minutes = Math.floor(totalSeconds / 60)
	const seconds = Math.floor(totalSeconds % 60)
	return `${minutes}:${seconds}`
}

export const getNameVariations = (name: string | null) => {
	if (!name) {
		return ""
	}
	return [toRomaji(name), toKana(name)]
}
