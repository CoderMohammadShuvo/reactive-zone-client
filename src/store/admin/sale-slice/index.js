import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  SaleList: [],
  SaleDetails: null,
};

export const getAllSalesForAdmin = createAsyncThunk(
  "/order/getAllSalesForAdmin",
  async () => {
    const response = await axios.get(
      `https://reactive-zone-backend.vercel.app/api/admin/sales/get-all`
    );
    console.log(response.data, "response.data");
    return response.data;
  }
);

export const getSaleDetailsForAdmin = createAsyncThunk(
  "/order/getSaleDetailsForAdmin",
  async (id) => {
    const response = await axios.get(
      `https://reactive-zone-backend.vercel.app/api/admin/sales/get/${id}`
    );
    console.log(response.data, "response.data");
    return response.data;
  }
);

export const updateSaleStatus = createAsyncThunk(
  "/order/updateOrderStatus",
  async ({ id, orderStatus }) => {
    const response = await axios.put(
      `https://reactive-zone-backend.vercel.app/api/admin/sales/update/${id}`,
      {
        orderStatus,
      }
    );

    return response.data;
  }
);

const adminSaleSlice = createSlice({
  name: "adminSaleSlice",
  initialState,
  reducers: {
    resetSaleDetails: (state) => {
      console.log("resetSaleDetails");

      state.orderDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllSalesForAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllSalesForAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.SaleList = action.payload.data;
      })
      .addCase(getAllSalesForAdmin.rejected, (state) => {
        state.isLoading = false;
        state.SaleList = [];
      })
      .addCase(getSaleDetailsForAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getSaleDetailsForAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.SaleDetails = action.payload.data;
      })
      .addCase(getSaleDetailsForAdmin.rejected, (state) => {
        state.isLoading = false;
        state.SaleDetails = null;
      });
  },
});

export const { resetSaleDetails } = adminSaleSlice.actions;

export default adminSaleSlice.reducer;
