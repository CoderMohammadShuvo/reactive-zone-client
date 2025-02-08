import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isAuthenticated: false,
  isLoading: false,
  user: null,
  loggedInUsers: [],
};

export const getLoggedInUsers2 = createAsyncThunk(
  "/admin/logged-in-users",
  async () => {
    const response = await axios.get(
      "https://reactive-zone-backend-niuu.vercel.app/api/admin/logged-in-users",
      {
        withCredentials: true,
      }
    );
    return response.data;
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {},
  },
  extraReducers: (builder) => {
    builder
      // Other cases remain unchanged
      .addCase(getLoggedInUsers2.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getLoggedInUsers2.fulfilled, (state, action) => {
        state.isLoading = false;
        state.loggedInUsers = action.payload.success
          ? action.payload.users
          : [];
      })
      .addCase(getLoggedInUsers2.rejected, (state, action) => {
        state.isLoading = false;
        state.loggedInUsers = [];
      });
  },
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;
