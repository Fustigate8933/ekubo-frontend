interface Song {
  id: string
  title: string
  artist: string
  src: string
}

type SongStore = {
	[key: string]: Song
}

export const useSongStore = () => useState<SongStore>("songStore", () => ({
	"song1": {
		id: "song1",
		src: "/insomnia.jpg",
		title: "Insomnia",
		artist: "Eve",
	},
	"song2": {
		id: "song2",
		src: "/kiminitodoke.jpg",
		title: "君に届け",
		artist: "谷澤智文",
	},
	"song3": {
		id: "song3",
		src: "/sukidakara.jpg",
		title: "好きだから。",
		artist: "スイカ",
	},
}))
