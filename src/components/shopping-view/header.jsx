"use client";

import { useState } from "react";
import {
  Menu,
  Search,
  ShoppingCart,
  Heart,
  RefreshCw,
  User,
  Phone,
  Mail,
} from "lucide-react";
import { HousePlug, LogOut, UserCog } from "lucide-react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import UserCartWrapper from "./cart-wrapper";
import { useSelector } from "react-redux";

const mainNavItems = [
  "Laptop",
  "Desktop and Server",
  "Gaming",
  "Monitor",
  "Tablet PC",
  "Printer",
  "Camera",
  "Security System",
  "Network",
  "Sound System",
  "Office Items",
  "Accessories",
  "Software",
  "Daily Life",
];

const accessories = [
  "Laptop Ram",
  "Laptop Cooler",
  "Laptop Bag",
  "Stand",
  "Battery",
  "Adapter",
  "Caddy",
];

export default function Navbar() {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  // const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const [openCartSheet, setOpenCartSheet] = useState(false);

  return (
    <nav className="w-full bg-black text-white">
      {/* Top Bar */}
      <div className="hidden md:flex justify-between items-center px-4 py-2 text-sm  max-w-7xl mx-auto">
        <div className="flex items-center space-x-4  ">
          <div className="flex items-center">
            <Phone className="h-4 w-4 mr-2" />
            <span>16 810</span>
          </div>
          <div className="flex items-center">
            <Mail className="h-4 w-4 mr-2" />
            <span>info@reactivezone.com</span>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <span>Offers</span>
          <span>Big Sale</span>
          <span>New Arrival</span>
          <span>Customer Service</span>
        </div>
      </div>

      {/* Main Header */}
      <div className="container  px-4 py-4 max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" className="md:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] bg-black text-white">
              <div className="flex flex-col space-y-4 mt-8">
                {mainNavItems.map((item) => (
                  <a key={item} href="#" className="hover:text-green-500">
                    {item}
                  </a>
                ))}
              </div>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link to="/shop/home" className="flex items-center gap-2">
            <HousePlug className="h-6 w-6" />
            <span className="font-bold">Reactive Zone</span>
          </Link>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Enter Your Keyword..."
                className="w-full px-4 py-2 rounded-l-md text-black"
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
              />
              <Button className="absolute right-0 top-0 h-full rounded-l-none bg-green-500 hover:bg-green-600">
                <Search className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* System Builder & Icons */}
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              className="hidden md:flex bg-green-500 hover:bg-green-600"
            >
              SYSTEM BUILDER
            </Button>
            <div className="flex items-center space-x-2">
              {/* <Button variant="ghost" size="icon">
                <ShoppingCart className="h-5 w-5" />             
              </Button> */}
              <Sheet
                open={openCartSheet}
                onOpenChange={() => setOpenCartSheet(false)}
              >
                <Button
                  onClick={() => setOpenCartSheet(true)}
                  variant="outline"
                  size="icon"
                  className="relative"
                >
                  <ShoppingCart className="w-6 text-red-400 h-6" />
                  <span className="absolute top-[-5px] right-[2px] font-bold text-sm">
                    {cartItems?.items?.length || 0}
                  </span>
                  <span className="sr-only">User cart</span>
                </Button>
                <UserCartWrapper
                  setOpenCartSheet={setOpenCartSheet}
                  cartItems={
                    cartItems && cartItems.items && cartItems.items.length > 0
                      ? cartItems.items
                      : []
                  }
                />
              </Sheet>
              <Button variant="ghost" size="icon">
                <Heart className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <RefreshCw className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="hidden md:flex mt-4">
          <ul className="flex space-x-6 text-sm">
            {mainNavItems.map((item) => (
              <li key={item}>
                <a href="#" className="hover:text-green-500">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Submenu */}
      {/* <div className="hidden md:block bg-gray-200 text-black">
        <div className="container mx-auto px-4 py-2">
          <div className="grid grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold mb-2">Laptop Brands</h3>
              <ul className="space-y-1 text-sm">
                {laptopBrands.map((brand) => (
                  <li key={brand}>
                    <a href="#" className="hover:text-green-700">
                      {brand}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Accessories</h3>
              <ul className="space-y-1 text-sm">
                {accessories.map((accessory) => (
                  <li key={accessory}>
                    <a href="#" className="hover:text-green-700">
                      {accessory}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div> */}
    </nav>
  );
}
