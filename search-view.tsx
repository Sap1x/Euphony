"use client"

import { useState, useEffect, useRef } from "react"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useMusic } from "@/context/music-context"
import SongList from "@/components/song-list"
import { cn } from "@/lib/utils"

const moodOptions = ["Happy", "Sad", "Romantic", "Energetic", "Party", "Relaxed"]

export default function SearchView() {
  const { search, searchResults, searchSuggestions, playSong, trendingSongs, getMoodSongs } = useMusic()
  const [query, setQuery] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedMood, setSelectedMood] = useState<string | null>(null)
  const [moodResults, setMoodResults] = useState<any[]>([])
  const searchInputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  // Perform search when query changes
  useEffect(() => {
    const delaySearch = setTimeout(() => {
      if (query.trim()) {
        search(query)
        setShowSuggestions(true)
      } else {
        setShowSuggestions(false)
      }
    }, 300)

    return () => clearTimeout(delaySearch)
  }, [query, search])

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Handle mood selection
  useEffect(() => {
    if (selectedMood) {
      const songs = getMoodSongs(selectedMood)
      setMoodResults(songs)
    } else {
      setMoodResults([])
    }
  }, [selectedMood, getMoodSongs])

  const handleSuggestionClick = (suggestion: any) => {
    playSong(suggestion)
    setShowSuggestions(false)
  }

  const handleMoodSelect = (mood: string) => {
    if (selectedMood === mood) {
      setSelectedMood(null)
    } else {
      setSelectedMood(mood)
      setQuery("")
    }
  }

  const clearSearch = () => {
    setQuery("")
    setSelectedMood(null)
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold mb-6">Search</h2>

      <div className="relative max-w-2xl">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          ref={searchInputRef}
          type="search"
          placeholder="Search for songs, artists, or albums..."
          className="pl-10 pr-10 bg-[#193552] border-[#1e3a5f] text-white h-12"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim() && setShowSuggestions(true)}
        />
        {(query || selectedMood) && (
          <button
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
            onClick={clearSearch}
          >
            <X className="h-5 w-5" />
          </button>
        )}

        {/* Search suggestions dropdown */}
        {showSuggestions && searchSuggestions.length > 0 && (
          <div
            ref={suggestionsRef}
            className="absolute z-10 mt-1 w-full bg-[#193552] border border-[#1e3a5f] rounded-md shadow-lg overflow-hidden"
          >
            {searchSuggestions.map((suggestion) => (
              <div
                key={suggestion.id}
                className="flex items-center p-3 hover:bg-[#224869] cursor-pointer"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <div className="flex-1">
                  <div className="font-medium">{suggestion.name}</div>
                  <div className="text-sm text-gray-400">{suggestion.artist}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Mood filters */}
      <div className="space-y-3">
        <h3 className="text-lg font-medium">Search by Mood</h3>
        <div className="flex flex-wrap gap-2">
          {moodOptions.map((mood) => (
            <Button
              key={mood}
              variant="outline"
              className={cn(
                "border-[#1e3a5f] hover:bg-[#224869] transition-colors",
                selectedMood === mood && "bg-[#224869] border-green-500",
              )}
              onClick={() => handleMoodSelect(mood)}
            >
              {mood}
            </Button>
          ))}
        </div>
      </div>

      {/* Search results */}
      {selectedMood ? (
        <>
          <h3 className="text-xl font-bold mt-8">{selectedMood} Songs</h3>
          {moodResults.length > 0 ? (
            <SongList songs={moodResults} onPlay={playSong} />
          ) : (
            <p className="text-gray-400 mt-4">No {selectedMood.toLowerCase()} songs found</p>
          )}
        </>
      ) : query.trim() ? (
        <>
          <h3 className="text-xl font-bold mt-8">Search Results</h3>
          {searchResults.length > 0 ? (
            <SongList songs={searchResults} onPlay={playSong} />
          ) : (
            <p className="text-gray-400 mt-4">No results found for "{query}"</p>
          )}
        </>
      ) : (
        <>
          <h3 className="text-xl font-bold mt-8">Trending Searches</h3>
          <SongList songs={trendingSongs.slice(0, 10)} onPlay={playSong} />
        </>
      )}
    </div>
  )
}

