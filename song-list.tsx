"use client"

import { useState } from "react"
import Image from "next/image"
import { Heart, MoreHorizontal, Play, Plus, Trash } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Song } from "@/types/music"
import { useMusic } from "@/context/music-context"
import { formatTime } from "@/lib/utils"

interface SongListProps {
  songs: Song[]
  onPlay: (song: Song) => void
  showLikeButton?: boolean
  showRemoveButton?: boolean
  playlistId?: string
}

export default function SongList({
  songs,
  onPlay,
  showLikeButton = false,
  showRemoveButton = false,
  playlistId,
}: SongListProps) {
  const { currentSong, likedSongs, playlists, toggleLike, addToPlaylist, removeFromPlaylist, addToLibrary } = useMusic()

  const [hoveredSongId, setHoveredSongId] = useState<string | null>(null)

  const isLiked = (songId: string) => {
    return likedSongs.some((song) => song.id === songId)
  }

  // Update the song list to ensure proper user interaction
  return (
    <div className="space-y-1">
      {songs.map((song) => (
        <div
          key={song.id}
          className={`flex items-center p-2 rounded-md ${
            currentSong?.id === song.id ? "bg-[#224869]" : "hover:bg-[#193552]"
          } transition-colors`}
          onMouseEnter={() => setHoveredSongId(song.id)}
          onMouseLeave={() => setHoveredSongId(null)}
        >
          <div className="w-10 flex-shrink-0 flex items-center justify-center">
            {hoveredSongId === song.id ? (
              <button
                className="text-white p-1 hover:scale-110 transition-transform"
                onClick={(e) => {
                  e.stopPropagation()
                  onPlay(song)
                }}
                aria-label="Play"
              >
                <Play className="h-4 w-4" />
              </button>
            ) : (
              <span className={`text-sm ${currentSong?.id === song.id ? "text-green-500" : "text-gray-400"}`}>
                {songs.indexOf(song) + 1}
              </span>
            )}
          </div>

          <div
            className="flex flex-1 items-center cursor-pointer hover:bg-[#224869] rounded-md p-1"
            onClick={() => onPlay(song)}
          >
            <div className="relative w-10 h-10 rounded overflow-hidden flex-shrink-0 mr-3">
              <Image
                src={song.imageUrl || "/placeholder.svg?height=300&width=300"}
                alt={song.name}
                fill
                className="object-cover"
              />
            </div>

            <div className="flex-1 min-w-0 mr-4">
              <div className={`font-medium truncate ${currentSong?.id === song.id ? "text-green-500" : "text-white"}`}>
                {song.name}
              </div>
              <div className="text-sm text-gray-400 truncate">{song.artist}</div>
            </div>
          </div>

          <div className="text-sm text-gray-400 mr-4 hidden md:block">{song.album}</div>

          <div className="flex items-center gap-3">
            {showLikeButton && (
              <button
                className={isLiked(song.id) ? "text-green-500" : "text-gray-400 hover:text-white"}
                onClick={(e) => {
                  e.stopPropagation()
                  toggleLike(song)
                }}
              >
                <Heart className={`h-5 w-5 ${isLiked(song.id) ? "fill-green-500" : ""}`} />
              </button>
            )}

            <div className="text-sm text-gray-400 w-12 text-right">{formatTime(song.duration)}</div>

            {showRemoveButton && playlistId ? (
              <button
                className="text-gray-400 hover:text-white"
                onClick={(e) => {
                  e.stopPropagation()
                  removeFromPlaylist(playlistId, song.id)
                }}
              >
                <Trash className="h-4 w-4" />
              </button>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="text-gray-400 hover:text-white" onClick={(e) => e.stopPropagation()}>
                    <MoreHorizontal className="h-5 w-5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-[#193552] border-[#1e3a5f] text-white">
                  <DropdownMenuItem className="cursor-pointer hover:bg-[#224869]" onClick={() => toggleLike(song)}>
                    <Heart className={`h-4 w-4 mr-2 ${isLiked(song.id) ? "fill-green-500 text-green-500" : ""}`} />
                    {isLiked(song.id) ? "Remove from Liked Songs" : "Add to Liked Songs"}
                  </DropdownMenuItem>

                  <DropdownMenuItem className="cursor-pointer hover:bg-[#224869]" onClick={() => addToLibrary(song)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add to Library
                  </DropdownMenuItem>

                  {playlists.length > 0 && (
                    <>
                      <DropdownMenuItem className="text-gray-400" disabled>
                        Add to Playlist
                      </DropdownMenuItem>

                      {playlists.map((playlist) => (
                        <DropdownMenuItem
                          key={playlist.id}
                          className="cursor-pointer hover:bg-[#224869] pl-6"
                          onClick={() => addToPlaylist(playlist.id, song)}
                        >
                          {playlist.name}
                        </DropdownMenuItem>
                      ))}
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

