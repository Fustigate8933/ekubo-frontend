import { ref, computed } from 'vue'

export interface SpotifyTrack {
  id: string
  name: string
  artists: Array<{ name: string }>
  album: {
    name: string
    images: Array<{ url: string }>
  }
  duration_ms: number
  preview_url: string | null
}

export const useMusicPlayer = () => {
  const toast = useToast()
  // State
  const isPlaying = ref(false)
  const currentTrack = ref<SpotifyTrack | null>(null)
  const currentTime = ref(0)
  const duration = ref(0)
  const volume = ref(50)
  const isReady = ref(false)
  const deviceId = ref<string | null>(null)
  const player = ref<any>(null)

  // Computed
  const progress = computed(() => {
    if (duration.value === 0) return 0
    return (currentTime.value / duration.value) * 100
  })

  const formattedTime = computed(() => {
    const formatTime = (seconds: number) => {
      const mins = Math.floor(seconds / 60)
      const secs = Math.floor(seconds % 60)
      return `${mins}:${secs.toString().padStart(2, '0')}`
    }
    return {
      current: formatTime(currentTime.value),
      total: formatTime(duration.value)
    }
  })

  // Methods
  const initializePlayer = async () => {
    try {
      // Check if Spotify Web Playback SDK is available
      if (!window.Spotify) {
        console.error('Spotify Web Playback SDK not loaded')
        toast.add({
          title: 'Spotify unavailable',
          description: 'Spotify Web Playback SDK is not loaded in this browser.',
          color: 'error',
        })
        return false
      }

      // Get access token (you'll need to implement this based on your auth system)
      const token = await getAccessToken()
      if (!token) {
        console.error('No access token available')
        toast.add({
          title: 'Spotify authentication',
          description: 'No Spotify access token available. Please connect your Spotify account.',
          color: 'warning',
        })
        return false
      }

      // Create Spotify player
      player.value = new window.Spotify.Player({
        name: 'Ekubo Music Player',
        getOAuthToken: (cb: (token: string) => void) => {
          cb(token)
        },
        volume: volume.value / 100
      })

      // Error handling
      player.value.addListener('initialization_error', ({ message }: { message: string }) => {
        console.error('Failed to initialize:', message)
        toast.add({ title: 'Spotify player error', description: String(message), color: 'error' })
      })

      player.value.addListener('authentication_error', ({ message }: { message: string }) => {
        console.error('Failed to authenticate:', message)
        toast.add({ title: 'Spotify authentication failed', description: String(message), color: 'error' })
      })

      player.value.addListener('account_error', ({ message }: { message: string }) => {
        console.error('Failed to validate Spotify account:', message)
        toast.add({ title: 'Spotify account error', description: String(message), color: 'error' })
      })

      player.value.addListener('playback_error', ({ message }: { message: string }) => {
        console.error('Failed to perform playback:', message)
        toast.add({ title: 'Playback error', description: String(message), color: 'error' })
      })

      // Playback status updates
      player.value.addListener('player_state_changed', (state: any) => {
        if (!state) return

        isPlaying.value = !state.paused
        currentTime.value = state.position / 1000
        duration.value = state.duration / 1000
      })

      // Ready
      player.value.addListener('ready', ({ device_id }: { device_id: string }) => {
        console.log('Ready with Device ID', device_id)
        deviceId.value = device_id
        isReady.value = true
      })

      // Not Ready
      player.value.addListener('not_ready', ({ device_id }: { device_id: string }) => {
        console.log('Device ID has gone offline', device_id)
        isReady.value = false
      })

      // Connect to the player
      const success = await player.value.connect()
      if (success) {
        console.log('Successfully connected to Spotify!')
        return true
      } else {
        console.error('Failed to connect to Spotify')
        toast.add({ title: 'Spotify connection failed', description: 'Failed to connect to Spotify player.', color: 'error' })
        return false
      }
    } catch (error) {
        console.error('Error initializing Spotify player:', error)
        toast.add({ title: 'Spotify initialization error', description: String((error as any)?.message ?? error), color: 'error' })
      return false
    }
  }

  const getAccessToken = async (): Promise<string | null> => {
    // TODO: Implement proper token retrieval from your auth system
    // This should get a valid Spotify access token
    try {
      // For now, return null - you'll need to implement this
      // based on your authentication system
      return null
    } catch (error) {
      console.error('Error getting access token:', error)
      toast.add({ title: 'Spotify token error', description: String((error as any)?.message ?? error), color: 'error' })
      return null
    }
  }

  const playTrack = async (track: SpotifyTrack) => {
    if (!player.value || !isReady.value) {
      console.error('Player not ready')
      toast.add({ title: 'Player not ready', description: 'Spotify player is not ready yet.', color: 'warning' })
      return false
    }

    try {
      currentTrack.value = track
      
      // Transfer playback to our device
      await fetch(`https://api.spotify.com/v1/me/player`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${await getAccessToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          device_ids: [deviceId.value]
        })
      })

      // Start playback
      await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId.value}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${await getAccessToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          uris: [`spotify:track:${track.id}`]
        })
      })

      isPlaying.value = true
      return true
    } catch (error) {
      console.error('Error playing track:', error)
      toast.add({ title: 'Playback failed', description: String((error as any)?.message ?? error), color: 'error' })
      return false
    }
  }

  const pause = () => {
    if (player.value && isReady.value) {
      player.value.pause()
    }
  }

  const resume = () => {
    if (player.value && isReady.value) {
      player.value.resume()
    }
  }

  const togglePlayPause = () => {
    if (isPlaying.value) {
      pause()
    } else {
      resume()
    }
  }

  const setVolume = (newVolume: number) => {
    volume.value = Math.max(0, Math.min(100, newVolume))
    if (player.value && isReady.value) {
      player.value.setVolume(volume.value / 100)
    }
  }

  const seekTo = (position: number) => {
    if (player.value && isReady.value) {
      player.value.seek(position * 1000) // Convert to milliseconds
    }
  }

  const disconnect = () => {
    if (player.value) {
      player.value.disconnect()
      isReady.value = false
      deviceId.value = null
    }
  }

  return {
    // State
    isPlaying,
    currentTrack,
    currentTime,
    duration,
    volume,
    isReady,
    deviceId,
    
    // Computed
    progress,
    formattedTime,
    
    // Methods
    initializePlayer,
    playTrack,
    pause,
    resume,
    togglePlayPause,
    setVolume,
    seekTo,
    disconnect
  }
}

// Extend Window interface for Spotify
declare global {
  interface Window {
    Spotify: any
  }
}

