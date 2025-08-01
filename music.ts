export interface Song {
  id: string
  name: string
  artist: string
  album: string
  releaseYear: string
  genre: string
  language: string
  duration: number
  previewUrl?: string
  imageUrl?: string
}

export interface Playlist {
  id: string
  name: string
  songs: Song[]
}

export interface MoodCategory {
  id: string
  name: string
  image: string
  songs: Song[]
}

export interface ArtistRecommendation {
  id: string
  name: string
  description: string
  image: string
  songs: Song[]
}

