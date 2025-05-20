// usersSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const addSupport = createAsyncThunk(
  "staff/addSupport",
  async ({ values }, thunkAPI) => {
    try {
      console.log(values)
      const response = await fetch(`http://localhost:8000/api/v1/support/add`, {
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

export const getAllSupport = createAsyncThunk(
  "staff/getAllSupport",
  async (_, thunkAPI) => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/support/list");

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

export const getSingleSupport = createAsyncThunk(
  "staff/getSingleSupport",
  async (user_id, thunkAPI) => {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/support/by/${user_id}`);

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
export const deleteSupport = createAsyncThunk(
  "staff/deleteSupport",
  async (id, thunkAPI) => {
    try {
      // Your asynchronous logic to delete student here
      const response = await fetch(`http://localhost:8000/api/v1/support/${id}`, {
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
export const updateSupport = createAsyncThunk(
  "student/updateSupport",
  async ({ id, updatedData }, thunkAPI) => {
    try {
        console.log( id, updatedData)
      // Your asynchronous logic to update student here
      const response = await fetch(`http://localhost:8000/api/v1/support/${id}`, {
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
  allsupport:null,
  singlesupport:null,
  loading: false,
  error: null,
  message: null,
};

const supportSlice = createSlice({
  name: "allsupport",
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
      .addCase(getAllSupport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllSupport.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.allsupport = action.payload.allsupport;
      })
      .addCase(getAllSupport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })

      .addCase(getSingleSupport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSingleSupport.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.singlesupport = action.payload.singlesupport;
      })
      .addCase(getSingleSupport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })
      .addCase(deleteSupport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSupport.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.message = action.payload.message;
        state.allsupport = state.allsupport?.filter(
          (u) => u.id !== action.payload.Id
        );
      })
      .addCase(deleteSupport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })
      .addCase(updateSupport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSupport.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.message = action.payload.message;
      })
      .addCase(updateSupport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })

      .addCase(addSupport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addSupport.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.message = action.payload.message;
      })
      .addCase(addSupport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })
  },
});

export const { clearErrors, clearMessage } = supportSlice.actions;

export default supportSlice.reducer;

