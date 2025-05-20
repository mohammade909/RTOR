import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const sendOTP = createAsyncThunk(
    "staff/sendOTP",
    async ({ userId ,email}, thunkAPI) => {
      try {
        const response = await fetch(`http://localhost:8000/api/v1/otp/send`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({userId,email}),
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message);
        }
  
        const data = await response.json();
  
        return data;
      } catch (error) {
        // Handle error
        return thunkAPI.rejectWithValue({ error: error.message });
      }
    }
  );
export const verifyOTP = createAsyncThunk(
    "staff/verifyOTP",
    async ({ userId, otp  }, thunkAPI) => {
      try {
        const response = await fetch(`http://localhost:8000/api/v1/otp/verify`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({userId, otp }),
        });
  
        if (!response.ok) {
          const errorData = await response.json();
              
          throw new Error(errorData.message);
        }
  
        const data = await response.json();
  
        return data;
      } catch (error) {
        console.log(error);
        
        // Handle error
        return thunkAPI.rejectWithValue({ error: error.message });
      }
    }
  );


const otpSlice = createSlice({
  name: "otp",
  initialState: { loading: false, error: null, success:false,message:null },
  reducers: {
    clearOtpErrors: (state) => {
      state.error = null;
    },
    clearOtpMessage: (state) => {
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendOTP.pending, (state) => {
        state.loading = true;
      })
      .addCase(sendOTP.fulfilled, (state,action) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(sendOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(verifyOTP.pending, (state) => {
        state.loading = true;
      })
      .addCase(verifyOTP.fulfilled, (state) => {
        state.loading = false;
        state.success = true
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error
      });
  },
});
export const { clearOtpErrors, clearOtpMessage } = otpSlice.actions;

export default otpSlice.reducer;

