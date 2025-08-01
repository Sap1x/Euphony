"use client"

import { useEffect, useState } from "react"
import { MusicProvider } from "@/context/music-context"
import Sidebar from "@/components/sidebar"
import MainContent from "@/components/main-content"
import NowPlaying from "@/components/now-playing"
import type { Song } from "@/types/music"
import { fetchSongs } from "@/lib/data-service"
import { isLoggedIn } from "@/lib/spotify-api"
import LoginModal from "@/components/auth/login-modal"
import { Toaster } from "@/components/ui/toaster"

export default function MusicPlayerApp() {
  const [isLoading, setIsLoading] = useState(true)
  const [songs, setSongs] = useState<Song[]>([])
  const [error, setError] = useState<string | null>(null)
  const [userInteracted, setUserInteracted] = useState(false)
  const [showInteractionMessage, setShowInteractionMessage] = useState(true)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [audioError, setAudioError] = useState<string | null>(null)

  useEffect(() => {
    const loadSongs = async () => {
      try {
        setIsLoading(true)
        const data = await fetchSongs()
        setSongs(data)
      } catch (err) {
        console.error("Failed to load songs:", err)
        setError("Failed to load songs. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    loadSongs()

    // Check if user is logged in
    if (!isLoggedIn()) {
      // Show login modal after a short delay
      setTimeout(() => {
        setShowLoginModal(true)
      }, 2000)
    }

    // Check if user has interacted with the page
    const handleInteraction = () => {
      setUserInteracted(true)
      setShowInteractionMessage(false)

      // Create an empty audio context to unlock audio on iOS and other browsers
      try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext
        if (AudioContext) {
          const audioContext = new AudioContext()
          // Resume the audio context if it's suspended
          if (audioContext.state === "suspended") {
            audioContext.resume().catch(console.error)
          }
        }
      } catch (e) {
        console.warn("Could not initialize AudioContext:", e)
      }

      // Remove event listeners once interaction is detected
      document.removeEventListener("click", handleInteraction)
      document.removeEventListener("keydown", handleInteraction)
      document.removeEventListener("touchstart", handleInteraction)
    }

    document.addEventListener("click", handleInteraction)
    document.addEventListener("keydown", handleInteraction)
    document.addEventListener("touchstart", handleInteraction)

    // Listen for audio errors
    const handleAudioError = (e: Event) => {
      const customEvent = e as CustomEvent
      if (customEvent.detail && customEvent.detail.message) {
        setAudioError(customEvent.detail.message)
        // Clear error after 5 seconds
        setTimeout(() => setAudioError(null), 5000)
      }
    }

    document.addEventListener("audio-error", handleAudioError)

    return () => {
      document.removeEventListener("click", handleInteraction)
      document.removeEventListener("keydown", handleInteraction)
      document.removeEventListener("touchstart", handleInteraction)
      document.removeEventListener("audio-error", handleAudioError)
    }
  }, [])

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-2">Error</h2>
          <p className="text-white">{error}</p>
          <button className="mt-4 px-4 py-2 bg-primary rounded-md" onClick={() => window.location.reload()}>
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Loading your music library...</p>
        </div>
      </div>
    )
  }

  return (
    <MusicProvider initialSongs={songs}>
      <div className="flex h-screen overflow-hidden">
        {showInteractionMessage && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-[#193552] p-8 rounded-lg max-w-md text-center">
              <h2 className="text-xl font-bold mb-4">Welcome to Euphony</h2>
              <p className="mb-6">Click anywhere to enable audio playback and start enjoying your music!</p>
              <button
                className="px-6 py-3 bg-white text-[#0a1929] rounded-full hover:bg-gray-200 font-bold"
                onClick={() => setShowInteractionMessage(false)}
              >
                Let's Go!
              </button>
            </div>
          </div>
        )}

        {audioError && (
          <div className="fixed top-4 right-4 bg-red-500 text-white p-4 rounded-md z-50 animate-fade-in-out">
            {audioError}
          </div>
        )}

        <Sidebar />
        <div className="flex-1 flex flex-col bg-gradient-to-b from-[#0f2942] to-[#0a1929]">
          <MainContent />
          <NowPlaying />
        </div>
      </div>

      <LoginModal open={showLoginModal} onOpenChange={setShowLoginModal} />
      <Toaster />
    </MusicProvider>
  )
}

