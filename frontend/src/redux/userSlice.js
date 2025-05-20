// usersSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const getAllUsers = createAsyncThunk(
  "staff/getAllUsers",
  async (page, thunkAPI) => {
    try {
      const response = await fetch(`https://api.r2rgloble.com/api/v1/users/list?page=${page}`);

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
export const getAllNonUsers = createAsyncThunk(
  "staff/getAllNonUsers",
  async (page, thunkAPI) => {
    try {
      const response = await fetch(`https://api.r2rgloble.com/api/v1/users/non/users`);

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
export const getAllRewards = createAsyncThunk(
  "staff/getAllRewards",
  async (_, thunkAPI) => {
    try {
      const response = await fetch("https://api.r2rgloble.com/api/v1/users/rewards");

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
export const getUser = createAsyncThunk(
  "staff/getUser",
  async (id, thunkAPI) => {
    try {
      const response = await fetch(`https://api.r2rgloble.com/api/v1/users/${id}`);

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
export const getUserbyemail = createAsyncThunk(
  "staff/getUserbyemail",
  async (userby, thunkAPI) => {
    try {
      console.log(userby)
      const response = await fetch(`https://api.r2rgloble.com/api/v1/users?email=${userby}`);

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
export const deleteUsers = createAsyncThunk(
  "staff/deleteUsers",
  async (id, thunkAPI) => {
    try {
      // Your asynchronous logic to delete student here
      const response = await fetch(`https://api.r2rgloble.com/api/v1/users/${id}`, {
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
export const updateUsers = createAsyncThunk(
  "student/updateUsers",
  async ({ id, updatedData }, thunkAPI) => {
    try {
      // Your asynchronous logic to update student here
      const response = await fetch(`https://api.r2rgloble.com/api/v1/users/${id}`, {
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
export const rewardNotification = createAsyncThunk(
  "student/rewardNotification",
  async (updatedData, thunkAPI) => {
    try {
      const response = await fetch(`https://api.r2rgloble.com/api/v1/users/send/reward`, {
        method: "POST",
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
export const defaulterNotification = createAsyncThunk(
  "student/defaulterNotification",
  async (id, thunkAPI) => {
    try {
      const response = await fetch(`https://api.r2rgloble.com/api/v1/users/get/defaulterreward/${id}`, {
        method: "get",
        headers: {
          "Content-Type": "application/json",
        },
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
  allusers:null,
  totalPages:null,
  userrewardnotification:null,
  allnonusers:null,
  allrewards:null,
  singleuser:null,
  emailuser:null,
  loading: false,
  error: null,
  message: null,
};

const userSlice = createSlice({
  name: "alluser",
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
      .addCase(getAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.allusers = action.payload.allusers;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })
      .addCase(getAllNonUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllNonUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.allnonusers = action.payload.allnonusers;
      })
      .addCase(getAllNonUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })
      .addCase(getAllRewards.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllRewards.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.allrewards = action.payload.allrewards;
      })
      .addCase(getAllRewards.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })
      .addCase(getUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.singleuser = action.payload.singleuser;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })
      .addCase(getUserbyemail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserbyemail.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.emailuser = action.payload.emailuser;
      })
      .addCase(getUserbyemail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })
      .addCase(deleteUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.message = action.payload.message;
        state.allusers = state.allusers.filter(
          (u) => u.id !== action.payload.Id
        );
      })
      .addCase(deleteUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })
      .addCase(updateUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.message = action.payload.message;
      })
      .addCase(updateUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })
      .addCase(rewardNotification.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(rewardNotification.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.message = action.payload.message;
      })
      .addCase(rewardNotification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })
      .addCase(defaulterNotification.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(defaulterNotification.fulfilled, (state, action) => {
        state.loading = false;
        state.userrewardnotification = action.payload.userrewardnotification;
      })
      .addCase(defaulterNotification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })
  },
});

export const { clearErrors, clearMessage } = userSlice.actions;

export default userSlice.reducer;

