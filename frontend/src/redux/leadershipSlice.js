// usersSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


export const getAllLeadership = createAsyncThunk(
  "staff/getAllLeadership",
  async (_, thunkAPI) => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/leadership/list");

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
export const getAllLeadershipByid = createAsyncThunk(
  "staff/getAllLeadershipByid",
  async ({user_id}, thunkAPI) => {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/leadership/by/${user_id}`)

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

export const deleteleadership = createAsyncThunk(
  "staff/deleteleadership",
  async (id, thunkAPI) => {
    try {
      // Your asynchronous logic to delete student here
      const response = await fetch(`http://localhost:8000/api/v1/leadership/${id}`, {
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
    allleadership:null,
    singleleadership:null,
  loading: false,
  error: null,
  message: null,
};

const leadershipSlice = createSlice({
  name: "allleadership",
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
      .addCase(getAllLeadership.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllLeadership.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.allleadership = action.payload.allleadership;
      })
      .addCase(getAllLeadership.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })

      .addCase(getAllLeadershipByid.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllLeadershipByid.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.singleleadership = action.payload.singleleadership;
      })
      .addCase(getAllLeadershipByid.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })
      .addCase(deleteleadership.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteleadership.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.message = action.payload.message;
        state.allleadership = state.allleadership?.filter(
          (u) => u.id !== action.payload.Id
        );
      })
      .addCase(deleteleadership.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })
     
  },
});

export const { clearErrors, clearMessage } = leadershipSlice.actions;

export default leadershipSlice.reducer;

