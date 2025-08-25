export const secondsToMinAndSec = (totalSeconds: number) => {
	const minutes = Math.floor(totalSeconds / 60)
	const seconds = Math.floor(totalSeconds % 60)
	return `${minutes}:${seconds}`
}
