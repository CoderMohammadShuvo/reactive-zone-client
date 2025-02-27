// import { useState, useRef } from "react";
// import CommonForm from "../common/form";
// import { DialogContent } from "../ui/dialog";
// import { Label } from "../ui/label";
// import { Separator } from "../ui/separator";
// import { Badge } from "../ui/badge";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   getAllOrdersForAdmin,
//   getOrderDetailsForAdmin,
//   updateOrderStatus,
// } from "@/store/admin/order-slice";
// import { useToast } from "@/hooks/use-toast";
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";

// const initialFormData = {
//   status: "",
// };

// function AdminSalesDetailsView({ orderDetails }) {
//   const [formData, setFormData] = useState(initialFormData);
//   const { user } = useSelector((state) => state.auth);
//   const dispatch = useDispatch();
//   const { toast } = useToast();
//   const pageRef = useRef();

//   function handleUpdateStatus(event) {
//     event.preventDefault();
//     const { status } = formData;

//     dispatch(
//       updateOrderStatus({ id: orderDetails?._id, orderStatus: status })
//     ).then((data) => {
//       if (data?.payload?.success) {
//         dispatch(getOrderDetailsForAdmin(orderDetails?._id));
//         dispatch(getAllOrdersForAdmin());
//         setFormData(initialFormData);
//         toast({
//           title: data?.payload?.message,
//         });
//       }
//     });
//   }

//   const downloadPDF = async () => {
//     const element = pageRef.current;
//     const canvas = await html2canvas(element);
//     const imgData = canvas.toDataURL("image/png");
//     const pdf = new jsPDF();
//     const imgWidth = 190; // Adjust for page size
//     const pageHeight = 297; // A4 dimensions in mm
//     const imgHeight = (canvas.height * imgWidth) / canvas.width;
//     let position = 0;

//     pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
//     pdf.save("Admin_Order_Details.pdf");
//   };

//   return (
//     <DialogContent className="sm:max-w-[600px]">
//       <div ref={pageRef} className="grid gap-6">
//         <div className="grid gap-2">
//           <div className="flex mt-6 items-center justify-between">
//             <p className="font-medium">Order ID</p>
//             <Label>{orderDetails?._id}</Label>
//           </div>
//           <div className="flex mt-2 items-center justify-between">
//             <p className="font-medium">Order Date</p>
//             <Label>{orderDetails?.orderDate.split("T")[0]}</Label>
//           </div>
//           <div className="flex mt-2 items-center justify-between">
//             <p className="font-medium">Order Price</p>
//             <Label>${orderDetails?.totalAmount}</Label>
//           </div>
//           <div className="flex mt-2 items-center justify-between">
//             <p className="font-medium">Payment method</p>
//             <Label>{orderDetails?.paymentMethod}</Label>
//           </div>
//           <div className="flex mt-2 items-center justify-between">
//             <p className="font-medium">Payment Status</p>
//             <Label>{orderDetails?.paymentStatus}</Label>
//           </div>
//           <div className="flex mt-2 items-center justify-between">
//             <p className="font-medium">Order Status</p>
//             <Label>
//               <Badge
//                 className={`py-1 px-3 ${
//                   orderDetails?.orderStatus === "confirmed"
//                     ? "bg-green-500"
//                     : orderDetails?.orderStatus === "rejected"
//                     ? "bg-red-600"
//                     : orderDetails?.orderStatus === "inProcess"
//                     ? "bg-yellow-600"
//                     : orderDetails?.orderStatus === "delivered"
//                     ? "bg-blue-600"
//                     : "bg-black"
//                 }`}
//               >
//                 {orderDetails?.orderStatus}
//               </Badge>
//             </Label>
//           </div>
//         </div>
//         <Separator />
//         <div className="grid gap-4">
//           <div className="grid gap-2">
//             <div className="font-medium">Order Details</div>
//             <ul className="grid gap-3">
//               {orderDetails?.cartItems && orderDetails?.cartItems.length > 0
//                 ? orderDetails?.cartItems.map((item) => (
//                     <li
//                       key={item.title}
//                       className="flex items-center justify-between"
//                     >
//                       <span>Title: {item.title}</span>
//                       <span>Quantity: {item.quantity}</span>
//                       <span>Price: ${item.price}</span>
//                     </li>
//                   ))
//                 : null}
//             </ul>
//           </div>
//         </div>
//         <div className="grid gap-4">
//           <div className="grid gap-2">
//             <div className="font-medium">Shipping Info</div>
//             <div className="grid gap-0.5 text-muted-foreground">
//               {/* <span>{user.userName}</span> */}
//               <span>{orderDetails?.addressInfo?.address}</span>
//               <span>{orderDetails?.addressInfo?.city}</span>
//               <span>{orderDetails?.addressInfo?.pincode}</span>
//               <span>{orderDetails?.addressInfo?.phone}</span>
//               <span>{orderDetails?.addressInfo?.notes}</span>
//             </div>
//           </div>
//         </div>
//         <div>
//           <CommonForm
//             formControls={[
//               {
//                 label: "Order Status",
//                 name: "status",
//                 componentType: "select",
//                 options: [
//                   { id: "pending", label: "Pending" },
//                   { id: "inProcess", label: "In Process" },
//                   { id: "inShipping", label: "In Shipping" },
//                   { id: "delivered", label: "Delivered" },
//                   { id: "rejected", label: "Rejected" },
//                 ],
//               },
//             ]}
//             formData={formData}
//             setFormData={setFormData}
//             buttonText={"Update Order Status"}
//             onSubmit={handleUpdateStatus}
//           />
//         </div>
//         <button
//           onClick={downloadPDF}
//           className="mt-4 py-2 px-4 rounded bg-blue-500 text-white"
//         >
//           Download Order Details PDF
//         </button>
//       </div>
//     </DialogContent>
//   );
// }

// export default AdminSalesDetailsView;

"use client";

import { useState, useRef } from "react";
import axios from "axios";
import CommonForm from "../common/form";
import { DialogContent } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const initialFormData = {
  status: "",
};

function AdminSalesDetailsView({ saleDetails }) {
  // Changed from orderId to saleDetails
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState(initialFormData);
  const { toast } = useToast();
  const pageRef = useRef();

  // Remove the useEffect since we're now receiving saleDetails directly

  // Update Order Status
  async function handleUpdateStatus(event) {
    event.preventDefault();
    const { status } = formData;

    try {
      setLoading(true);
      const response = await axios.put(
        `https://reactive-zone-backend.vercel.app/api/admin/orders/update/${saleDetails._id}`,
        {
          orderStatus: status,
        }
      );

      if (response.data.success) {
        toast({ title: response.data.message });
        setFormData(initialFormData);
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      toast({
        title: "Error updating status",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  // Download Order Details as PDF
  const downloadPDF = async () => {
    try {
      const element = pageRef.current;
      if (!element) return;

      const canvas = await html2canvas(element);
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      const imgWidth = 190;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 10, 0, imgWidth, imgHeight);
      pdf.save("Sale_Details.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: "Error generating PDF",
        variant: "destructive",
      });
    }
  };

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  if (!saleDetails) {
    return <div className="p-4">No sale details available</div>;
  }

  return (
    <DialogContent className="sm:max-w-[600px]">
      <div ref={pageRef} className="grid gap-6">
        <div className="grid gap-2">
          <div className="flex mt-6 items-center justify-between">
            <p className="font-medium">Sale ID</p>
            <Label>{saleDetails._id}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Sale Date</p>
            <Label>
              {new Date(saleDetails.createdAt).toLocaleDateString()}
            </Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Total Amount</p>
            <Label>${saleDetails.total}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Payment Method</p>
            <Label>{saleDetails.paymentMethod}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Status</p>
            <Label>
              <Badge
                className={`py-1 px-3 ${
                  saleDetails.status === "confirmed"
                    ? "bg-green-500"
                    : saleDetails.status === "rejected"
                    ? "bg-red-600"
                    : saleDetails.status === "inProcess"
                    ? "bg-yellow-600"
                    : saleDetails.status === "delivered"
                    ? "bg-blue-600"
                    : "bg-black"
                }`}
              >
                {saleDetails.status}
              </Badge>
            </Label>
          </div>
        </div>
        <Separator />
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="font-medium">Products</div>
            <ul className="grid gap-3">
              {saleDetails.products?.map((item, index) => (
                <li key={index} className="flex items-center justify-between">
                  <span>Name: {item.name}</span>
                  <span>Quantity: {item.quantity || 1}</span>
                  <span>Price: ${item.price}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="font-medium">Shipping Information</div>
            <div className="grid gap-0.5 text-muted-foreground">
              <span>{saleDetails.addressInfo?.address}</span>
              <span>{saleDetails.addressInfo?.city}</span>
              <span>{saleDetails.addressInfo?.district}</span>
              <span>{saleDetails.addressInfo?.postcode}</span>
              <span>{saleDetails.addressInfo?.phone}</span>
              <span>{saleDetails.addressInfo?.notes}</span>
            </div>
          </div>
        </div>
        <div>
          <CommonForm
            formControls={[
              {
                label: "Sale Status",
                name: "status",
                componentType: "select",
                options: [
                  { id: "pending", label: "Pending" },
                  { id: "inProcess", label: "In Process" },
                  { id: "inShipping", label: "In Shipping" },
                  { id: "delivered", label: "Delivered" },
                  { id: "rejected", label: "Rejected" },
                ],
              },
            ]}
            formData={formData}
            setFormData={setFormData}
            buttonText="Update Status"
            onSubmit={handleUpdateStatus}
            disabled={loading}
          />
        </div>
        <button
          onClick={downloadPDF}
          className="mt-4 py-2 px-4 rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors disabled:opacity-50"
          disabled={loading}
        >
          Download Sale Details PDF
        </button>
      </div>
    </DialogContent>
  );
}

export default AdminSalesDetailsView;
