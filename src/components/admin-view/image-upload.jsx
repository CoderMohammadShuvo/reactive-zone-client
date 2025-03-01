"use client"

import { useEffect, useRef, useState } from "react"
import { FileIcon, UploadCloudIcon, XIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import axios from "axios"

function ProductImageUpload({
  uploadedImageUrl = [],
  setUploadedImageUrl,
  isEditMode = false,
  maxImages = 4,
  onMultipleUploadComplete,
}) {
  const { toast } = useToast()
  const inputRef = useRef(null)
  const [imageFiles, setImageFiles] = useState([])
  const [imageLoadingStates, setImageLoadingStates] = useState([])
  const [uploadedUrls, setUploadedUrls] = useState(uploadedImageUrl)
  const [uploadQueue, setUploadQueue] = useState([])

  // Sync with parent's state
  useEffect(() => {
    setUploadedUrls(uploadedImageUrl)
  }, [uploadedImageUrl])

  // Process upload queue
  useEffect(() => {
    if (uploadQueue.length > 0) {
      const [nextFile, ...remainingQueue] = uploadQueue
      uploadImageToCloudinary(nextFile).then(() => {
        setUploadQueue(remainingQueue)
      })
    }
  }, [uploadQueue])

  const handleImageFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files || [])
    const remainingSlots = maxImages - uploadedUrls.length
    const filesToAdd = selectedFiles.slice(0, remainingSlots)

    if (filesToAdd.length > 0) {
      setImageFiles((prev) => [...prev, ...filesToAdd])
      setImageLoadingStates((prev) => [...prev, ...filesToAdd.map(() => true)])
      setUploadQueue((prev) => [...prev, ...filesToAdd])
    }
  }

  const uploadImageToCloudinary = async (file) => {
    const formData = new FormData()
    formData.append("my_file", file)

    try {
      const response = await axios.post(
        "https://reactive-zone-backend.vercel.app/api/admin/products/upload-image",
        formData,
      )

      if (response?.data?.success) {
        const newUrl = response.data.result.url
        const updatedUrls = [...uploadedUrls, newUrl] // Append new URL to the end

        setUploadedUrls(updatedUrls)
        setUploadedImageUrl(updatedUrls) // Update parent state

        if (onMultipleUploadComplete) {
          onMultipleUploadComplete(updatedUrls)
        }

        toast({
          title: "Image uploaded successfully",
        })

        // Remove the file from imageFiles after successful upload
        setImageFiles((prev) => prev.filter((f) => f !== file))
      }
    } catch (error) {
      console.error("Error uploading image:", error)
      toast({
        title: "Error uploading image",
        variant: "destructive",
      })
    } finally {
      // Update loading states
      setImageLoadingStates((prev) => {
        const index = imageFiles.findIndex((f) => f === file)
        if (index === -1) return prev
        const newStates = [...prev]
        newStates[index] = false
        return newStates.filter((_, i) => i !== index)
      })
    }
  }

  const handleRemoveImage = (index) => {
    const updatedUrls = uploadedUrls.filter((_, i) => i !== index)
    setUploadedUrls(updatedUrls)
    setUploadedImageUrl(updatedUrls)

    if (onMultipleUploadComplete) {
      onMultipleUploadComplete(updatedUrls)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const droppedFiles = Array.from(e.dataTransfer.files)
    const remainingSlots = maxImages - uploadedUrls.length
    const filesToAdd = droppedFiles.slice(0, remainingSlots)

    if (filesToAdd.length > 0) {
      setImageFiles((prev) => [...prev, ...filesToAdd])
      setImageLoadingStates((prev) => [...prev, ...filesToAdd.map(() => true)])
      setUploadQueue((prev) => [...prev, ...filesToAdd])
    }
  }

  const handleUploadClick = () => {
    inputRef.current?.click()
  }

  return (
    <div className="w-full mt-4">
      <Label className="text-lg font-semibold mb-2 block">Upload Images</Label>
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`${isEditMode ? "opacity-60" : ""} border-2 border-dashed rounded-lg p-4`}
      >
        <Input
          id="image-upload"
          type="file"
          multiple
          className="hidden"
          ref={inputRef}
          onChange={handleImageFileChange}
          disabled={isEditMode || uploadedUrls.length >= maxImages}
          accept="image/*"
        />

        {/* Image Preview Grid */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {uploadedUrls.map((url, index) => (
            <div key={index} className="relative group">
              <img
                src={url || "/placeholder.svg"}
                alt={`Uploaded ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg"
              />
              {!isEditMode && (
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleRemoveImage(index)}
                >
                  <XIcon className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>

        {/* Upload Area */}
        {uploadedUrls.length < maxImages && !isEditMode && (
          <div
            onClick={handleUploadClick}
            className="flex flex-col items-center justify-center h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50"
          >
            <UploadCloudIcon className="w-10 h-10 text-muted-foreground mb-2" />
            <span>Click or drag images to upload</span>
            <span className="text-sm text-muted-foreground mt-2">
              {maxImages - uploadedUrls.length} slots remaining
            </span>
          </div>
        )}

        {/* Loading States */}
        {imageLoadingStates.some(Boolean) && (
          <div className="mt-4 space-y-2">
            {imageFiles.map((file, index) => (
              <div key={index} className="flex items-center gap-2">
                <FileIcon className="h-5 w-5" />
                <span className="text-sm">{file.name}</span>
                <Skeleton className="h-4 w-4 rounded-full animate-spin" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Debug Information */}
      <div className="mt-4 text-xs text-muted-foreground">
        <p>Total files: {uploadedUrls.length}</p>
        <p>Uploading: {uploadQueue.length}</p>
        <p>Remaining slots: {maxImages - uploadedUrls.length}</p>
      </div>
    </div>
  )
}

export default ProductImageUpload

