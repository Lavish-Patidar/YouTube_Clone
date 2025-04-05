//backend/controllers/tagsController.js
// Import necessary modules and utilities
import { Tag } from "../models/tagsModel.js"; // Tag model
import { asyncHandler } from "../utils/asyncHandler.js"; // Async error handling wrapper
import { ApiResponse } from "../utils/ApiResponse.js"; // Standardized API response format
import { ApiError } from "../utils/ApiError.js"; // Custom error handler


export const createTag = asyncHandler(async (req, res) => {
    const { name } = req.body; // Extract the tag name from the request body

    // Validate if the tag name is provided
    if (!name) {
        throw new ApiError(400, "Tag name is required");
    }

    // Check if the tag already exists to prevent duplicates
    const existingTag = await Tag.findOne({ name });
    if (existingTag) {
        throw new ApiError(400, "Tag already exists");
    }

    // Create and save the new tag in the database
    const tag = await Tag.create({ name });

    // Send success response with the created tag
    res
        .status(201)
        .json(new ApiResponse(201, tag, "Tag created successfully"));
});


export const getAllTags = asyncHandler(async (req, res) => {
    // Fetch all tags from the database
    const tags = await Tag.find();

    // Send success response with the list of tags
    res
        .status(200)
        .json(new ApiResponse(200, tags, "Tags fetched successfully"));
});


export const deleteTag = asyncHandler(async (req, res) => {
    const { id } = req.params; // Extract the tag ID from request parameters

    // Find the tag by ID
    const tag = await Tag.findById(id);

    // If the tag doesn't exist, throw a 404 error
    if (!tag) {
        throw new ApiError(404, "Tag not found");
    }

    // Delete the tag from the database
    await tag.deleteOne();

    // Send success response indicating the tag was deleted
    res
        .status(200)
        .json(new ApiResponse(200, {}, "Tag deleted successfully"));
});
