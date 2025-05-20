import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "https://api.r2rgloble.com/api/v1";

// Async thunk to create multiple codes
export const createCodes = createAsyncThunk(
  "codes/createCodes",
  async (codes, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/codes`, {
        codes,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk to fetch all codes
export const fetchCodes = createAsyncThunk(
  "codes/fetchCodes",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/codes`);
      const codeValues = response.data.codes.map(codeObj => codeObj.code);

      return codeValues;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk to fetch a code by ID
export const fetchCodeById = createAsyncThunk(
  "codes/fetchCodeById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/codes/${id}`);
      return response.data.code;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const codesSlice = createSlice({
  name: "codes",
  initialState: {
    codes: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createCodes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCodes.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(createCodes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchCodes.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCodes.fulfilled, (state, action) => {
        state.loading = false;
        state.codes = action.payload;
      })
      .addCase(fetchCodes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchCodeById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCodeById.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(fetchCodeById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default codesSlice.reducer;
