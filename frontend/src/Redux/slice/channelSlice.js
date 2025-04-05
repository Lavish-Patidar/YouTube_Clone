// frontend/src/Redux/channelSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// **Initial State**: Defines the initial values for the channel slice
const initialState = {
    channel: null,          
    loading: false,         
    error: null,            
    successMessage: null,   
};

// **Async Thunks: Handles API calls for channel-related operations**

/* 
  1. Create a channel 
  Sends a POST request with channel data to create a new channel.
*/
export const createChannel = createAsyncThunk(
    "channel/createChannel",
    async (channelData, { rejectWithValue }) => {
        try {
            const response = await axios.post("/api/v1/channel/create", channelData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`, // Attach authorization token
                },
            });
            return response.data.channel; // Return channel data on success
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || "Failed to create channel"); // Handle error
        }
    }
);

/* 
  2. Fetch channel data by ID
  Sends a GET request to fetch details of a specific channel.
*/
export const getChannel = createAsyncThunk(
    "channel/data",
    async (channelId, { rejectWithValue }) => {
        try {
            const response = await axios.get(`/api/v1/channel/data/${channelId}`);
            return response.data.data; // Return channel data on success
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || "Failed to fetch channel data");
        }
    }
);

/* 
  3. Update a channel 
  Sends a PUT request with updated data (e.g., title, description, or files).
*/
export const updateChannel = createAsyncThunk(
    "channel/updateChannel",
    async ({ channelId, formData }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`/api/v1/channel/update/${channelId}`, formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    "Content-Type": "multipart/form-data", // Required for file uploads
                },
            });
            return response.data.data; // Return updated channel data
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || "Failed to update channel");
        }
    }
);

/* 
  4. Delete a channel 
  Sends a DELETE request to delete a specific channel by ID.
*/
export const deleteChannel = createAsyncThunk(
    "channel/delete",
    async (channelId, { rejectWithValue }) => {
        try {
            const response = await axios.delete(`/api/v1/channel/delete/${channelId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            });
            return response.data.message; // Return success message on successful deletion
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || "Failed to delete channel");
        }
    }
);

/* 
  5. Subscribe to a channel 
  Sends a POST request to subscribe to a specific channel.
*/
export const subscribeChannel = createAsyncThunk(
    "channel/subscribe",
    async (channelId, { rejectWithValue }) => {
        try {
            const response = await axios.post(`/api/v1/channel/subscribe/${channelId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            });
            return response.data.message; // Return success message
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || "Failed to subscribe channel");
        }
    }
);

/* 
  6. Unsubscribe from a channel
  Sends a POST request to unsubscribe from a specific channel.
*/
export const unsubscribeChannel = createAsyncThunk(
    "channel/unsubscribe",
    async (channelId, { rejectWithValue }) => {
        try {
            const response = await axios.post(`/api/v1/channel/unsubscribe/${channelId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            });
            return response.data.message; // Return success message
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || "Failed to unsubscribe channel");
        }
    }
);

// **Slice Definition**
const channelSlice = createSlice({
    name: "channel", 
    initialState,    

    // **Synchronous Reducers**
    reducers: {
        // Clears any existing error message in the state
        clearError(state) {
            state.error = null;
        },
        // Clears any existing success message in the state
        clearSuccessMessage(state) {
            state.successMessage = null;
        },
    },

    // **Extra Reducers: Handles async thunk states (pending, fulfilled, rejected)**
    extraReducers: (builder) => {
        // Handle createChannel actions
        builder
            .addCase(createChannel.pending, (state) => {
                state.loading = true;          
                state.error = null;            
                state.successMessage = null;   
            })
            .addCase(createChannel.fulfilled, (state, action) => {
                state.loading = false;
                state.channel = action.payload; // Store newly created channel data
                state.successMessage = "Channel created successfully!";
            })
            .addCase(createChannel.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;   // Store error message
            });

        // Handle getChannel actions
        builder
            .addCase(getChannel.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getChannel.fulfilled, (state, action) => {
                state.loading = false;
                state.channel = action.payload; // Update channel data in the state
            })
            .addCase(getChannel.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;   // Store error message
            });

        // Handle updateChannel actions
        builder
            .addCase(updateChannel.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(updateChannel.fulfilled, (state, action) => {
                state.loading = false;
                state.channel = action.payload; // Update channel data
                state.successMessage = "Channel updated successfully!";
            })
            .addCase(updateChannel.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Handle deleteChannel actions
        builder
            .addCase(deleteChannel.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(deleteChannel.fulfilled, (state) => {
                state.loading = false;
                state.channel = null; // Clear channel data after deletion
            })
            .addCase(deleteChannel.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Handle subscribeChannel actions
        builder
            .addCase(subscribeChannel.fulfilled, (state) => {
                state.loading = false; // No additional state changes required
            })
            .addCase(subscribeChannel.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Handle unsubscribeChannel actions
        builder
            .addCase(unsubscribeChannel.fulfilled, (state) => {
                state.loading = false; // No additional state changes required
            })
            .addCase(unsubscribeChannel.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});


export const { clearError, clearSuccessMessage } = channelSlice.actions;


export default channelSlice.reducer;
