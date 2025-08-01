"use client"

import { createContext, useContext, useState, useEffect, useRef, type ReactNode } from "react"
import type { Song, Playlist, MoodCategory } from "@/types/music"
import { generateMoodCategories, generateTrendingSongs } from "@/lib/recommendation-engine"
import {
  playTrack,
  pauseTrack,
  resumeTrack,
  setVolume as setAudioVolume,
  seekTo as seekToPosition,
  getListeningHistory,
  getRecommendations,
  getArtistPlaylists,
} from "@/lib/spotify-api"

interface MusicContextType {
  songs: Song[]
  currentSong: Song | null
  isPlaying: boolean
  volume: number
  progress: number
  duration: number
  likedSongs: Song[]
  playlists: Playlist[]
  userLibrary: Song[]
  moodCategories: MoodCategory[]
  artistRecommendations: any[]
  trendingSongs: Song[]
  searchResults: Song[]
  searchSuggestions: Song[]
  currentView: string
  isShuffleOn: boolean
  isRepeatOn: boolean
  isMaximized: boolean
  recentlyPlayed: Song[]
  personalizedRecommendations: Song[]
  setCurrentView: (view: string) => void
  playSong: (song: Song) => void
  pauseSong: () => void
  resumeSong: () => void
  nextSong: () => void
  previousSong: () => void
  setVolume: (volume: number) => void
  seekTo: (progress: number) => void
  toggleLike: (song: Song) => void
  createPlaylist: (name: string) => void
  addToPlaylist: (playlistId: string, song: Song) => void
  removeFromPlaylist: (playlistId: string, songId: string) => void
  removePlaylist: (playlistId: string) => void
  addToLibrary: (song: Song) => void
  removeFromLibrary: (songId: string) => void
  search: (query: string) => void
  getArtistSongs: (artistName: string) => Song[]
  getMoodSongs: (mood: string) => Song[]
  toggleShuffle: () => void
  toggleRepeat: () => void
  toggleMaximize: () => void
  getRecommendedSongs: (basedOn: Song | string) => Song[]
  refreshRecommendations: () => void
}

const MusicContext = createContext<MusicContextType | undefined>(undefined)

export function MusicProvider({ children, initialSongs }: { children: ReactNode; initialSongs: Song[] }) {
  const [songs, setSongs] = useState<Song[]>(initialSongs)
  const [currentSong, setCurrentSong] = useState<Song | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.7)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [likedSongs, setLikedSongs] = useState<Song[]>([])
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [userLibrary, setUserLibrary] = useState<Song[]>([])
  const [moodCategories, setMoodCategories] = useState<MoodCategory[]>([])
  const [artistRecommendations, setArtistRecommendations] = useState<any[]>([])
  const [trendingSongs, setTrendingSongs] = useState<Song[]>([])
  const [searchResults, setSearchResults] = useState<Song[]>([])
  const [searchSuggestions, setSearchSuggestions] = useState<Song[]>([])
  const [currentView, setCurrentView] = useState("home")
  const [isShuffleOn, setIsShuffleOn] = useState(false)
  const [isRepeatOn, setIsRepeatOn] = useState(false)
  const [isMaximized, setIsMaximized] = useState(false)
  const [recentlyPlayed, setRecentlyPlayed] = useState<Song[]>([])
  const [personalizedRecommendations, setPersonalizedRecommendations] = useState<Song[]>([])

  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Dummy function for getArtistImage
  const getArtistImage = (artist: string) => {
    // Replace with actual logic to fetch artist image
    return `https://source.unsplash.com/100x100/?${artist}`
  }

  // Initialize recommendations and load from localStorage
  useEffect(() => {
    // Initialize recommendations
    if (songs.length > 0) {
      setMoodCategories(generateMoodCategories(songs))

      // Get artist playlists for Ed Sheeran and Rihanna
      const artistPlaylists = getArtistPlaylists()
      const artistRecs = []

      // Convert artist playlists to artist recommendations format
      for (const [artist, songs] of Object.entries(artistPlaylists)) {
        artistRecs.push({
          id: artist.toLowerCase().replace(/\s+/g, "-"),
          name: artist,
          description:
            artist === "Ed Sheeran"
              ? "English singer-songwriter"
              : artist === "Rihanna"
                ? "Barbadian singer"
                : artist === "Arijit Singh"
                  ? "Indian singer"
                  : artist === "Vishal Mishra"
                    ? "Indian singer-songwriter"
                    : "Artist",
          image: getArtistImage(artist),
          songs: songs,
        })
      }

      setArtistRecommendations(artistRecs)
      setTrendingSongs(generateTrendingSongs(songs))

      // Get listening history
      const listeningHistory = getListeningHistory()
      if (listeningHistory.length > 0) {
        const recommendations = getRecommendations(songs, listeningHistory)
        setPersonalizedRecommendations(recommendations)
      }
    }

    // Load from localStorage
    const loadFromStorage = () => {
      try {
        const storedLikedSongs = localStorage.getItem("likedSongs")
        const storedPlaylists = localStorage.getItem("playlists")
        const storedUserLibrary = localStorage.getItem("userLibrary")
        const storedRecentlyPlayed = localStorage.getItem("recentlyPlayed")

        if (storedLikedSongs) setLikedSongs(JSON.parse(storedLikedSongs))
        if (storedPlaylists) setPlaylists(JSON.parse(storedPlaylists))
        if (storedUserLibrary) setUserLibrary(JSON.parse(storedUserLibrary))
        if (storedRecentlyPlayed) setRecentlyPlayed(JSON.parse(storedRecentlyPlayed))
      } catch (error) {
        console.error("Error loading from localStorage:", error)
      }
    }

    loadFromStorage()

    // Listen for song-ended event
    const handleSongEnded = () => {
      nextSong()
    }

    document.addEventListener("song-ended", handleSongEnded)

    // Cleanup
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      document.removeEventListener("song-ended", handleSongEnded)
    }
  }, [songs])

  // Save to localStorage when state changes
  useEffect(() => {
    try {
      localStorage.setItem("likedSongs", JSON.stringify(likedSongs))
      localStorage.setItem("playlists", JSON.stringify(playlists))
      localStorage.setItem("userLibrary", JSON.stringify(userLibrary))
      localStorage.setItem("recentlyPlayed", JSON.stringify(recentlyPlayed))
    } catch (error) {
      console.error("Error saving to localStorage:", error)
    }
  }, [likedSongs, playlists, userLibrary, recentlyPlayed])

  // Update progress while playing
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setProgress((prevProgress) => {
          const newProgress = prevProgress + 1

          // If we reach the end of the song
          if (newProgress >= duration) {
            if (isRepeatOn) {
              // If repeat is on, restart the same song
              return 0
            } else {
              // Otherwise, play the next song
              clearInterval(intervalRef.current!)
              nextSong()
              return 0
            }
          }

          return newProgress
        })
      }, 1000)
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isPlaying, duration, isRepeatOn])

  // Refresh recommendations based on listening history
  const refreshRecommendations = () => {
    const listeningHistory = getListeningHistory()
    if (listeningHistory.length > 0) {
      const recommendations = getRecommendations(songs, listeningHistory)
      setPersonalizedRecommendations(recommendations)
    }
  }

  // Simulate audio playback using the Spotify API service
  const playSong = async (song: Song) => {
    if (!song) return

    // Stop current simulated playback
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    // Set the current song
    setCurrentSong(song)

    // Set a fixed duration for the song (in seconds)
    const songDuration = song.duration || 180 // Default to 3 minutes if no duration
    setDuration(songDuration)

    // Reset progress
    setProgress(0)

    // Play the song using the Spotify API service
    const success = await playTrack(song)

    if (success) {
      // Start simulated playback
      setIsPlaying(true)

      // Simulate progress updates
      intervalRef.current = setInterval(() => {
        setProgress((prevProgress) => {
          const newProgress = prevProgress + 1

          // If we reach the end of the song
          if (newProgress >= songDuration) {
            if (isRepeatOn) {
              // If repeat is on, restart the same song
              return 0
            } else {
              // Otherwise, play the next song
              clearInterval(intervalRef.current!)
              nextSong()
              return 0
            }
          }

          return newProgress
        })
      }, 1000)
    }

    // Add to recently played
    if (!recentlyPlayed.some((s) => s.id === song.id)) {
      const updatedRecent = [song, ...recentlyPlayed].slice(0, 20)
      setRecentlyPlayed(updatedRecent)
    } else {
      // Move to top if already in recently played
      setRecentlyPlayed([song, ...recentlyPlayed.filter((s) => s.id !== song.id)])
    }

    // Refresh recommendations after playing a song
    refreshRecommendations()
  }

  const pauseSong = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    pauseTrack()
    setIsPlaying(false)
  }

  const resumeSong = () => {
    if (!isPlaying && currentSong) {
      resumeTrack()
      setIsPlaying(true)

      // Restart the progress simulation
      intervalRef.current = setInterval(() => {
        setProgress((prevProgress) => {
          const newProgress = prevProgress + 1

          // If we reach the end of the song
          if (newProgress >= duration) {
            if (isRepeatOn) {
              // If repeat is on, restart the same song
              return 0
            } else {
              // Otherwise, play the next song
              clearInterval(intervalRef.current!)
              nextSong()
              return 0
            }
          }

          return newProgress
        })
      }, 1000)
    }
  }

  const getNextSong = (): Song | null => {
    if (!currentSong || songs.length === 0) return null

    // If shuffle is on, get a random song that hasn't been played recently
    if (isShuffleOn) {
      const recentIds = new Set(recentlyPlayed.slice(0, 10).map((s) => s.id))
      const availableSongs = songs.filter((s) => !recentIds.has(s.id) && s.id !== currentSong.id)

      if (availableSongs.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableSongs.length)
        return availableSongs[randomIndex]
      } else {
        // If all songs have been played recently, just pick a random one
        const randomIndex = Math.floor(Math.random() * songs.length)
        return songs[randomIndex]
      }
    } else {
      // Normal sequential playback
      const currentIndex = songs.findIndex((song) => song.id === currentSong.id)
      const nextIndex = (currentIndex + 1) % songs.length
      return songs[nextIndex]
    }
  }

  const nextSong = () => {
    const next = getNextSong()
    if (next) {
      playSong(next)
    }
  }

  const previousSong = () => {
    if (currentSong && songs.length > 0) {
      // If we're more than 3 seconds into the song, restart it instead of going to previous
      if (progress > 3) {
        setProgress(0)
        seekToPosition(0)
        return
      }

      // If shuffle is on, go to the last played song
      if (isShuffleOn && recentlyPlayed.length > 1) {
        playSong(recentlyPlayed[1]) // Index 0 is current song
      } else {
        // Normal sequential playback
        const currentIndex = songs.findIndex((song) => song.id === currentSong.id)
        const prevIndex = (currentIndex - 1 + songs.length) % songs.length
        playSong(songs[prevIndex])
      }
    } else if (songs.length > 0) {
      playSong(songs[0])
    }
  }

  const setVolumeLevel = (newVolume: number) => {
    setVolume(newVolume)
    setAudioVolume(newVolume)
  }

  const seekTo = (newProgress: number) => {
    setProgress(newProgress)
    seekToPosition(newProgress)
  }

  const toggleLike = (song: Song) => {
    const isLiked = likedSongs.some((s) => s.id === song.id)

    if (isLiked) {
      setLikedSongs(likedSongs.filter((s) => s.id !== song.id))
    } else {
      setLikedSongs([...likedSongs, song])
    }
  }

  const createPlaylist = (name: string) => {
    const newPlaylist: Playlist = {
      id: `playlist-${Date.now()}`,
      name,
      songs: [],
    }

    setPlaylists([...playlists, newPlaylist])
  }

  const addToPlaylist = (playlistId: string, song: Song) => {
    setPlaylists(
      playlists.map((playlist) => {
        if (playlist.id === playlistId) {
          // Check if song already exists in playlist
          if (!playlist.songs.some((s) => s.id === song.id)) {
            return { ...playlist, songs: [...playlist.songs, song] }
          }
        }
        return playlist
      }),
    )
  }

  const removeFromPlaylist = (playlistId: string, songId: string) => {
    setPlaylists(
      playlists.map((playlist) => {
        if (playlist.id === playlistId) {
          return { ...playlist, songs: playlist.songs.filter((s) => s.id !== songId) }
        }
        return playlist
      }),
    )
  }

  // New function to completely remove a playlist
  const removePlaylist = (playlistId: string) => {
    setPlaylists(playlists.filter((playlist) => playlist.id !== playlistId))
  }

  const addToLibrary = (song: Song) => {
    if (!userLibrary.some((s) => s.id === song.id)) {
      setUserLibrary([...userLibrary, song])
    }
  }

  const removeFromLibrary = (songId: string) => {
    setUserLibrary(userLibrary.filter((s) => s.id !== songId))
  }

  const search = (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      setSearchSuggestions([])
      return
    }

    // For full search results
    const results = songs.filter(
      (song) =>
        song.name.toLowerCase().includes(query.toLowerCase()) ||
        song.artist.toLowerCase().includes(query.toLowerCase()) ||
        song.album.toLowerCase().includes(query.toLowerCase()) ||
        song.genre.toLowerCase().includes(query.toLowerCase()),
    )

    setSearchResults(results)

    // For search suggestions (as you type)
    const suggestions = songs
      .filter(
        (song) =>
          song.name.toLowerCase().startsWith(query.toLowerCase()) ||
          song.artist.toLowerCase().startsWith(query.toLowerCase()),
      )
      .slice(0, 5)

    setSearchSuggestions(suggestions)
  }

  const getArtistSongs = (artistName: string) => {
    return songs.filter((song) => song.artist.toLowerCase().includes(artistName.toLowerCase()))
  }

  const getMoodSongs = (mood: string) => {
    return songs.filter((song) => song.genre.toLowerCase().includes(mood.toLowerCase()))
  }

  const toggleShuffle = () => {
    setIsShuffleOn(!isShuffleOn)
  }

  const toggleRepeat = () => {
    setIsRepeatOn(!isRepeatOn)
  }

  const toggleMaximize = () => {
    setIsMaximized(!isMaximized)
  }

  const getRecommendedSongs = (basedOn: Song | string) => {
    if (typeof basedOn === "string") {
      // If based on mood
      return getMoodSongs(basedOn)
    } else {
      // If based on a song
      const similarSongs = songs.filter(
        (song) => song.id !== basedOn.id && (song.genre === basedOn.genre || song.artist === basedOn.artist),
      )

      // Shuffle and return top 10
      return similarSongs.sort(() => 0.5 - Math.random()).slice(0, 10)
    }
  }

  return (
    <MusicContext.Provider
      value={{
        songs,
        currentSong,
        isPlaying,
        volume,
        progress,
        duration,
        likedSongs,
        playlists,
        userLibrary,
        moodCategories,
        artistRecommendations,
        trendingSongs,
        searchResults,
        searchSuggestions,
        currentView,
        isShuffleOn,
        isRepeatOn,
        isMaximized,
        recentlyPlayed,
        personalizedRecommendations,
        setCurrentView,
        playSong,
        pauseSong,
        resumeSong,
        nextSong,
        previousSong,
        setVolume: setVolumeLevel,
        seekTo,
        toggleLike,
        createPlaylist,
        addToPlaylist,
        removeFromPlaylist,
        removePlaylist,
        addToLibrary,
        removeFromLibrary,
        search,
        getArtistSongs,
        getMoodSongs,
        toggleShuffle,
        toggleRepeat,
        toggleMaximize,
        getRecommendedSongs,
        refreshRecommendations,
      }}
    >
      {children}
    </MusicContext.Provider>
  )
}

export function useMusic() {
  const context = useContext(MusicContext)
  if (context === undefined) {
    throw new Error("useMusic must be used within a MusicProvider")
  }
  return context
}

