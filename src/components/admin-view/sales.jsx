"use client";

import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Dialog } from "../ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import axios from "axios";
import { Search } from "lucide-react";
import { Badge } from "../ui/badge";
import { Link } from "react-router-dom";
import AdminSalesDetailsView from "./sale-details";

function AdminSalesView() {
  const [saleList, setSaleList] = useState([]);
  const [saleDetails, setSaleDetails] = useState(null);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchSales() {
      try {
        setLoading(true);
        const response = await axios.get(
          "https://reactive-zone-backend.vercel.app/api/admin/sales/get-all"
        );
        console.log("API Response:", response.data); // Debug log
        // Check if response.data is an array
        const sales = Array.isArray(response.data) ? response.data : [];
        setSaleList(sales);
      } catch (error) {
        console.error("Error fetching sales:", error);
        setError(error.message);
        setSaleList([]);
      } finally {
        setLoading(false);
      }
    }
    fetchSales();
  }, []);

  async function fetchSaleDetails(getId) {
    try {
      const response = await axios.get(
        `https://reactive-zone-backend.vercel.app/api/admin/sales/get/${getId}`
      );
      console.log("details:", response.data); // Debug log
      setSaleDetails(response.data);
      setOpenDetailsDialog(true);
    } catch (error) {
      console.error("Error fetching sale details:", error);
      setSaleDetails(null);
    }
  }

  // Format date safely
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return dateString.split("T")[0];
    } catch (error) {
      return `${error}Invalid Date`;
    }
  };

  const filteredProducts = saleList.filter((order) =>
    order?._id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">Loading sales data...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center text-red-500">
            Error loading sales: {error}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between w-full items-center">
        <CardTitle>Sales ({saleList.length})</CardTitle>
        <Link to="/admin/create-sales">
          <Button>New Sale</Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="relative w-full sm:w-64 mb-4">
          <Input
            type="text"
            placeholder="Search by Invoice ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
        </div>

        {saleList.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No sales data available
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice ID</TableHead>
                <TableHead>Sale Date</TableHead>
                <TableHead>Sale Status</TableHead>
                <TableHead>Total Price</TableHead>
                <TableHead>
                  <span className="sr-only">Details</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((orderItem) => (
                <TableRow key={orderItem?.invoiceId}>
                  <TableCell>{orderItem?.invoiceId || "N/A"}</TableCell>
                  <TableCell>{formatDate(orderItem?.createdAt)}</TableCell>
                  <TableCell>
                    <Badge
                      className={`py-1 px-3 ${
                        orderItem?.orderStatus === "confirmed"
                          ? "bg-green-500"
                          : orderItem?.orderStatus === "rejected"
                          ? "bg-red-600"
                          : orderItem?.orderStatus === "delivered"
                          ? "bg-blue-600"
                          : orderItem?.orderStatus === "inProcess"
                          ? "bg-yellow-600"
                          : "bg-black"
                      }`}
                    >
                      {orderItem?.status || "Unknown"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    ${orderItem?.total?.toFixed(2) || "0.00"}
                  </TableCell>
                  <TableCell>
                    <Dialog
                      open={openDetailsDialog}
                      onOpenChange={() => setOpenDetailsDialog(false)}
                    >
                      <Button onClick={() => fetchSaleDetails(orderItem?._id)}>
                        View Details
                      </Button>
                      <AdminSalesDetailsView saleDetails={saleDetails} />
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

export default AdminSalesView;
