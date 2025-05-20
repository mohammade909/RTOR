// usersSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const createOffer = createAsyncThunk(
  "offer/create",
  async (values, thunkAPI) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/offers/create`,
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
export const MineReward = createAsyncThunk(
  "offer/MineReward",
  async (values, thunkAPI) => {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/offers/mine`, {
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
      console.log(data);

      return data;
    } catch (error) {
      // Handle error
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);

export const fetchOffers = createAsyncThunk(
  "offer/fetchOffers",
  async (_, thunkAPI) => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/offers");

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

export const fetchOfferById = createAsyncThunk(
  "offer/fetchOfferById",
  async (id, thunkAPI) => {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/offers/${id}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
      const data = await response.json();
      console.log(data)
      return data;
    } catch (error) {
      // Handle error
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);

export const fetchReferredUsers = createAsyncThunk(
  "offer/fetchReferredUsers",
  async ({ userId, startDate, endDate, userPlanVal }, thunkAPI) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/offers/referred/${userId}/${startDate}/${endDate}/${userPlanVal}`
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

export const fecthUserOffers = createAsyncThunk(
  "offer/fecthUserOffers",
  async (id, thunkAPI) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/offers/user/${id}`
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
export const deleteOffer = createAsyncThunk(
  "offer/deleteOffer",
  async (id, thunkAPI) => {
    try {
      // Your asynchronous logic to delete student here
      const response = await fetch(
        `http://localhost:8000/api/v1/offers/delete/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
      const data = await response.json();
      console.log(data);

      return id;
    } catch (error) {
      // Handle error
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);
export const updateOffer = createAsyncThunk(
  "student/updateOffer",
  async ({ id, updatedData }, thunkAPI) => {
    try {
      // Your asynchronous logic to update student here
      const response = await fetch(
        `http://localhost:8000/api/v1/offers/update/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
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

const initialState = {
  offers: [],
  offerDetails: null,
  userOffers: [],
  loading: false,
  error: null,
  message: null,
};

const offerSlice = createSlice({
  name: "offers",
  initialState,
  reducers: {
    resetState: (state) => {
      state.error = null;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOfferById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOfferById.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.offerDetails = action.payload;
      })
      .addCase(fetchOfferById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })
      .addCase(fetchOffers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOffers.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.offers = action.payload;
      })
      .addCase(fetchOffers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })
      .addCase(fetchReferredUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReferredUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.offerDetails = action.payload;
      })
      .addCase(fetchReferredUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })
      .addCase(fecthUserOffers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fecthUserOffers.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.offers = action.payload;
      })
      .addCase(fecthUserOffers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })
      .addCase(deleteOffer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteOffer.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.message = "Offer has been deleted";
        state.offers = state.offers.filter(
          (off) => off.offer_id !== action.payload
        );
      })
      .addCase(deleteOffer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })
      .addCase(updateOffer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOffer.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.message = "update offer successfully";
      })
      .addCase(updateOffer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })

      .addCase(createOffer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOffer.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.message = "Offer has been created successfully";
      })
      .addCase(createOffer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      });
  },
});

export const { resetState } = offerSlice.actions;

export default offerSlice.reducer;
