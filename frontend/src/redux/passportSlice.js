// usersSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


export const addPassport = createAsyncThunk(
  "user/addPassport",
  async (formData, thunkAPI) => {
    try {
      const response = await fetch('https://api.r2rgloble.com/api/v1/passport/add', {
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
export const getAllPassport = createAsyncThunk(
  "staff/getAllPassport",
  async (_, thunkAPI) => {
    try {
      const response = await fetch("https://api.r2rgloble.com/api/v1/passport/list");

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
export const getPassportByid = createAsyncThunk(
  "staff/getPassportByid",
  async (user_id, thunkAPI) => {
    try {
      const response = await fetch(`https://api.r2rgloble.com/api/v1/passport/by/${user_id}`)

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

export const deletePassport = createAsyncThunk(
  "staff/deletePassport",
  async (id, thunkAPI) => {
    try {
      // Your asynchronous logic to delete student here
      const response = await fetch(`https://api.r2rgloble.com/api/v1/passport/${id}`, {
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
export const addTicket = createAsyncThunk(
  "user/addTicket",
  async (fdata, thunkAPI) => {
    try {
      const response = await fetch('https://api.r2rgloble.com/api/v1/passport/ticket', {
        method: 'POST',
        body: fdata,
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
  allpassport:null,
  singlepassport:null,
  loading: false,
  error: null,
  message: null,
};

const passportSlice = createSlice({
  name: "passport",
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
      .addCase(getAllPassport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllPassport.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.allpassport = action.payload.allpassport;
      })
      .addCase(getAllPassport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })

      .addCase(getPassportByid.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPassportByid.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.singlepassport = action.payload.singlepassport;
      })
      .addCase(getPassportByid.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })
      .addCase(deletePassport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePassport.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.message = action.payload.message;
        state.allpassport = state.allpassport?.filter(
          (u) => u.id !== action.payload.Id
        );
      })
      .addCase(deletePassport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })
      .addCase(addPassport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addPassport.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.message = action.payload.message;
      })
      .addCase(addPassport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })
      .addCase(addTicket.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addTicket.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.message = action.payload.message;
      })
      .addCase(addTicket.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })
  },
});

export const { clearErrors, clearMessage } = passportSlice.actions;

export default passportSlice.reducer;

