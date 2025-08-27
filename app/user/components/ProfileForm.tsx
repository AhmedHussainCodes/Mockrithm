"use client"

import type React from "react"

import { useState } from "react"
import type { User } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { updateUserProfile } from "../lib/firestore"

interface ProfileFormProps {
  user: User
  onUpdate: (user: User) => void
}

export function ProfileForm({ user, onUpdate }: ProfileFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: user.name,
    resumeLink: user.resumeLink || "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      await updateUserProfile(user.id, formData)
      onUpdate({ ...user, ...formData })
      setIsOpen(false)
    } catch (err) {
      setError("Failed to update profile. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
       <Button
  variant="outline"
  className="!border-white text-white hover:bg-gray-50 bg-transparent"
>
  Edit Profile
</Button>

      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-black border-gray-200">
        <DialogHeader>
          <DialogTitle className="text-white">Edit Profile</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-200">
              Name
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="border-gray-300 focus:border-black focus:ring-black"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="resumeLink" className="text-gray-200">
              Resume Link
            </Label>
            <Input
              id="resumeLink"
              type="url"
              value={formData.resumeLink}
              onChange={(e) => setFormData({ ...formData, resumeLink: e.target.value })}
              className="border-gray-300 focus:border-black focus:ring-black"
              placeholder="https://..."
            />
          </div>
          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertDescription className="text-red-700">{error}</AlertDescription>
            </Alert>
          )}
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="border-gray-300 text-white hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-black text-white border border-gray-300 hover:bg-gray-800">
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
