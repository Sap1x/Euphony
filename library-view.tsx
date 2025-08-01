"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useMusic } from "@/context/music-context"
import SongList from "@/components/song-list"
import PlaylistManagement from "@/components/playlist-management"

export default function LibraryView() {
  const { userLibrary, playlists, playSong, setCurrentView } = useMusic()

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold mb-6">Your Library</h2>

      <Tabs defaultValue="songs" className="w-full">
        <TabsList className="bg-[#193552] border-[#1e3a5f]">
          <TabsTrigger value="songs" className="data-[state=active]:bg-[#224869]">
            Songs
          </TabsTrigger>
          <TabsTrigger value="playlists" className="data-[state=active]:bg-[#224869]">
            Playlists
          </TabsTrigger>
        </TabsList>

        <TabsContent value="songs" className="mt-6">
          {userLibrary.length > 0 ? (
            <SongList songs={userLibrary} onPlay={playSong} />
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-400 mb-4">Your library is empty</p>
              <button
                className="px-4 py-2 bg-white text-[#0a1929] rounded-full hover:bg-gray-200"
                onClick={() => setCurrentView("home")}
              >
                Discover Music
              </button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="playlists" className="mt-6">
          <PlaylistManagement />
        </TabsContent>
      </Tabs>
    </div>
  )
}

