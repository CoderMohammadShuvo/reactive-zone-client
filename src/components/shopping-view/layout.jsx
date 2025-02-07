import { Outlet } from "react-router-dom";
import ShoppingHeader from "./header";
import { FaArrowRight } from "react-icons/fa6";
import { BsFacebook } from "react-icons/bs";
import { GrYoutube } from "react-icons/gr";
import { IoIosArrowDown } from "react-icons/io";

function ShoppingLayout() {
  return (
    <div className="flex flex-col bg-white overflow-hidden">
      {/* common header */}
      <ShoppingHeader />
      <main className="flex flex-col w-full">
        <Outlet />
      </main>
      <footer className="w-full bg-[#000000] text-white py-8 px-4 sm:px-6 lg:px-12">
        {/* Newsletter Section */}
        <div className="max-w-lg mx-auto text-center flex flex-col gap-4">
          <p className="text-lg sm:text-2xl font-medium">
            Subscribe to our Newsletter
          </p>
          <div className="cursor-pointer p-3 border border-white flex justify-between items-center rounded-md">
            <p className="text-sm sm:text-base">Email</p>
            <FaArrowRight />
          </div>
        </div>

        {/* Links Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-10 lg:gap-12 w-full max-w-5xl mx-auto mt-8">
          <div>
            <h1 className="text-lg sm:text-xl font-bold">Our Policies</h1>
            <p className="text-sm mt-2">Privacy Policy</p>
            <p className="text-sm">Refund Policy</p>
            <p className="text-sm">Terms of Service</p>
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold">About Us</h1>
            <p className="text-sm mt-2">Our Mission</p>
            <p className="text-sm">Our Vision</p>
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold">Our Slogan</h1>
            <p className="text-sm mt-2">
              Fashion That Defines You and Boosts Confidence
            </p>
          </div>
        </div>

        {/* Social Media Section */}
        <div className="flex justify-center gap-6 mt-6">
          <BsFacebook className="text-xl sm:text-2xl cursor-pointer" />
          <GrYoutube className="text-xl sm:text-2xl cursor-pointer" />
        </div>

        {/* Language Selector */}
        <div className="w-full max-w-xs mx-auto mt-6">
          <p className="text-sm">Language</p>
          <div className="cursor-pointer p-2 border border-white flex justify-between items-center rounded-md w-full mt-2">
            <p className="text-sm">English</p>
            <IoIosArrowDown />
          </div>
          <p className="text-xs sm:text-sm text-center mt-4">
            © 2025, Captain Fashion BD. Powered by FathSoft.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default ShoppingLayout;
