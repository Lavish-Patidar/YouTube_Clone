// frontend/src/Redux/slice/commentsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

/* 
  **Async Thunks: Handle asynchronous API calls for comments**
*/

/* 
  1. Fetch Comments by Video ID
  Sends a GET request to retrieve comments associated with a specific video.
*/
export const fetchCommentsByVideoId = createAsyncThunk(
  'comments/fetchCommentsByVideoId',
  async (videoId) => {
    const response = await axios.get(`/api/v1/comments/video/${videoId}`);
    return response.data.data; // Return the fetched comments
  }
);

/* 
  2. Add a Comment
  Sends a POST request to add a new comment to a specific video.
*/
export const addComment = createAsyncThunk(
  'comments/addComment',
  async ({ videoId, comment }) => {
    const response = await axios.post(`/api/v1/comments/video/${videoId}`, { comment });
    return response.data.data; // Return the newly added comment
  }
);

/* 
  3. Delete a Comment
  Sends a DELETE request to remove a comment by its ID.
*/
export const deleteComment = createAsyncThunk(
  'comments/deleteComment',
  async ({ videoId, commentId }) => {
    await axios.delete(`/api/v1/comments/${commentId}`);
    return { videoId, commentId }; // Return videoId and deleted commentId for reference
  }
);

/* 
  4. Update a Comment
  Sends a PUT request to update the content of an existing comment.
*/
export const updateComment = createAsyncThunk(
  'comments/updateComment',
  async ({ videoId, commentId, newComment }) => {
    const response = await axios.put(`/api/v1/comments/${commentId}`, { newComment });
    return { videoId, commentId, updatedComment: response.data.data }; // Return updated comment data
  }
);

/* 
  **Slice Definition: Handles the state and actions for comments**
*/
const commentsSlice = createSlice({
  name: 'comments', // Name of the slice
  initialState: {
    comments: [],     // Holds the list of comments
    loading: false,   // Indicates if an async operation is in progress
    error: null,      // Holds error messages if any
  },
  reducers: {
    // No synchronous reducers are defined here
  },
  extraReducers: (builder) => {
    builder
      /* 
        Handle fetchCommentsByVideoId
        Updates the state with fetched comments on success.
      */
      .addCase(fetchCommentsByVideoId.fulfilled, (state, action) => {
        state.comments = action.payload; // Replace comments with fetched data
      })

      /* 
        Handle addComment
        Adds the newly created comment to the state.
      */
      .addCase(addComment.fulfilled, (state, action) => {
        state.comments.push(action.payload); // Append the new comment
      })

      /* 
        Handle deleteComment
        Removes a comment from the state based on its ID.
      */
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.comments = state.comments.filter(
          (comment) => comment._id !== action.payload.commentId
        ); // Filter out the deleted comment
      })

      /* 
        Handle updateComment
        Updates the content of a comment in the state.
      */
      .addCase(updateComment.fulfilled, (state, action) => {
        const index = state.comments.findIndex(
          (comment) => comment._id === action.payload.commentId
        );
        if (index !== -1) {
          state.comments[index] = action.payload.updatedComment; // Update the comment data
        }
      });
  },
});

export default commentsSlice.reducer;
