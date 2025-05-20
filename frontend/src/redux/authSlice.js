// authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (values, thunkAPI) => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/auth/signin", {
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

export const loginAdmin = createAsyncThunk(
  "auth/loginAdmin",
  async (values, thunkAPI) => {
    try {
      console.log(values);
      // Your asynchronous logic to authenticate user here
      const response = await fetch(
        "http://localhost:8000/api/v1/auth/adminsignin",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.log(errorData);
        throw new Error(errorData.message);
      }

      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      // Handle error
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);
export const signupUser = createAsyncThunk(
  "auth/signupUser",
  async (values, thunkAPI) => {
    try {
      // Your asynchronous logic to authenticate user here
      const response = await fetch(
        "http://localhost:8000/api/v1/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.log(errorData);
        throw new Error(errorData.error);
      }

      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      console.log(error);
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);
export const sendVerificationEmail = createAsyncThunk(
  "auth/verifyEmail",
  async (values, thunkAPI) => {
    try {
      // Your asynchronous logic to authenticate user here
      const response = await fetch(
        "http://localhost:8000/api/v1/auth/email-verification",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.log(errorData);
        throw new Error(errorData.error);
      }

      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      console.log(error);
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);
export const verifyEmailCode = createAsyncThunk(
  "auth/verifyEmailCode",
  async (values, thunkAPI) => {
    try {
      // Your asynchronous logic to authenticate user here
      const response = await fetch(
        "http://localhost:8000/api/v1/auth/verify-code",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.log(errorData);
        throw new Error(errorData.error);
      }

      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      console.log(error);
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);
export const signoutuser = createAsyncThunk(
  "auth/signoutuser",
  async (_, thunkAPI) => {
    try {
      localStorage.removeItem("auth");
      const response = await fetch("http://localhost:8000/api/v1/auth/signout");
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
export const signoutadmin = createAsyncThunk(
  "auth/signoutadmin",
  async (_, thunkAPI) => {
    try {
      localStorage.removeItem("auth");
      const response = await fetch(
        "http://localhost:8000/api/v1/auth/signoutadmin"
      );
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
// export const ChangePassword = createAsyncThunk(
//   "user/ChangePassword",
//   async (values, thunkAPI) => {
//     try {
//       // Your asynchronous logic to authenticate user here
//       console.log(values)
//       const response = await fetch("http://localhost:8000/api/v1/auth/changepassword", {
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

const initialState = {
  auth: null,
  admin: null,
  loading: false,
  error: null,
  message: null,
  expireAt: null,         // Make sure this exists
  adminExpireAt: null,
};

const authSlice = createSlice({
  name: "auth",
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
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.auth = action.payload.auth;
        state.expireAt = action.payload.expireAt;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })
      .addCase(loginAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.admin = action.payload.admin;
        state.adminExpireAt = action.payload.expireAt;
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.auth = action.payload.auth;
        state.message = action.payload.message;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })
      .addCase(sendVerificationEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendVerificationEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.message = "Verification email sent!";
      })
      .addCase(sendVerificationEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })
      .addCase(verifyEmailCode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyEmailCode.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.message = "Email Verified Successfully!";
      })
      .addCase(verifyEmailCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })
      .addCase(signoutuser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signoutuser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.auth = null;
      })
      .addCase(signoutuser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })
      .addCase(signoutadmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signoutadmin.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.admin = null;
      })
      .addCase(signoutadmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      });
    // .addCase(ChangePassword.pending, (state) => {
    //   state.loading = true;
    //   state.error = null;
    // })
    // .addCase(ChangePassword.fulfilled, (state, action) => {
    //   state.loading = false;
    //   state.error = null;
    //   state.message = action.payload.message;
    // })
    // .addCase(ChangePassword.rejected, (state, action) => {
    //   state.loading = false;
    //   state.error = action.payload.error;
    // })
  },
});

export const { clearErrors, clearMessage } = authSlice.actions;

export default authSlice.reducer;
