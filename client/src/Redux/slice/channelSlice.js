import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "./axiosConfig";

const initialState = {
    channel: null,
    loading: false,
    error: null,
    successMessage: null,
};

export const createChannel = createAsyncThunk(
    "channel/createChannel",
    async (channelData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/api/channel/create', channelData, {
                headers: {
                    "Content-Type": "application/json"
                }
            });
            return response.data.channel;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || "Failed to create channel");
        }
    }
);

export const getChannel = createAsyncThunk(
    "channel/data",
    async (channelId, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/api/channel/data/${channelId}`);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || "Failed to fetch channel data");
        }
    }
);

export const updateChannel = createAsyncThunk(
    "channel/updateChannel",
    async ({ channelId, formData }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(`/api/channel/update/${channelId}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || "Failed to update channel");
        }
    }
);

export const deleteChannel = createAsyncThunk(
    "channel/delete",
    async (channelId, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.delete(`/api/channel/delete/${channelId}`);
            return response.data.message;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || "Failed to delete channel");
        }
    }
);

export const subscribeChannel = createAsyncThunk(
    "channel/subscribe",
    async (channelId, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(`/api/channel/subscribe/${channelId}`);
            return response.data.message;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || "Failed to subscribe channel");
        }
    }
);

export const unsubscribeChannel = createAsyncThunk(
    "channel/unsubscribe",
    async (channelId, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(`/api/channel/unsubscribe/${channelId}`);
            return response.data.message;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || "Failed to unsubscribe channel");
        }
    }
);

const channelSlice = createSlice({
    name: "channel",
    initialState,
    reducers: {
        clearError(state) {
            state.error = null;
        },
        clearSuccessMessage(state) {
            state.successMessage = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createChannel.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(createChannel.fulfilled, (state, action) => {
                state.loading = false;
                state.channel = action.payload;
                state.successMessage = "Channel created successfully!";
            })
            .addCase(createChannel.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getChannel.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getChannel.fulfilled, (state, action) => {
                state.loading = false;
                state.channel = action.payload;
            })
            .addCase(getChannel.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateChannel.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(updateChannel.fulfilled, (state, action) => {
                state.loading = false;
                state.channel = action.payload;
                state.successMessage = "Channel updated successfully!";
            })
            .addCase(updateChannel.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deleteChannel.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(deleteChannel.fulfilled, (state) => {
                state.loading = false;
                state.channel = null;
            })
            .addCase(deleteChannel.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(subscribeChannel.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(subscribeChannel.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(unsubscribeChannel.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(unsubscribeChannel.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearError, clearSuccessMessage } = channelSlice.actions;
export default channelSlice.reducer;
