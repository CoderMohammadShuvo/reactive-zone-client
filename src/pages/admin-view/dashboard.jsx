// import { Button } from "@/components/ui/button";
// import ProductImageUpload from "@/components/admin-view/image-upload";
// import { addFeatureImage, getFeatureImages } from "@/store/common-slice";
// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   Card,
//   CardContent,
//   CardFooter,
//   CardHeader,
// } from "@/components/ui/card";
// import { format } from "date-fns";

// function AdminDashboard() {
//   const [imageFile, setImageFile] = useState(null);
//   const [uploadedImageUrl, setUploadedImageUrl] = useState("");
//   const [imageLoadingState, setImageLoadingState] = useState(false);
//   const dispatch = useDispatch();
//   const { featureImageList } = useSelector((state) => state.commonFeature);

//   console.log(uploadedImageUrl, "uploadedImageUrl");

//   function handleUploadFeatureImage() {
//     dispatch(addFeatureImage(uploadedImageUrl)).then((data) => {
//       if (data?.payload?.success) {
//         dispatch(getFeatureImages());
//         setImageFile(null);
//         setUploadedImageUrl("");
//       }
//     });
//   }

//   function handleEditImage(imageId) {
//     // Handle image edit logic here
//     console.log("Edit clicked for image ID:", imageId);
//   }

//   function handleDeleteImage(imageId) {
//     // Handle image delete logic here
//     console.log("Delete clicked for image ID:", imageId);
//   }

//   useEffect(() => {
//     dispatch(getFeatureImages());
//   }, [dispatch]);

//   console.log(featureImageList, "featureImageList");

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
//       />
//       <Button
//         onClick={handleUploadFeatureImage}
//         className={`mt-5 mb-5 ${
//           imageFile ? "hover:bg-green-700" : "cursor-not-allowed opacity-50"
//         }`}
//         disabled={!imageFile}
//       >
//         Upload
//       </Button>
//       <div className="flex flex-col gap-4 mt-5">
//         <h1 className="text-4xl font-semibold text-black">Uploaded Images..</h1>
//         {featureImageList && featureImageList.length > 0 ? (
//           featureImageList.map((featureImgItem) => (
//             <Card key={featureImgItem.id} className="relative">
//               <CardHeader>
//                 <h3 className="text-lg font-bold">Image Uploaded At..</h3>
//                 <p>
//                   {format(
//                     new Date(featureImgItem.createdAt),
//                     "dd/MM/yyyy hh:mm a"
//                   )}
//                 </p>
//               </CardHeader>
//               <CardContent>
//                 <img
//                   src={featureImgItem.image}
//                   alt={`Feature Image ${featureImgItem.id}`}
//                   className="w-full mt-2 border-2 h-full object-cover rounded-lg"
//                 />
//               </CardContent>
//               <CardFooter className="flex justify-end gap-2">
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={() => handleEditImage(featureImgItem.id)}
//                 >
//                   Edit
//                 </Button>
//                 <Button
//                   variant="destructive"
//                   size="sm"
//                   onClick={() => handleDeleteImage(featureImgItem.id)}
//                 >
//                   Delete
//                 </Button>
//               </CardFooter>
//             </Card>
//           ))
//         ) : (
//           <p className="text-gray-500">No images uploaded yet.</p>
//         )}
//       </div>
//     </div>
//   );
// }

// export default AdminDashboard;

import { Button } from "@/components/ui/button";
import ProductImageUpload from "@/components/admin-view/image-upload";
import {
  addFeatureImage,
  getFeatureImages,
  updateFeatureImage,
  deleteFeatureImage,
} from "@/store/common-slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { format } from "date-fns";

function AdminDashboard() {
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);

  const dispatch = useDispatch();
  const { featureImageList } = useSelector((state) => state.commonFeature);

  console.log(uploadedImageUrl, "uploadedImageUrl");

  function handleUploadFeatureImage() {
    {
      // Add a new image
      dispatch(addFeatureImage(uploadedImageUrl)).then((data) => {
        if (data?.payload?.success) {
          dispatch(getFeatureImages());
          resetUploadState();
        }
      });
    }
  }

  function handleDeleteImage(imageId) {
    dispatch(deleteFeatureImage(imageId)).then((data) => {
      if (data?.payload?.success) {
        dispatch(getFeatureImages());
        resetUploadState();
      }
    });
  }

  function resetUploadState() {
    setImageFile(null);
    setUploadedImageUrl("");
  }

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  console.log(featureImageList, "featureImageList");

  return (
    <div>
      <ProductImageUpload
        imageFile={imageFile}
        setImageFile={setImageFile}
        uploadedImageUrl={uploadedImageUrl}
        setUploadedImageUrl={setUploadedImageUrl}
        setImageLoadingState={setImageLoadingState}
        imageLoadingState={imageLoadingState}
        isCustomStyling={true}
      />
      <Button
        onClick={handleUploadFeatureImage}
        className={`mt-5 mb-5 ${
          uploadedImageUrl
            ? "hover:bg-green-700"
            : "cursor-not-allowed opacity-50"
        }`}
        disabled={!uploadedImageUrl}
      >
        Upload
      </Button>
      <div className="flex flex-col gap-4 mt-5">
        <h1 className="text-4xl font-semibold text-black">Uploaded Images..</h1>
        {featureImageList && featureImageList.length > 0 ? (
          featureImageList.map((featureImgItem) => (
            <Card key={featureImgItem.id} className="relative">
              <CardHeader>
                <h3 className="text-lg font-bold">Image Uploaded At..</h3>
                <p>
                  {format(
                    new Date(featureImgItem.createdAt),
                    "dd/MM/yyyy hh:mm a"
                  )}
                </p>
              </CardHeader>
              <CardContent>
                <img
                  src={featureImgItem.image}
                  alt={`Feature Image ${featureImgItem?._id}`}
                  className="w-full mt-2 border-2 h-full object-cover rounded-lg"
                />
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteImage(featureImgItem?._id)}
                >
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <p className="text-gray-500">No images uploaded yet.</p>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
