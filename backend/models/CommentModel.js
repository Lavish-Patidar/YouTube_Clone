//backend/models/CommentModel.js
// Importing required modules
import mongoose, { Schema } from "mongoose"; 

// Schema definition for the comment model
const commentSchema = new Schema(
  {
    // The text content of the comment
    text: {
      type: String,        // Data type is String
      required: true,      // Comment text is required
    },

    // The username of the user who posted the comment
    userName: {
      type: String,        // Data type is String
      required: true,      // Username is required for each comment
    },

    // Reference to the user who posted the comment
    userId: {
      type: mongoose.Schema.Types.ObjectId,  // Type is ObjectId, referencing the 'User' model
      ref: 'User',                            // Refers to the 'User' model for population
      required: true,                         // User reference is required for each comment
    },

    // URL or path to the user's avatar (optional)
    userAvatar: {
      type: String,        // Data type is String
    },

    // Reference to the video that the comment belongs to
    videoId: {
      type: mongoose.Schema.Types.ObjectId,  // Type is ObjectId, referencing the 'Video' model
      ref: 'Video',                          // Refers to the 'Video' model for population
      required: true,                        // Video reference is required for each comment
    },
  },
  { timestamps: true }  // Automatically adds createdAt and updatedAt fields to track when the comment was created/modified
);

// Exporting the Comment model
export const Comment = mongoose.model("Comment", commentSchema);
