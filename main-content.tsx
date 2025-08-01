"use client"

import { useMusic } from "@/context/music-context"
import HomeView from "@/components/views/home-view"
import SearchView from "@/components/views/search-view"
import LibraryView from "@/components/views/library-view"
import LikedSongsView from "@/components/views/liked-songs-view"
import PlaylistView from "@/components/views/playlist-view"
import ArtistView from "@/components/views/artist-view"
import MoodView from "@/components/views/mood-view"

export default function MainContent() {
  const { currentView } = useMusic()

  // Determine which view to render based on currentView
  const renderView = () => {
    if (currentView === "home") {
      return <HomeView />
    } else if (currentView === "search") {
      return <SearchView />
    } else if (currentView === "library") {
      return <LibraryView />
    } else if (currentView === "liked") {
      return <LikedSongsView />
    } else if (currentView.startsWith("playlist-")) {
      const playlistId = currentView.replace("playlist-", "")
      return <PlaylistView playlistId={playlistId} />
    } else if (currentView.startsWith("artist-")) {
      const artistName = currentView.replace("artist-", "")
      return <ArtistView artistName={artistName} />
    } else if (currentView.startsWith("mood-")) {
      const mood = currentView.replace("mood-", "")
      return <MoodView mood={mood} />
    }

    // Default to home view
    return <HomeView />
  }

  return <div className="flex-1 overflow-y-auto p-8">{renderView()}</div>
}

