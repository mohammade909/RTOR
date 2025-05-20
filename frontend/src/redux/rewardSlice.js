import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "http://localhost:8000/api/v1/rewards"; // Change to your API URL

// Initialize User Rewards
export const initializeRewards = createAsyncThunk(
  "rewards/initialize",
  async (userId, { rejectWithValue }) => {
    console.log(userId)
    try {
      const response = await axios.post(`${BASE_URL}/initialize`, { user_id: userId });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error initializing rewards");
    }
  }
);

// Get User Rewards
export const fetchUserRewards = createAsyncThunk(
  "rewards/fetch",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/user/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error fetching rewards");
    }
  }
);

export const fetchRewards = createAsyncThunk(
  'rewards/fetchRewards',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch rewards');
    }
  }
);
export const fetchUserBusiness = createAsyncThunk(
  'rewards/fetchUserBusiness',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/user/business/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch rewards');
    }
  }
);
export const claimReward = createAsyncThunk(
  'rewards/claimReward',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/user/claim/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch rewards');
    }
  }
);

export const createReward = createAsyncThunk(
  'rewards/createReward',
  async (rewardData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/`, rewardData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to create reward');
    }
  }
);

export const updateReward = createAsyncThunk(
  'rewards/updateReward',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${BASE_URL}/${id}`, data);
      return { ...response.data, id, updatedData: data };
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to update reward');
    }
  }
);

export const deleteReward = createAsyncThunk(
  'rewards/deleteReward',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${BASE_URL}/${id}`);
      return { ...response.data, id };
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to delete reward');
    }
  }
);

const rewardsSlice = createSlice({
  name: "rewards",
  initialState: {
    rewards: [],
    loading: false,
    error: null,
    successMessage: null,
    totalBusiness:null
  },
  reducers: {
    clearMessages: (state) => {
      state.successMessage = null;
      state.error = null;
    },
    setSelectedReward: (state, action) => {
      state.selectedReward = action.payload;
    },
    clearSelectedReward: (state) => {
      state.selectedReward = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeRewards.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(initializeRewards.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
      })
      .addCase(initializeRewards.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchUserRewards.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserRewards.fulfilled, (state, action) => {
        state.loading = false;
        state.rewards = action.payload;
      })
      .addCase(fetchUserRewards.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchRewards.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRewards.fulfilled, (state, action) => {
        state.loading = false;
        state.rewards = action.payload.data;
        state.success = true;
      })
      .addCase(fetchRewards.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchUserBusiness.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserBusiness.fulfilled, (state, action) => {
        state.loading = false;
        state.totalBusiness = action.payload.data;
        state.success = true;
      })
      .addCase(fetchUserBusiness.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(claimReward.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(claimReward.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.successMessage ='Reward Claimed successfull!'
      })
      .addCase(claimReward.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create reward
      .addCase(createReward.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createReward.fulfilled, (state, action) => {
        state.loading = false;
        // Add the new reward if the response includes it
        if (action.payload.reward_id) {
          const newReward = {
            id: action.payload.reward_id,
            ...action.meta.arg
          };
          state.rewards.push(newReward);
        }
        state.success = true;
      })
      .addCase(createReward.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update reward
      .addCase(updateReward.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateReward.fulfilled, (state, action) => {
        state.loading = false;
        // Update the reward in the array
        const index = state.rewards.findIndex(reward => reward.id === action.payload.id);
        if (index !== -1) {
          state.rewards[index] = {
            ...state.rewards[index],
            ...action.payload.updatedData
          };
        }
        state.success = true;
      })
      .addCase(updateReward.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete reward
      .addCase(deleteReward.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteReward.fulfilled, (state, action) => {
        state.loading = false;
        // Remove the deleted reward from the array
        state.rewards = state.rewards.filter(reward => reward.id !== action.payload.id);
        state.success = true;
      })
      .addCase(deleteReward.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { 
  clearError, 
  clearSuccess, 
  setSelectedReward, 
  clearSelectedReward 
} = rewardsSlice.actions;
export default rewardsSlice.reducer;
