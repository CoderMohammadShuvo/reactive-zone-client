import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice/index";
import authReducer2 from "./auth-slice/getUser";

import adminProductsSlice from "./admin/products-slice";
import adminOrderSlice from "./admin/order-slice";

import shopProductsSlice from "./shop/products-slice";
import shopCartSlice from "./shop/cart-slice";
import shopAddressSlice from "./shop/address-slice";
import shopOrderSlice from "./shop/order-slice";
import shopSearchSlice from "./shop/search-slice";
import shopReviewSlice from "./shop/review-slice";
import commonFeatureSlice from "./common-slice";
import AdminSaleSlice from "./admin/sale-slice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    getUser: authReducer2,

    adminProducts: adminProductsSlice,
    adminOrder: adminOrderSlice,
    adminSale: AdminSaleSlice,

    shopProducts: shopProductsSlice,
    shopCart: shopCartSlice,
    shopAddress: shopAddressSlice,
    shopOrder: shopOrderSlice,
    shopSearch: shopSearchSlice,
    shopReview: shopReviewSlice,

    commonFeature: commonFeatureSlice,
  },
});

export default store;
