//backend/controllers/videoController.js
import { Video } from "../models/videoModel.js";
import { Channel } from "../models/channelModel.js";
import { newUser } from "../models/userModel.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Tag } from "../models/tagsModel.js";
import mongoose from "mongoose";

// Upload and publish a new video
export const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description, tags } = req.body;
  const thumbnailFile = req.files?.thumbnail?.[0]; // Thumbnail file
  const videoFile = req.files?.videoFile?.[0]; // Video file

  // Check if required fields are provided
  if (!title || !description || !thumbnailFile || !videoFile) {
    throw new ApiError(400, "All fields are required, including thumbnail and video files");
  }

  // Upload files to Cloudinary
  const [thumbnailFilePath, videoFilePath] = await Promise.all([
    uploadOnCloudinary(thumbnailFile.path),
    uploadOnCloudinary(videoFile.path),
  ]);

  if (!thumbnailFilePath || !videoFilePath) {
    throw new ApiError(400, "File upload failed");
  }

  // Handle tags - create tags if they don't exist
  const tagArray = tags ? tags.split(",").map((tag) => tag.trim().toLowerCase()) : [];
  for (const tagName of tagArray) {
    const existingTag = await Tag.findOne({ name: tagName });
    if (!existingTag) await Tag.create({ name: tagName });
  }

  // Create the video document
  const video = await Video.create({
    title,
    description,
    thumbnail: thumbnailFilePath.url,
    videoFile: videoFilePath.url,
    owner: req.user._id, // User uploading the video
    channelId: req.user.channelId, // Associated channel
    views: 0,
    tags: tagArray,
  });

  // Update the channel with the new video
  const channel = await Channel.findById(req.user.channelId);
  if (!channel) throw new ApiError(404, "Channel not found");

  channel.videos.push(video._id);
  await channel.save();

  // Send success response
  res.status(201).json(new ApiResponse(201, video, "Video published successfully"));
});

// Get all videos
export const getAllVideos = asyncHandler(async (req, res) => {
  const videos = await Video.find()
    .populate("channelId") // Populate channel details
    .populate("owner", "-password"); // Populate owner details without sensitive data

  return res.status(200).json(new ApiResponse(200, videos, "Videos fetched successfully"));
});

// Get all videos uploaded by a user
export const getAllUserVideos = asyncHandler(async (req, res) => {
  const { owner } = req.params; // Extract owner ID from params
  if (!owner) throw new ApiError(400, "Owner ID is required");

  const userVideos = await Video.find({ owner })
    .populate("channelId")
    .populate("owner", "-password");

  return res.status(200).json(new ApiResponse(200, userVideos, "User videos fetched successfully"));
});

// Delete a video by ID
export const deleteVideoById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  // Find the video by ID
  const video = await Video.findById(id);
  if (!video) throw new ApiError(404, "Video not found");

  // Check if the user is authorized to delete the video
  if (video.owner.toString() !== userId.toString()) {
    throw new ApiError(403, "You are not authorized to delete this video");
  }

  // Use a transaction to handle database changes atomically
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    // Remove video from the channel's videos array
    await Channel.updateOne({ _id: video.channelId }, { $pull: { videos: video._id } }, { session });

    // Remove the video from any users' liked videos
    await newUser.updateMany(
      { likes: video._id },
      { $pull: { likes: video._id } },
      { session }
    );

    // Delete the video
    await Video.findByIdAndDelete(id, { session });

    await session.commitTransaction();
    res.status(200).json(new ApiResponse(200, null, "Video deleted successfully"));
  } catch (error) {
    await session.abortTransaction();
    throw new ApiError(500, "Error deleting video");
  } finally {
    session.endSession();
  }
});

// Get video details by ID
export const VideoDataById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const video = await Video.findById(id)
    .populate("owner", "-password")
    .populate("channelId");

  if (!video) throw new ApiError(404, "Video not found");

  return res.status(200).json(new ApiResponse(200, video, "Video fetched successfully"));
});

// Increment views for a video
export const viewsIncrement = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const video = await Video.findById(id);
  if (!video) throw new ApiError(404, "Video not found");

  video.views += 1; // Increment view count
  await video.save();

  return res.status(200).json(new ApiResponse(200, video, "Video views updated"));
});

// Like a video
export const likeVideo = asyncHandler(async (req, res) => {
  const { videoId, userId } = req.body;

  // Fetch the video and user data
  const [video, user] = await Promise.all([
    Video.findById(videoId),
    newUser.findById(userId),
  ]);

  if (!video || !user) throw new ApiError(404, "Video or User not found");

  // If the user hasn't liked the video, add the like
  if (!video.likes.includes(userId)) {
    video.likes.push(userId);
    await video.save();
  }

  // If the video hasn't been liked by the user, add the like to the user
  if (!user.likes.includes(videoId)) {
    user.likes.push(videoId);
    await user.save();
  }

  res.status(200).json(new ApiResponse(200, null, "Video liked successfully"));
});

// Unlike a video
export const removeLikeVideo = asyncHandler(async (req, res) => {
  const { videoId, userId } = req.body;

  // Fetch the video and user data
  const [video, user] = await Promise.all([
    Video.findById(videoId),
    newUser.findById(userId),
  ]);

  if (!video || !user) throw new ApiError(404, "Video or User not found");

  // Remove the like from the video and user
  video.likes = video.likes.filter((id) => id.toString() !== userId);
  user.likes = user.likes.filter((id) => id.toString() !== videoId);

  // Save changes to the database
  await Promise.all([video.save(), user.save()]);

  res.status(200).json(new ApiResponse(200, null, "Video unliked successfully"));
});

// Update video details
export const updateVideo = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, description, tags } = req.body;

  const video = await Video.findById(id);
  if (!video) throw new ApiError(404, "Video not found");

  // Update fields if provided
  if (title) video.title = title;
  if (description) video.description = description;

  // Handle file uploads for thumbnail and video
  if (req.files?.thumbnail?.[0]) {
    const thumbnailPath = await uploadOnCloudinary(req.files.thumbnail[0].path);
    video.thumbnail = thumbnailPath.url;
  }

  if (req.files?.videoFile?.[0]) {
    const videoFilePath = await uploadOnCloudinary(req.files.videoFile[0].path);
    video.videoFile = videoFilePath.url;
  }

  // Update tags if provided
  if (tags) {
    video.tags = tags.split(",").map((tag) => tag.trim().toLowerCase());
  }

  await video.save();
  res.status(200).json(new ApiResponse(200, video, "Video updated successfully"));
});
