"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"

export function CategoryManagement() {
  const [categories, setCategories] = useState([])
  const [newCategory, setNewCategory] = useState("")
  const [editingCategory, setEditingCategory] = useState(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await axios.get("https://reactive-zone-backend.vercel.app/api/admin/category/get")
      setCategories(response.data.data)
    } catch (error) {
      console.error("Error fetching categories:", error)
      toast({
        title: "Error fetching categories",
        description: "Please try again later.",
        variant: "destructive",
      })
    }
  }

  const handleAddCategory = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post("https://reactive-zone-backend.vercel.app/api/admin/category/add", {
        title: newCategory,
      })
      if (response.data.success) {
        setNewCategory("")
        fetchCategories()
        toast({
          title: "Category added successfully",
        })
      }
    } catch (error) {
      console.error("Error adding category:", error)
      toast({
        title: "Error adding category",
        description: "Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleEditCategory = async (id, newTitle) => {
    try {
      const response = await axios.put(`https://reactive-zone-backend.vercel.app/api/admin/category/update/${id}`, {
        title: newTitle,
      })
      if (response.data.success) {
        setEditingCategory(null)
        fetchCategories()
        toast({
          title: "Category updated successfully",
        })
      }
    } catch (error) {
      console.error("Error updating category:", error)
      toast({
        title: "Error updating category",
        description: "Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteCategory = async (id) => {
    try {
      const response = await axios.delete(`https://reactive-zone-backend.vercel.app/api/admin/category/delete/${id}`)
      if (response.data.success) {
        fetchCategories()
        toast({
          title: "Category deleted successfully",
        })
      }
    } catch (error) {
      console.error("Error deleting category:", error)
      toast({
        title: "Error deleting category",
        description: "Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div>
      <form onSubmit={handleAddCategory} className="mb-4">
        <Input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="New Category Name"
          className="mr-2 mt-4"
        />
        <Button type="submit" className="mt-4">Add Category</Button>
      </form>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Category Name</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category._id}>
              <TableCell>
                {editingCategory === category._id ? (
                  <Input
                    type="text"
                    defaultValue={category.title}
                    onBlur={(e) => handleEditCategory(category._id, e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        handleEditCategory(category._id, e.target.value)
                      }
                    }}
                  />
                ) : (
                  category.title
                )}
              </TableCell>
              <TableCell>
                <Button onClick={() => setEditingCategory(category._id)} className="mr-2">
                  Edit
                </Button>
                <Button variant="destructive" onClick={() => handleDeleteCategory(category._id)}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

