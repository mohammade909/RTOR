// forgotSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
export const sendForgotLink = createAsyncThunk(
  "pass/sendForgotLink",
  async (forgotData, thunkAPI) => {
    try {
      const response = await fetch('https://api.r2rgloble.com/api/v1/pass/forget', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(forgotData), 
      });
      console.log(response)
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);
export const resetPassword = createAsyncThunk(
  "pass/resetPassword",
  async (forgotData, thunkAPI) => {
    try {
      const response = await fetch('https://api.r2rgloble.com/api/v1/pass/reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(forgotData), 
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);


const initialState = {
  loading: false,
  error: null,
  message: null,
};

const forgotSlice = createSlice({
  name: "forgot",
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    },
    clearMessage: (state) => {
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendForgotLink.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendForgotLink.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.message = action.payload.message;
      })
      .addCase(sendForgotLink.rejected, (state, action) => {
        state.loading = false;
        state.error = "User Not Found";
      })
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.message = "Password change successfuly";
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error =action.payload.error;
      })
  },
});

export const { clearErrors, clearMessage } = forgotSlice.actions;

export default forgotSlice.reducer;

