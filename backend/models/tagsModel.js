//backend/models/tagsModel.js
// Importing required modules
import mongoose, { Schema } from "mongoose"; 

// Schema definition for the tag model
const tagSchema = new Schema(
    {
        // The name of the tag
        name: {
            type: String,        // Data type is String
            required: true,      // Tag name is required
            unique: true,        // Tag name must be unique across the collection
        },
    },
    {
        timestamps: true,       // Automatically adds createdAt and updatedAt fields
    }
);

// Exporting the Tag model
export const Tag = mongoose.model("Tag", tagSchema);
