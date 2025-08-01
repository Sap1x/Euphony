"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { useMusic } from "@/context/music-context"
import SongList from "@/components/song-list"
import type { Song } from "@/types/music"
import { getMoodImage } from "@/lib/data-service"

interface MoodViewProps {
  mood: string
}

export default function MoodView({ mood }: MoodViewProps) {
  const { getMoodSongs, playSong } = useMusic()
  const [moodSongs, setMoodSongs] = useState<Song[]>([])

  const moodName = mood.toUpperCase()

  useEffect(() => {
    setMoodSongs(getMoodSongs(mood))
  }, [mood, getMoodSongs])

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-6">
        <div className="relative w-40 h-40 rounded overflow-hidden">
          <Image src={getMoodImage(moodName) || "/placeholder.svg"} alt={moodName} fill className="object-cover" />
        </div>
        <div>
          <h2 className="text-3xl font-bold">{moodName}</h2>
          <p className="text-gray-400">
            {moodSongs.length} {moodSongs.length === 1 ? "song" : "songs"}
          </p>
        </div>
      </div>

      {moodSongs.length > 0 ? (
        <SongList songs={moodSongs} onPlay={playSong} />
      ) : (
        <p className="text-gray-400 mt-4">No songs found for this mood</p>
      )}
    </div>
  )
}

