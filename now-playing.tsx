"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import {
  Heart,
  Laptop2,
  LayoutList,
  Maximize2,
  Minimize2,
  Mic2,
  Pause,
  Play,
  Repeat,
  Repeat1,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume,
  Volume1,
  Volume2,
  VolumeX,
} from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { useMusic } from "@/context/music-context"
import { formatTime } from "@/lib/utils"
import { cn } from "@/lib/utils"
import { playTrack } from "@/lib/spotify-api"

export default function NowPlaying() {
  const {
    currentSong,
    isPlaying,
    progress,
    duration,
    likedSongs,
    pauseSong,
    resumeSong,
    nextSong,
    previousSong,
    setVolume,
    seekTo,
    toggleLike,
    isShuffleOn,
    isRepeatOn,
    isMaximized,
    toggleShuffle,
    toggleRepeat,
    toggleMaximize,
  } = useMusic()

  const [localVolume, setLocalVolume] = useState([70])
  const [localProgress, setLocalProgress] = useState([0])
  const [isLiked, setIsLiked] = useState(false)
  const [showVolumeSlider, setShowVolumeSlider] = useState(false)
  const [playbackError, setPlaybackError] = useState<string | null>(null)
  const progressBarRef = useRef<HTMLDivElement>(null)

  // Update local progress when global progress changes
  useEffect(() => {
    setLocalProgress([progress])
  }, [progress])

  // Check if current song is liked
  useEffect(() => {
    if (currentSong && likedSongs.some((song) => song.id === currentSong.id)) {
      setIsLiked(true)
    } else {
      setIsLiked(false)
    }
  }, [currentSong, likedSongs])

  // Listen for audio errors
  useEffect(() => {
    const handleAudioError = (e: Event) => {
      const customEvent = e as CustomEvent
      if (customEvent.detail && customEvent.detail.message) {
        setPlaybackError(customEvent.detail.message)
        // Clear error after 5 seconds
        setTimeout(() => setPlaybackError(null), 5000)
      }
    }

    document.addEventListener("audio-error", handleAudioError)
    return () => {
      document.removeEventListener("audio-error", handleAudioError)
    }
  }, [])

  // Handle volume change
  const handleVolumeChange = (value: number[]) => {
    setLocalVolume(value)
    setVolume(value[0] / 100)
  }

  // Handle progress change
  const handleProgressChange = (value: number[]) => {
    setLocalProgress(value)
  }

  // Handle progress change end
  const handleProgressChangeEnd = (value: number[]) => {
    seekTo(value[0])
  }

  // Handle play/pause with improved error handling
  const handlePlayPause = () => {
    if (isPlaying) {
      pauseSong()
    } else {
      if (currentSong) {
        try {
          // Clear any previous errors
          setPlaybackError(null)

          // Try to resume or play the track
          if (progress > 0) {
            resumeSong()
          } else {
            // Simulate playing with Spotify
            playTrack(currentSong)
              .then((success) => {
                if (!success) {
                  setPlaybackError("Playback couldn't start automatically. Click again to try.")
                }
              })
              .catch((error) => {
                console.error("Error playing track:", error)
                setPlaybackError("Error playing track. Please try again.")
              })
          }
        } catch (error) {
          console.error("Error in play/pause handler:", error)
          setPlaybackError("Playback error. Please try again.")
        }
      }
    }
  }

  // Handle like
  const handleLike = () => {
    if (currentSong) {
      toggleLike(currentSong)
    }
  }

  // Get volume icon based on volume level
  const getVolumeIcon = () => {
    const volume = localVolume[0]
    if (volume === 0) return <VolumeX className="h-4 w-4" />
    if (volume < 33) return <Volume className="h-4 w-4" />
    if (volume < 67) return <Volume1 className="h-4 w-4" />
    return <Volume2 className="h-4 w-4" />
  }

  if (!currentSong) {
    return (
      <div className="h-20 bg-[#0a1929] border-t border-[#1e3a5f] px-4 flex items-center justify-center text-gray-400">
        No song selected
      </div>
    )
  }

  // Render maximized player
  if (isMaximized) {
    return (
      <div className="fixed inset-0 z-50 bg-gradient-to-b from-[#0f2942] to-[#0a1929] flex flex-col">
        {/* Header with minimize button */}
        <div className="p-4 flex justify-end">
          <button
            onClick={toggleMaximize}
            className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-[#193552]"
          >
            <Minimize2 className="h-6 w-6" />
          </button>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          {/* Album art */}
          <div className="relative w-64 h-64 md:w-80 md:h-80 mb-8 rounded-lg overflow-hidden shadow-2xl">
            <Image
              src={currentSong.imageUrl || "/placeholder.svg?height=300&width=300"}
              alt={`${currentSong.name} by ${currentSong.artist}`}
              fill
              className="object-cover"
            />
          </div>

          {/* Song info */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold">{currentSong.name}</h2>
            <p className="text-gray-400">{currentSong.artist}</p>
          </div>

          {/* Progress bar */}
          <div className="w-full max-w-md flex items-center gap-2 mb-4">
            <span className="text-sm text-gray-400">{formatTime(progress)}</span>
            <div ref={progressBarRef} className="relative w-full h-1 bg-[#193552] rounded-full">
              <Slider
                value={localProgress}
                onValueChange={handleProgressChange}
                onValueCommit={handleProgressChangeEnd}
                max={duration || 100}
                step={1}
                className="w-full h-1"
              />
            </div>
            <span className="text-sm text-gray-400">{formatTime(duration)}</span>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-6">
            <button
              className={cn("text-gray-400 hover:text-white", isShuffleOn && "text-green-500")}
              onClick={toggleShuffle}
              aria-label="Shuffle"
            >
              <Shuffle className="h-5 w-5" />
            </button>

            <button className="text-gray-400 hover:text-white" onClick={previousSong}>
              <SkipBack className="h-6 w-6" />
            </button>

            <button
              className="bg-white text-black rounded-full p-3 hover:scale-105 transition"
              onClick={handlePlayPause}
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
            </button>

            <button className="text-gray-400 hover:text-white" onClick={nextSong}>
              <SkipForward className="h-6 w-6" />
            </button>

            <button
              className={cn("text-gray-400 hover:text-white", isRepeatOn && "text-green-500")}
              onClick={toggleRepeat}
              aria-label="Repeat"
            >
              {isRepeatOn ? <Repeat1 className="h-5 w-5" /> : <Repeat className="h-5 w-5" />}
            </button>
          </div>

          {/* Volume control */}
          <div className="mt-6 flex items-center gap-2">
            <button className="text-gray-400 hover:text-white" onClick={() => setShowVolumeSlider(!showVolumeSlider)}>
              {getVolumeIcon()}
            </button>

            {showVolumeSlider && (
              <Slider value={localVolume} onValueChange={handleVolumeChange} max={100} step={1} className="w-32 h-1" />
            )}

            <button
              className={cn("ml-4 text-gray-400 hover:text-white", isLiked && "text-green-500")}
              onClick={handleLike}
            >
              <Heart className={`h-5 w-5 ${isLiked ? "fill-green-500" : ""}`} />
            </button>
          </div>

          {/* Error message */}
          {playbackError && (
            <div className="mt-4 text-red-500 text-sm bg-[#193552] p-2 rounded-md">{playbackError}</div>
          )}
        </div>
      </div>
    )
  }

  // Add a play button that will be shown when autoplay is blocked
  return (
    <div className="h-20 bg-[#0a1929] border-t border-[#1e3a5f] px-4 flex items-center">
      {/* Song info */}
      <div className="flex items-center w-1/4">
        <div className="relative h-14 w-14 rounded overflow-hidden">
          <Image
            src={currentSong.imageUrl || "/placeholder.svg?height=300&width=300"}
            alt={`${currentSong.name} by ${currentSong.artist}`}
            fill
            className="object-cover"
          />
        </div>
        <div className="ml-3">
          <div className="text-sm font-medium">{currentSong.name}</div>
          <div className="text-xs text-gray-400">{currentSong.artist}</div>
        </div>
        <button
          className={`ml-4 ${isLiked ? "text-green-500" : "text-gray-400 hover:text-white"}`}
          onClick={handleLike}
        >
          <Heart className={`h-5 w-5 ${isLiked ? "fill-green-500" : ""}`} />
        </button>
      </div>

      {/* Player controls */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="flex items-center gap-4 mb-1">
          <button
            className={cn("text-gray-400 hover:text-white", isShuffleOn && "text-green-500")}
            onClick={toggleShuffle}
          >
            <Shuffle className="h-4 w-4" />
          </button>
          <button className="text-gray-400 hover:text-white" onClick={previousSong}>
            <SkipBack className="h-5 w-5" />
          </button>
          <button
            className="bg-white text-black rounded-full p-1 hover:scale-105 transition"
            onClick={handlePlayPause}
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          </button>
          <button className="text-gray-400 hover:text-white" onClick={nextSong}>
            <SkipForward className="h-5 w-5" />
          </button>
          <button
            className={cn("text-gray-400 hover:text-white", isRepeatOn && "text-green-500")}
            onClick={toggleRepeat}
          >
            {isRepeatOn ? <Repeat1 className="h-4 w-4" /> : <Repeat className="h-4 w-4" />}
          </button>
        </div>
        <div className="flex items-center w-full gap-2">
          <span className="text-xs text-gray-400">{formatTime(progress)}</span>
          <div ref={progressBarRef} className="relative w-full h-1 bg-[#193552] rounded-full">
            <Slider
              value={localProgress}
              onValueChange={handleProgressChange}
              onValueCommit={handleProgressChangeEnd}
              max={duration || 100}
              step={1}
              className="w-full h-1"
            />
          </div>
          <span className="text-xs text-gray-400">{formatTime(duration)}</span>
        </div>

        {/* Error message (compact version) */}
        {playbackError && <div className="text-red-500 text-xs mt-1">{playbackError}</div>}
      </div>

      {/* Volume controls */}
      <div className="w-1/4 flex items-center justify-end gap-3">
        <button className="text-gray-400 hover:text-white">
          <Mic2 className="h-4 w-4" />
        </button>
        <button className="text-gray-400 hover:text-white">
          <LayoutList className="h-4 w-4" />
        </button>
        <button className="text-gray-400 hover:text-white">
          <Laptop2 className="h-4 w-4" />
        </button>
        <div className="flex items-center gap-1">
          <button className="text-gray-400 hover:text-white">{getVolumeIcon()}</button>
          <Slider value={localVolume} onValueChange={handleVolumeChange} max={100} step={1} className="w-20 h-1" />
        </div>
        <button className="text-gray-400 hover:text-white" onClick={toggleMaximize}>
          <Maximize2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

