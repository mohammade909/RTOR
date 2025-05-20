// usersSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const addTopup = createAsyncThunk(
  "staff/addTopup",
  async ({ values }, thunkAPI) => {
    try {

      const response = await fetch(`https://api.r2rgloble.com/api/v1/topup/add`, {
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

export const entryPlanActivation = createAsyncThunk(
  "staff/entryPlanActivation",
  async ({ id ,userby_id}, thunkAPI) => {
    try {
      console.log(id)
      const response = await fetch(`https://api.r2rgloble.com/api/v1/topup/entry`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({id,userby_id}),
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
// export const addRecharge = createAsyncThunk(
//   "user/addRecharge",
//   async (formData, thunkAPI) => {
//     try {
//       const response = await fetch('https://api.r2rgloble.com/api/v1/topup/recharge', {
//         method: 'POST',
//         body: formData,
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message);
//       }

//       const data = await response.json();
//       return data;
//     } catch (error) {
//       return thunkAPI.rejectWithValue({ error: error.message });
//     }
//   }
// );
export const getAllTopup = createAsyncThunk(
  "staff/getAllTopup",
  async (_, thunkAPI) => {
    try {
      const response = await fetch("https://api.r2rgloble.com/api/v1/topup/list");

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
export const getAllTopupByid = createAsyncThunk(
  "staff/getAllTopupByid",
  async (user_id, thunkAPI) => {
    try {
      const response = await fetch(`https://api.r2rgloble.com/api/v1/topup/by/${user_id}`)

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

export const deleteTopup = createAsyncThunk(
  "staff/deleteTopup",
  async (id, thunkAPI) => {
    try {
      // Your asynchronous logic to delete student here
      const response = await fetch(`https://api.r2rgloble.com/api/v1/topup/${id}`, {
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
export const updateTopup = createAsyncThunk(
  "student/updateTopup",
  async ({ id, updatedData }, thunkAPI) => {
    try {
        console.log( id, updatedData)
      // Your asynchronous logic to update student here
      const response = await fetch(`https://api.r2rgloble.com/api/v1/topup/${id}`, {
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
export const addReTopup = createAsyncThunk(
  "staff/addReTopup",
  async ({ values }, thunkAPI) => {
    try {
      const response = await fetch(`https://api.r2rgloble.com/api/v1/topup/addretopup`, {
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
const initialState = {
  alltopup:null,
  singletopup:null,
  loading: false,
  error: null,
  message: null,
};

const topupSlice = createSlice({
  name: "alltopup",
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
      .addCase(getAllTopup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllTopup.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.alltopup = action.payload.alltopup;
      })
      .addCase(getAllTopup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })

      .addCase(getAllTopupByid.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllTopupByid.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.singletopup = action.payload.singletopup;
      })
      .addCase(getAllTopupByid.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })
      .addCase(deleteTopup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTopup.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.message = action.payload.message;
        state.alltopup = state.alltopup?.filter(
          (u) => u.id !== action.payload.Id
        );
      })
      .addCase(deleteTopup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })
      .addCase(updateTopup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTopup.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.message = action.payload.message;
      })
      .addCase(updateTopup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })

      .addCase(addTopup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addTopup.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.message = action.payload.message;
      })
      .addCase(addTopup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })

      .addCase(addReTopup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addReTopup.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.message = action.payload.message;
      })
      .addCase(addReTopup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })

      .addCase(entryPlanActivation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(entryPlanActivation.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.message = action.payload.message;
      })
      .addCase(entryPlanActivation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })

  },
});

export const { clearErrors, clearMessage } = topupSlice.actions;

export default topupSlice.reducer;

