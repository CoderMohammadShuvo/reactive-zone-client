import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Label } from "../ui/label";
import { useSelector } from "react-redux";

function AddressCard({
  addressInfo,
  handleDeleteAddress,
  handleEditAddress,
  setCurrentSelectedAddress,
  selectedId,
}) {
  // Get the logged-in user's email from Redux
  const { user } = useSelector((state) => state.auth);
  const userEmail = user?.email;
  const userName = user?.userName;

  return (
    <Card
      onClick={
        setCurrentSelectedAddress
          ? () => setCurrentSelectedAddress(addressInfo)
          : null
      }
      className={`cursor-pointer border-red-700 ${
        selectedId?._id === addressInfo?._id
          ? "border-red-900 border-[4px]"
          : "border-black"
      }`}
    >
      <CardContent className={"grid p-4 gap-4"}>
        <Label>fullName: {userName}</Label>
        <Label>Address: {addressInfo?.address}</Label>
        <Label>City: {addressInfo?.city}</Label>
        <Label>Pincode: {addressInfo?.pincode}</Label>
        <Label>Phone: {addressInfo?.phone}</Label>
        <Label>Notes: {addressInfo?.notes}</Label>
        <Label>Email: {userEmail}</Label> {/* Display the user's email */}
      </CardContent>
      <CardFooter className="p-3 flex justify-between">
        <Button onClick={() => handleEditAddress(addressInfo)}>Edit</Button>
        <Button onClick={() => handleDeleteAddress(addressInfo)}>Delete</Button>
      </CardFooter>
    </Card>
  );
}

export default AddressCard;

// import { useNavigate } from "react-router-dom"; // Use `useNavigate` instead of `Navigate`
// import { Button } from "../ui/button";
// import { Card, CardContent, CardFooter } from "../ui/card";
// import { Label } from "../ui/label";
// import { useSelector } from "react-redux";

// function AddressCard({
//   addressInfo,
//   handleDeleteAddress,
//   handleEditAddress,
//   setCurrentSelectedAddress,
//   selectedId,
// }) {
//   // Get the logged-in user's email from Redux
//   const { user } = useSelector((state) => state.auth);
//   const userEmail = user?.email;
//   const navigate = useNavigate(); // Correct hook for navigation

//   const handleSuccessNavigation = () => {
//     navigate("/shop/payment-success");
//   };

//   return (
//     <Card
//       onClick={
//         setCurrentSelectedAddress
//           ? () => setCurrentSelectedAddress(addressInfo)
//           : null
//       }
//       className={`cursor-pointer border-red-700 ${
//         selectedId?._id === addressInfo?._id
//           ? "border-red-900 border-[4px]"
//           : "border-black"
//       }`}
//     >
//       <CardContent className="grid p-4 gap-4">
//         <Label>Address: {addressInfo?.address}</Label>
//         <Label>City: {addressInfo?.city}</Label>
//         <Label>Pincode: {addressInfo?.pincode}</Label>
//         <Label>Phone: {addressInfo?.phone}</Label>
//         <Label>Notes: {addressInfo?.notes}</Label>
//         <Label>Email: {userEmail}</Label> {/* Display the user's email */}
//       </CardContent>
//       <CardFooter className="p-3 flex justify-between">
//         <Button onClick={() => handleEditAddress(addressInfo)}>Edit</Button>
//         <Button onClick={() => handleDeleteAddress(addressInfo)}>Delete</Button>
//       </CardFooter>
//       <Button onClick={handleSuccessNavigation}>Success</Button>
//     </Card>
//   );
// }

// export default AddressCard;
