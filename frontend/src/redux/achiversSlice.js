// achiversSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


export const addAchivers = createAsyncThunk(
  "Achiver/addAchivers",
  async (formData, thunkAPI) => {
    try {
      const response = await fetch('https://api.r2rgloble.com/api/v1/achivers/add', {
        method: 'POST',
        body: formData,
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
export const getAllAchivers = createAsyncThunk(
  "staff/getAllAchivers",
  async (_, thunkAPI) => {
    try {
      const response = await fetch("https://api.r2rgloble.com/api/v1/achivers/list");

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

export const deleteAchivers = createAsyncThunk(
  "staff/deleteAchivers",
  async (id, thunkAPI) => {
    try {
      // Your asynchronous logic to delete student here
      const response = await fetch(`https://api.r2rgloble.com/api/v1/achivers/${id}`, {
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
  allachivers:null,
  loading: false,
  error: null,
  message: null,
};

const achiversSlice = createSlice({
  name: "achivers",
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
      .addCase(getAllAchivers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllAchivers.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.allachivers = action.payload.allachivers;
      })
      .addCase(getAllAchivers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })

      .addCase(deleteAchivers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAchivers.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.message = action.payload.message;
        state.allachivers = state.allachivers?.filter(
          (u) => u.id !== action.payload.Id
        );
      })
      .addCase(deleteAchivers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })
      .addCase(addAchivers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addAchivers.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.message = action.payload.message;
      })
      .addCase(addAchivers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })
  },
});

export const { clearErrors, clearMessage } = achiversSlice.actions;

export default achiversSlice.reducer;

