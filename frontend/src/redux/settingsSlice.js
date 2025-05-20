// usersSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";



export const getSettings = createAsyncThunk(
  "staff/getSettings",
  async (_, thunkAPI) => {
    try {
      const response = await fetch("https://api.r2rgloble.com/api/v1/settings");

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


export const updateSettings = createAsyncThunk(
  "student/updateSettings",
  async (values , thunkAPI) => {
    try {
      // Your asynchronous logic to update student here
      const response = await fetch(`https://api.r2rgloble.com/api/v1/settings`, {
        method: "PUT",
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

const initialState = {
  settings:null,
  loading: false,
  error: null,
  message: null,
};

const settingsSlice = createSlice({
  name: "settingsSlice",
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
      .addCase(getSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.settings = action.payload.settings;
      })
      .addCase(getSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })

   
      .addCase(updateSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.message = action.payload.message;
      })
      .addCase(updateSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })

     
  },
});

export const { clearErrors, clearMessage } = settingsSlice.actions;

export default settingsSlice.reducer;

