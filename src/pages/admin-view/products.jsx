"use client"

import ProductImageUpload from "@/components/admin-view/image-upload"
import CommonForm from "@/components/common/form"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { addProductFormElements } from "@/config"
import { useToast } from "@/hooks/use-toast"
import { addNewProduct, deleteProduct, editProduct, fetchAllProducts } from "@/store/admin/products-slice"
import { Fragment, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CategoryManagement } from "./category-management"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

const initialFormData = {
  image: null,
  title: "",
  description: "",
  category: "",
  brand: "",
  price: "",
  salePrice: "",
  totalStock: "",
  averageReview: 0,
}

function AdminProducts() {
  const [openCreateProductsDialog, setOpenCreateProductsDialog] = useState(false)
  const [openCategoryDialog, setOpenCategoryDialog] = useState(false)
  const [formData, setFormData] = useState(initialFormData)
  const [imageFile, setImageFile] = useState(null)
  const [uploadedImageUrl, setUploadedImageUrl] = useState("")
  const [imageLoadingState, setImageLoadingState] = useState(false)
  const [currentEditedId, setCurrentEditedId] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")

  const { productList } = useSelector((state) => state.adminProducts)
  const dispatch = useDispatch()
  const { toast } = useToast()

  function onSubmit(event) {
    event.preventDefault()

    currentEditedId !== null
      ? dispatch(
          editProduct({
            id: currentEditedId,
            formData,
          }),
        ).then((data) => {
          console.log(data, "edit")

          if (data?.payload?.success) {
            dispatch(fetchAllProducts())
            setFormData(initialFormData)
            setOpenCreateProductsDialog(false)
            setCurrentEditedId(null)
          }
        })
      : dispatch(
          addNewProduct({
            ...formData,
            image: uploadedImageUrl,
          }),
        ).then((data) => {
          if (data?.payload?.success) {
            dispatch(fetchAllProducts())
            setOpenCreateProductsDialog(false)
            setImageFile(null)
            setFormData(initialFormData)
            toast({
              title: "Product added successfully",
            })
          }
        })
  }

  function handleDelete(getCurrentProductId) {
    dispatch(deleteProduct(getCurrentProductId)).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllProducts())
      }
    })
  }

  function isFormValid() {
    return Object.keys(formData)
      .filter((currentKey) => currentKey !== "averageReview")
      .map((key) => formData[key] !== "")
      .every((item) => item)
  }

  useEffect(() => {
    dispatch(fetchAllProducts())
  }, [dispatch])

  const filteredProducts = productList.filter((product) =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <Fragment>
      <div className="mb-5 w-full flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-64">
          <Input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        </div>
        <div className="flex gap-4">
          <Button onClick={() => setOpenCreateProductsDialog(true)}>Add New Product</Button>
          <Sheet open={openCategoryDialog} onOpenChange={setOpenCategoryDialog}>
            <SheetTrigger asChild>
              <Button variant="outline">Manage Categories</Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Category Management</SheetTitle>
              </SheetHeader>
              <CategoryManagement />
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((productItem) => (
                <TableRow key={productItem._id}>
                  <TableCell>
                    <img
                      src={productItem.image || "/placeholder.svg"}
                      alt={productItem.title}
                      className="w-16 h-16 object-cover"
                    />
                  </TableCell>
                  <TableCell>{productItem.title}</TableCell>
                  <TableCell>{productItem.category}</TableCell>
                  <TableCell>${productItem.price}</TableCell>
                  <TableCell>{productItem.totalStock}</TableCell>
                  <TableCell>
                    <Button
                      onClick={() => {
                        setFormData(productItem)
                        setOpenCreateProductsDialog(true)
                        setCurrentEditedId(productItem._id)
                      }}
                      className="mr-2"
                    >
                      Edit
                    </Button>
                    <Button variant="destructive" onClick={() => handleDelete(productItem._id)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  No products found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <Sheet
        open={openCreateProductsDialog}
        onOpenChange={() => {
          setOpenCreateProductsDialog(false)
          setCurrentEditedId(null)
          setFormData(initialFormData)
        }}
      >
        <SheetContent side="right" className="overflow-auto">
          <SheetHeader>
            <SheetTitle>{currentEditedId !== null ? "Edit Product" : "Add New Product"}</SheetTitle>
          </SheetHeader>
          <ProductImageUpload
            imageFile={imageFile}
            setImageFile={setImageFile}
            uploadedImageUrl={uploadedImageUrl}
            setUploadedImageUrl={setUploadedImageUrl}
            setImageLoadingState={setImageLoadingState}
            imageLoadingState={imageLoadingState}
            isEditMode={currentEditedId !== null}
          />
          <div className="py-6">
            <CommonForm
              onSubmit={onSubmit}
              formData={formData}
              setFormData={setFormData}
              buttonText={currentEditedId !== null ? "Edit" : "Add"}
              formControls={addProductFormElements}
              isBtnDisabled={!isFormValid()}
            />
          </div>
        </SheetContent>
      </Sheet>
    </Fragment>
  )
}

export default AdminProducts

