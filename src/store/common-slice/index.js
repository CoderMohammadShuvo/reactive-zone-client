import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  featureImageList: [],
};

export const getFeatureImages = createAsyncThunk(
  "/order/getFeatureImages",
  async () => {
    const response = await axios.get(
      `https://reactive-zone-backend.vercel.app/api/common/feature/get`
    );
    return response.data;
  }
);

export const addFeatureImage = createAsyncThunk(
  "/order/addFeatureImage",
  async (image) => {
    const response = await axios.post(
      `http://localhost:5000/api/common/feature/add`,
      { image }
    );
    return response.data;
  }
);

export const updateFeatureImage = createAsyncThunk(
  "/order/updateFeatureImage",
  async ({ id, updatedImage }) => {
    const response = await axios.put(
      `http://localhost:5000/api/common/feature/update/${id}`,
      { image: updatedImage }
    );
    return response.data;
  }
);

export const deleteFeatureImage = createAsyncThunk(
  "/order/deleteFeatureImage",
  async (id) => {
    const response = await axios.delete(
      `http://localhost:5000/api/common/feature/delete/${id}`
    );
    return response.data;
  }
);

const commonSlice = createSlice({
  name: "commonSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getFeatureImages.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getFeatureImages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.featureImageList = action.payload.data;
      })
      .addCase(getFeatureImages.rejected, (state) => {
        state.isLoading = false;
        state.featureImageList = [];
      })
      .addCase(addFeatureImage.fulfilled, (state, action) => {
        state.featureImageList.push(action.payload.data);
      })
      .addCase(updateFeatureImage.fulfilled, (state, action) => {
        const updatedImage = action.payload.data;
        const index = state.featureImageList.findIndex(
          (image) => image.id === updatedImage.id
        );
        if (index !== -1) {
          state.featureImageList[index] = updatedImage;
        }
      })
      .addCase(deleteFeatureImage.fulfilled, (state, action) => {
        const deletedImageId = action.payload.data?._id;
        state.featureImageList = state.featureImageList.filter(
          (image) => image.id !== deletedImageId
        );
      });
  },
});

export default commonSlice.reducer;
