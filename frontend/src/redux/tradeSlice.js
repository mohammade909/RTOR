// src/redux/slices/roiSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
// Adjust this path as needed

// ✅ Async thunk to update ROI income for a user
export const makeTrade = createAsyncThunk(
  "roi/updateIncome",
  async ({ userId, pair }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `http://localhost:8000/api/v1/referral/self-trade/${userId}?pair=${pair}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const tradeSlice = createSlice({
  name: "trade",
  initialState: {
    loading: false,
    message: "",
    error: "",
  },
  reducers: {
    resetState: (state) => {
      state.loading = false;
      state.message = "";
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(makeTrade.pending, (state) => {
        state.loading = true;
        state.message = "";
        state.error = "";
      })
      .addCase(makeTrade.fulfilled, (state, action) => {
        state.loading = false;
        state.message = "Trade Successfull!";
      })
      .addCase(makeTrade.rejected, (state, action) => {
        state.loading = false;
        state.message = action.payload.message || "Failed to update ROI income";
      });
  },
});

export const { resetState } = tradeSlice.actions;

export default tradeSlice.reducer;
