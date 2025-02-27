"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Search, Trash2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

function AdminSalesCreateView() {
  const [products, setProducts] = useState([])
  const [selectedProducts, setSelectedProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [saleDetails, setSaleDetails] = useState({
    paidAmount: "",
    discount: "",
    paymentMethod: "cash",
  })

  // Fetch products from API
  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await axios.get("https://reactive-zone-backend.vercel.app/api/admin/products/get")
      if (response.data?.success) {
        setProducts(response.data.data)
      }
    } catch (error) {
      console.error("Error fetching products:", error)
    } finally {
      setLoading(false)
    }
  }

  // Handle product selection
  const handleProductSelect = (productId) => {
    const product = products.find((p) => p._id === productId)
    if (product) {
      const existingProduct = selectedProducts.find((p) => p._id === productId)
      if (existingProduct) {
        // If product already exists, increase quantity
        setSelectedProducts(
          selectedProducts.map((p) =>
            p._id === productId ? { ...p, quantity: p.quantity + 1, total: (p.quantity + 1) * p.price } : p,
          ),
        )
      } else {
        // Add new product with quantity 1
        setSelectedProducts([...selectedProducts, { ...product, quantity: 1, total: product.price }])
      }
    }
  }

  // Handle quantity change
  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity >= 0) {
      setSelectedProducts(
        selectedProducts.map((p) =>
          p._id === productId ? { ...p, quantity: newQuantity, total: newQuantity * p.price } : p,
        ),
      )
    }
  }

  // Handle product removal
  const handleRemoveProduct = (productId) => {
    setSelectedProducts(selectedProducts.filter((p) => p._id !== productId))
  }

  // Calculate totals
  const subtotal = selectedProducts.reduce((sum, product) => sum + product.total, 0)
  const discount = Number.parseFloat(saleDetails.discount) || 0
  const total = subtotal - discount

  // Filter products based on search term
  const filteredProducts = products.filter((product) => product.title.toLowerCase().includes(searchTerm.toLowerCase()))

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
                    <p className="text-sm text-muted-foreground">Stock: {product.totalStock}</p>
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
                          onClick={() => handleQuantityChange(product._id, product.quantity - 1)}
                        >
                          -
                        </Button>
                        <span>{product.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuantityChange(product._id, product.quantity + 1)}
                        >
                          +
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>${product.total}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => handleRemoveProduct(product._id)}>
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
          <CardTitle>Payment Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Payment Method</label>
            <Select
              value={saleDetails.paymentMethod}
              onValueChange={(value) => setSaleDetails({ ...saleDetails, paymentMethod: value })}
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
              onChange={(e) => setSaleDetails({ ...saleDetails, paidAmount: e.target.value })}
              placeholder="Enter paid amount"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Discount</label>
            <Input
              type="number"
              value={saleDetails.discount}
              onChange={(e) => setSaleDetails({ ...saleDetails, discount: e.target.value })}
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

          <Button
            className="w-full"
            size="lg"
            onClick={() => {
              // Handle sale completion here
            }}
          >
            Complete Sale
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default AdminSalesCreateView

