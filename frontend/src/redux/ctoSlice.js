// usersSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const getctoList = createAsyncThunk(
  "staff/getctoList",
  async (_, thunkAPI) => {
    try {
      const response = await fetch("https://api.r2rgloble.com/api/v1/cto/list");

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

export const checkCto = createAsyncThunk(
  "staff/checkCto",
  async (_, thunkAPI) => {
    try {
      const response = await fetch("https://api.r2rgloble.com/api/v1/cto");

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

export const getctoListByid = createAsyncThunk(
  "staff/getctoListByid",
  async (id, thunkAPI) => {
    try {
      const response = await fetch(
        `https://api.r2rgloble.com/api/v1/cto/byid/${id}`
      );

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
export const getctoTransListByid = createAsyncThunk(
  "staff/getctoTransListByid",
  async (id, thunkAPI) => {
    try {
      const response = await fetch(
        `https://api.r2rgloble.com/api/v1/cto/transaction/${id}`
      );

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
export const payToCto = createAsyncThunk(
  "staff/payToCto",
  async ({ values }, thunkAPI) => {
    try {
      console.log(values);
      const response = await fetch("https://api.r2rgloble.com/api/v1/cto/pay", {
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
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);

export const deleteCto = createAsyncThunk(
  "staff/deleteCto",
  async (id, thunkAPI) => {
    try {
      console.log(id);
      // Your asynchronous logic to delete student here
      const response = await fetch(`https://api.r2rgloble.com/api/v1/cto/${id}`, {
        method: "PUT",
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
  allcto: null,
  singlecto: null,
  singlectotransaction: null,
  loading: false,
  error: null,
  message: null,
};

const ctoSlice = createSlice({
  name: "ctoSlice",
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
      .addCase(getctoList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getctoList.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.allcto = action.payload.allcto;
      })
      .addCase(getctoList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })
      .addCase(getctoTransListByid.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getctoTransListByid.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.singlectotransaction = action.payload.singlectotransaction;
      })
      .addCase(getctoTransListByid.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })
      .addCase(checkCto.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkCto.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.message = action.payload.message;
      })
      .addCase(checkCto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })
      .addCase(getctoListByid.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getctoListByid.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.singlecto = action.payload.singlecto;
      })
      .addCase(getctoListByid.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })
      .addCase(deleteCto.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCto.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.message = action.payload.message;
      })
      .addCase(deleteCto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })
      .addCase(payToCto.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(payToCto.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.message = action.payload.message;
      })
      .addCase(payToCto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      });
  },
});

export const { clearErrors, clearMessage } = ctoSlice.actions;

export default ctoSlice.reducer;
