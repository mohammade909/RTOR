// usersSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";




export const addPlan = createAsyncThunk(
  "staff/addPlan",
  async ({ values }, thunkAPI) => {
    try {
      console.log(values)
      // Your asynchronous logic to update student here
      const response = await fetch(`https://api.r2rgloble.com/api/v1/plans/add`, {
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
export const addactivelevel = createAsyncThunk(
  "staff/addactivelevel",
  async ({ values }, thunkAPI) => {
    try {
      console.log(values)
      // Your asynchronous logic to update student here
      const response = await fetch(`https://api.r2rgloble.com/api/v1/plans/addactivelevel`, {
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
export const addinvestlevel = createAsyncThunk(
  "staff/addinvestlevel",
  async ({ values }, thunkAPI) => {
    try {
      console.log(values)
      // Your asynchronous logic to update student here
      const response = await fetch(`https://api.r2rgloble.com/api/v1/plans/addinvestlevel`, {
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
export const getAllPlans = createAsyncThunk(
  "staff/getAllPlans",
  async (_, thunkAPI) => {
    try {
      const response = await fetch("https://api.r2rgloble.com/api/v1/plans/list");

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

export const getPlan = createAsyncThunk(
  "staff/getPlan",
  async (id, thunkAPI) => {
    try {
      const response = await fetch(`https://api.r2rgloble.com/api/v1/plans/${id}`);

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
export const deletePlan = createAsyncThunk(
  "staff/deletePlan",
  async (id, thunkAPI) => {
    try {
      // Your asynchronous logic to delete student here
      const response = await fetch(`https://api.r2rgloble.com/api/v1/plans/${id}`, {
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
export const updatePlan = createAsyncThunk(
  "student/updatePlan",
  async ({ id, updatedData }, thunkAPI) => {
    try {
      // Your asynchronous logic to update student here
      const response = await fetch(`https://api.r2rgloble.com/api/v1/plans/${id}`, {
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
  allplans:null,
  singleplan:null,
  loading: false,
  error: null,
  message: null,
};

const planSlice = createSlice({
  name: "allplan",
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
      .addCase(getAllPlans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllPlans.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.allplans = action.payload.allplans;
      })
      .addCase(getAllPlans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })
      .addCase(getPlan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPlan.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.singleplan = action.payload.singleplan;
      })
      .addCase(getPlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })
      .addCase(deletePlan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePlan.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.message = action.payload.message;
        state.allplans = state.allplans.filter(
          (u) => u.id !== action.payload.Id
        );
      })
      .addCase(deletePlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })
      .addCase(updatePlan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePlan.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.message = action.payload.message;
      })
      .addCase(updatePlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })

      .addCase(addPlan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addPlan.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.message = action.payload.message;
      })
      .addCase(addPlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })




      .addCase(addactivelevel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addactivelevel.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.message = action.payload.message;
      })
      .addCase(addactivelevel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })






      .addCase(addinvestlevel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addinvestlevel.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.message = action.payload.message;
      })
      .addCase(addinvestlevel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })
  },
});

export const { clearErrors, clearMessage } = planSlice.actions;

export default planSlice.reducer;

