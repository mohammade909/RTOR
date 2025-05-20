// usersSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// export const addDeposite = createAsyncThunk(
//   "staff/addDeposite",
//   async ({ values }, thunkAPI) => {
//     try {
//       console.log(values)
//       const response = await fetch(`https://api.r2rgloble.com/api/v1/deposite/add`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(values),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message);
//       }

//       const data = await response.json();

//       return data;
//     } catch (error) {
//       // Handle error
//       return thunkAPI.rejectWithValue({ error: error.message });
//     }
//   }
// );
export const addDeposite = createAsyncThunk(
  "user/addDeposite",
  async (formData, thunkAPI) => {
    try {
      const response = await fetch('https://api.r2rgloble.com/api/v1/deposite/add', {
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
export const getAllDeposite = createAsyncThunk(
  "staff/getAllDeposite",
  async (_, thunkAPI) => {
    try {
      const response = await fetch("https://api.r2rgloble.com/api/v1/deposite/list");

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
export const getAllDepositeByid = createAsyncThunk(
  "staff/getAllDepositeByid",
  async (user_id, thunkAPI) => {
    try {
      const response = await fetch(`https://api.r2rgloble.com/api/v1/deposite/by/${user_id}`)

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

export const deleteDeposite = createAsyncThunk(
  "staff/deleteDeposite",
  async (id, thunkAPI) => {
    try {
      // Your asynchronous logic to delete student here
      const response = await fetch(`https://api.r2rgloble.com/api/v1/deposite/${id}`, {
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
export const updateDeposite = createAsyncThunk(
  "student/updateDeposite",
  async ({ id, status,amount,user_id }, thunkAPI) => {
    try {
      // Your asynchronous logic to update student here
      const response = await fetch(`https://api.r2rgloble.com/api/v1/deposite/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({status,amount,user_id }),
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
  alldeposite:null,
  singleDeposite:null,
  loading: false,
  error: null,
  message: null,
};

const depositeSlice = createSlice({
  name: "alldeposite",
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
      .addCase(getAllDeposite.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllDeposite.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.alldeposite = action.payload.alldeposite;
      })
      .addCase(getAllDeposite.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })

      .addCase(getAllDepositeByid.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllDepositeByid.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.singleDeposite = action.payload.singleDeposite;
      })
      .addCase(getAllDepositeByid.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })
      .addCase(deleteDeposite.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteDeposite.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.message = action.payload.message;
        state.alldeposite = state.alldeposite?.filter(
          (u) => u.id !== action.payload.Id
        );
      })
      .addCase(deleteDeposite.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })
      .addCase(updateDeposite.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDeposite.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.message = action.payload.message;
      })
      .addCase(updateDeposite.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })

      .addCase(addDeposite.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addDeposite.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.message = action.payload.message;
      })
      .addCase(addDeposite.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })
  },
});

export const { clearErrors, clearMessage } = depositeSlice.actions;

export default depositeSlice.reducer;

