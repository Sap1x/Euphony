"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useMusic } from "@/context/music-context"

interface CreatePlaylistDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function CreatePlaylistDialog({ open, onOpenChange }: CreatePlaylistDialogProps) {
  const [playlistName, setPlaylistName] = useState("")
  const { createPlaylist } = useMusic()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (playlistName.trim()) {
      createPlaylist(playlistName.trim())
      setPlaylistName("")
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#193552] border-[#1e3a5f] text-white">
        <DialogHeader>
          <DialogTitle>Create New Playlist</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="py-4">
            <Input
              placeholder="Playlist name"
              value={playlistName}
              onChange={(e) => setPlaylistName(e.target.value)}
              className="bg-[#0a1929] border-[#1e3a5f] text-white"
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-[#1e3a5f] text-white hover:bg-[#224869]"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!playlistName.trim()} className="bg-white text-[#0a1929] hover:bg-gray-200">
              Create
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

