// src/features/salary/salarySlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
const baseurl ='https://api.goldfoxmarket.com'
// Async thunks for API calls
export const fetchUserSalaries = createAsyncThunk(
  'salary/fetchUserSalaries',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${baseurl}/api/v1/salary/user-salaries`, { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchSalaryTransactions = createAsyncThunk(
  'salary/fetchSalaryTransactions',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${baseurl}/api/v1/salary/transactions`, { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchTodaySalaryStats = createAsyncThunk(
  'salary/fetchTodaySalaryStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${baseurl}/api/v1/salary/today-stats`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchUserSalaryHistory = createAsyncThunk(
  'salary/fetchUserSalaryHistory',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${baseurl}/api/v1/salary/user-history/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchSalaryTierStats = createAsyncThunk(
  'salary/fetchSalaryTierStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${baseurl}api/v1/salary/tier-stats`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchAdminSalaryDashboard = createAsyncThunk(
  'salary/fetchAdminSalaryDashboard',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${baseurl}/api/v1/salary/admin-dashboard`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Initial state
const initialState = {
  userSalaries: {
    data: [],
    total: 0,
    totalPages: 0,
    currentPage: 1,
    loading: false,
    error: null
  },
  transactions: {
    data: [],
    total: 0,
    totalPages: 0,
    currentPage: 1,
    loading: false,
    error: null
  },
  todayStats: {
    data: null,
    loading: false,
    error: null
  },
  userHistory: {
    data: null,
    loading: false,
    error: null
  },
  tierStats: {
    data: null,
    loading: false,
    error: null
  },
  adminDashboard: {
    data: null,
    loading: false,
    error: null
  }
};

// Slice
const salarySlice = createSlice({
  name: 'salary',
  initialState,
  reducers: {
    resetUserHistory: (state) => {
      state.userHistory = {
        data: null,
        loading: false,
        error: null
      };
    }
  },
  extraReducers: (builder) => {
    // User Salaries
    builder
      .addCase(fetchUserSalaries.pending, (state) => {
        state.userSalaries.loading = true;
        state.userSalaries.error = null;
      })
      .addCase(fetchUserSalaries.fulfilled, (state, action) => {
        state.userSalaries.loading = false;
        state.userSalaries.data = action.payload.data;
        state.userSalaries.total = action.payload.total;
        state.userSalaries.totalPages = action.payload.total_pages;
        state.userSalaries.currentPage = action.payload.current_page;
      })
      .addCase(fetchUserSalaries.rejected, (state, action) => {
        state.userSalaries.loading = false;
        state.userSalaries.error = action.payload?.message || 'Failed to fetch user salaries';
      })

    // Salary Transactions  
      .addCase(fetchSalaryTransactions.pending, (state) => {
        state.transactions.loading = true;
        state.transactions.error = null;
      })
      .addCase(fetchSalaryTransactions.fulfilled, (state, action) => {
        state.transactions.loading = false;
        state.transactions.data = action.payload.data;
        state.transactions.total = action.payload.total;
        state.transactions.totalPages = action.payload.total_pages;
        state.transactions.currentPage = action.payload.current_page;
      })
      .addCase(fetchSalaryTransactions.rejected, (state, action) => {
        state.transactions.loading = false;
        state.transactions.error = action.payload?.message || 'Failed to fetch salary transactions';
      })

    // Today's Stats
      .addCase(fetchTodaySalaryStats.pending, (state) => {
        state.todayStats.loading = true;
        state.todayStats.error = null;
      })
      .addCase(fetchTodaySalaryStats.fulfilled, (state, action) => {
        state.todayStats.loading = false;
        state.todayStats.data = action.payload;
      })
      .addCase(fetchTodaySalaryStats.rejected, (state, action) => {
        state.todayStats.loading = false;
        state.todayStats.error = action.payload?.message || 'Failed to fetch today\'s stats';
      })

    // User Salary History
      .addCase(fetchUserSalaryHistory.pending, (state) => {
        state.userHistory.loading = true;
        state.userHistory.error = null;
      })
      .addCase(fetchUserSalaryHistory.fulfilled, (state, action) => {
        state.userHistory.loading = false;
        state.userHistory.data = action.payload;
      })
      .addCase(fetchUserSalaryHistory.rejected, (state, action) => {
        state.userHistory.loading = false;
        state.userHistory.error = action.payload?.message || 'Failed to fetch user salary history';
      })

    // Salary Tier Stats
      .addCase(fetchSalaryTierStats.pending, (state) => {
        state.tierStats.loading = true;
        state.tierStats.error = null;
      })
      .addCase(fetchSalaryTierStats.fulfilled, (state, action) => {
        state.tierStats.loading = false;
        state.tierStats.data = action.payload;
      })
      .addCase(fetchSalaryTierStats.rejected, (state, action) => {
        state.tierStats.loading = false;
        state.tierStats.error = action.payload?.message || 'Failed to fetch salary tier stats';
      })

    // Admin Dashboard
      .addCase(fetchAdminSalaryDashboard.pending, (state) => {
        state.adminDashboard.loading = true;
        state.adminDashboard.error = null;
      })
      .addCase(fetchAdminSalaryDashboard.fulfilled, (state, action) => {
        state.adminDashboard.loading = false;
        state.adminDashboard.data = action.payload;
      })
      .addCase(fetchAdminSalaryDashboard.rejected, (state, action) => {
        state.adminDashboard.loading = false;
        state.adminDashboard.error = action.payload?.message || 'Failed to fetch admin dashboard';
      });
  }
});

export const { resetUserHistory } = salarySlice.actions;
export default salarySlice.reducer;