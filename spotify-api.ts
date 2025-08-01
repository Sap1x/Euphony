// This is a simulated Spotify API service
// In a real application, this would make actual API calls to Spotify

import type { Song } from "@/types/music"

// Simulated Spotify access token
let accessToken: string | null = null
let refreshToken: string | null = null
let expiresAt = 0

// Simulated user data
let userData: {
  id: string
  email: string
  name: string
  profileImage: string
} | null = null

// Audio player
let audioElement: HTMLAudioElement | null = null
let audioContext: AudioContext | null = null
let audioSource: MediaElementAudioSourceNode | null = null
let audioGain: GainNode | null = null
let audioAnalyser: AnalyserNode | null = null
let playbackTimer: NodeJS.Timeout | null = null

// Check if token is expired
const isTokenExpired = (): boolean => {
  return !accessToken || Date.now() > expiresAt
}

// Simulate refreshing the token
const refreshAccessToken = async (): Promise<boolean> => {
  if (!refreshToken) return false

  // In a real app, this would call the Spotify API
  accessToken = "simulated_access_token_" + Math.random().toString(36).substring(2)
  expiresAt = Date.now() + 3600 * 1000 // 1 hour
  return true
}

// Get the access token, refreshing if needed
export const getAccessToken = async (): Promise<string | null> => {
  if (isTokenExpired() && refreshToken) {
    await refreshAccessToken()
  }
  return accessToken
}

// Simulate login with Spotify
export const loginWithSpotify = (): void => {
  // In a real app, this would redirect to Spotify's authorization page
  console.log("Redirecting to Spotify login...")

  // For demo purposes, we'll simulate a successful login after a delay
  setTimeout(() => {
    // Simulate receiving tokens from Spotify
    accessToken = "simulated_access_token_" + Math.random().toString(36).substring(2)
    refreshToken = "simulated_refresh_token_" + Math.random().toString(36).substring(2)
    expiresAt = Date.now() + 3600 * 1000 // 1 hour

    // Simulate user data
    userData = {
      id: "spotify_user_123",
      email: "user@example.com",
      name: "Music Lover",
      profileImage: "https://i.scdn.co/image/ab6775700000ee85c5d00be2745ae9990af93d64",
    }

    // In a real app, we would store these tokens securely
    localStorage.setItem(
      "spotify_auth_simulation",
      JSON.stringify({
        accessToken,
        refreshToken,
        expiresAt,
        userData,
      }),
    )

    // Redirect back to the app
    window.location.href = "/"
  }, 1000)
}

// Simulate login with email
export const loginWithEmail = async (email: string, password: string): Promise<boolean> => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Always succeed for demo
  accessToken = "simulated_access_token_" + Math.random().toString(36).substring(2)
  refreshToken = "simulated_refresh_token_" + Math.random().toString(36).substring(2)
  expiresAt = Date.now() + 3600 * 1000 // 1 hour

  userData = {
    id: "user_" + Math.random().toString(36).substring(2),
    email,
    name: email.split("@")[0],
    profileImage: "https://i.scdn.co/image/ab6775700000ee85c5d00be2745ae9990af93d64",
  }

  localStorage.setItem(
    "spotify_auth_simulation",
    JSON.stringify({
      accessToken,
      refreshToken,
      expiresAt,
      userData,
    }),
  )

  // Store user credentials in localStorage (in a real app, this would be in a secure database)
  localStorage.setItem(
    "user_credentials",
    JSON.stringify({
      email,
      password: btoa(password), // Simple encoding, not secure for production
    }),
  )

  return true
}

// Simulate signup with email
export const signupWithEmail = async (email: string, password: string): Promise<string> => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Generate a verification code
  const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()

  // In a real app, this would send an email
  console.log(`Verification code for ${email}: ${verificationCode}`)

  // Store the verification code in localStorage for demo purposes
  localStorage.setItem("verification_code", verificationCode)

  return verificationCode
}

// Verify email code
export const verifyEmailCode = async (email: string, code: string): Promise<boolean> => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Check if code matches
  const storedCode = localStorage.getItem("verification_code")
  return code === storedCode
}

// Logout
export const logout = (): void => {
  accessToken = null
  refreshToken = null
  expiresAt = 0
  userData = null

  localStorage.removeItem("spotify_auth_simulation")
}

// Get user data
export const getUserData = (): typeof userData => {
  // Try to load from localStorage if not already loaded
  if (!userData) {
    const stored = localStorage.getItem("spotify_auth_simulation")
    if (stored) {
      const parsed = JSON.parse(stored)
      accessToken = parsed.accessToken
      refreshToken = parsed.refreshToken
      expiresAt = parsed.expiresAt
      userData = parsed.userData
    }
  }

  return userData
}

// Check if user is logged in
export const isLoggedIn = (): boolean => {
  return !!getUserData()
}

// Simulate getting a track from Spotify
export const getTrack = async (trackId: string): Promise<any> => {
  // In a real app, this would call the Spotify API
  await new Promise((resolve) => setTimeout(resolve, 500))

  return {
    id: trackId,
    name: "Simulated Spotify Track",
    artists: [{ name: "Artist Name" }],
    album: {
      name: "Album Name",
      images: [{ url: "https://i.scdn.co/image/ab67616d0000b273c5d00be2745ae9990af93d64" }],
    },
    preview_url: "https://p.scdn.co/mp3-preview/sample.mp3",
  }
}

// Clean up audio resources
const cleanupAudio = () => {
  if (playbackTimer) {
    clearTimeout(playbackTimer)
    playbackTimer = null
  }

  if (audioSource) {
    audioSource.disconnect()
    audioSource = null
  }

  if (audioGain) {
    audioGain.disconnect()
    audioGain = null
  }

  if (audioAnalyser) {
    audioAnalyser.disconnect()
    audioAnalyser = null
  }

  if (audioContext && audioContext.state !== "closed") {
    audioContext.close().catch(console.error)
    audioContext = null
  }

  if (audioElement) {
    audioElement.pause()
    audioElement.src = ""
    audioElement.load()
    audioElement = null
  }
}

// Improved audio playback with reliable sources
export const playTrack = async (song: Song): Promise<boolean> => {
  try {
    // Clean up any existing audio resources
    cleanupAudio()

    // Create a new audio element
    audioElement = new Audio()

    // Add event listeners for error handling
    audioElement.addEventListener("error", (e) => {
      console.error("Audio error:", e)
      // Dispatch a custom event to notify the app of the error
      document.dispatchEvent(
        new CustomEvent("audio-error", {
          detail: { message: "Error playing track", error: e },
        }),
      )
    })

    // Use reliable audio sources that are guaranteed to work
    const reliableSources = [
      "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
      "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
      "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
      "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
      "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
      "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
      "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
      "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
    ]

    // Use a consistent audio file based on song ID to simulate the same song always playing the same audio
    const songIdNumber = Number.parseInt(song.id.replace(/\D/g, "")) || 0
    const audioIndex = songIdNumber % reliableSources.length
    audioElement.src = reliableSources[audioIndex]
    audioElement.crossOrigin = "anonymous" // Important for CORS

    // Set up audio context for volume control and analysis
    try {
      // Use a more reliable way to create AudioContext
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
      if (!AudioContextClass) {
        throw new Error("AudioContext not supported")
      }

      audioContext = new AudioContextClass()
      audioSource = audioContext.createMediaElementSource(audioElement)
      audioGain = audioContext.createGain()
      audioAnalyser = audioContext.createAnalyser()

      // Connect the audio nodes
      audioSource.connect(audioGain)
      audioGain.connect(audioAnalyser)
      audioAnalyser.connect(audioContext.destination)

      // Set initial volume
      audioGain.gain.value = 0.7 // Default volume
    } catch (contextError) {
      console.warn("Could not create audio context, falling back to basic audio:", contextError)
      // Continue without audio context - basic playback will still work
    }

    // Add event listeners
    audioElement.addEventListener("ended", () => {
      // Trigger next song logic
      const event = new CustomEvent("song-ended", { detail: song })
      document.dispatchEvent(event)
    })

    // Set up a timer to ensure the song stops after its duration
    // This is a fallback in case the 'ended' event doesn't fire
    if (song.duration) {
      playbackTimer = setTimeout(
        () => {
          if (audioElement && !audioElement.paused) {
            audioElement.pause()
            // Trigger next song logic
            const event = new CustomEvent("song-ended", { detail: song })
            document.dispatchEvent(event)
          }
        },
        (song.duration + 2) * 1000,
      ) // Add 2 seconds buffer
    }

    // Play the audio with user interaction handling
    try {
      // Try to play - this might fail due to browser autoplay policies
      await audioElement.play()
    } catch (playError) {
      console.warn("Autoplay prevented, waiting for user interaction:", playError)

      // Create a one-time click handler to play on next user interaction
      const playOnInteraction = async () => {
        try {
          if (audioElement) {
            await audioElement.play()
            // Remove the event listeners once playback starts
            document.removeEventListener("click", playOnInteraction)
            document.removeEventListener("touchstart", playOnInteraction)
            document.removeEventListener("keydown", playOnInteraction)
          }
        } catch (retryError) {
          console.error("Still couldn't play audio after user interaction:", retryError)
        }
      }

      // Add event listeners for user interaction
      document.addEventListener("click", playOnInteraction, { once: true })
      document.addEventListener("touchstart", playOnInteraction, { once: true })
      document.addEventListener("keydown", playOnInteraction, { once: true })

      // Return false to indicate playback didn't start automatically
      return false
    }

    // Save to listening history
    saveToListeningHistory(song)

    return true
  } catch (error) {
    console.error("Error playing track:", error)
    return false
  }
}

// Pause the currently playing track
export const pauseTrack = (): boolean => {
  if (audioElement) {
    audioElement.pause()
    return true
  }
  return false
}

// Resume the currently paused track
export const resumeTrack = (): boolean => {
  if (audioElement) {
    // Use a Promise to handle potential autoplay restrictions
    audioElement.play().catch((error) => {
      console.warn("Could not resume playback:", error)

      // Create a one-time click handler to resume on next user interaction
      const resumeOnInteraction = async () => {
        try {
          if (audioElement) {
            await audioElement.play()
            // Remove the event listeners once playback resumes
            document.removeEventListener("click", resumeOnInteraction)
            document.removeEventListener("touchstart", resumeOnInteraction)
            document.removeEventListener("keydown", resumeOnInteraction)
          }
        } catch (retryError) {
          console.error("Still couldn't resume audio after user interaction:", retryError)
        }
      }

      // Add event listeners for user interaction
      document.addEventListener("click", resumeOnInteraction, { once: true })
      document.addEventListener("touchstart", resumeOnInteraction, { once: true })
      document.addEventListener("keydown", resumeOnInteraction, { once: true })
    })

    return true
  }
  return false
}

// Set volume (0-1)
export const setVolume = (volume: number): boolean => {
  if (audioGain) {
    // If we have an audio context, use the gain node
    audioGain.gain.value = Math.max(0, Math.min(1, volume))
    return true
  } else if (audioElement) {
    // Fallback to basic volume control
    audioElement.volume = Math.max(0, Math.min(1, volume))
    return true
  }
  return false
}

// Seek to a specific position (in seconds)
export const seekTo = (position: number): boolean => {
  if (audioElement) {
    audioElement.currentTime = position
    return true
  }
  return false
}

// Get current playback position
export const getCurrentPosition = (): number => {
  if (audioElement) {
    return audioElement.currentTime
  }
  return 0
}

// Get track duration
export const getTrackDuration = (): number => {
  if (audioElement && !isNaN(audioElement.duration)) {
    return audioElement.duration
  }
  return 0
}

// Save to listening history
const saveToListeningHistory = (song: Song): void => {
  try {
    // Get existing history
    const historyJson = localStorage.getItem("listening_history")
    let history: Song[] = historyJson ? JSON.parse(historyJson) : []

    // Add current song to the beginning
    history = [song, ...history.filter((s) => s.id !== song.id)].slice(0, 50) // Keep last 50 songs

    // Save back to localStorage
    localStorage.setItem("listening_history", JSON.stringify(history))
  } catch (error) {
    console.error("Error saving listening history:", error)
  }
}

// Get listening history
export const getListeningHistory = (): Song[] => {
  try {
    const historyJson = localStorage.getItem("listening_history")
    return historyJson ? JSON.parse(historyJson) : []
  } catch (error) {
    console.error("Error getting listening history:", error)
    return []
  }
}

// Simulate creating a playlist
export const createSpotifyPlaylist = async (name: string, description: string): Promise<string> => {
  // In a real app, this would call the Spotify API
  await new Promise((resolve) => setTimeout(resolve, 500))

  return "spotify_playlist_" + Math.random().toString(36).substring(2)
}

// Simulate adding tracks to a playlist
export const addTracksToPlaylist = async (playlistId: string, trackIds: string[]): Promise<boolean> => {
  // In a real app, this would call the Spotify API
  await new Promise((resolve) => setTimeout(resolve, 500))

  return true
}

// Simulate removing a playlist
export const deletePlaylist = async (playlistId: string): Promise<boolean> => {
  // In a real app, this would call the Spotify API
  await new Promise((resolve) => setTimeout(resolve, 500))

  return true
}

// Enhanced recommendation engine
export const getRecommendations = (songs: Song[], listeningHistory: Song[]): Song[] => {
  if (!listeningHistory.length) return []

  // Extract features from listening history
  const favoriteArtists = new Map<string, number>()
  const favoriteGenres = new Map<string, number>()
  const favoriteLanguages = new Map<string, number>()

  listeningHistory.forEach((song, index) => {
    // More recent songs get higher weight
    const recencyWeight = 1 + (listeningHistory.length - index) / listeningHistory.length

    // Count artist occurrences with recency weight
    const artist = song.artist.split(/,|&|ft\./)[0].trim()
    favoriteArtists.set(artist, (favoriteArtists.get(artist) || 0) + recencyWeight)

    // Count genre occurrences with recency weight
    favoriteGenres.set(song.genre, (favoriteGenres.get(song.genre) || 0) + recencyWeight)

    // Count language preferences
    favoriteLanguages.set(song.language, (favoriteLanguages.get(song.language) || 0) + recencyWeight)
  })

  // Sort by frequency
  const topArtists = [...favoriteArtists.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map((a) => a[0])

  const topGenres = [...favoriteGenres.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map((g) => g[0])

  const topLanguages = [...favoriteLanguages.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map((l) => l[0])

  // Filter songs that match top artists or genres but aren't in listening history
  const recentlyPlayedIds = new Set(listeningHistory.slice(0, 20).map((s) => s.id))

  // Score each song based on how well it matches user preferences
  const scoredSongs = songs
    .filter((song) => !recentlyPlayedIds.has(song.id))
    .map((song) => {
      const artist = song.artist.split(/,|&|ft\./)[0].trim()

      let score = 0
      // Artist match is a strong signal
      if (topArtists.includes(artist)) score += 5

      // Genre match is also important
      if (topGenres.includes(song.genre)) score += 3

      // Language preference
      if (topLanguages.includes(song.language)) score += 2

      // Slight boost for newer songs
      const releaseYear = Number.parseInt(song.releaseYear) || 2000
      score += (releaseYear - 2000) / 100

      return { song, score }
    })
    .sort((a, b) => b.score - a.score)
    .map((item) => item.song)

  // Return top 20 recommendations
  return scoredSongs.slice(0, 20)
}

// Helper function to shuffle an array
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array]
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
  }
  return newArray
}

// Artist playlists - updated with more artists and their songs
export const getArtistPlaylists = (): Record<string, Song[]> => {
  return {
    "Ed Sheeran": [
      {
        id: "ed-1",
        name: "Shape of You",
        artist: "Ed Sheeran",
        album: "÷ (Divide)",
        releaseYear: "2017",
        genre: "Pop",
        language: "English",
        duration: 233,
        imageUrl: "https://i.scdn.co/image/ab67616d0000b273ba5db46f4b838ef6027e6f96",
        previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      },
      {
        id: "ed-2",
        name: "Perfect",
        artist: "Ed Sheeran",
        album: "÷ (Divide)",
        releaseYear: "2017",
        genre: "Pop",
        language: "English",
        duration: 263,
        imageUrl: "https://i.scdn.co/image/ab67616d0000b273ba5db46f4b838ef6027e6f96",
        previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
      },
      {
        id: "ed-3",
        name: "Thinking Out Loud",
        artist: "Ed Sheeran",
        album: "x (Multiply)",
        releaseYear: "2014",
        genre: "Pop",
        language: "English",
        duration: 281,
        imageUrl: "https://i.scdn.co/image/ab67616d0000b2731010ec589253eebe75f4a8fc",
        previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
      },
      {
        id: "ed-4",
        name: "Photograph",
        artist: "Ed Sheeran",
        album: "x (Multiply)",
        releaseYear: "2014",
        genre: "Pop",
        language: "English",
        duration: 258,
        imageUrl: "https://i.scdn.co/image/ab67616d0000b2731010ec589253eebe75f4a8fc",
        previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
      },
      {
        id: "ed-5",
        name: "Castle on the Hill",
        artist: "Ed Sheeran",
        album: "÷ (Divide)",
        releaseYear: "2017",
        genre: "Pop Rock",
        language: "English",
        duration: 261,
        imageUrl: "https://i.scdn.co/image/ab67616d0000b273ba5db46f4b838ef6027e6f96",
        previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
      },
      {
        id: "ed-6",
        name: "Bad Habits",
        artist: "Ed Sheeran",
        album: "= (Equals)",
        releaseYear: "2021",
        genre: "Pop",
        language: "English",
        duration: 230,
        imageUrl: "https://i.scdn.co/image/ab67616d0000b273ef24c3fdbf856340d55cfeb2",
        previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      },
      {
        id: "ed-7",
        name: "Shivers",
        artist: "Ed Sheeran",
        album: "= (Equals)",
        releaseYear: "2021",
        genre: "Pop",
        language: "English",
        duration: 207,
        imageUrl: "https://i.scdn.co/image/ab67616d0000b273ef24c3fdbf856340d55cfeb2",
        previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
      },
      {
        id: "ed-8",
        name: "The A Team",
        artist: "Ed Sheeran",
        album: "+ (Plus)",
        releaseYear: "2011",
        genre: "Folk Pop",
        language: "English",
        duration: 258,
        imageUrl: "https://i.scdn.co/image/ab67616d0000b273a6680498c9a7892c6d4f3cbf",
        previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
      },
      {
        id: "ed-9",
        name: "Galway Girl",
        artist: "Ed Sheeran",
        album: "÷ (Divide)",
        releaseYear: "2017",
        genre: "Folk Pop",
        language: "English",
        duration: 170,
        imageUrl: "https://i.scdn.co/image/ab67616d0000b273ba5db46f4b838ef6027e6f96",
        previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
      },
      {
        id: "ed-10",
        name: "I Don't Care",
        artist: "Ed Sheeran & Justin Bieber",
        album: "No.6 Collaborations Project",
        releaseYear: "2019",
        genre: "Pop",
        language: "English",
        duration: 219,
        imageUrl: "https://i.scdn.co/image/ab67616d0000b273b1c4b76e23414c9f20242268",
        previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
      },
    ],
    Rihanna: [
      {
        id: "rih-1",
        name: "Diamonds",
        artist: "Rihanna",
        album: "Unapologetic",
        releaseYear: "2012",
        genre: "Pop",
        language: "English",
        duration: 225,
        imageUrl: "https://i.scdn.co/image/ab67616d0000b273c5358139f5bc5d9a4f78f74c",
        previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      },
      {
        id: "rih-2",
        name: "Umbrella",
        artist: "Rihanna ft. Jay-Z",
        album: "Good Girl Gone Bad",
        releaseYear: "2007",
        genre: "R&B",
        language: "English",
        duration: 275,
        imageUrl: "https://i.scdn.co/image/ab67616d0000b273f9f27e373f7f4f514d74acd5",
        previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
      },
      {
        id: "rih-3",
        name: "Work",
        artist: "Rihanna ft. Drake",
        album: "Anti",
        releaseYear: "2016",
        genre: "Dancehall",
        language: "English",
        duration: 219,
        imageUrl: "https://i.scdn.co/image/ab67616d0000b273e2e352d89826aef6dbd5ff8f",
        previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
      },
      {
        id: "rih-4",
        name: "We Found Love",
        artist: "Rihanna ft. Calvin Harris",
        album: "Talk That Talk",
        releaseYear: "2011",
        genre: "Dance-Pop",
        language: "English",
        duration: 215,
        imageUrl: "https://i.scdn.co/image/ab67616d0000b273d0d1571c29cd98d9cd7f2a6d",
        previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
      },
      {
        id: "rih-5",
        name: "Stay",
        artist: "Rihanna ft. Mikky Ekko",
        album: "Unapologetic",
        releaseYear: "2012",
        genre: "Pop Ballad",
        language: "English",
        duration: 240,
        imageUrl: "https://i.scdn.co/image/ab67616d0000b273c5358139f5bc5d9a4f78f74c",
        previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
      },
      {
        id: "rih-6",
        name: "Don't Stop the Music",
        artist: "Rihanna",
        album: "Good Girl Gone Bad",
        releaseYear: "2007",
        genre: "Dance-Pop",
        language: "English",
        duration: 267,
        imageUrl: "https://i.scdn.co/image/ab67616d0000b273f9f27e373f7f4f514d74acd5",
        previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      },
      {
        id: "rih-7",
        name: "Needed Me",
        artist: "Rihanna",
        album: "Anti",
        releaseYear: "2016",
        genre: "R&B",
        language: "English",
        duration: 191,
        imageUrl: "https://i.scdn.co/image/ab67616d0000b273e2e352d89826aef6dbd5ff8f",
        previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
      },
      {
        id: "rih-8",
        name: "Love on the Brain",
        artist: "Rihanna",
        album: "Anti",
        releaseYear: "2016",
        genre: "R&B",
        language: "English",
        duration: 224,
        imageUrl: "https://i.scdn.co/image/ab67616d0000b273e2e352d89826aef6dbd5ff8f",
        previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
      },
      {
        id: "rih-9",
        name: "Only Girl (In the World)",
        artist: "Rihanna",
        album: "Loud",
        releaseYear: "2010",
        genre: "Dance-Pop",
        language: "English",
        duration: 235,
        imageUrl: "https://i.scdn.co/image/ab67616d0000b273c36dd9eb55fb0db4911f25dd",
        previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
      },
      {
        id: "rih-10",
        name: "Disturbia",
        artist: "Rihanna",
        album: "Good Girl Gone Bad: Reloaded",
        releaseYear: "2008",
        genre: "Dance-Pop",
        language: "English",
        duration: 233,
        imageUrl: "https://i.scdn.co/image/ab67616d0000b273f9f27e373f7f4f514d74acd5",
        previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
      },
    ],
    "Arijit Singh": [
      {
        id: "arijit-1",
        name: "Tum Hi Ho",
        artist: "Arijit Singh",
        album: "Aashiqui 2",
        releaseYear: "2013",
        genre: "Romantic",
        language: "Hindi",
        duration: 252,
        imageUrl: "https://i.scdn.co/image/ab67616d0000b273a9f6c04ba168640b48aa5795",
        previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      },
      {
        id: "arijit-2",
        name: "Channa Mereya",
        artist: "Arijit Singh",
        album: "Ae Dil Hai Mushkil",
        releaseYear: "2016",
        genre: "Sad",
        language: "Hindi",
        duration: 247,
        imageUrl: "https://i.scdn.co/image/ab67616d0000b273a5a0567c3280d1bf98e1a5e5",
        previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
      },
      {
        id: "arijit-3",
        name: "Raabta",
        artist: "Arijit Singh",
        album: "Agent Vinod",
        releaseYear: "2012",
        genre: "Romantic",
        language: "Hindi",
        duration: 245,
        imageUrl: "https://i.scdn.co/image/ab67616d0000b273e0e7a056cbe5b82f15c525ef",
        previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
      },
      {
        id: "arijit-4",
        name: "Agar Tum Saath Ho",
        artist: "Arijit Singh & Alka Yagnik",
        album: "Tamasha",
        releaseYear: "2015",
        genre: "Sad",
        language: "Hindi",
        duration: 260,
        imageUrl: "https://i.scdn.co/image/ab67616d0000b273c3e9a3f9b5c3f1e8c9b92efa",
        previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
      },
      {
        id: "arijit-5",
        name: "Gerua",
        artist: "Arijit Singh & Antara Mitra",
        album: "Dilwale",
        releaseYear: "2015",
        genre: "Romantic",
        language: "Hindi",
        duration: 271,
        imageUrl: "https://i.scdn.co/image/ab67616d0000b273c8d838003416a0e400dc3ebe",
        previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
      },
    ],
    "Vishal Mishra": [
      {
        id: "vishal-1",
        name: "Kaise Hua",
        artist: "Vishal Mishra",
        album: "Kabir Singh",
        releaseYear: "2019",
        genre: "Romantic",
        language: "Hindi",
        duration: 240,
        imageUrl: "https://i.scdn.co/image/ab67616d0000b273c5e0c39a3f40c225ad7db69a",
        previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      },
      {
        id: "vishal-2",
        name: "Dil Tod Ke",
        artist: "Vishal Mishra",
        album: "Broken But Beautiful 3",
        releaseYear: "2021",
        genre: "Sad",
        language: "Hindi",
        duration: 255,
        imageUrl: "https://i.scdn.co/image/ab67616d0000b273e0b83da271d6b3a6c0dc011a",
        previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
      },
      {
        id: "vishal-3",
        name: "Aaj Bhi",
        artist: "Vishal Mishra",
        album: "Aaj Bhi",
        releaseYear: "2020",
        genre: "Sad",
        language: "Hindi",
        duration: 238,
        imageUrl: "https://i.scdn.co/image/ab67616d0000b273e0b83da271d6b3a6c0dc011a",
        previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
      },
      {
        id: "vishal-4",
        name: "Pehla Pyaar",
        artist: "Vishal Mishra",
        album: "Kabir Singh",
        releaseYear: "2019",
        genre: "Romantic",
        language: "Hindi",
        duration: 245,
        imageUrl: "https://i.scdn.co/image/ab67616d0000b273c5e0c39a3f40c225ad7db69a",
        previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
      },
      {
        id: "vishal-5",
        name: "Woh Chaand Kahan Se Laogi",
        artist: "Vishal Mishra",
        album: "Woh Chaand Kahan Se Laogi",
        releaseYear: "2020",
        genre: "Romantic",
        language: "Hindi",
        duration: 262,
        imageUrl: "https://i.scdn.co/image/ab67616d0000b273e0b83da271d6b3a6c0dc011a",
        previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
      },
    ],
    "Taylor Swift": [
      {
        id: "taylor-1",
        name: "Blank Space",
        artist: "Taylor Swift",
        album: "1989",
        releaseYear: "2014",
        genre: "Pop",
        language: "English",
        duration: 231,
        imageUrl: "https://i.scdn.co/image/ab67616d0000b273c79b600289a80aaef74d155d",
        previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      },
      {
        id: "taylor-2",
        name: "Anti-Hero",
        artist: "Taylor Swift",
        album: "Midnights",
        releaseYear: "2022",
        genre: "Pop",
        language: "English",
        duration: 200,
        imageUrl: "https://i.scdn.co/image/ab67616d0000b273bb54dde68cd23e2a268ae0f5",
        previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
      },
      {
        id: "taylor-3",
        name: "Love Story",
        artist: "Taylor Swift",
        album: "Fearless",
        releaseYear: "2008",
        genre: "Country Pop",
        language: "English",
        duration: 235,
        imageUrl: "https://i.scdn.co/image/ab67616d0000b273a7613d346501b828b56a0bc3",
        previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
      },
      {
        id: "taylor-4",
        name: "Shake It Off",
        artist: "Taylor Swift",
        album: "1989",
        releaseYear: "2014",
        genre: "Pop",
        language: "English",
        duration: 219,
        imageUrl: "https://i.scdn.co/image/ab67616d0000b273c79b600289a80aaef74d155d",
        previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
      },
      {
        id: "taylor-5",
        name: "Cruel Summer",
        artist: "Taylor Swift",
        album: "Lover",
        releaseYear: "2019",
        genre: "Pop",
        language: "English",
        duration: 178,
        imageUrl: "https://i.scdn.co/image/ab67616d0000b273e787cffec20aa2a396a61647",
        previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
      },
    ],
  }
}

// Mood-based playlists with improved images and more songs
export const getMoodPlaylists = (): Record<string, Song[]> => {
  return {
    Energetic: [
      {
        id: "energetic-1",
        name: "Don't Stop Me Now",
        artist: "Queen",
        album: "Jazz",
        releaseYear: "1978",
        genre: "Energetic",
        language: "English",
        duration: 210,
        imageUrl: "https://i.scdn.co/image/ab67706f00000002b60db5d0cd3c547a9c4e7424",
        previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      },
      {
        id: "energetic-2",
        name: "Uptown Funk",
        artist: "Mark Ronson ft. Bruno Mars",
        album: "Uptown Special",
        releaseYear: "2015",
        genre: "Energetic",
        language: "English",
        duration: 270,
        imageUrl: "https://i.scdn.co/image/ab67706f00000002b60db5d0cd3c547a9c4e7424",
        previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
      },
      {
        id: "energetic-3",
        name: "Can't Hold Us",
        artist: "Macklemore & Ryan Lewis",
        album: "The Heist",
        releaseYear: "2012",
        genre: "Energetic",
        language: "English",
        duration: 258,
        imageUrl: "https://i.scdn.co/image/ab67706f00000002b60db5d0cd3c547a9c4e7424",
        previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
      },
      {
        id: "energetic-4",
        name: "Malhari",
        artist: "Vishal Dadlani",
        album: "Bajirao Mastani",
        releaseYear: "2015",
        genre: "Energetic",
        language: "Hindi",
        duration: 240,
        imageUrl: "https://i.scdn.co/image/ab67706f00000002b60db5d0cd3c547a9c4e7424",
        previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
      },
      {
        id: "energetic-5",
        name: "Dhinka Chika",
        artist: "Mika Singh",
        album: "Ready",
        releaseYear: "2011",
        genre: "Energetic",
        language: "Hindi",
        duration: 235,
        imageUrl: "https://i.scdn.co/image/ab67706f00000002b60db5d0cd3c547a9c4e7424",
        previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
      },
    ],
    Party: [
      {
        id: "party-1",
        name: "I Gotta Feeling",
        artist: "Black Eyed Peas",
        album: "The E.N.D.",
        releaseYear: "2009",
        genre: "Party",
        language: "English",
        duration: 289,
        imageUrl: "https://i.scdn.co/image/ab67706f00000002b60e53e3a7cdc8e233abc2c6",
        previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      },
      {
        id: "party-2",
        name: "Dynamite",
        artist: "Taio Cruz",
        album: "Rokstarr",
        releaseYear: "2010",
        genre: "Party",
        language: "English",
        duration: 203,
        imageUrl: "https://i.scdn.co/image/ab67706f00000002b60e53e3a7cdc8e233abc2c6",
        previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
      },
      {
        id: "party-3",
        name: "We Found Love",
        artist: "Rihanna ft. Calvin Harris",
        album: "Talk That Talk",
        releaseYear: "2011",
        genre: "Party",
        language: "English",
        duration: 215,
        imageUrl: "https://i.scdn.co/image/ab67706f00000002b60e53e3a7cdc8e233abc2c6",
        previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
      },
      {
        id: "party-4",
        name: "Naach Meri Rani",
        artist: "Guru Randhawa ft. Nora Fatehi",
        album: "Party Hits 2023",
        releaseYear: "2020",
        genre: "Party",
        language: "Hindi",
        duration: 210,
        imageUrl: "https://i.scdn.co/image/ab67706f00000002b60e53e3a7cdc8e233abc2c6",
        previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
      },
      {
        id: "party-5",
        name: "Garmi",
        artist: "Badshah ft. Neha Kakkar",
        album: "Street Dancer 3D",
        releaseYear: "2020",
        genre: "Party",
        language: "Hindi",
        duration: 225,
        imageUrl: "https://i.scdn.co/image/ab67706f00000002b60e53e3a7cdc8e233abc2c6",
        previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
      },
    ],
    Romantic: [
      {
        id: "romantic-1",
        name: "Perfect",
        artist: "Ed Sheeran",
        album: "÷",
        releaseYear: "2017",
        genre: "Romantic",
        language: "English",
        duration: 263,
        imageUrl: "https://i.scdn.co/image/ab67706f00000002ec9d60059aa215a7ba364695",
        previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      },
      {
        id: "romantic-2",
        name: "All of Me",
        artist: "John Legend",
        album: "Love in the Future",
        releaseYear: "2013",
        genre: "Romantic",
        language: "English",
        duration: 270,
        imageUrl: "https://i.scdn.co/image/ab67706f00000002ec9d60059aa215a7ba364695",
        previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
      },
      {
        id: "romantic-3",
        name: "Tum Hi Ho",
        artist: "Arijit Singh",
        album: "Aashiqui 2",
        releaseYear: "2013",
        genre: "Romantic",
        language: "Hindi",
        duration: 252,
        imageUrl: "https://i.scdn.co/image/ab67706f00000002ec9d60059aa215a7ba364695",
        previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
      },
      {
        id: "romantic-4",
        name: "Raabta",
        artist: "Arijit Singh",
        album: "Agent Vinod",
        releaseYear: "2012",
        genre: "Romantic",
        language: "Hindi",
        duration: 245,
        imageUrl: "https://i.scdn.co/image/ab67706f00000002ec9d60059aa215a7ba364695",
        previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
      },
      {
        id: "romantic-5",
        name: "Kaise Hua",
        artist: "Vishal Mishra",
        album: "Kabir Singh",
        releaseYear: "2019",
        genre: "Romantic",
        language: "Hindi",
        duration: 240,
        imageUrl: "https://i.scdn.co/image/ab67706f00000002ec9d60059aa215a7ba364695",
        previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
      },
    ],
    Sad: [
      {
        id: "sad-1",
        name: "Someone Like You",
        artist: "Adele",
        album: "21",
        releaseYear: "2011",
        genre: "Sad",
        language: "English",
        duration: 285,
        imageUrl: "https://i.scdn.co/image/ab67706f00000002f5e3bf0413ec122f118e5f08",
        previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      },
      {
        id: "sad-2",
        name: "Fix You",
        artist: "Coldplay",
        album: "X&Y",
        releaseYear: "2005",
        genre: "Sad",
        language: "English",
        duration: 294,
        imageUrl: "https://i.scdn.co/image/ab67706f00000002f5e3bf0413ec122f118e5f08",
        previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
      },
      {
        id: "sad-3",
        name: "Channa Mereya",
        artist: "Arijit Singh",
        album: "Ae Dil Hai Mushkil",
        releaseYear: "2016",
        genre: "Sad",
        language: "Hindi",
        duration: 247,
        imageUrl: "https://i.scdn.co/image/ab67706f00000002f5e3bf0413ec122f118e5f08",
        previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
      },
      {
        id: "sad-4",
        name: "Agar Tum Saath Ho",
        artist: "Arijit Singh & Alka Yagnik",
        album: "Tamasha",
        releaseYear: "2015",
        genre: "Sad",
        language: "Hindi",
        duration: 260,
        imageUrl: "https://i.scdn.co/image/ab67706f00000002f5e3bf0413ec122f118e5f08",
        previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
      },
      {
        id: "sad-5",
        name: "Dil Tod Ke",
        artist: "Vishal Mishra",
        album: "Broken But Beautiful 3",
        releaseYear: "2021",
        genre: "Sad",
        language: "Hindi",
        duration: 255,
        imageUrl: "https://i.scdn.co/image/ab67706f00000002f5e3bf0413ec122f118e5f08",
        previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
      },
    ],
  }
}

