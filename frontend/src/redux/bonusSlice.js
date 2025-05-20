import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const BASEURL = 'http://localhost:8000' 
// Change this as needed

// Fetch all bonuses
export const fetchBonuses = createAsyncThunk(
  "bonuses/fetchBonuses",
  async () => {
    const response = await axios.get(`${BASEURL}/api/v1/bonus`);
    return response.data;
  }
);

// Create a new bonus
export const createBonus = createAsyncThunk(
  "bonuses/createBonus",
  async (bonusData) => {
    const response = await axios.post(`${BASEURL}/bonus`, bonusData);
    return response.data;
  }
);
export const claimBonus = createAsyncThunk(
  "bonuses/claimBonus",
  async ({ user_id, bonus_type, plan_id }) => {
    const response = await axios.post(`${BASEURL}/api/v1/bonus/claim`, {
      user_id,
      bonus_type,
      plan_id
    });
    return response.data;
  }
);

// Update an existing bonus
export const updateBonus = createAsyncThunk(
  "bonuses/updateBonus",
  async ({ id, data }) => {
    const response = await axios.put(`${BASEURL}/api/v1/bonus/${id}`, data);
    return response.data;
  }
);

// Delete a bonus
export const deleteBonus = createAsyncThunk(
  "bonuses/deleteBonus",
  async (id) => {
    await axios.delete(`${BASEURL}/bonus/${id}`);
    return id;
  }
);

const bonusesSlice = createSlice({
  name: "bonuses",
  initialState: {
    bonuses: [],
    loading: false,
    error: null,
    message: null,
  },
  reducers: {
    resetState: (state) => {
      state.loading = false;
      state.error = null;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchBonuses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBonuses.fulfilled, (state, action) => {
        state.loading = false;
        state.bonuses = action.payload;
      })
      .addCase(fetchBonuses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Create
      .addCase(createBonus.fulfilled, (state, action) => {
        state.bonuses.push(action.payload);
      })
      .addCase(createBonus.rejected, (state, action) => {
        state.error = action.error.message;
      })

      .addCase(claimBonus.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(claimBonus.fulfilled, (state, action) => {
        state.loading = false;
        state.message = "Bonus has been claimed";
      })
      .addCase(claimBonus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.error;
      })

      .addCase(updateBonus.pending, (state, action) => {
        state.loading = true;
      })
      // Update
      .addCase(updateBonus.fulfilled, (state, action) => {
        const index = state.bonuses.findIndex(
          (b) => b.id === action.payload.id
        );
        if (index !== -1) {
          state.bonuses[index] = action.payload;
        }
        state.loading = false
        state.message = "Bonus Updated Successfully!"
      })
      .addCase(updateBonus.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // Delete
      .addCase(deleteBonus.fulfilled, (state, action) => {
        state.bonuses = state.bonuses.filter((b) => b.id !== action.payload);
      })
      .addCase(deleteBonus.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});
export const { resetState } = bonusesSlice.actions;
export default bonusesSlice.reducer;
