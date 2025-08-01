"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { useMusic } from "@/context/music-context"
import SongList from "@/components/song-list"
import type { Song } from "@/types/music"
import { getArtistImage } from "@/lib/data-service"

interface ArtistViewProps {
  artistName: string
}

export default function ArtistView({ artistName }: ArtistViewProps) {
  const { getArtistSongs, playSong } = useMusic()
  const [artistSongs, setArtistSongs] = useState<Song[]>([])

  useEffect(() => {
    setArtistSongs(getArtistSongs(artistName))
  }, [artistName, getArtistSongs])

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-6">
        <div className="relative w-40 h-40 rounded-full overflow-hidden">
          <Image
            src={getArtistImage(artistName) || "/placeholder.svg"}
            alt={artistName}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <h2 className="text-3xl font-bold">{artistName}</h2>
          <p className="text-gray-400">
            {artistSongs.length} {artistSongs.length === 1 ? "song" : "songs"}
          </p>
        </div>
      </div>

      <h3 className="text-xl font-bold mt-8">Popular Songs</h3>

      {artistSongs.length > 0 ? (
        <SongList songs={artistSongs} onPlay={playSong} />
      ) : (
        <p className="text-gray-400 mt-4">No songs found for this artist</p>
      )}
    </div>
  )
}

