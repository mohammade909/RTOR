// usersSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const BASEURL = "https://api.r2rgloble.com";

export const getTransaction = createAsyncThunk(
  "transaction/getTransaction",
  async ({ table_name }, thunkAPI) => {
    try {
      // Your asynchronous logic to update student here
      const response = await fetch(`https://api.r2rgloble.com/api/v1/tr/list`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(table_name),
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

export const getTransactionById = createAsyncThunk(
  "staff/getTransactionById",
  async ({ table_name, user_id }, thunkAPI) => {
    try {
      console.log(table_name, user_id);
      const response = await fetch(
        `https://api.r2rgloble.com/api/v1/tr/tr/${user_id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ table_name }),
        }
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

export const fetchTransactionSummary = createAsyncThunk(
  'transactionSummary/fetch',
  async (month = null, { rejectWithValue }) => {
    try {
      const url = month 
        ? `https://api.r2rgloble.com/api/v1/tr/matrix?month=${month}` 
        : 'https://api.r2rgloble.com/api/v1/tr/matrix';
      
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch transaction summary');
    }
  }
);
// Create transaction async thunk
export const createTransaction = createAsyncThunk(
  "transactions/createTransaction",
  async (transactionData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASEURL}/api/v1/tr/create`,
        transactionData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Get all transactions async thunk with pagination, filters and search
export const getTransactions = createAsyncThunk(
  "transactions/getTransactions",
  async (params, { rejectWithValue }) => {
    const {
      page = 1,
      limit = 10,
      transaction_type,
      source,
      status,
      search,
    } = params || {};
    try {
      const queryParams = new URLSearchParams();
      if (page) queryParams.append("page", page);
      if (limit) queryParams.append("limit", limit);
      if (transaction_type)
        queryParams.append("transaction_type", transaction_type);
      if (source) queryParams.append("source", source);
      if (status) queryParams.append("status", status);
      if (search) queryParams.append("search", search);

      const response = await axios.get(
        `${BASEURL}/api/v1/tr/all?${queryParams.toString()}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Get user transactions async thunk
export const getUserTransactions = createAsyncThunk(
  "transactions/getUserTransactions",
  async (params, { rejectWithValue }) => {
    const {
      user_id,
      page = 1,
      limit = 10,
      transaction_type,
      source,
      status,
      search,
    } = params || {};
    try {
      const queryParams = new URLSearchParams();
      if (page) queryParams.append("page", page);
      if (limit) queryParams.append("limit", limit);
      if (transaction_type)
        queryParams.append("transaction_type", transaction_type);
      if (source) queryParams.append("source", source);
      if (status) queryParams.append("status", status);
      if (search) queryParams.append("search", search);

      console.log(queryParams.toString());
      const response = await axios.get(
        `${BASEURL}/api/v1/tr/user/${user_id}?${queryParams.toString()}`
      );
      console.log(response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Get user details with transactions
export const getUserDetailsWithTransactions = createAsyncThunk(
  "transactions/getUserDetailsWithTransactions",
  async (user_id, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${BASEURL}/api/v1/transactions/user/${user_id}/details`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Update transaction status
export const updateTransactionStatus = createAsyncThunk(
  "transactions/updateTransactionStatus",
  async ({ transaction_id, status }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `${BASEURL}/api/v1/transactions/${transaction_id}`,
        { status }
      );
      return { transaction_id, status, message: response.data.message };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  transaction: null,
  alltransaction: null,
  transactions: [],
  userTransactions: [],
  summary: [],
  userDetails: null,
  totalPages: 0,
  currentPage: 1,
  loading: false,
  error: null,
  success: false,
  message: null,
};

const transactionSlice = createSlice({
  name: "transactionSlice",
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    },
    clearMessage: (state) => {
      state.message = null;
    },
    resetTransactionState: (state) => {
      state.success = false;
      state.error = null;
      state.message = "";
    },
    clearTransactions: (state) => {
      state.transactions = [];
      state.userTransactions = [];
      state.totalPages = 0;
      state.currentPage = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTransactionById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTransactionById.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.transaction = action.payload.transaction;
      })
      .addCase(getTransactionById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })
      .addCase(getTransaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTransaction.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.alltransaction = action.payload.alltransaction;
      })
      .addCase(getTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })
      .addCase(createTransaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTransaction.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;
      })
      .addCase(createTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to create transaction";
      })

      // Get all transactions cases
      .addCase(getTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload.transactions;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(getTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch transactions";
      })

      // Get user transactions cases
      .addCase(getUserTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.userTransactions = action.payload.transactions;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(getUserTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Failed to fetch user transactions";
      })

      // Get user details with transactions cases
      .addCase(getUserDetailsWithTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserDetailsWithTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.userDetails = action.payload.user;
        state.userTransactions = action.payload.transactions;
      })
      .addCase(getUserDetailsWithTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch user details";
      })

      // Update transaction status cases
      .addCase(updateTransactionStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTransactionStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;
        // Update the status in the transactions list
        const { transaction_id, status } = action.payload;
        if (state.transactions.length > 0) {
          const transactionIndex = state.transactions.findIndex(
            (t) => t.transaction_id === transaction_id
          );
          if (transactionIndex !== -1) {
            state.transactions[transactionIndex].status = status;
          }
        }
        if (state.userTransactions.length > 0) {
          const userTransactionIndex = state.userTransactions.findIndex(
            (t) => t.transaction_id === transaction_id
          );
          if (userTransactionIndex !== -1) {
            state.userTransactions[userTransactionIndex].status = status;
          }
        }
      })
      .addCase(updateTransactionStatus.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Failed to update transaction status";
      }).addCase(fetchTransactionSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactionSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.summary = action.payload.data;
      })
      .addCase(fetchTransactionSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch transaction summary';
      });
  },
});

export const {
  clearErrors,
  clearMessage,
  resetTransactionState,
  clearTransactions,
} = transactionSlice.actions;

export default transactionSlice.reducer;
