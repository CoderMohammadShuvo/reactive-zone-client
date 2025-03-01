"use client"

import { useState, useRef } from "react"
import { PlugIcon as HousePlug, PrinterIcon } from "lucide-react"
import { DialogContent } from "../ui/dialog"
import { Separator } from "../ui/separator"
import { Button } from "../ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { useToast } from "@/hooks/use-toast"
import CommonForm from "../common/form"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"
import axios from "axios"

const initialFormData = {
  status: "",
}

function AdminSalesDetailsView({ saleDetails }) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState(initialFormData)
  const { toast } = useToast()
  const printRef = useRef()

  async function handleUpdateStatus(event) {
    event.preventDefault()
    const { status } = formData

    try {
      setLoading(true)
      const response = await axios.put(
        `https://reactive-zone-backend.vercel.app/api/admin/orders/update/${saleDetails._id}`,
        {
          orderStatus: status,
        },
      )

      if (response.data.success) {
        toast({ title: response.data.message })
        setFormData(initialFormData)
      }
    } catch (error) {
      console.error("Error updating order status:", error)
      toast({
        title: "Error updating status",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const downloadPDF = async () => {
    try {
      const element = printRef.current
      if (!element) return

      const canvas = await html2canvas(element)
      const imgData = canvas.toDataURL("image/png")
      const pdf = new jsPDF()
      const imgWidth = 190
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      pdf.addImage(imgData, "PNG", 10, 0, imgWidth, imgHeight)
      pdf.save("Sale_Details.pdf")
    } catch (error) {
      console.error("Error generating PDF:", error)
      toast({
        title: "Error generating PDF",
        variant: "destructive",
      })
    }
  }

  if (!saleDetails) {
    return <div className="p-4">No sale details available</div>
  }

  return (
    <DialogContent className="max-w-[900px] min-w-[200px]">
      {/* Printable Content */}
      <div ref={printRef} className="print-section">
        <div className="flex mb-4 justify-between pt-4">
          <div className="flex gap-2 items-center h-[50px]">
            <HousePlug className="h-6 w-6" />
            <span className="font-bold">Reactive Zone</span>
          </div>
          <div className="text-right text-sm">
            <h1 className="font-sm font-normal">
              <span className="font-bold font-sm">Hotline:</span> 01234567890
            </h1>
            <p className="font-normal">Shop #224, 2nd Floor, Sundarban Square, Gulistan, Dhaka</p>
            <p className="font-normal">admin@reactive-zone.com</p>
          </div>
        </div>

        <Separator />

        <div className="flex justify-between mt-4">
          <div>
            <h1 className="font-bold">Sale Details</h1>
            <p className="font-medium">
              Sale ID: <span className="font-normal">{saleDetails._id}</span>
            </p>
            <p className="font-medium">
              Sale Date: <span className="font-normal">{new Date(saleDetails.createdAt).toLocaleDateString()}</span>
            </p>
            <p className="font-medium">
              Total Amount: <span className="font-normal">৳ {saleDetails.total}</span>
            </p>
          </div>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <div className="font-medium">Shipping Information</div>
              <div className="grid gap-0.5 text-muted-foreground">
                <span>
                  {saleDetails.addressInfo?.address}, {saleDetails.addressInfo?.city},
                  {saleDetails.addressInfo?.district}, {saleDetails.addressInfo?.postcode}
                </span>
                <span>{saleDetails.addressInfo?.phone}</span>
                <span>{saleDetails.addressInfo?.notes}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 mt-6">
          <div className="grid gap-2">
            <div className="font-medium mb-2">Products</div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {saleDetails.products?.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.quantity || 1}</TableCell>
                    <TableCell>৳{item.price}</TableCell>
                    <TableCell>৳{(item.quantity || 1) * item.price}</TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={3}></TableCell>
                  <TableCell className="font-medium">Subtotal:</TableCell>
                  <TableCell>
                    ৳{saleDetails.products?.reduce((acc, item) => acc + (item.quantity || 1) * item.price, 0)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Signature Section */}
        {/* <div className="grid grid-cols-3 gap-8 mt-16">
          <div className="text-center">
            <div className="border-t pt-2">
              <p className="text-sm font-medium">Prepared By: Shop</p>
            </div>
          </div>
          <div className="text-center">
            <div className="border-t pt-2">
              <p className="text-sm font-medium">Checked By: Admin</p>
            </div>
          </div>
          <div className="text-center">
            <div className="border-t pt-2">
              <p className="text-sm font-medium">Authorized By: Admin</p>
            </div>
          </div>
        </div> */}
      </div>

      {/* Non-printable Controls */}
      <div className="non-print-section mt-6">
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

        <div className="flex gap-4 mt-4">
          <Button onClick={downloadPDF} disabled={loading} className="flex-1">
            <PrinterIcon className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          .non-print-section {
            display: none !important;
          }
          .print-section {
            padding: 20px;
          }
        }
      `}</style>
    </DialogContent>
  )
}

export default AdminSalesDetailsView

