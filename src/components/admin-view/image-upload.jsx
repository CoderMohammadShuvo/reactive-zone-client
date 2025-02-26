"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { FileIcon, UploadCloudIcon, XIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import axios from "axios"

function ProductImageUpload({
  imageFile,
  setImageFile,
  imageLoadingState,
  setImageLoadingState,
  uploadedImageUrl,
  setUploadedImageUrl,
  isEditMode,
  isCustomStyling = false,
  maxImages = 4,
  onMultipleUploadComplete,
}) {
  const inputRef = useRef(null)
  const [imageFiles, setImageFiles] = useState(imageFile ? [imageFile] : [])
  const [imageLoadingStates, setImageLoadingStates] = useState(imageLoadingState ? [imageLoadingState] : [])
  const [uploadedImageUrls, setUploadedImageUrls] = useState(uploadedImageUrl ? [uploadedImageUrl] : [])
  const [isUploading, setIsUploading] = useState(false)

  function handleImageFileChange(event) {
    const selectedFiles = Array.from(event.target.files || [])
    console.log("Selected files:", selectedFiles)
    addNewFiles(selectedFiles)
  }

  function handleDragOver(event) {
    event.preventDefault()
  }

  function handleDrop(event) {
    event.preventDefault()
    const droppedFiles = Array.from(event.dataTransfer.files || [])
    console.log("Dropped files:", droppedFiles)
    addNewFiles(droppedFiles)
  }

  function addNewFiles(newFiles) {
    const remainingSlots = maxImages - imageFiles.length
    const filesToAdd = newFiles.slice(0, remainingSlots)

    setImageFiles((prevFiles) => [...prevFiles, ...filesToAdd])
    setImageLoadingStates((prevStates) => [...prevStates, ...filesToAdd.map(() => true)])
    setUploadedImageUrls((prevUrls) => [...prevUrls, ...filesToAdd.map(() => null)])
    setIsUploading(true)

    if (filesToAdd.length > 0) {
      setImageFile(filesToAdd[0])
      setImageLoadingState(true)
    }
  }

  function handleRemoveImage(index) {
    setImageFiles((prevFiles) => prevFiles.filter((_, i) => i !== index))
    setImageLoadingStates((prevStates) => prevStates.filter((_, i) => i !== index))
    setUploadedImageUrls((prevUrls) => {
      const newUrls = prevUrls.filter((_, i) => i !== index)
      if (onMultipleUploadComplete) {
        const validUrls = newUrls.filter((url) => url !== null)
        onMultipleUploadComplete(validUrls)
      }
      return newUrls
    })

    if (index === 0) {
      setImageFile(null)
      setImageLoadingState(false)
      setUploadedImageUrl("")
    }
  }

  const uploadImageToCloudinary = useCallback(
    async (file, index) => {
      setImageLoadingStates((prevStates) => {
        const newStates = [...prevStates]
        newStates[index] = true
        return newStates
      })

      const data = new FormData()
      data.append("my_file", file)

      try {
        const response = await axios.post(
          "https://reactive-zone-backend.vercel.app/api/admin/products/upload-image",
          data,
        )

        if (response?.data?.success) {
          setUploadedImageUrls((prevUrls) => {
            const newUrls = [...prevUrls]
            newUrls[index] = response.data.result.url

            const allUploaded = newUrls.every((url) => url !== null)
            if (allUploaded && onMultipleUploadComplete) {
              const validUrls = newUrls.filter((url) => url !== null)
              onMultipleUploadComplete(validUrls)
              setIsUploading(false)
            }

            return newUrls
          })

          if (index === 0) {
            setUploadedImageUrl(response.data.result.url)
          }
        }
      } catch (error) {
        console.error("Error uploading image:", error)
        setImageFiles((prev) => prev.filter((_, i) => i !== index))
        setUploadedImageUrls((prev) => prev.filter((_, i) => i !== index))
        setImageLoadingStates((prev) => prev.filter((_, i) => i !== index))
        setIsUploading(false)
      } finally {
        setImageLoadingStates((prevStates) => {
          const newStates = [...prevStates]
          newStates[index] = false
          return newStates
        })

        if (index === 0) {
          setImageLoadingState(false)
        }
      }
    },
    [setImageLoadingState, setUploadedImageUrl, onMultipleUploadComplete],
  )

  useEffect(() => {
    if (!isUploading) return

    const pendingUploads = imageFiles.filter((_, index) => uploadedImageUrls[index] === null)

    pendingUploads.forEach((file, index) => {
      const originalIndex = imageFiles.indexOf(file)
      uploadImageToCloudinary(file, originalIndex)
    })
  }, [imageFiles, uploadedImageUrls, uploadImageToCloudinary, isUploading])

  return (
    <div className={`w-full mt-4 ${isCustomStyling ? "" : "max-w-md mx-auto"}`}>
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
          disabled={isEditMode || imageFiles.length >= maxImages}
          accept="image/*"
        />
        {imageFiles.length === 0 ? (
          <Label
            htmlFor="image-upload"
            className={`${
              isEditMode || imageFiles.length >= maxImages ? "cursor-not-allowed" : "cursor-pointer"
            } flex flex-col items-center justify-center h-32`}
          >
            <UploadCloudIcon className="w-10 h-10 text-muted-foreground mb-2" />
            <span>Drag & drop or click to upload images</span>
            <span className="text-sm text-muted-foreground mt-2">(Max {maxImages} images)</span>
          </Label>
        ) : (
          <div className="space-y-2">
            {imageFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <FileIcon className="w-8 text-primary mr-2 h-8" />
                  <div className="flex flex-col">
                    <p className="text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {uploadedImageUrls[index] ? "Uploaded" : "Uploading..."}
                    </p>
                  </div>
                </div>
                {imageLoadingStates[index] ? (
                  <Skeleton className="h-8 w-8 bg-gray-100" />
                ) : (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-foreground"
                    onClick={() => handleRemoveImage(index)}
                  >
                    <XIcon className="w-4 h-4" />
                    <span className="sr-only">Remove File</span>
                  </Button>
                )}
              </div>
            ))}
            {imageFiles.length < maxImages && (
              <Label
                htmlFor="image-upload"
                className="flex items-center justify-center h-12 border-2 border-dashed rounded-lg cursor-pointer"
              >
                <UploadCloudIcon className="w-6 h-6 text-muted-foreground mr-2" />
                <span>Add more images</span>
              </Label>
            )}
          </div>
        )}
      </div>

      {/* Debug Information */}
      <div className="mt-4 text-xs text-muted-foreground">
        <p>Total files: {imageFiles.length}</p>
        <p>Uploaded URLs: {uploadedImageUrls.filter(Boolean).length}</p>
        <p>Loading states: {imageLoadingStates.filter(Boolean).length} active</p>
      </div>
    </div>
  )
}

export default ProductImageUpload

