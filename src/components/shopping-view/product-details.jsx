"use client"

import { useState } from "react"
import { Heart, ShoppingCart } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice"
import { setProductDetails } from "@/store/shop/products-slice"
import { addReview, getReviews } from "@/store/shop/review-slice"
import StarRatingComponent from "../common/start-rating"

function ProductDetailsDialog({ open, setOpen, productDetails }) {
  const [reviewMsg, setReviewMsg] = useState("")
  const [rating, setRating] = useState(0)
  const [selectedImage, setSelectedImage] = useState(productDetails?.images?.[0] || productDetails?.image)
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { cartItems } = useSelector((state) => state.shopCart)
  const { reviews } = useSelector((state) => state.shopReview)
  const { toast } = useToast()

  // Get all available images
  const allImages = productDetails?.images?.length
    ? productDetails.images
    : productDetails?.image
      ? [productDetails.image]
      : []

  function handleRatingChange(getRating) {
    setRating(getRating)
  }

  function handleAddToCart(getCurrentProductId, getTotalStock) {
    const getCartItems = cartItems.items || []

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex((item) => item.productId === getCurrentProductId)
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity
        if (getQuantity + 1 > getTotalStock) {
          toast({
            title: `Only ${getQuantity} quantity available`,
            variant: "destructive",
          })
          return
        }
      }
    }

    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      }),
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id))
        toast({
          title: "Added to cart successfully",
        })
      }
    })
  }

  function handleDialogClose() {
    setOpen(false)
    dispatch(setProductDetails())
    setRating(0)
    setReviewMsg("")
    setSelectedImage(productDetails?.images?.[0] || productDetails?.image)
  }

  function handleAddReview() {
    if (!user?.id) {
      toast({
        title: "Please login to add a review",
        variant: "destructive",
      })
      return
    }

    dispatch(
      addReview({
        productId: productDetails?._id,
        userId: user?.id,
        userName: user?.userName,
        reviewMessage: reviewMsg,
        reviewValue: rating,
      }),
    ).then((data) => {
      if (data?.payload?.success) {
        setRating(0)
        setReviewMsg("")
        dispatch(getReviews(productDetails?._id))
        toast({
          title: "Review added successfully!",
        })
      }
    })
  }

  const averageReview =
    reviews && reviews.length > 0
      ? reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) / reviews.length
      : 0

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="grid md:grid-cols-2 gap-8 p-6 max-w-[95vw] md:max-w-[85vw] lg:max-w-[75vw]">
        {/* Left Column - Image Gallery */}
        <div className="space-y-4">
          {/* Main Image Display */}
          <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
            <img
              src={selectedImage || "/placeholder.svg"}
              alt={productDetails?.title}
              className="w-full h-full object-cover transition-all duration-300 hover:scale-105"
            />
            {productDetails?.salePrice > 0 && (
              <Badge variant="destructive" className="absolute top-2 left-2">
                Sale
              </Badge>
            )}
          </div>

          {/* Thumbnail Gallery */}
          {allImages.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {allImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(image)}
                  className={`relative aspect-square rounded-md overflow-hidden ${
                    selectedImage === image ? "ring-2 ring-primary" : "ring-1 ring-gray-200 hover:ring-gray-300"
                  }`}
                >
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`${productDetails?.title} - View ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column - Product Details */}
        <div className="flex flex-col h-full">
          <div className="flex-1">
            {/* Product Title and Stock Status */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold tracking-tight mb-2">{productDetails?.title}</h1>
                <div className="flex items-center gap-2 text-sm">
                  <Badge variant={productDetails?.totalStock > 0 ? "secondary" : "destructive"}>
                    {productDetails?.totalStock > 0 ? "In Stock" : "Out of Stock"}
                  </Badge>
                  {productDetails?.totalStock > 0 && (
                    <span className="text-muted-foreground">({productDetails?.totalStock} available)</span>
                  )}
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="flex items-baseline gap-4 mb-4">
              {productDetails?.salePrice > 0 ? (
                <>
                  <p className="text-3xl font-bold text-primary">${productDetails?.salePrice}</p>
                  <p className="text-xl text-muted-foreground line-through">${productDetails?.price}</p>
                  <Badge variant="secondary" className="ml-2">
                    Save ${(productDetails?.price - productDetails?.salePrice).toFixed(2)}
                  </Badge>
                </>
              ) : (
                <p className="text-3xl font-bold text-primary">${productDetails?.price}</p>
              )}
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-6">
              <StarRatingComponent rating={averageReview} />
              <span className="text-sm text-muted-foreground">
                {averageReview.toFixed(1)} ({reviews?.length || 0} reviews)
              </span>
            </div>

            {/* Description */}
            <Card className="p-4 mb-6 bg-gray-50">
              <p className="text-sm text-muted-foreground leading-relaxed">{productDetails?.description}</p>
            </Card>

            {/* Actions */}
            <div className="flex gap-2 mb-6">
              <Button
                className="flex-1"
                size="lg"
                disabled={productDetails?.totalStock === 0}
                onClick={() => handleAddToCart(productDetails?._id, productDetails?.totalStock)}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                {productDetails?.totalStock === 0 ? "Out of Stock" : "Add to Cart"}
              </Button>
              <Button size="lg" variant="outline">
                <Heart className="w-4 h-4" />
              </Button>
            </div>

            {/* Reviews Section */}
            <Tabs defaultValue="reviews" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="reviews">Reviews ({reviews?.length || 0})</TabsTrigger>
                <TabsTrigger value="write">Write a Review</TabsTrigger>
              </TabsList>
              <TabsContent value="reviews">
                <div className="space-y-4 max-h-[300px] overflow-y-auto p-4">
                  {reviews && reviews.length > 0 ? (
                    reviews.map((reviewItem, index) => (
                      <Card key={index} className="p-4">
                        <div className="flex gap-4">
                          <Avatar className="w-10 h-10 border">
                            <AvatarFallback>{reviewItem?.userName[0].toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-semibold">{reviewItem?.userName}</h3>
                              <StarRatingComponent rating={reviewItem?.reviewValue} size="sm" />
                            </div>
                            <p className="text-sm text-muted-foreground">{reviewItem.reviewMessage}</p>
                          </div>
                        </div>
                      </Card>
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground">No reviews yet</p>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="write">
                <Card className="p-4">
                  <div className="space-y-4">
                    <div>
                      <Label>Rating</Label>
                      <div className="flex gap-1 mt-2">
                        <StarRatingComponent rating={rating} handleRatingChange={handleRatingChange} />
                      </div>
                    </div>
                    <div>
                      <Label>Your Review</Label>
                      <Input
                        className="mt-2"
                        name="reviewMsg"
                        value={reviewMsg}
                        onChange={(event) => setReviewMsg(event.target.value)}
                        placeholder="Write your review here..."
                      />
                    </div>
                    <Button onClick={handleAddReview} disabled={!rating || reviewMsg.trim() === ""} className="w-full">
                      Submit Review
                    </Button>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ProductDetailsDialog

