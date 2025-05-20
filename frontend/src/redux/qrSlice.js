// usersSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const addQrLink = createAsyncThunk(
  "staff/addQrLink",
  async (values , thunkAPI) => {
    try {
      const response = await fetch(`https://api.r2rgloble.com/api/v1/qr/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
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

export const getQrLink = createAsyncThunk(
  "staff/getQrLink",
  async (_, thunkAPI) => {
    try {
      const response = await fetch("https://api.r2rgloble.com/api/v1/qr");

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

export const deleteQrLink = createAsyncThunk(
  "staff/deleteQrLink",
  async (id, thunkAPI) => {
    try {
      // Your asynchronous logic to delete student here
      const response = await fetch(`https://api.r2rgloble.com/api/v1/qr/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
      const data = await response.json();
      return { Id: id, message: data.message };
    } catch (error) {
      // Handle error
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);



const initialState = {
  qr:null,
  loading: false,
  error: null,
  message: null,
};

const qrSlice = createSlice({
  name: "qrSlice",
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
      .addCase(getQrLink.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getQrLink.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.qr = action.payload.qr;
      })
      .addCase(getQrLink.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })
      .addCase(addQrLink.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addQrLink.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.message = action.payload.message;
      })
      .addCase(addQrLink.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })
      .addCase(deleteQrLink.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteQrLink.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.message = action.payload.message;
     
      })
      .addCase(deleteQrLink.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })
  },
});

export const { clearErrors, clearMessage } = qrSlice.actions;

export default qrSlice.reducer;

