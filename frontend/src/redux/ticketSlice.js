import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const BASEURL  =`http://localhost:8000`; // Adjust the path based on your project structure

// Create a ticket
export const createTicket = createAsyncThunk(
  "tickets/createTicket",
  async (ticketData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASEURL}/api/v1/tickets`,
        ticketData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

// Add a response to a ticket
export const addTicketResponse = createAsyncThunk(
  "tickets/addTicketResponse",
  async ({ ticketId, responseData }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASEURL}/api/v1/tickets/${ticketId}/responses`,
        responseData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

// Fetch all tickets for a user
export const fetchTicketsByUser = createAsyncThunk(
  "tickets/fetchTicketsByUser",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${BASEURL}/api/v1/tickets/${userId}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);
export const fetchTicketById = createAsyncThunk(
  "tickets/fetchTicketById",
  async (ticketId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${BASEURL}/api/v1/tickets/single/${ticketId}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

// Fetch all tickets (admin view)
export const fetchAllTickets = createAsyncThunk(
  "tickets/fetchAllTickets",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASEURL}/api/v1/tickets`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

// Fetch all responses for a ticket
export const fetchTicketResponses = createAsyncThunk(
  "tickets/fetchTicketResponses",
  async (ticketId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${BASEURL}/api/v1/ticket-responses/${ticketId}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

// Update ticket status
export const updateTicketStatus = createAsyncThunk(
  "tickets/updateTicketStatus",
  async ({ ticketId, status }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${BASEURL}/api/v1/tickets/${ticketId}/status`,
        { status }
      );
      console.log(response.data)
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

// Initial state for tickets
const initialState = {
  tickets: [],
  ticket: null,
  responses: [],
  loading: false,
  error: null,
  success: false,
  message: null,
};

const ticketSlice = createSlice({
  name: "tickets",
  initialState,
  reducers: {
    resetState: (state) => {
      state.success = false;
      state.error = null;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    // Create ticket
    builder
      .addCase(createTicket.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTicket.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = "Ticket created successfully!";
        state.tickets.push(action.payload);
      })
      .addCase(createTicket.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Add ticket response
    builder
      .addCase(addTicketResponse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addTicketResponse.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = "Response added successfully!";
        state.responses.push(action.payload);
      })
      .addCase(addTicketResponse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch tickets by user
    builder
      .addCase(fetchTicketsByUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTicketsByUser.fulfilled, (state, action) => {
        state.loading = false;
        state.tickets = action.payload.tickets;
      })
      .addCase(fetchTicketsByUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    builder
      .addCase(fetchTicketById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTicketById.fulfilled, (state, action) => {
        state.loading = false;
        state.ticket = action.payload.ticket;
      })
      .addCase(fetchTicketById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch all tickets (admin)
    builder
      .addCase(fetchAllTickets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllTickets.fulfilled, (state, action) => {
        state.loading = false;
        state.tickets = action.payload.tickets;
      })
      .addCase(fetchAllTickets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch ticket responses
    builder
      .addCase(fetchTicketResponses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTicketResponses.fulfilled, (state, action) => {
        state.loading = false;
        state.responses = action.payload.responses;
      })
      .addCase(fetchTicketResponses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update ticket status
    builder
      .addCase(updateTicketStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTicketStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = "Ticket status updated successfully!";
        const index = state.tickets.findIndex(
          (ticket) => ticket.ticket_id === action.payload.ticket_id
        );
        if (index !== -1) {
          state.tickets[index].status = action.payload.status;
        }
      })
      .addCase(updateTicketStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetState } = ticketSlice.actions;
export default ticketSlice.reducer;
