//backend/models/channelModel.js
// Importing required modules
import mongoose, { Schema } from "mongoose"; 

// Schema definition for the channel model
const channelSchema = new Schema( 
  {
    // Channel's name
    name: {
      type: String,        // Data type is String
      required: true,      // Name is required
      trim: true,          // Remove any leading or trailing spaces
    },

    // Channel's handle (unique identifier for the channel, like @username)
    handle: {
      type: String,        // Data type is String
      required: true,      // Handle is required
      unique: true,        // Handle must be unique across all channels
      trim: true,          // Remove any leading or trailing spaces
    },

    // Channel's banner image (optional)
    banner: {
      type: String,        // Data type is String, storing URL or file path
    },

    // Channel's avatar (profile picture, optional)
    avatar: {
      type: String,        // Data type is String, storing URL or file path
    },

    // Description of the channel
    description: {
      type: String,        // Data type is String
      trim: true,          // Remove any leading or trailing spaces
    },

    // Reference to the owner of the channel (must be a valid user)
    owner: {
      type: Schema.Types.ObjectId,   // Type is ObjectId, referencing the 'newUser' model
      ref: "newUser",                // Refers to the 'newUser' model for population
      required: true,                // Owner is required to create a channel
    },

    // Array of users who are subscribed to the channel
    subscribers: [
      {
        type: Schema.Types.ObjectId, // Type is ObjectId, referencing the 'newUser' model
        ref: "newUser"               // Refers to the 'newUser' model for population
      }
    ],

    // Array of videos uploaded to the channel
    videos: [
      {
        type: Schema.Types.ObjectId, // Type is ObjectId, referencing the 'Video' collection
        ref: "Video"                  // Refers to the 'Video' model for population
      }
    ]
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Exporting the Channel model
export const Channel = mongoose.model("Channel", channelSchema);
