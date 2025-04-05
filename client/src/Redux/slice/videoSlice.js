// frontend/src/Redux/slice/videoSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import BackendURL from './Constant/ServerURL';

/*
  **Initial State**
  - `videos`: List of all videos.
  - `userVideos`: Videos uploaded by a specific user.
  - `video`: Details of a single video.
  - `loading`: Tracks loading state during API requests.
  - `error`: Stores error messages if requests fail.
  - `status`: General status flag (optional, can be expanded for other use cases).
*/
const initialState = {
  videos: [],
  userVideos: [],
  video: null,
  loading: false,
  error: null,
  status: false,
};

/*
  **Async Thunks**
  - Thunks handle asynchronous operations (API calls).
*/

// Fetch all videos
export const fetchAllVideos = createAsyncThunk(
  '/api/videos/allVideo',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BackendURL}/api/videos/allVideo`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// Fetch videos by a specific user
export const fetchAllUserVideos = createAsyncThunk(
  '/api/videos/allUserVideo',
  async (ownerId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BackendURL}/api/videos/allUserVideo/${ownerId}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// Fetch video details by ID
export const fetchVideoById = createAsyncThunk(
  '/api/videos/videoData',
  async (videoId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BackendURL}/api/videos/videoData/${videoId}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// Publish a new video
export const publishVideo = createAsyncThunk(
  '/api/videos/publish',
  async (videoData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BackendURL}/api/videos/publish`, videoData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// Delete a video by ID
export const deleteVideo = createAsyncThunk(
  '/api/videos/delete',
  async (videoId, { rejectWithValue }) => {
    try {
      await axios.delete(`${BackendURL}/api/videos/delete/${videoId}`);
      return videoId; // Return deleted video ID to update state
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// Increment views on a video
export const incrementView = createAsyncThunk(
  '/api/videos/incrementView',
  async (videoId, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${BackendURL}/api/videos/incrementView/${videoId}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// Like a video
export const likeVideo = createAsyncThunk(
  'video/likeVideo',
  async ({ videoId, userId }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BackendURL}/api/videos/like`, { videoId, userId });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// Remove a like from a video
export const removeLikeVideo = createAsyncThunk(
  'video/removeLikeVideo',
  async ({ videoId, userId }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BackendURL}/api/videos/removelike`, { videoId, userId });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// Update video details
export const updateVideo = createAsyncThunk(
  '/api/videos/update',
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${BackendURL}/api/videos/update/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data.video;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

/*
  **Video Slice**
  - Contains reducers and extraReducers to handle synchronous and asynchronous actions.
*/
const videoSlice = createSlice({
  name: 'videos',
  initialState,
  reducers: {
    resetUserVideos: (state) => {
      state.userVideos = []; // Reset the userVideos state
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all videos
      .addCase(fetchAllVideos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllVideos.fulfilled, (state, action) => {
        state.loading = false;
        state.videos = action.payload;
      })
      .addCase(fetchAllVideos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch user videos
      .addCase(fetchAllUserVideos.fulfilled, (state, action) => {
        state.loading = false;
        state.userVideos = action.payload;
      })

      // Fetch video details
      .addCase(fetchVideoById.fulfilled, (state, action) => {
        state.loading = false;
        state.video = action.payload;
      })

      // Publish a video
      .addCase(publishVideo.fulfilled, (state, action) => {
        state.loading = false;
        state.videos.push(action.payload);
      })

      // Delete a video
      .addCase(deleteVideo.fulfilled, (state, action) => {
        state.loading = false;
        state.videos = state.videos.filter((video) => video._id !== action.payload);
        state.userVideos = state.userVideos.filter((video) => video._id !== action.payload);
      })

      // Increment views
      .addCase(incrementView.fulfilled, (state, action) => {
        const updatedVideo = action.payload;
        const index = state.videos.findIndex((video) => video._id === updatedVideo._id);
        if (index !== -1) {
          state.videos[index] = updatedVideo;
        }
      })

      // Like a video
      .addCase(likeVideo.fulfilled, (state, action) => {
        if (state.video) {
          state.video.likes.push(action.payload.userId);
        }
      })

      // Remove a like
      .addCase(removeLikeVideo.fulfilled, (state, action) => {
        if (state.video) {
          state.video.likes = state.video.likes.filter((id) => id !== action.payload.userId);
        }
      })

      // Update a video
      .addCase(updateVideo.fulfilled, (state, action) => {
        state.video = action.payload;
      });
  },
});

export const { resetUserVideos } = videoSlice.actions;

export default videoSlice.reducer;
