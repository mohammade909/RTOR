// usersSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const addWithdrawal = createAsyncThunk(
  "staff/addWithdrawal",
  async ({ values }, thunkAPI) => {
    try {
      console.log(values)
      const response = await fetch(`https://api.r2rgloble.com/api/v1/withdrawalrequest/add`, {
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
export const autoTransfer = createAsyncThunk(
  "withdrwal/autoTransfer",
  async (id, thunkAPI) => {
    try {
      const response = await fetch(`https://api.r2rgloble.com/api/v1/withdrawalrequest/auto-transfer/${id}`);

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

export const addROIWithdrawal = createAsyncThunk(
  "staff/addROIWithdrawal",
  async ({ values }, thunkAPI) => {
    try {
      console.log(values)
      const response = await fetch(`https://api.r2rgloble.com/api/v1/withdrawalrequest/add/roiwithdrawal`, {
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
export const WithdrawalPrinciple = createAsyncThunk(
  "staff/WithdrawalPrinciple",
  async ({ values }, thunkAPI) => {
    try {
      console.log(values)
      const response = await fetch(`https://api.r2rgloble.com/api/v1/withdrawalrequest/add/principle`, {
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

export const addCompoundWithdrawal = createAsyncThunk(
  "staff/addCompoundWithdrawal",
  async ({ values }, thunkAPI) => {
    try {
      console.log(values)
      const response = await fetch(`https://api.r2rgloble.com/api/v1/withdrawalrequest/addcompoundwithdrawal`, {
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

export const getAllWithdrawal = createAsyncThunk(
  "staff/getAllWithdrawal",
  async (_, thunkAPI) => {
    try {
      const response = await fetch("https://api.r2rgloble.com/api/v1/withdrawalrequest/list");

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
export const getAllWithdrawalByid = createAsyncThunk(
  "staff/getAllWithdrawalByid",
  async (user_id, thunkAPI) => {
    try {
      const response = await fetch(`https://api.r2rgloble.com/api/v1/withdrawalrequest/by/${user_id}`)

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

export const deleteWithdrawal = createAsyncThunk(
  "staff/deleteWithdrawal",
  async (id, thunkAPI) => {
    try {
      // Your asynchronous logic to delete student here
      const response = await fetch(`https://api.r2rgloble.com/api/v1/withdrawalrequest/${id}`, {
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

export const compoundAmount = createAsyncThunk(
  "staff/compoundAmount",
  async ({ values }, thunkAPI) => {
    try {
      console.log(values)
      const response = await fetch(`https://api.r2rgloble.com/api/v1/withdrawalrequest/compound/amount`, {
        method: "PUT",
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
export const updateWithdrawal = createAsyncThunk(
  "student/updateWithdrawal",
  async ({  id, status,amount,user_id }, thunkAPI) => {
    try {
      // Your asynchronous logic to update student here
      const response = await fetch(`https://api.r2rgloble.com/api/v1/withdrawalrequest/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({status,amount,user_id}),
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
export const updateROIWithdrawal = createAsyncThunk(
  "student/updateROIWithdrawal",
  async ({  id, status,amount,user_id }, thunkAPI) => {
    try {
      // Your asynchronous logic to update student here
      const response = await fetch(`https://api.r2rgloble.com/api/v1/withdrawalrequest/update/roi/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({status,amount,user_id}),
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
export const updatePrincipleWithdrawal = createAsyncThunk(
  "student/updatePrincipleWithdrawal",
  async ({  id, status,amount,user_id }, thunkAPI) => {
    try {
      // Your asynchronous logic to update student here
      const response = await fetch(`https://api.r2rgloble.com/api/v1/withdrawalrequest/update/principle/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({status,amount,user_id}),
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

export const updateCompoundWithdrawal = createAsyncThunk(
  "student/updateCompoundWithdrawal",
  async ({  id, status,amount,user_id }, thunkAPI) => {
    try {
      // Your asynchronous logic to update student here
      const response = await fetch(`https://api.r2rgloble.com/api/v1/withdrawalrequest/compound/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({status,amount,user_id}),
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
export const debitAmount = createAsyncThunk(
  "student/debitAmount",
  async (values, thunkAPI) => {
    try {
      // Your asynchronous logic to update student here
      const response = await fetch(`https://api.r2rgloble.com/api/v1/withdrawalrequest/debit`, {
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
  allwithdrawal:null,
  singleWithdrawal:null,
  loading: false,
  error: null,
  message: null,
};

const withdrawalSlice = createSlice({
  name: "allwithdrawal",
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
      .addCase(getAllWithdrawal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllWithdrawal.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.allwithdrawal = action.payload.allwithdrawal;
      })
      .addCase(getAllWithdrawal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })

      .addCase(getAllWithdrawalByid.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllWithdrawalByid.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.singleWithdrawal = action.payload.singleWithdrawal;
      })
      .addCase(getAllWithdrawalByid.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })
      .addCase(deleteWithdrawal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteWithdrawal.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.message = action.payload.message;
        state.allwithdrawal = state.allwithdrawal.filter(
          (u) => u.id !== action.payload.Id
        );
      })
      .addCase(deleteWithdrawal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })
      .addCase(updateWithdrawal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateWithdrawal.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.message = action.payload.message;
      })
      .addCase(updateWithdrawal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })




      .addCase(autoTransfer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(autoTransfer.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.message = "Your funds successfully transfer to active wallet";
      })
      .addCase(autoTransfer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })









      .addCase(debitAmount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(debitAmount.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.message = action.payload.message;
      })
      .addCase(debitAmount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })
      .addCase(addWithdrawal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addWithdrawal.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.message = action.payload.message;
      })
      .addCase(addWithdrawal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })
      .addCase(addCompoundWithdrawal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCompoundWithdrawal.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.message = action.payload.message;
      })
      .addCase(addCompoundWithdrawal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })
      .addCase(compoundAmount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(compoundAmount.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.message = action.payload.message;
      })
      .addCase(compoundAmount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })
      .addCase(updateCompoundWithdrawal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCompoundWithdrawal.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.message = action.payload.message;
      })
      .addCase(updateCompoundWithdrawal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })
      .addCase(updateROIWithdrawal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateROIWithdrawal.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.message = action.payload.message;
      })
      .addCase(updateROIWithdrawal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })
      .addCase(updatePrincipleWithdrawal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePrincipleWithdrawal.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.message = action.payload.message;
      })
      .addCase(updatePrincipleWithdrawal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })
      .addCase(addROIWithdrawal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })
      .addCase(addROIWithdrawal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addROIWithdrawal.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.message = action.payload.message;
      })
      .addCase(WithdrawalPrinciple.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })
      .addCase(WithdrawalPrinciple.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(WithdrawalPrinciple.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.message = action.payload.message;
      })
  },
});

export const { clearErrors, clearMessage } = withdrawalSlice.actions;

export default withdrawalSlice.reducer;

