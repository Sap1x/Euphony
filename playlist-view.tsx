"use client"

import { useMusic } from "@/context/music-context"
import SongList from "@/components/song-list"

interface PlaylistViewProps {
  playlistId: string
}

export default function PlaylistView({ playlistId }: PlaylistViewProps) {
  const { playlists, playSong, setCurrentView } = useMusic()

  const playlist = playlists.find((p) => p.id === playlistId)

  if (!playlist) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-400 mb-4">Playlist not found</p>
        <button
          className="px-4 py-2 bg-white text-[#0a1929] rounded-full hover:bg-gray-200"
          onClick={() => setCurrentView("library")}
        >
          Back to Library
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold mb-6">{playlist.name}</h2>

      {playlist.songs.length > 0 ? (
        <SongList songs={playlist.songs} onPlay={playSong} showRemoveButton playlistId={playlistId} />
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-400 mb-4">This playlist is empty</p>
          <button
            className="px-4 py-2 bg-white text-[#0a1929] rounded-full hover:bg-gray-200"
            onClick={() => setCurrentView("home")}
          >
            Add Songs
          </button>
        </div>
      )}
    </div>
  )
}

