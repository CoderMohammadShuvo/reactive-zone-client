"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import PropTypes from "prop-types"

export function BrandManagement({ onBrandChange }) {
  const [brands, setBrands] = useState([])
  const [newBrand, setNewBrand] = useState("")
  const [editingBrand, setEditingBrand] = useState(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchBrands()
  }, [])

  const fetchBrands = async () => {
    try {
      const response = await axios.get("https://reactive-zone-backend.vercel.app/api/admin/brand/get")
      setBrands(response.data.data)
    } catch (error) {
      console.error("Error fetching brands:", error)
      toast({
        title: "Error fetching brands",
        description: "Please try again later.",
        variant: "destructive",
      })
    }
  }

  console.log("fetchBrands", brands);

  const handleAddBrand = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post("https://reactive-zone-backend.vercel.app/api/admin/brand/add", {
        title: newBrand,
      })
      if (response.data.success) {
        setNewBrand("")
        fetchBrands()
        onBrandChange()
        toast({
          title: "Brand added successfully",
        })
      }
    } catch (error) {
      console.error("Error adding brand:", error)
      toast({
        title: "Error adding brand",
        description: "Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleEditBrand = async (id, newTitle) => {
    try {
      const response = await axios.put(`https://reactive-zone-backend.vercel.app/api/admin/brand/update/${id}`, {
        title: newTitle,
      })
      if (response.data.success) {
        setEditingBrand(null)
        fetchBrands()
        onBrandChange()
        toast({
          title: "Brand updated successfully",
        })
      }
    } catch (error) {
      console.error("Error updating brand:", error)
      toast({
        title: "Error updating brand",
        description: "Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteBrand = async (id) => {
    try {
      const response = await axios.delete(`https://reactive-zone-backend.vercel.app/api/admin/brand/delete/${id}`)
      if (response.data.success) {
        fetchBrands()
        onBrandChange()
        toast({
          title: "Brand deleted successfully",
        })
      }
    } catch (error) {
      console.error("Error deleting brand:", error)
      toast({
        title: "Error deleting brand",
        description: "Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleAddBrand} className="flex space-x-2">
        <Input
          type="text"
          value={newBrand}
          onChange={(e) => setNewBrand(e.target.value)}
          placeholder="New Brand Name"
          className="flex-grow"
        />
        <Button type="submit">Add</Button>
      </form>
      <div className="max-h-[60vh] overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Brand Name</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {brands.map((brand) => (
              <TableRow key={brand._id}>
                <TableCell>
                  {editingBrand === brand._id ? (
                    <Input
                      type="text"
                      defaultValue={brand.title}
                      onBlur={(e) => handleEditBrand(brand._id, e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          handleEditBrand(brand._id, e.target.value)
                        }
                      }}
                    />
                  ) : (
                    brand.title
                  )}
                </TableCell>
                <TableCell>
                  <Button onClick={() => setEditingBrand(brand._id)} className="mr-2" size="sm">
                    Edit
                  </Button>
                  <Button variant="destructive" onClick={() => handleDeleteBrand(brand._id)} size="sm">
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

BrandManagement.propTypes = {
  onBrandChange: PropTypes.func.isRequired,
}


