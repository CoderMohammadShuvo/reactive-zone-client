"use client";

import {
  Airplay,
  Camera,
  GamepadIcon,
  Headphones,
  Heater,
  Images,
  Laptop,
  Shirt,
  ShoppingBasket,
  WashingMachine,
  Watch,
} from "lucide-react";
import Marquee from "react-fast-marquee";
import { IoIosSettings } from "react-icons/io";
import { FaLocationDot } from "react-icons/fa6";
import { Card, CardContent } from "@/components/ui/card";
import { IoSearch } from "react-icons/io5";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/products-slice";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { useNavigate } from "react-router-dom";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";

import ProductDetailsDialog from "@/components/shopping-view/product-details";
import { useToast } from "@/hooks/use-toast";
import { getFeatureImages } from "@/store/common-slice";
import { GiDeliveryDrone } from "react-icons/gi";
import { BsFan } from "react-icons/bs";
import { GiWeightScale } from "react-icons/gi";
import { GiTv } from "react-icons/gi";
import { CiMobile3 } from "react-icons/ci";
import { LuCable } from "react-icons/lu";
import { BsFillDeviceSsdFill } from "react-icons/bs";
import { TbDeviceComputerCamera } from "react-icons/tb";
import { TbRazorElectric } from "react-icons/tb";
import { IoWatchOutline } from "react-icons/io5";
import { GiPhotoCamera } from "react-icons/gi";
import { GiEarbuds } from "react-icons/gi";
import { BsEarbuds } from "react-icons/bs";
import { BsPciCardSound } from "react-icons/bs";
import { GiConsoleController } from "react-icons/gi";
import { LuMessageSquareWarning } from "react-icons/lu";
import { GoQuestion } from "react-icons/go";
import { IoIosLaptop } from "react-icons/io";

const categoriesWithIcon = [
  { id: "headphone", label: "Headphone", icon: Headphones },
  { id: "laptop", label: "Laptop", icon: Laptop },
  { id: "gaming", label: "Gaming", icon: GamepadIcon },
  { id: "camera", label: "Camera", icon: Camera },
  { id: "watch", label: "Watch", icon: Watch },
];

const FeaturedCategoriesWithIcon = [
  { id: "drone", label: "Drone", icon: GiDeliveryDrone },
  { id: "fan", label: "ChargerFan", icon: BsFan },
  { id: "weightScale", label: "WeightScale", icon: GiWeightScale },
  { id: "tv", label: "TV", icon: GiTv },
  { id: "mobile", label: "Mobile", icon: CiMobile3 },
  { id: "accessories", label: "Accessories", icon: LuCable },
  { id: "camera", label: "Camera", icon: GiPhotoCamera },
  { id: "ssd", label: "PortableSSD", icon: BsFillDeviceSsdFill },
  { id: "Wificamera", label: "WifiCamera", icon: TbDeviceComputerCamera },
  { id: "Trimmer", label: "Trimmer", icon: TbRazorElectric },
  { id: "soundCard", label: "Sound", icon: BsPciCardSound },
  { id: "gameconsole", label: "GameConsole", icon: GiConsoleController },
  { id: "earphone", label: "Earphone", icon: GiEarbuds },
  { id: "earbuds", label: "Earbuds", icon: BsEarbuds },
  { id: "watch", label: "SmartWatch", icon: IoWatchOutline },
];

const brandsWithIcon = [
  { id: "nike", label: "Nike", icon: Shirt },
  { id: "adidas", label: "Adidas", icon: WashingMachine },
  { id: "puma", label: "Puma", icon: ShoppingBasket },
  { id: "levi", label: "Levi's", icon: Airplay },
  { id: "zara", label: "Zara", icon: Images },
  { id: "h&m", label: "H&M", icon: Heater },
];

const marqueeAnnouncements = [
  "Welcome to the online shopping store",
  "Get the best deals on all products",
  "Shop now and get the best deals",
  "Free shipping on orders over $50",
  "New arrivals every week",
  "24/7 customer support available",
];

function ShoppingHome() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const { productList, productDetails } = useSelector(
    (state) => state.shopProducts
  );
  const { featureImageList } = useSelector((state) => state.commonFeature);

  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  function handleNavigateToListingPage(getCurrentItem, section) {
    sessionStorage.removeItem("filters");
    const currentFilter = {
      [section]: [getCurrentItem.id],
    };

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    navigate(`/shop/listing`);
  }

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  function handleAddtoCart(getCurrentProductId) {
    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({
          title: "Product is added to cart",
        });
      }
    });
  }

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => {
        const nextSlide = (prevSlide + 1) % featureImageList.length;
        console.log("Current Slide Updated To:", nextSlide);
        return nextSlide;
      });
    }, 1500);

    return () => clearInterval(timer);
  }, [featureImageList.length]);

  useEffect(() => {
    dispatch(
      fetchAllFilteredProducts({
        filterParams: {},
        sortParams: "price-lowtohigh",
      })
    );
  }, [dispatch]);

  console.log(featureImageList, "hello feature");

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  return (
    <div className="flex flex-col min-h-screen pt-[10px] bg-[#f2f4f8]">
      <div className="max-w-7xl mx-auto mt-4 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left Large Image */}
          <div className="lg:col-span-2 h-[60vh] sm:h-auto">
            <img
              src="https://www.startech.com.bd/image/cache/catalog/home/banner/2025/bundle-offer-982x500.webp"
              className="w-full h-full object-cover rounded-lg"
              alt="Main Banner"
            />
          </div>

          {/* Right Side Smaller Images */}
          <div className="flex flex-col gap-4 h-[60vh] sm:h-auto">
            <img
              src="https://www.ryans.com/storage/right_side/FD-HT-500DA-Home-Theater-Speaker-Right-Slider_1738817120.webp"
              className="w-full h-1/2 object-cover rounded-lg"
              alt="Top Right Banner"
            />
            <img
              src="https://www.ryans.com/storage/right_side/Buy-Logitech-products-get-Discount-right-slider%20(2)_1737880672.webp"
              className="w-full h-1/2 object-cover rounded-lg"
              alt="Bottom Right Banner"
            />
          </div>
        </div>
      </div>
      {/* marquee section */}
      <div className="py-5 m-4 mt-10 bg-white rounded-[8px]">
        <Marquee gradient={false} speed={40} pauseOnHover={true}>
          <div className="flex space-x-10 px-4">
            {marqueeAnnouncements.map((text, index) => (
              <p
                key={index}
                className="text-primary text-xl font-bold whitespace-nowrap"
              >
                {text}
              </p>
            ))}
          </div>
        </Marquee>
      </div>
      {/* small cards section */}
      {/* Finder Cards Section */}
      <section className="py-12 m-4 bg-gray-200">
        <h2 className="text-2xl font-bold  flex  justify-center items-center mb-8 px-4">
          Quick Support
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-4">
          {/* Laptop Finder Card */}
          <div className="bg-white rounded-lg hover:shadow-lg transition-shadow">
            <button className="w-full p-4 flex items-start gap-4">
              <div className="shrink-0">
                <IoIosLaptop className="text-3xl text-white rounded-full p-2 bg-[#ef4a23]" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-semibold">Laptop Finder</h3>
                <p className="text-sm text-gray-600">Find your laptop easily</p>
              </div>
            </button>
          </div>

          {/* Raise a Complaint Card */}
          <div className="bg-white rounded-lg hover:shadow-lg transition-shadow">
            <button className="w-full p-4 flex items-start gap-4">
              <div className="shrink-0">
                <LuMessageSquareWarning className="text-3xl text-white rounded-full p-2 bg-[#ef4a23]" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-semibold">Raise a Complaint</h3>
                <p className="text-sm text-gray-600">Share your experience</p>
              </div>
            </button>
          </div>

          {/* Online Support Card */}
          <div className="bg-white rounded-lg hover:shadow-lg transition-shadow">
            <button className="w-full p-4 flex items-start gap-4">
              <div className="shrink-0">
                <GoQuestion className="text-3xl text-white rounded-full p-2 bg-[#ef4a23]" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-semibold">Online Support</h3>
                <p className="text-sm text-gray-600">Get Online Support</p>
              </div>
            </button>
          </div>

          {/* Service Center Card */}
          <div className="bg-white rounded-lg hover:shadow-lg transition-shadow">
            <button className="w-full p-4 flex items-start gap-4">
              <div className="shrink-0">
                <IoIosSettings className="text-3xl text-white rounded-full p-2 bg-[#ef4a23]" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-semibold">Service Center</h3>
                <p className="text-sm text-gray-600">Repair your Device</p>
              </div>
            </button>
          </div>
        </div>
      </section>
      {/* featured categories */}
      <section className="py-12 bg-gray-100 ">
        <div className="px-4 max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-2">
            Fetured categories
          </h2>
          <h2 className="font-bold text-center mb-8">
            Get Your Desired Product from Featured Category!
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
            {FeaturedCategoriesWithIcon.map((categoryItem) => (
              <Card
                key={categoryItem}
                onClick={() =>
                  handleNavigateToListingPage(categoryItem, "category")
                }
                className="cursor-pointer hover:shadow-lg transition-shadow hover:text-orange-400"
              >
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <categoryItem.icon className="w-12 h-12 mb-4 text-primary" />
                  <span className="font-bold">{categoryItem.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      {/*location section*/}
      <section>
        <div className="m-4 mt-10 bg-[#2f5fc3] flex rounded-[8px] justify-between items-center">
          <div className="flex items-center">
            <div className="pt-2  text-yellow-50 text-4xl pl-10">
              <FaLocationDot />
            </div>
            <div className="p-10 px-5">
              <h1 className="text-white text-3xl font-semibold">
                20+ Physical Stores
              </h1>
              <h2 className="text-white text-xl font-semibold">
                Visit Our Store & Get Your Desired IT Product!
              </h2>
            </div>
          </div>
          <div className="p-4 mr-6">
            <button className="flex items-center gap-2 bg-[#ef9919] px-6 py-3 rounded-full text-black font-bold hover:bg-[#d88b17] transition-colors">
              <span>Find Our Store</span>
              <IoSearch className="text-xl" />
            </button>
          </div>
        </div>
      </section>

      {/* category */}
      <section className="py-12 bg-gray-50 ">
        <div className="px-4 max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">
            Shop by category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categoriesWithIcon.map((categoryItem) => (
              <Card
                key={categoryItem}
                onClick={() =>
                  handleNavigateToListingPage(categoryItem, "category")
                }
                className="cursor-pointer hover:shadow-lg transition-shadow"
              >
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <categoryItem.icon className="w-12 h-12 mb-4 text-primary" />
                  <span className="font-bold">{categoryItem.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      {/* brand */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 max-w-7xl ">
          <h2 className="text-3xl font-bold text-center mb-8">Shop by Brand</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {brandsWithIcon.map((brandItem) => (
              <Card
                key={brandItem}
                onClick={() => handleNavigateToListingPage(brandItem, "brand")}
                className="cursor-pointer hover:shadow-lg transition-shadow"
              >
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <brandItem.icon className="w-12 h-12 mb-4 text-primary" />
                  <span className="font-bold">{brandItem.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container max-w-7xl mx-auto px-4">
          <h2 className="text-3xl  font-bold text-center mb-8">
            Featured Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
            {productList && productList.length > 0
              ? productList.map((productItem) => (
                  <ShoppingProductTile
                    key={productItem}
                    handleGetProductDetails={handleGetProductDetails}
                    product={productItem}
                    handleAddtoCart={handleAddtoCart}
                  />
                ))
              : null}
          </div>
        </div>
      </section>
      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}

export default ShoppingHome;
