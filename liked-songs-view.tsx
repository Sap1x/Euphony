"use client"

import { useMusic } from "@/context/music-context"
import SongList from "@/components/song-list"

export default function LikedSongsView() {
  const { likedSongs, playSong, setCurrentView } = useMusic()

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold mb-6">Liked Songs</h2>

      {likedSongs.length > 0 ? (
        <SongList songs={likedSongs} onPlay={playSong} showLikeButton />
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-400 mb-4">You haven't liked any songs yet</p>
          <button
            className="px-4 py-2 bg-white text-[#0a1929] rounded-full hover:bg-gray-200"
            onClick={() => setCurrentView("home")}
          >
            Discover Music
          </button>
        </div>
      )}
    </div>
  )
}

