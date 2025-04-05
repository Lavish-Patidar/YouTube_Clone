//backend/models/videoModel.js
// Importing required modules
import mongoose, { Schema } from "mongoose";  
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"; 

// Schema definition for the video model
const videoSchema = new Schema(
    {
        // The path or URL of the video file
        videoFile: {
            type: String,         // Data type is String
            required: true        // Video file is required
        },

        // The path or URL of the thumbnail image
        thumbnail: {
            type: String,         // Data type is String
            required: true        // Thumbnail is required
        },

        // The title of the video
        title: {
            type: String,         // Data type is String
            required: true        // Title is required
        },

        // A brief description of the video
        description: {
            type: String,         // Data type is String
            required: true        // Description is required
        },

        // The duration of the video in seconds
        duration: {
            type: Number,         // Data type is Number
            default: 0            // Default value is 0 (in case the duration is not provided)
        },

        // The number of views the video has received
        views: {
            type: Number,         // Data type is Number
            default: 0            // Default value is 0 (initial view count)
        },

        // Reference to the user who owns the video
        owner: {
            type: Schema.Types.ObjectId,   // Type is ObjectId, referencing the 'newUser' model
            ref: "newUser",                 // Refers to the 'newUser' model for population
            required: true                  // Owner is required for each video
        },

        // Reference to the channel where the video is uploaded (optional)
        channelId: {
            type: Schema.Types.ObjectId,   // Type is ObjectId, referencing the 'Channel' model
            ref: "Channel"                 // Refers to the 'Channel' model for population
        },

        // An array of tags associated with the video
        tags: [
            {
                type: String,              // Data type is String for each tag
            },
        ],

        // An array of users who liked the video
        likes: [
            {
                type: Schema.Types.ObjectId,   // Type is ObjectId, referencing the 'newUser' model
                ref: "newUser"                 // Refers to the 'newUser' model for population
            }
        ]
    },
    {
        timestamps: true      // Automatically adds createdAt and updatedAt fields
    }
);

// Method to increment the view count of the video
videoSchema.methods.incrementViews = async function () {
    this.views++;            // Increment the views count
    await this.save();       // Save the updated video document
};

// Adding pagination functionality to aggregate queries using mongoose-aggregate-paginate-v2 plugin
videoSchema.plugin(mongooseAggregatePaginate);

// Exporting the Video model
export const Video = mongoose.model("Video", videoSchema);
