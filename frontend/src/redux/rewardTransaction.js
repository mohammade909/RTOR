import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "https://api.r2rgloble.com/api/v1"; // Base URL for all API endpoints

// Fetch transactions with filters and pagination
export const fetchTransactions = createAsyncThunk(
  "transactions/fetchAll",
  async (params = {}, { rejectWithValue }) => {
    try {
      const { page = 1, limit = 10, ...filters } = params ?? {}; // Ensure params is always an object

      // Build query params
      const queryParams = new URLSearchParams({ page, limit });

      // Add all filters to query params
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
          queryParams.append(key, value);
        }
      });

      const response = await axios.get(`${BASE_URL}/tr/rewards?${queryParams}`);
      console.log("API Response RAW:", response);
      console.log("API Response DATA:", response.data);
      
      if (!response.data || typeof response.data !== 'object') {
        console.error("Invalid response format:", response.data);
        return rejectWithValue("Invalid response format from server");
      }
      
      // Extract the data from the response
      const { transactions, pagination, totalPages, currentPage } = response.data;
      
      // Check if transactions exist in response
      if (!Array.isArray(transactions)) {
        console.error("Transactions is not an array:", transactions);
        return rejectWithValue("Transactions data is invalid");
      }
      
      // If pagination object exists in response, use it
      let paginationData = pagination;
      
      // If pagination doesn't exist but we have totalPages and currentPage
      if (!paginationData && totalPages !== undefined) {
        paginationData = {
          total: transactions.length * totalPages, // Estimate
          per_page: limit,
          current_page: currentPage || parseInt(page),
          last_page: totalPages,
          from: ((currentPage || parseInt(page)) - 1) * limit + 1,
          to: ((currentPage || parseInt(page)) - 1) * limit + transactions.length
        };
      } else if (!paginationData) {
        // Create a default pagination object if none exists
        paginationData = {
          total: transactions.length,
          per_page: parseInt(limit),
          current_page: parseInt(page),
          last_page: 1,
          from: transactions.length > 0 ? 1 : 0,
          to: transactions.length
        };
      }
      
      console.log("Returning to Redux:", { 
        transactions, 
        pagination: paginationData 
      });
      
      return { 
        transactions, 
        pagination: paginationData
      };
    } catch (error) {
      console.error("Fetch transactions error:", error);
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

// Fetch transactions for a specific user with filters
export const fetchUserTransactions = createAsyncThunk(
  "transactions/fetchByUser",
  async ({ userId, ...params }, { rejectWithValue }) => {
    try {
      const { page = 1, limit = 10, ...filters } = params;
      
      // Build query params
      const queryParams = new URLSearchParams();
      queryParams.append('user_id', userId);
      queryParams.append('page', page);
      queryParams.append('limit', limit);
      
      // Add all filters to query params
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          queryParams.append(key, value);
        }
      });
      
      const response = await axios.get(`${BASE_URL}/reward/transactions?${queryParams}`);
      console.log("User transactions response:", response.data);
      
      // Handle the same way as fetchTransactions
      const { transactions, pagination, totalPages, currentPage } = response.data;
      
      let paginationData = pagination;
      
      if (!paginationData && totalPages !== undefined) {
        paginationData = {
          total: transactions.length * totalPages,
          per_page: limit,
          current_page: currentPage || parseInt(page),
          last_page: totalPages,
          from: ((currentPage || parseInt(page)) - 1) * limit + 1,
          to: ((currentPage || parseInt(page)) - 1) * limit + transactions.length
        };
      } else if (!paginationData) {
        paginationData = {
          total: transactions.length,
          per_page: parseInt(limit),
          current_page: parseInt(page),
          last_page: 1,
          from: transactions.length > 0 ? 1 : 0,
          to: transactions.length
        };
      }
      
      return {
        transactions,
        pagination: paginationData
      };
    } catch (error) {
      console.error("Fetch user transactions error:", error);
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

const transactionSlice = createSlice({
  name: "transactions",
  initialState: {
    transactions: [],
    userTransactions: [],
    pagination: {
      total: 0,
      per_page: 10,
      current_page: 1,
      last_page: 1,
      from: 0,
      to: 0
    },
    userPagination: {
      total: 0,
      per_page: 10,
      current_page: 1,
      last_page: 1,
      from: 0,
      to: 0
    },
    loading: false,
    error: null,
    filters: {
      offer_id: '',
      status: '',
      offer_title: '',
      date_from: '',
      date_to: '',
      amount_min: '',
      amount_max: ''
    }
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = {
        offer_id: '',
        status: '',
        offer_title: '',
        date_from: '',
        date_to: '',
        amount_min: '',
        amount_max: ''
      };
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all transactions
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        console.log("Redux fulfilled action:", action);
        console.log("Redux fulfilled payload:", action.payload);
        
        // Ensure we have valid data
        if (action.payload && Array.isArray(action.payload.transactions)) {
          state.transactions = action.payload.transactions;
          
          if (action.payload.pagination) {
            state.pagination = action.payload.pagination;
          }
        } else {
          console.error("Invalid payload structure in fulfilled action:", action.payload);
          state.error = "Invalid data received from server";
        }
        
        state.loading = false;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        console.error("Redux rejected:", action);
        state.loading = false;
        state.error = action.payload || "Unknown error occurred";
      })
      
      // Fetch user transactions
      .addCase(fetchUserTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserTransactions.fulfilled, (state, action) => {
        console.log("User transactions fulfilled:", action.payload);
        
        if (action.payload && Array.isArray(action.payload.transactions)) {
          state.userTransactions = action.payload.transactions;
          
          if (action.payload.pagination) {
            state.userPagination = action.payload.pagination;
          }
        } else {
          console.error("Invalid user transactions payload:", action.payload);
          state.error = "Invalid user transaction data received";
        }
        
        state.loading = false;
      })
      .addCase(fetchUserTransactions.rejected, (state, action) => {
        console.error("User transactions rejected:", action);
        state.loading = false;
        state.error = action.payload || "Unknown error occurred";
      });
  },
});

export const { setFilters, resetFilters } = transactionSlice.actions;
export default transactionSlice.reducer;