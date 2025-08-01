"use client"

import { useState } from "react"
import { Heart, Home, Library, Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useMusic } from "@/context/music-context"
import CreatePlaylistDialog from "@/components/create-playlist-dialog"

export default function Sidebar() {
  const { currentView, setCurrentView, playlists } = useMusic()
  const [isCreatePlaylistOpen, setIsCreatePlaylistOpen] = useState(false)

  return (
    <>
      <div className="w-60 bg-[#0a1929] border-r border-[#1e3a5f] p-5 flex flex-col overflow-y-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white font-bebas-neue">EUPHONY</h1>
        </div>

        <nav className="space-y-6 flex-1">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start text-lg font-normal",
              currentView === "home" ? "text-white" : "text-gray-400",
            )}
            onClick={() => setCurrentView("home")}
          >
            <Home className="mr-3 h-5 w-5" />
            Home
          </Button>

          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start text-lg font-normal",
              currentView === "search" ? "text-white" : "text-gray-400",
            )}
            onClick={() => setCurrentView("search")}
          >
            <Search className="mr-3 h-5 w-5" />
            Search
          </Button>

          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start text-lg font-normal",
              currentView === "library" ? "text-white" : "text-gray-400",
            )}
            onClick={() => setCurrentView("library")}
          >
            <Library className="mr-3 h-5 w-5" />
            Your Library
          </Button>

          <div className="pt-6">
            <Button
              variant="ghost"
              className="w-full justify-start text-lg font-normal text-gray-400"
              onClick={() => setIsCreatePlaylistOpen(true)}
            >
              <Plus className="mr-3 h-5 w-5" />
              Create Playlist
            </Button>

            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start text-lg font-normal",
                currentView === "liked" ? "text-white" : "text-gray-400",
              )}
              onClick={() => setCurrentView("liked")}
            >
              <Heart className="mr-3 h-5 w-5" />
              Liked Songs
            </Button>
          </div>
        </nav>

        {playlists.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-semibold text-gray-400 mb-2">YOUR PLAYLISTS</h3>
            <div className="space-y-1">
              {playlists.map((playlist) => (
                <Button
                  key={playlist.id}
                  variant="ghost"
                  className="w-full justify-start text-sm font-normal text-gray-400 hover:text-white"
                  onClick={() => setCurrentView(`playlist-${playlist.id}`)}
                >
                  {playlist.name}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>

      <CreatePlaylistDialog open={isCreatePlaylistOpen} onOpenChange={setIsCreatePlaylistOpen} />
    </>
  )
}

