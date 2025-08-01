"use client"

import type React from "react"

import { useState } from "react"
import { Trash2, Plus, Music } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useMusic } from "@/context/music-context"
import { deletePlaylist } from "@/lib/spotify-api"
import { toast } from "@/components/ui/use-toast"

export default function PlaylistManagement() {
  const { playlists, createPlaylist, removePlaylist } = useMusic()
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [playlistToDelete, setPlaylistToDelete] = useState<string | null>(null)
  const [newPlaylistName, setNewPlaylistName] = useState("")
  const [newPlaylistDescription, setNewPlaylistDescription] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleCreatePlaylist = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Create playlist in local state
      createPlaylist(newPlaylistName)

      // Reset form and close dialog
      setNewPlaylistName("")
      setNewPlaylistDescription("")
      setIsCreateOpen(false)

      toast({
        title: "Playlist created",
        description: `"${newPlaylistName}" has been created successfully.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create playlist. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeletePlaylist = async () => {
    if (!playlistToDelete) return

    setIsLoading(true)

    try {
      // Delete playlist from Spotify (simulated)
      await deletePlaylist(playlistToDelete)

      // Update UI to reflect deletion - use the removePlaylist function from context
      removePlaylist(playlistToDelete)

      setIsDeleteOpen(false)
      setPlaylistToDelete(null)

      toast({
        title: "Playlist deleted",
        description: "The playlist has been deleted successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete playlist. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const openDeleteDialog = (playlistId: string) => {
    setPlaylistToDelete(playlistId)
    setIsDeleteOpen(true)
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Your Playlists</h2>
          <Button
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
          >
            <Plus className="h-4 w-4" />
            New Playlist
          </Button>
        </div>

        {playlists.length === 0 ? (
          <div className="text-center py-8 bg-[#193552] rounded-lg">
            <Music className="h-12 w-12 mx-auto text-gray-400 mb-2" />
            <p className="text-gray-400">You don't have any playlists yet</p>
            <Button
              onClick={() => setIsCreateOpen(true)}
              variant="outline"
              className="mt-4 border-[#1e3a5f] text-white hover:bg-[#224869]"
            >
              Create Your First Playlist
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {playlists.map((playlist) => (
              <div
                key={playlist.id}
                className="flex items-center justify-between p-3 bg-[#193552] hover:bg-[#224869] transition-colors rounded-md"
              >
                <div>
                  <h3 className="font-medium">{playlist.name}</h3>
                  <p className="text-sm text-gray-400">{playlist.songs.length} songs</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => openDeleteDialog(playlist.id)}
                  className="text-gray-400 hover:text-red-500 hover:bg-transparent"
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Playlist Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="bg-[#193552] border-[#1e3a5f] text-white">
          <DialogHeader>
            <DialogTitle>Create New Playlist</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreatePlaylist}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="playlist-name">Playlist Name</Label>
                <Input
                  id="playlist-name"
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                  placeholder="My Awesome Playlist"
                  className="bg-[#0a1929] border-[#1e3a5f] text-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="playlist-description">Description (optional)</Label>
                <Textarea
                  id="playlist-description"
                  value={newPlaylistDescription}
                  onChange={(e) => setNewPlaylistDescription(e.target.value)}
                  placeholder="A collection of my favorite songs"
                  className="bg-[#0a1929] border-[#1e3a5f] text-white"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateOpen(false)}
                className="border-[#1e3a5f] text-white hover:bg-[#224869]"
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!newPlaylistName.trim() || isLoading}
                className="bg-green-600 hover:bg-green-700"
              >
                {isLoading ? "Creating..." : "Create Playlist"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Playlist Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="bg-[#193552] border-[#1e3a5f] text-white">
          <DialogHeader>
            <DialogTitle>Delete Playlist</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to delete this playlist? This action cannot be undone.</p>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteOpen(false)}
              className="border-[#1e3a5f] text-white hover:bg-[#224869]"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button onClick={handleDeletePlaylist} disabled={isLoading} className="bg-red-600 hover:bg-red-700">
              {isLoading ? "Deleting..." : "Delete Playlist"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

