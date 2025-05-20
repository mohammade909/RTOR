// usersSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
export const addNews = createAsyncThunk(
  "staff/addNews",
  async ({ values }, thunkAPI) => {
    try {
      const response = await fetch(`https://api.r2rgloble.com/api/v1//news/add`, {
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

export const getAllNews = createAsyncThunk(
  "staff/getAllNews",
  async (_, thunkAPI) => {
    try {
      const response = await fetch("https://api.r2rgloble.com/api/v1//news/list");

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

export const getNews = createAsyncThunk(
  "staff/getNews",
  async (id, thunkAPI) => {
    try {
      const response = await fetch(`https://api.r2rgloble.com/api/v1//news/${id}`);

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
export const deleteNews = createAsyncThunk(
  "staff/deleteNews",
  async (id, thunkAPI) => {
    try {
      // Your asynchronous logic to delete student here
      const response = await fetch(`https://api.r2rgloble.com/api/v1//news/${id}`, {
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
export const updateNews = createAsyncThunk(
  "student/updateNews",
  async ({ id, updatedData }, thunkAPI) => {
    try {
      // Your asynchronous logic to update student here
      const response = await fetch(`https://api.r2rgloble.com/api/v1//news/${id}`, {
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

const initialState = {
  allnews:null,
  singlenews:null,
  loading: false,
  error: null,
  message: null,
};

const newslice = createSlice({
  name: "allnews",
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
      .addCase(getAllNews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllNews.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.allnews = action.payload.allnews;
      })
      .addCase(getAllNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })
      .addCase(getNews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getNews.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.singlenews = action.payload.singlenews;
      })
      .addCase(getNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })
      .addCase(deleteNews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteNews.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.message = action.payload.message;
        state.allnews = state.allnews.filter(
          (u) => u.id !== action.payload.Id
        );
      })
      .addCase(deleteNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })
      .addCase(updateNews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateNews.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.message = action.payload.message;
      })
      .addCase(updateNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })

      .addCase(addNews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addNews.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.message = action.payload.message;
      })
      .addCase(addNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })
  },
});

export const { clearErrors, clearMessage } = newslice.actions;

export default newslice.reducer;

