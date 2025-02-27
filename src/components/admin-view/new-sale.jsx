// "use client";

// import { useState, useEffect } from "react";
// import axios from "axios";
// import { Search, Trash2 } from "lucide-react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";

// function AdminSalesCreateView() {
//   const [products, setProducts] = useState([]);
//   const [selectedProducts, setSelectedProducts] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [saleDetails, setSaleDetails] = useState({
//     paidAmount: "",
//     discount: "",
//     paymentMethod: "cash",
//   });

//   // Fetch products from API
//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   const fetchProducts = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get(
//         "https://reactive-zone-backend.vercel.app/api/admin/products/get"
//       );
//       if (response.data?.success) {
//         setProducts(response.data.data);
//       }
//     } catch (error) {
//       console.error("Error fetching products:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle product selection
//   const handleProductSelect = (productId) => {
//     const product = products.find((p) => p._id === productId);
//     if (product) {
//       const existingProduct = selectedProducts.find((p) => p._id === productId);
//       if (existingProduct) {
//         // If product already exists, increase quantity
//         setSelectedProducts(
//           selectedProducts.map((p) =>
//             p._id === productId
//               ? {
//                   ...p,
//                   quantity: p.quantity + 1,
//                   total: (p.quantity + 1) * p.price,
//                 }
//               : p
//           )
//         );
//       } else {
//         // Add new product with quantity 1
//         setSelectedProducts([
//           ...selectedProducts,
//           { ...product, quantity: 1, total: product.price },
//         ]);
//       }
//     }
//   };

//   // Handle quantity change
//   const handleQuantityChange = (productId, newQuantity) => {
//     if (newQuantity >= 0) {
//       setSelectedProducts(
//         selectedProducts.map((p) =>
//           p._id === productId
//             ? { ...p, quantity: newQuantity, total: newQuantity * p.price }
//             : p
//         )
//       );
//     }
//   };

//   // Handle product removal
//   const handleRemoveProduct = (productId) => {
//     setSelectedProducts(selectedProducts.filter((p) => p._id !== productId));
//   };

//   // handle Complete Sale API
//   const handleCompleteSale = async () => {
//     if (selectedProducts.length === 0) {
//       alert("Please select at least one product.");
//       return;
//     }

//     const saleData = {
//       invoiceId: "INV002",
//       userName: "halim",
//       addressInfo: {
//         address: "123 Main St",
//         city: "New Jersy",
//         district: "NY",
//         postcode: "10002",
//         phone: "123-456-7890",
//         notes: "Deliver during business hours",
//       },

//       products: selectedProducts.map((product) => ({
//         // productId: product._id,
//         // quantity: product.quantity,
//         name: product.title,
//         // price: product.price,
//         price: product.total,

//         // total: product.total,
//       })),
//       // subtotal,
//       discount,
//       total,
//       paidAmount: saleDetails.paidAmount,
//       // paymentMethod: saleDetails.paymentMethod,
//       grossTotal: total,
//       grossTotalRound: total,

//       totalRecievable: total,

//       totalRecieved: saleDetails.paidAmount,
//       status: "ACTIVE",
//     };

//     try {
//       setLoading(true);
//       const response = await axios.post(
//         "https://reactive-zone-backend.vercel.app/api/admin/sales/create",
//         saleData
//       );
//       console.log(response.data);
//       if (response.data) {
//         alert("Sale completed successfully!");
//         setSelectedProducts([]);
//         setSaleDetails({ paidAmount: "", discount: "", paymentMethod: "cash" });
//       } else {
//         alert("Failed to complete the sale.");
//       }
//     } catch (error) {
//       console.error("Error completing sale:", error);
//       alert("An error occurred. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Calculate totals
//   const subtotal = selectedProducts.reduce(
//     (sum, product) => sum + product.total,
//     0
//   );
//   const discount = Number.parseFloat(saleDetails.discount) || 0;
//   const total = subtotal - discount;

//   // Filter products based on search term
//   const filteredProducts = products.filter((product) =>
//     product.title.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//       {/* Left Column - Product Selection */}
//       <Card className="md:col-span-2">
//         <CardHeader className="flex flex-row justify-between items-center">
//           <CardTitle>Select Products</CardTitle>
//           <div className="relative w-64">
//             <Search className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
//             <Input
//               placeholder="Search products..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="pl-8"
//             />
//           </div>
//         </CardHeader>
//         <CardContent>
//           <div className="h-[400px] overflow-y-auto border rounded-lg p-4">
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//               {loading ? (
//                 <p>Loading products...</p>
//               ) : (
//                 filteredProducts.map((product) => (
//                   <div
//                     key={product._id}
//                     className="border rounded-lg p-4 cursor-pointer hover:bg-accent transition-colors"
//                     onClick={() => handleProductSelect(product._id)}
//                   >
//                     <img
//                       src={product.image || "/placeholder.svg"}
//                       alt={product.title}
//                       className="w-full h-32 object-cover rounded-md mb-2"
//                     />
//                     <h3 className="font-medium truncate">{product.title}</h3>
//                     <p className="text-sm text-muted-foreground">
//                       Stock: {product.totalStock}
//                     </p>
//                     <p className="font-semibold">${product.price}</p>
//                   </div>
//                 ))
//               )}
//             </div>
//           </div>

//           {/* Selected Products Table */}
//           <div className="mt-6">
//             <h3 className="font-semibold mb-4">Selected Products</h3>
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Product</TableHead>
//                   <TableHead>Price</TableHead>
//                   <TableHead>Quantity</TableHead>
//                   <TableHead>Total</TableHead>
//                   <TableHead>Action</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {selectedProducts.map((product) => (
//                   <TableRow key={product._id}>
//                     <TableCell>{product.title}</TableCell>
//                     <TableCell>${product.price}</TableCell>
//                     <TableCell>
//                       <div className="flex items-center gap-2">
//                         <Button
//                           variant="outline"
//                           size="sm"
//                           onClick={() =>
//                             handleQuantityChange(
//                               product._id,
//                               product.quantity - 1
//                             )
//                           }
//                         >
//                           -
//                         </Button>
//                         <span>{product.quantity}</span>
//                         <Button
//                           variant="outline"
//                           size="sm"
//                           onClick={() =>
//                             handleQuantityChange(
//                               product._id,
//                               product.quantity + 1
//                             )
//                           }
//                         >
//                           +
//                         </Button>
//                       </div>
//                     </TableCell>
//                     <TableCell>${product.total}</TableCell>
//                     <TableCell>
//                       <Button
//                         variant="ghost"
//                         size="sm"
//                         onClick={() => handleRemoveProduct(product._id)}
//                       >
//                         <Trash2 className="h-4 w-4" />
//                       </Button>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Right Column - Payment Details */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Payment Details</CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <div>
//             <label className="text-sm font-medium">Payment Method</label>
//             <Select
//               value={saleDetails.paymentMethod}
//               onValueChange={(value) =>
//                 setSaleDetails({ ...saleDetails, paymentMethod: value })
//               }
//             >
//               <SelectTrigger>
//                 <SelectValue placeholder="Select payment method" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectGroup>
//                   <SelectItem value="cash">Cash</SelectItem>
//                   <SelectItem value="card">Card</SelectItem>
//                   <SelectItem value="bkash">Bkash</SelectItem>
//                   <SelectItem value="nagad">Nagad</SelectItem>
//                 </SelectGroup>
//               </SelectContent>
//             </Select>
//           </div>

//           <div>
//             <label className="text-sm font-medium">Paid Amount</label>
//             <Input
//               type="number"
//               value={saleDetails.paidAmount}
//               onChange={(e) =>
//                 setSaleDetails({ ...saleDetails, paidAmount: e.target.value })
//               }
//               placeholder="Enter paid amount"
//             />
//           </div>

//           <div>
//             <label className="text-sm font-medium">Discount</label>
//             <Input
//               type="number"
//               value={saleDetails.discount}
//               onChange={(e) =>
//                 setSaleDetails({ ...saleDetails, discount: e.target.value })
//               }
//               placeholder="Enter discount amount"
//             />
//           </div>

//           <div className="pt-4 border-t">
//             <div className="flex justify-between mb-2">
//               <span>Subtotal:</span>
//               <span>${subtotal}</span>
//             </div>
//             <div className="flex justify-between mb-2">
//               <span>Discount:</span>
//               <span>${discount}</span>
//             </div>
//             <div className="flex justify-between font-bold">
//               <span>Total:</span>
//               <span>${total}</span>
//             </div>
//           </div>

//           <Button
//             className="w-full"
//             size="lg"
//             // onClick={() => {
//             // }}
//             onClick={handleCompleteSale}
//           >
//             Complete Sale
//           </Button>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

// export default AdminSalesCreateView;

"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Search, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useNavigate } from "react-router-dom";

function AdminSalesCreateView() {
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigateTo = useNavigate();
  const [saleDetails, setSaleDetails] = useState({
    paidAmount: "",
    discount: "",
    paymentMethod: "cash",
  });
  const [dynamicFields, setDynamicFields] = useState([{ key: "", value: "" }]);
  const [invoiceDetails, setInvoiceDetails] = useState({
    invoiceId: "INV002",
    userName: "",
    status: "ACTIVE",
    addressInfo: {
      address: "",
      city: "",
      district: "",
      postcode: "",
      phone: "",
      notes: "",
    },
  });

  // Fetch products from API
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://reactive-zone-backend.vercel.app/api/admin/products/get"
      );
      if (response.data?.success) {
        setProducts(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle product selection
  const handleProductSelect = (productId) => {
    const product = products.find((p) => p._id === productId);
    if (product) {
      const existingProduct = selectedProducts.find((p) => p._id === productId);
      if (existingProduct) {
        // If product already exists, increase quantity
        setSelectedProducts(
          selectedProducts.map((p) =>
            p._id === productId
              ? {
                  ...p,
                  quantity: p.quantity + 1,
                  total: (p.quantity + 1) * p.price,
                }
              : p
          )
        );
      } else {
        // Add new product with quantity 1
        setSelectedProducts([
          ...selectedProducts,
          { ...product, quantity: 1, total: product.price },
        ]);
      }
    }
  };

  // Handle quantity change
  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity >= 0) {
      setSelectedProducts(
        selectedProducts.map((p) =>
          p._id === productId
            ? { ...p, quantity: newQuantity, total: newQuantity * p.price }
            : p
        )
      );
    }
  };

  // Handle product removal
  const handleRemoveProduct = (productId) => {
    setSelectedProducts(selectedProducts.filter((p) => p._id !== productId));
  };

  // Handle dynamic field key change
  const handleDynamicFieldKeyChange = (index, newKey) => {
    const updatedFields = [...dynamicFields];
    updatedFields[index].key = newKey;
    setDynamicFields(updatedFields);
  };

  // Handle dynamic field value change
  const handleDynamicFieldValueChange = (index, newValue) => {
    const updatedFields = [...dynamicFields];
    updatedFields[index].value = newValue;
    setDynamicFields(updatedFields);
  };

  // Add new dynamic field
  const addDynamicField = () => {
    setDynamicFields([...dynamicFields, { key: "", value: "" }]);
  };

  // Remove dynamic field
  const removeDynamicField = (index) => {
    const updatedFields = [...dynamicFields];
    updatedFields.splice(index, 1);
    setDynamicFields(updatedFields);
  };

  // handle Complete Sale API

  const handleCompleteSale = async () => {
    if (selectedProducts.length === 0) {
      alert("Please select at least one product.");
      return;
    }

    const saleData = {
      ...invoiceDetails, // This spreads invoiceId, userName, addressInfo, and status
      products: selectedProducts.map((product) => ({
        name: product.title,
        price: product.total,
      })),
      discount,
      total,
      paidAmount: saleDetails.paidAmount,
      grossTotal: total,
      grossTotalRound: total,
      totalRecievable: total,
      totalRecieved: saleDetails.paidAmount,
    };

    try {
      setLoading(true);
      const response = await axios.post(
        "https://reactive-zone-backend.vercel.app/api/admin/sales/create",
        saleData
      );
      console.log(response.data);
      if (response.data) {
        alert("Sale completed successfully!");
        navigateTo("/admin/sales");
        setSelectedProducts([]);
        setSaleDetails({ paidAmount: "", discount: "", paymentMethod: "cash" });
        setInvoiceDetails({
          invoiceId: "INV002",
          userName: "",
          status: "ACTIVE",
          addressInfo: {
            address: "",
            city: "",
            district: "",
            postcode: "",
            phone: "",
            notes: "",
          },
        });
      } else {
        alert("Failed to complete the sale.");
      }
    } catch (error) {
      console.error("Error completing sale:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Calculate totals
  const subtotal = selectedProducts.reduce(
    (sum, product) => sum + product.total,
    0
  );
  const discount = Number.parseFloat(saleDetails.discount) || 0;
  const total = subtotal - discount;

  // Filter products based on search term
  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Left Column - Product Selection */}
      <Card className="md:col-span-2">
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle>Select Products</CardTitle>
          <div className="relative w-64">
            <Search className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] overflow-y-auto border rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {loading ? (
                <p>Loading products...</p>
              ) : (
                filteredProducts.map((product) => (
                  <div
                    key={product._id}
                    className="border rounded-lg p-4 cursor-pointer hover:bg-accent transition-colors"
                    onClick={() => handleProductSelect(product._id)}
                  >
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.title}
                      className="w-full h-32 object-cover rounded-md mb-2"
                    />
                    <h3 className="font-medium truncate">{product.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      Stock: {product.totalStock}
                    </p>
                    <p className="font-semibold">${product.price}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Selected Products Table */}
          <div className="mt-6">
            <h3 className="font-semibold mb-4">Selected Products</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedProducts.map((product) => (
                  <TableRow key={product._id}>
                    <TableCell>{product.title}</TableCell>
                    <TableCell>${product.price}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleQuantityChange(
                              product._id,
                              product.quantity - 1
                            )
                          }
                        >
                          -
                        </Button>
                        <span>{product.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleQuantityChange(
                              product._id,
                              product.quantity + 1
                            )
                          }
                        >
                          +
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>${product.total}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveProduct(product._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Right Column - Payment Details */}
      <Card>
        <CardHeader>
          <CardTitle>Sale Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Invoice and User Details */}
          <div className="space-y-4 pb-4 border-b">
            <h3 className="font-medium">Invoice Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Invoice ID</label>
                <Input
                  value={invoiceDetails.invoiceId}
                  onChange={(e) =>
                    setInvoiceDetails({
                      ...invoiceDetails,
                      invoiceId: e.target.value,
                    })
                  }
                  placeholder="Enter invoice ID"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Customer Name</label>
                <Input
                  value={invoiceDetails.userName}
                  onChange={(e) =>
                    setInvoiceDetails({
                      ...invoiceDetails,
                      userName: e.target.value,
                    })
                  }
                  placeholder="Enter customer name"
                />
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="space-y-4 pb-4 border-b">
            <h3 className="font-medium">Address Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Country</label>
                <Input
                  value={invoiceDetails.addressInfo.address}
                  onChange={(e) =>
                    setInvoiceDetails({
                      ...invoiceDetails,
                      addressInfo: {
                        ...invoiceDetails.addressInfo,
                        address: e.target.value,
                      },
                    })
                  }
                  placeholder="Enter address"
                />
              </div>
              <div>
                <label className="text-sm font-medium">City</label>
                <Input
                  value={invoiceDetails.addressInfo.city}
                  onChange={(e) =>
                    setInvoiceDetails({
                      ...invoiceDetails,
                      addressInfo: {
                        ...invoiceDetails.addressInfo,
                        city: e.target.value,
                      },
                    })
                  }
                  placeholder="Enter city"
                />
              </div>
              <div>
                <label className="text-sm font-medium">District</label>
                <Input
                  value={invoiceDetails.addressInfo.district}
                  onChange={(e) =>
                    setInvoiceDetails({
                      ...invoiceDetails,
                      addressInfo: {
                        ...invoiceDetails.addressInfo,
                        district: e.target.value,
                      },
                    })
                  }
                  placeholder="Enter district"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Postcode</label>
                <Input
                  value={invoiceDetails.addressInfo.postcode}
                  onChange={(e) =>
                    setInvoiceDetails({
                      ...invoiceDetails,
                      addressInfo: {
                        ...invoiceDetails.addressInfo,
                        postcode: e.target.value,
                      },
                    })
                  }
                  placeholder="Enter postcode"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Phone</label>
                <Input
                  value={invoiceDetails.addressInfo.phone}
                  onChange={(e) =>
                    setInvoiceDetails({
                      ...invoiceDetails,
                      addressInfo: {
                        ...invoiceDetails.addressInfo,
                        phone: e.target.value,
                      },
                    })
                  }
                  placeholder="Enter phone number"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Notes</label>
                <Input
                  value={invoiceDetails.addressInfo.notes}
                  onChange={(e) =>
                    setInvoiceDetails({
                      ...invoiceDetails,
                      addressInfo: {
                        ...invoiceDetails.addressInfo,
                        notes: e.target.value,
                      },
                    })
                  }
                  placeholder="Enter notes"
                />
              </div>
            </div>
          </div>

          {/* Status Selection */}
          <div className="pb-4 border-b">
            <label className="text-sm font-medium">Status</label>
            <Select
              value={invoiceDetails.status}
              onValueChange={(value) =>
                setInvoiceDetails({
                  ...invoiceDetails,
                  status: value,
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Payment Method */}
          <div>
            <label className="text-sm font-medium">Payment Method</label>
            <Select
              value={saleDetails.paymentMethod}
              onValueChange={(value) =>
                setSaleDetails({ ...saleDetails, paymentMethod: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="card">Card</SelectItem>
                  <SelectItem value="bkash">Bkash</SelectItem>
                  <SelectItem value="nagad">Nagad</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium">Paid Amount</label>
            <Input
              type="number"
              value={saleDetails.paidAmount}
              onChange={(e) =>
                setSaleDetails({ ...saleDetails, paidAmount: e.target.value })
              }
              placeholder="Enter paid amount"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Discount</label>
            <Input
              type="number"
              value={saleDetails.discount}
              onChange={(e) =>
                setSaleDetails({ ...saleDetails, discount: e.target.value })
              }
              placeholder="Enter discount amount"
            />
          </div>

          <div className="pt-4 border-t">
            <div className="flex justify-between mb-2">
              <span>Subtotal:</span>
              <span>${subtotal}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Discount:</span>
              <span>${discount}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Total:</span>
              <span>${total}</span>
            </div>
          </div>

          <Button className="w-full" size="lg" onClick={handleCompleteSale}>
            Complete Sale
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default AdminSalesCreateView;
