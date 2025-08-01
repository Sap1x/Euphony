"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, Home, Library, Plus, Search } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent } from "@/components/ui/tabs"

import NowPlaying from "./now-playing"

// Music data with Hindi and English songs
const musicData = {
  moods: [
    {
      id: "happy",
      name: "HAPPY",
      image: "/placeholder.svg?height=200&width=200",
      songs: [
        { id: "h1", title: "Happy", artist: "Pharrell Williams", language: "English" },
        { id: "h2", title: "Badtameez Dil", artist: "Benny Dayal", language: "Hindi" },
        { id: "h3", title: "Can't Stop the Feeling", artist: "Justin Timberlake", language: "English" },
        { id: "h4", title: "Tune Maari Entriyaan", artist: "Vishal Dadlani", language: "Hindi" },
      ],
    },
    {
      id: "love",
      name: "LOVE",
      image: "/placeholder.svg?height=200&width=200",
      songs: [
        { id: "l1", title: "Perfect", artist: "Ed Sheeran", language: "English" },
        { id: "l2", title: "Tum Hi Ho", artist: "Arijit Singh", language: "Hindi" },
        { id: "l3", title: "All of Me", artist: "John Legend", language: "English" },
        { id: "l4", title: "Raabta", artist: "Arijit Singh", language: "Hindi" },
      ],
    },
    {
      id: "sad",
      name: "SAD",
      image: "/placeholder.svg?height=200&width=200",
      songs: [
        { id: "s1", title: "Someone Like You", artist: "Adele", language: "English" },
        { id: "s2", title: "Channa Mereya", artist: "Arijit Singh", language: "Hindi" },
        { id: "s3", title: "Fix You", artist: "Coldplay", language: "English" },
        { id: "s4", title: "Agar Tum Saath Ho", artist: "Arijit Singh & Alka Yagnik", language: "Hindi" },
      ],
    },
    {
      id: "energetic",
      name: "ENERGETIC",
      image: "/placeholder.svg?height=200&width=200",
      songs: [
        { id: "e1", title: "Uptown Funk", artist: "Mark Ronson ft. Bruno Mars", language: "English" },
        { id: "e2", title: "Malhari", artist: "Vishal Dadlani", language: "Hindi" },
        { id: "e3", title: "Can't Hold Us", artist: "Macklemore & Ryan Lewis", language: "English" },
        { id: "e4", title: "Dhinka Chika", artist: "Mika Singh", language: "Hindi" },
      ],
    },
    {
      id: "relaxed",
      name: "RELAXED",
      image: "/placeholder.svg?height=200&width=200",
      songs: [
        { id: "r1", title: "Sunday Morning", artist: "Maroon 5", language: "English" },
        { id: "r2", title: "Tum Se Hi", artist: "Mohit Chauhan", language: "Hindi" },
        { id: "r3", title: "Stay", artist: "Rihanna ft. Mikky Ekko", language: "English" },
        { id: "r4", title: "Kabira", artist: "Arijit Singh & Harshdeep Kaur", language: "Hindi" },
      ],
    },
    {
      id: "classic",
      name: "CLASSIC",
      image: "/placeholder.svg?height=200&width=200",
      songs: [
        { id: "c1", title: "Bohemian Rhapsody", artist: "Queen", language: "English" },
        { id: "c2", title: "Lag Jaa Gale", artist: "Lata Mangeshkar", language: "Hindi" },
        { id: "c3", title: "Hotel California", artist: "Eagles", language: "English" },
        { id: "c4", title: "Pyar Kiya To Darna Kya", artist: "Lata Mangeshkar", language: "Hindi" },
      ],
    },
  ],
  artists: [
    {
      id: "ed-sheeran",
      name: "Ed Sheeran",
      description: "English singer-songwriter",
      image: "/placeholder.svg?height=200&width=200",
      songs: [
        { id: "ed1", title: "Shape of You", language: "English" },
        { id: "ed2", title: "Perfect", language: "English" },
        { id: "ed3", title: "Thinking Out Loud", language: "English" },
      ],
    },
    {
      id: "arijit-singh",
      name: "Arijit Singh",
      description: "Indian singer",
      image: "/placeholder.svg?height=200&width=200",
      songs: [
        { id: "ar1", title: "Tum Hi Ho", language: "Hindi" },
        { id: "ar2", title: "Channa Mereya", language: "Hindi" },
        { id: "ar3", title: "Ae Dil Hai Mushkil", language: "Hindi" },
      ],
    },
    {
      id: "taylor-swift",
      name: "Taylor Swift",
      description: "American singer, songwriter",
      image: "/placeholder.svg?height=200&width=200",
      songs: [
        { id: "ts1", title: "Blank Space", language: "English" },
        { id: "ts2", title: "Love Story", language: "English" },
        { id: "ts3", title: "Anti-Hero", language: "English" },
      ],
    },
    {
      id: "ar-rahman",
      name: "A.R. Rahman",
      description: "Indian composer, singer",
      image: "/placeholder.svg?height=200&width=200",
      songs: [
        { id: "ar1", title: "Jai Ho", language: "Hindi" },
        { id: "ar2", title: "Dil Se Re", language: "Hindi" },
        { id: "ar3", title: "Kun Faya Kun", language: "Hindi" },
      ],
    },
    {
      id: "rihanna",
      name: "Rihanna",
      description: "Barbadian singer",
      image: "/placeholder.svg?height=200&width=200",
      songs: [
        { id: "ri1", title: "Diamonds", language: "English" },
        { id: "ri2", title: "Umbrella", language: "English" },
        { id: "ri3", title: "Work", language: "English" },
      ],
    },
  ],
  forYou: [
    {
      id: "fy1",
      title: "Daily Mix 1",
      description: "Arijit Singh, Shreya Ghoshal and more",
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      id: "fy2",
      title: "Daily Mix 2",
      description: "Ed Sheeran, Taylor Swift and more",
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      id: "fy3",
      title: "Bollywood Hits",
      description: "Top Hindi songs from recent movies",
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      id: "fy4",
      title: "Pop Rewind",
      description: "Throwback to your favorite pop hits",
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      id: "fy5",
      title: "Discover Weekly",
      description: "New discoveries and deep cuts picked for you",
      image: "/placeholder.svg?height=200&width=200",
    },
  ],
}

export default function MusicPlayer() {
  const [currentTab, setCurrentTab] = useState("home")
  const [currentSong, setCurrentSong] = useState({
    title: "Tum Hi Ho",
    artist: "Arijit Singh",
    album: "Aashiqui 2",
    cover: "/placeholder.svg?height=300&width=300",
  })

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div className="w-60 bg-[#0a1929] border-r border-[#1e3a5f] p-5 flex flex-col">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Euphony</h1>
          <p className="text-xs text-gray-400">Music Player</p>
        </div>

        <nav className="space-y-6 flex-1">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start text-lg font-normal",
              currentTab === "home" ? "text-white" : "text-gray-400",
            )}
            onClick={() => setCurrentTab("home")}
          >
            <Home className="mr-3 h-5 w-5" />
            Home
          </Button>

          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start text-lg font-normal",
              currentTab === "search" ? "text-white" : "text-gray-400",
            )}
            onClick={() => setCurrentTab("search")}
          >
            <Search className="mr-3 h-5 w-5" />
            Search
          </Button>

          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start text-lg font-normal",
              currentTab === "library" ? "text-white" : "text-gray-400",
            )}
            onClick={() => setCurrentTab("library")}
          >
            <Library className="mr-3 h-5 w-5" />
            Your Library
          </Button>

          <div className="pt-6">
            <Button variant="ghost" className="w-full justify-start text-lg font-normal text-gray-400">
              <Plus className="mr-3 h-5 w-5" />
              Create Playlist
            </Button>

            <Button variant="ghost" className="w-full justify-start text-lg font-normal text-gray-400">
              <Heart className="mr-3 h-5 w-5" />
              Liked Songs
            </Button>
          </div>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col bg-gradient-to-b from-[#0f2942] to-[#0a1929]">
        <div className="flex-1 overflow-y-auto p-8">
          <Tabs defaultValue="home" className="w-full">
            <TabsContent value="home" className="space-y-8">
              <h2 className="text-3xl font-bold mb-6">Good Night</h2>

              {/* Mood-based recommendations */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {musicData.moods.map((mood) => (
                  <Link href="#" key={mood.id} className="block">
                    <Card className="bg-[#193552] hover:bg-[#224869] transition-colors border-none overflow-hidden">
                      <div className="flex items-center p-2">
                        <div className="relative w-16 h-16 rounded overflow-hidden">
                          <Image src={mood.image || "/placeholder.svg"} alt={mood.name} fill className="object-cover" />
                        </div>
                        <div className="ml-4 font-bold text-lg">{mood.name}</div>
                      </div>
                    </Card>
                  </Link>
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
                {musicData.artists.map((artist) => (
                  <Link href="#" key={artist.id} className="block">
                    <Card className="bg-[#193552] hover:bg-[#224869] transition-colors border-none overflow-hidden p-4">
                      <div className="relative w-full aspect-square rounded-md overflow-hidden mb-4">
                        <Image
                          src={artist.image || "/placeholder.svg"}
                          alt={artist.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <h3 className="font-bold">{artist.name}</h3>
                      <p className="text-sm text-gray-400">{artist.description}</p>
                    </Card>
                  </Link>
                ))}
              </div>

              {/* Made For You section */}
              <div className="flex items-center justify-between mt-8">
                <h2 className="text-3xl font-bold">Made For You</h2>
                <Link href="#" className="text-sm text-gray-400 hover:text-white">
                  SEE ALL
                </Link>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {musicData.forYou.map((item) => (
                  <Link href="#" key={item.id} className="block">
                    <Card className="bg-[#193552] hover:bg-[#224869] transition-colors border-none overflow-hidden p-4">
                      <div className="relative w-full aspect-square rounded-md overflow-hidden mb-4">
                        <Image src={item.image || "/placeholder.svg"} alt={item.title} fill className="object-cover" />
                      </div>
                      <h3 className="font-bold">{item.title}</h3>
                      <p className="text-sm text-gray-400 line-clamp-2">{item.description}</p>
                    </Card>
                  </Link>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Now playing bar */}
        <NowPlaying song={currentSong} />
      </div>
    </div>
  )
}

