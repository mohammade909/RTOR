// usersSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


export const addActPlan = createAsyncThunk(
  "staff/addActPlan",
  async ({ values }, thunkAPI) => {
    try {
      const response = await fetch(`https://api.r2rgloble.com/api/v1/actplan/add`, {
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

export const getAllActPlan = createAsyncThunk(
  "staff/getAllActPlan",
  async (_, thunkAPI) => {
    try {
      const response = await fetch("https://api.r2rgloble.com/api/v1/actplan/list");

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

export const getActPlan = createAsyncThunk(
  "staff/getActPlan",
  async (id, thunkAPI) => {
    try {
      const response = await fetch(`https://api.r2rgloble.com/api/v1/actplan/${id}`);

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
export const deleteActPlan = createAsyncThunk(
  "staff/deleteActPlan",
  async (id, thunkAPI) => {
    try {
      // Your asynchronous logic to delete student here
      const response = await fetch(`https://api.r2rgloble.com/api/v1/actplan/${id}`, {
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
export const updateActPlan = createAsyncThunk(
  "student/updateActPlan",
  async ({ id, updatedData }, thunkAPI) => {
    try {
      // Your asynchronous logic to update student here
      const response = await fetch(`https://api.r2rgloble.com/api/v1/actplan/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
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
  allactplans:null,
  singleactplan:null,
  loading: false,
  error: null,
  message: null,
};

const actplanSlice = createSlice({
  name: "allactplan",
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
      .addCase(getAllActPlan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllActPlan.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.allactplans = action.payload.allactplans;
      })
      .addCase(getAllActPlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })
      .addCase(getActPlan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getActPlan.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.singleactplan = action.payload.singleactplan;
      })
      .addCase(getActPlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })
      .addCase(deleteActPlan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteActPlan.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.message = action.payload.message;
        state.allactplans = state.allactplans.filter(
          (u) => u.id !== action.payload.Id
        );
      })
      .addCase(deleteActPlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })
      .addCase(updateActPlan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateActPlan.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.message = action.payload.message;
      })
      .addCase(updateActPlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })

      .addCase(addActPlan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addActPlan.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.message = action.payload.message;
      })
      .addCase(addActPlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })
  },
});

export const { clearErrors, clearMessage } = actplanSlice.actions;

export default actplanSlice.reducer;

