"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useMusic } from "@/context/music-context"
import { Card } from "@/components/ui/card"
import SongList from "@/components/song-list"
import { getGreeting } from "@/lib/data-service"
import { getMoodPlaylists } from "@/lib/spotify-api"
import { motion } from "framer-motion"

export default function HomeView() {
  const { moodCategories, artistRecommendations, trendingSongs, setCurrentView, playSong, recentlyPlayed } = useMusic()
  const [greeting, setGreeting] = useState(getGreeting())
  const [spotifyMoodPlaylists, setSpotifyMoodPlaylists] = useState<Record<string, any>>({})

  // Update greeting based on time of day
  useEffect(() => {
    // Update greeting every minute
    const intervalId = setInterval(() => {
      setGreeting(getGreeting())
    }, 60000)

    return () => clearInterval(intervalId)
  }, [])

  // Load Spotify mood playlists
  useEffect(() => {
    setSpotifyMoodPlaylists(getMoodPlaylists())
  }, [])

  return (
    <div className="space-y-8">
      {/* Animated logo and greeting */}
      <div className="flex items-center mb-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mr-4"
        >
          <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gradient-to-r from-green-400 to-blue-500">
            <motion.div
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 20,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="w-6 h-6 bg-white rounded-full" />
            </motion.div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-4 h-4 bg-[#0a1929] rounded-full" />
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-3xl font-bold">{greeting}</h2>
        </motion.div>
      </div>

      {/* Mood-based recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {moodCategories.map((mood) => (
          <motion.div
            key={mood.id}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setCurrentView(`mood-${mood.id}`)}
            className="cursor-pointer"
          >
            <Card className="bg-[#193552] hover:bg-[#224869] transition-colors border-none overflow-hidden">
              <div className="flex items-center p-2">
                <div className="relative w-16 h-16 rounded overflow-hidden">
                  <Image
                    src={mood.image || "/placeholder.svg?height=300&width=300"}
                    alt={mood.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="ml-4 font-bold text-lg">{mood.name}</div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Artist section */}
      <div className="flex items-center justify-between mt-8">
        <h2 className="text-3xl font-bold">Artist</h2>
        <Link href="#" className="text-sm text-gray-400 hover:text-white">
          SEE ALL
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {artistRecommendations.slice(0, 5).map((artist) => (
          <motion.div
            key={artist.id}
            whileHover={{
              scale: 1.05,
              transition: { duration: 0.2 },
            }}
            onClick={() => setCurrentView(`artist-${artist.name}`)}
            className="cursor-pointer"
          >
            <Card className="bg-[#193552] hover:bg-[#224869] transition-colors border-none overflow-hidden p-4 h-full">
              <div className="relative w-full aspect-square rounded-md overflow-hidden mb-4">
                <Image
                  src={artist.image || "/placeholder.svg?height=300&width=300"}
                  alt={artist.name}
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="font-bold group-hover:text-green-400 transition-colors">{artist.name}</h3>
              <p className="text-sm text-gray-400">{artist.description}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Spotify Mood Playlists */}
      {Object.keys(spotifyMoodPlaylists).length > 0 && (
        <>
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Mood Playlists</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(spotifyMoodPlaylists)
                .slice(0, 3)
                .map(([mood, songs]) => (
                  <Card key={mood} className="bg-[#193552] hover:bg-[#224869] transition-colors border-none p-4">
                    <h3 className="font-bold text-lg mb-2">{mood} Vibes</h3>
                    <div className="space-y-2">
                      {(songs as any[]).slice(0, 3).map((song) => (
                        <div
                          key={song.id}
                          className="flex items-center p-2 hover:bg-[#0a1929] rounded-md cursor-pointer"
                          onClick={() => playSong(song)}
                        >
                          <div className="flex-1 truncate">
                            <div className="font-medium truncate">{song.name}</div>
                            <div className="text-xs text-gray-400 truncate">{song.artist}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button
                      className="w-full mt-3 text-sm text-green-400 hover:text-green-300 font-medium"
                      onClick={() => setCurrentView(`mood-${mood.toLowerCase()}`)}
                    >
                      See all {mood} songs
                    </button>
                  </Card>
                ))}
            </div>
          </div>
        </>
      )}

      {/* Trending Songs */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Trending Songs 2025</h2>
        <SongList songs={trendingSongs.slice(0, 5)} onPlay={playSong} />
      </div>

      {/* Recently Played */}
      {recentlyPlayed.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Recently Played</h2>
          <SongList songs={recentlyPlayed.slice(0, 5)} onPlay={playSong} />
        </div>
      )}
    </div>
  )
}

