import type { Song, MoodCategory, ArtistRecommendation } from "@/types/music"
import { getArtistImage, getMoodImage } from "@/lib/data-service"

// Generate mood-based categories
export function generateMoodCategories(songs: Song[]): MoodCategory[] {
  const moods = [
    { id: "romantic", name: "ROMANTIC" },
    { id: "sad", name: "SAD" },
    { id: "happy", name: "HAPPY" },
    { id: "energetic", name: "ENERGETIC" },
    { id: "party", name: "PARTY" },
    { id: "chill", name: "RELAXED" },
  ]

  return moods.map((mood) => {
    // Filter songs by mood/genre
    const moodSongs = songs
      .filter(
        (song) => song.genre.toLowerCase().includes(mood.id) || song.genre.toLowerCase() === mood.name.toLowerCase(),
      )
      .slice(0, 20) // Limit to 20 songs per mood

    return {
      id: mood.id,
      name: mood.name,
      image: getMoodImage(mood.name),
      songs: moodSongs,
    }
  })
}

// Generate artist recommendations
export function generateArtistRecommendations(songs: Song[]): ArtistRecommendation[] {
  // Count songs by artist
  const artistCounts = songs.reduce(
    (acc, song) => {
      const artist = song.artist.split(/,|&|ft\./)[0].trim()
      acc[artist] = (acc[artist] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  // Get top artists
  const topArtists = Object.entries(artistCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([artist]) => artist)

  return topArtists.map((artist) => {
    const artistSongs = songs.filter((song) => song.artist.toLowerCase().includes(artist.toLowerCase())).slice(0, 10)

    let description = "Artist"
    if (artistSongs.length > 0) {
      const language = artistSongs[0].language
      description = language === "Hindi" ? "Indian singer" : "International artist"
    }

    return {
      id: artist.toLowerCase().replace(/\s+/g, "-"),
      name: artist,
      description,
      image: getArtistImage(artist),
      songs: artistSongs,
    }
  })
}

// Generate trending songs
export function generateTrendingSongs(songs: Song[]): Song[] {
  // Sort by release year (newest first) and take top 20
  return [...songs]
    .sort((a, b) => {
      const yearA = Number.parseInt(a.releaseYear) || 0
      const yearB = Number.parseInt(b.releaseYear) || 0
      return yearB - yearA
    })
    .slice(0, 20)
}

// Get personalized recommendations based on user preferences
export function getPersonalizedRecommendations(songs: Song[], likedSongs: Song[], recentlyPlayed: Song[]): Song[] {
  if (likedSongs.length === 0 && recentlyPlayed.length === 0) {
    // If no user data, return trending songs
    return generateTrendingSongs(songs)
  }

  // Get genres and artists from liked and recently played songs
  const userGenres = new Set<string>()
  const userArtists = new Set<string>()
  ;[...likedSongs, ...recentlyPlayed].forEach((song) => {
    userGenres.add(song.genre)
    userArtists.add(song.artist.split(/,|&|ft\./)[0].trim())
  })

  // Filter songs that match user preferences
  const recommendations = songs.filter((song) => {
    const artist = song.artist.split(/,|&|ft\./)[0].trim()
    return userGenres.has(song.genre) || userArtists.has(artist)
  })

  // Remove duplicates and songs already in liked or recently played
  const existingIds = new Set([...likedSongs, ...recentlyPlayed].map((song) => song.id))
  const uniqueRecommendations = recommendations.filter((song) => !existingIds.has(song.id))

  // Shuffle and limit to 20 songs
  return shuffleArray(uniqueRecommendations).slice(0, 20)
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

