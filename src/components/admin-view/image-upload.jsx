import { FileIcon, UploadCloudIcon, XIcon } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useEffect, useRef } from "react";
import { Button } from "../ui/button";
import axios from "axios";
import { Skeleton } from "../ui/skeleton";

function ProductImageUpload({
  imageFile,
  setImageFile,
  imageLoadingState,
  setImageLoadingState,
  uploadedImageUrl,
  setUploadedImageUrl,
  isEditMode,
  isCustomStyling = false,
}) {
  const inputRef = useRef(null);

  function handleImageFileChange(event) {
    console.log(event.target.files, "event.target.files");
    const selectedFile = event.target.files?.[0];
    console.log(selectedFile);

    if (selectedFile) setImageFile(selectedFile);
  }
  function handleDragOver(event) {
    event.preventDefault();
  }

  function handleDrop(event) {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files?.[0];
    if (droppedFile) setImageFile(droppedFile);
  }

  function handleRemoveImage() {
    setImageFile(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  async function uploadImageToCloudinary() {
    setImageLoadingState(true);
    const data = new FormData();
    data.append("my_file", imageFile);
    const response = await axios.post(
      "https://reactive-zone-backend-niuu.vercel.app/api/admin/products/upload-image",
      data
    );
    console.log(response, "response");

    if (response?.data?.success) {
      setUploadedImageUrl(response.data.result.url);
      setImageLoadingState(false);
    }
  }

  useEffect(() => {
    if (imageFile !== null) uploadImageToCloudinary();
  }, [imageFile]);

  return (
    <div
      className={`w-full  mt-4 ${isCustomStyling ? "" : "max-w-md mx-auto"}`}
    >
      <Label className="text-lg font-semibold mb-2 block">Upload Image</Label>
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`${
          isEditMode ? "opacity-60" : ""
        } border-2 border-dashed rounded-lg p-4`}
      >
        <Input
          id="image-upload"
          type="file"
          className="hidden"
          ref={inputRef}
          onChange={handleImageFileChange}
          disabled={isEditMode}
        />
        {!imageFile ? (
          <Label
            htmlFor="image-upload"
            className={`${
              isEditMode ? "cursor-not-allowed" : ""
            } flex flex-col items-center justify-center h-32 cursor-pointer`}
          >
            <UploadCloudIcon className="w-10 h-10 text-muted-foreground mb-2" />
            <span>Drag & drop or click to upload image</span>
          </Label>
        ) : imageLoadingState ? (
          <Skeleton className="h-10 bg-gray-100" />
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FileIcon className="w-8 text-primary mr-2 h-8" />
            </div>
            <p className="text-sm font-medium">{imageFile.name}</p>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground"
              onClick={handleRemoveImage}
            >
              <XIcon className="w-4 h-4" />
              <span className="sr-only">Remove File</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductImageUpload;

// import { Button } from "@/components/ui/button";
// import {
//   addFeatureImage,
//   getFeatureImages,
//   deleteFeatureImage,
//   updateFeatureImage,
// } from "@/store/common-slice";
// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";

// function AdminDashboard() {
//   const [imageFile, setImageFile] = useState(null);
//   const [uploadedImageUrl, setUploadedImageUrl] = useState("");
//   const [imageLoadingState, setImageLoadingState] = useState(false);
//   const [isEditMode, setIsEditMode] = useState(false); // New state to track edit mode
//   const [editingImageId, setEditingImageId] = useState(null); // Track the image being edited
//   const dispatch = useDispatch();
//   const { featureImageList } = useSelector((state) => state.commonFeature);

//   // Function to handle image upload and saving
//   function handleUploadFeatureImage() {
//     if (isEditMode && editingImageId) {
//       dispatch(
//         updateFeatureImage({ id: editingImageId, image: uploadedImageUrl })
//       ).then((data) => {
//         if (data?.payload?.success) {
//           dispatch(getFeatureImages());
//           resetImageState();
//         }
//       });
//     } else {
//       dispatch(addFeatureImage(uploadedImageUrl)).then((data) => {
//         if (data?.payload?.success) {
//           dispatch(getFeatureImages());
//           resetImageState();
//         }
//       });
//     }
//   }

//   // Function to handle deleting an image
//   function handleDeleteFeatureImage(imageId) {
//     dispatch(deleteFeatureImage(imageId)).then((data) => {
//       if (data?.payload?.success) {
//         dispatch(getFeatureImages());
//       }
//     });
//   }

//   // Reset image states after upload or update
//   function resetImageState() {
//     setImageFile(null);
//     setUploadedImageUrl("");
//     setIsEditMode(false);
//     setEditingImageId(null);
//   }

//   useEffect(() => {
//     dispatch(getFeatureImages());
//   }, [dispatch]);

//   return (
//     <div>
//       <ProductImageUpload
//         imageFile={imageFile}
//         setImageFile={setImageFile}
//         uploadedImageUrl={uploadedImageUrl}
//         setUploadedImageUrl={setUploadedImageUrl}
//         setImageLoadingState={setImageLoadingState}
//         imageLoadingState={imageLoadingState}
//         isCustomStyling={true}
//         isEditMode={isEditMode} // Pass down edit mode flag
//       />
//       <Button onClick={handleUploadFeatureImage} className="mt-5 w-full mb-5">
//         {isEditMode ? "Update Image" : "Upload"}
//       </Button>

//       <h1 className="text-2xl text-black">Uploaded Images..</h1>
//       <div className="grid grid-cols-4 gap-4 mt-5">
//         {featureImageList && featureImageList.length > 0
//           ? featureImageList.map((featureImgItem) => (
//               <div className="relative" key={featureImgItem.id}>
//                 <img
//                   src={featureImgItem.image}
//                   className="w-full mt-2 border-2 h-full object-cover rounded-t-lg"
//                   alt="Feature"
//                 />
//                 <div className="absolute top-0 right-0 p-2">
//                   <Button
//                     onClick={() => {
//                       setIsEditMode(true);
//                       setEditingImageId(featureImgItem.id);
//                       setUploadedImageUrl(featureImgItem.image); // Set the current image to edit
//                     }}
//                     className="mr-2"
//                   >
//                     Edit
//                   </Button>
//                   <Button
//                     onClick={() => handleDeleteFeatureImage(featureImgItem.id)}
//                     className="bg-red-500"
//                   >
//                     Delete
//                   </Button>
//                 </div>
//               </div>
//             ))
//           : null}
//       </div>
//     </div>
//   );
// }

// export default AdminDashboard;
