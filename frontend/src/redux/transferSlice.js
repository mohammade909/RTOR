// usersSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const transfertouser = createAsyncThunk(
  "tra/transfertouser",
  async ({values} , thunkAPI) => {
    try {
      console.log(values)
      const response = await fetch(`https://api.r2rgloble.com/api/v1/transfer/touser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({values}),
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

export const FriendTopup = createAsyncThunk(
  "tra/FriendTopup",
  async ({values} , thunkAPI) => {
    try {
      console.log(values)
      const response = await fetch(`https://api.r2rgloble.com/api/v1/transfer/friend`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({values}),
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

export const getTransfer = createAsyncThunk(
  "tran/getTransfer",
  async (_, thunkAPI) => {
    try {
      const response = await fetch("https://api.r2rgloble.com/api/v1/transfer/list");

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

export const getTransferById = createAsyncThunk(
  "tran/getTransferById",
  async (user_id , thunkAPI) => {
    try {
      const response = await fetch(`https://api.r2rgloble.com/api/v1/transfer/byid/${user_id}`, {
       
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


const initialState = {
  alltransfer: null,
  transfer: null,
  loading: false,
  error: null,
  message: null,
};

const transferSlice = createSlice({
  name: "transferSlice",
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
      .addCase(transfertouser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(transfertouser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.message = action.payload.message;
      })
      .addCase(transfertouser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })
      .addCase(getTransfer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTransfer.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.alltransfer = action.payload.alltransfer;
      })
      .addCase(getTransfer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })
      .addCase(getTransferById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTransferById.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.transfer = action.payload.transfer;
      })
      .addCase(getTransferById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })
      .addCase(FriendTopup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(FriendTopup.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.message = action.payload.message;
      })
      .addCase(FriendTopup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })
  },
});

export const { clearErrors, clearMessage } = transferSlice.actions;

export default transferSlice.reducer;

