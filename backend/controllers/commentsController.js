//backend/controllers/commentsController.js
// Import necessary modules and utilities
import { Comment } from '../models/CommentModel.js'; // Comment model
import { asyncHandler } from "../utils/asyncHandler.js"; // Async error handling wrapper
import { ApiResponse } from "../utils/ApiResponse.js"; // Standardized API response format
import { ApiError } from "../utils/ApiError.js"; // Custom error handler

// Get all comments for a specific video
export const getCommentsByVideoId = asyncHandler(async (req, res) => {
  // Fetch comments using the video ID from request parameters
  const comments = await Comment.find({ videoId: req.params.videoId });

  // Send success response with the fetched comments
  res
    .status(200)
    .json(new ApiResponse(200, comments, "Comments fetched successfully"));
});

// Add a new comment to a video
export const addComment = asyncHandler(async (req, res) => {
  const { comment } = req.body; // Extract comment text from request body

  // Validate that the comment text is provided
  if (!comment) {
    throw new ApiError(400, "Comment text is required");
  }

  // Create a new comment document in the database
  const newComment = await Comment.create({
    text: comment,           // Comment text
    userName: req.user.name, // Name of the user (from auth middleware)
    userId: req.user._id,    // ID of the user (from auth middleware)
    userAvatar: req.user.avatar, // User avatar (if available)
    videoId: req.params.videoId, // Video ID from request parameters
  });

  // Send success response with the newly created comment
  res
    .status(201)
    .json(new ApiResponse(201, newComment, "Comment added successfully"));
});

// Delete a comment
export const deleteComment = asyncHandler(async (req, res) => {
  // Fetch the comment by its ID from request parameters
  const comment = await Comment.findById(req.params.commentId);

  // If the comment doesn't exist, throw a 404 error
  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  // Authorization check: Ensure the user deleting the comment is the comment owner
  if (comment.userId.toString() !== req.user.id) {
    throw new ApiError(403, "Not authorized to delete this comment");
  }

  // Delete the comment from the database
  await comment.deleteOne();

  // Send success response indicating the comment was deleted
  res
    .status(200)
    .json(new ApiResponse(200, {}, "Comment deleted successfully"));
});

// Update an existing comment
export const updateComment = asyncHandler(async (req, res) => {
  const { newComment } = req.body; // Extract updated comment text from request body

  // Validate that the updated comment text is provided
  if (!newComment) {
    throw new ApiError(400, "Updated comment text is required");
  }

  // Find the comment by its ID from request parameters
  const comment = await Comment.findById(req.params.commentId);

  // If the comment doesn't exist, throw a 404 error
  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  // Authorization check: Ensure the user updating the comment is the comment owner
  if (comment.userId.toString() !== req.user.id) {
    throw new ApiError(403, "Not authorized to edit this comment");
  }

  // Update the comment text and save changes to the database
  comment.text = newComment;
  await comment.save();

  // Send success response with the updated comment
  res
    .status(200)
    .json(new ApiResponse(200, comment, "Comment updated successfully"));
});
