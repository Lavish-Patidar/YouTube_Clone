//backend/controllers/channelController.js
// Importing required models and utilities
import { Channel } from "../models/channelModel.js";
import { newUser } from "../models/userModel.js";
import { Video } from "../models/videoModel.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

// Create a new channel
export const createChannel = asyncHandler(async (req, res) => {
  const { name, handle } = req.body; // Extract channel name and handle from request body
  const userId = req.user._id; // User ID extracted from middleware (auth)

  // Check if the user exists and doesn't already have a channel
  const user = await newUser.findById(userId);
  if (!user) throw new ApiError(404, "User not found");
  if (user.hasChannel) throw new ApiError(400, "User already has a channel");

  // Set default avatar and banner images
  const avatar =
    "https://res.cloudinary.com/dpdwl1tsu/image/upload/v1733578739/egt2sufg3qzyn1ofws9t_xvfn00.jpg";
  const banner =
    "https://res.cloudinary.com/dpdwl1tsu/image/upload/v1733578478/dlekdyn1dep7gevz9zyn.avif";

  // Create a new channel document in the database
  const channel = await Channel.create({
    name,
    handle,
    owner: userId,
    avatar,
    banner,
  });

  // Update user to reflect that a channel has been created
  user.hasChannel = true;
  user.channelId = channel._id;
  await user.save();

  // Return success response with channel data
  res
    .status(201)
    .json(new ApiResponse(201, channel, "Channel created successfully"));
});

// Get a channel's details
export const getChannel = asyncHandler(async (req, res) => {
  const { id } = req.params; // Extract channel ID from request parameters

  // Find channel by ID and populate owner details (excluding password)
  const channel = await Channel.findById(id).populate("owner", "-password");
  if (!channel) throw new ApiError(404, "Channel not found");

  // Return success response with channel data
  res
    .status(200)
    .json(new ApiResponse(200, channel, "Channel fetched successfully"));
});

// Update channel details
export const updateChannel = asyncHandler(async (req, res) => {
  const { name, handle, description } = req.body; // Extract fields to update

  // Initialize variables for file uploads (banner and avatar)
  let bannerName, avatarName;

  // If a new banner file is uploaded, upload to Cloudinary
  if (req.files?.banner) {
    const bannerLocalPath = req.files.banner[0].path;
    bannerName = await uploadOnCloudinary(bannerLocalPath);
  }

  // If a new avatar file is uploaded, upload to Cloudinary
  if (req.files?.avatar) {
    const avatarLocalPath = req.files.avatar[0].path;
    avatarName = await uploadOnCloudinary(avatarLocalPath);
  }

  // Prepare the update data object with any provided fields
  const updateData = {};
  if (name) updateData.name = name;
  if (handle) updateData.handle = handle;
  if (description) updateData.description = description;
  if (bannerName) updateData.banner = bannerName.url;
  if (avatarName) updateData.avatar = avatarName.url;

  // Update the channel document in the database
  const channel = await Channel.findByIdAndUpdate(
    req.params.id,
    { $set: updateData },
    { new: true } // Return the updated document
  );

  if (!channel) throw new ApiError(404, "Channel not found");

  // Return success response with updated channel data
  res
    .status(200)
    .json(new ApiResponse(200, channel, "Channel updated successfully"));
});

// Subscribe to a channel
export const subscribeToChannel = asyncHandler(async (req, res) => {
  const channelId = req.params.id; // Channel to subscribe to
  const userId = req.user._id; // User performing the action

  // Find the channel by ID
  const channel = await Channel.findById(channelId);
  if (!channel) throw new ApiError(404, "Channel not found");

  // Check if user is already subscribed
  if (channel.subscribers.includes(userId))
    throw new ApiError(400, "Already subscribed to this channel");

  // Add user ID to the channel's subscribers array
  channel.subscribers.push(userId);
  await channel.save();

  // Add the channel ID to the user's subscriptions array
  const user = await newUser.findById(userId);
  user.subscriptions.push(channelId);
  await user.save();

  // Return success response
  res
    .status(200)
    .json(new ApiResponse(200, channel, "Subscribed successfully"));
});

// Unsubscribe from a channel
export const unsubscribeFromChannel = asyncHandler(async (req, res) => {
  const channelId = req.params.id; // Channel to unsubscribe from
  const userId = req.user._id; // User performing the action

  // Find the channel by ID
  const channel = await Channel.findById(channelId);
  if (!channel) throw new ApiError(404, "Channel not found");

  // Check if user is subscribed
  if (!channel.subscribers.includes(userId))
    throw new ApiError(400, "Not subscribed to this channel");

  // Remove user ID from the channel's subscribers array
  channel.subscribers = channel.subscribers.filter(
    (subscriber) => subscriber.toString() !== userId.toString()
  );
  await channel.save();

  // Remove channel ID from the user's subscriptions array
  const user = await newUser.findById(userId);
  user.subscriptions = user.subscriptions.filter(
    (subscription) => subscription.toString() !== channelId.toString()
  );
  await user.save();

  // Return success response
  res
    .status(200)
    .json(new ApiResponse(200, channel, "Unsubscribed successfully"));
});

// Delete a channel
export const deleteChannel = asyncHandler(async (req, res) => {
  const channelId = req.params.id; // Channel to delete
  const userId = req.user._id; // User performing the action

  // Find the channel and populate its videos
  const channel = await Channel.findById(channelId).populate("videos");
  if (!channel) throw new ApiError(404, "Channel not found");

  // Authorization check: Only the channel owner can delete it
  if (channel.owner.toString() !== userId.toString())
    throw new ApiError(403, "You are not authorized to delete this channel");

  // Delete all associated videos
  const videoIds = channel.videos.map((video) => video._id);
  await Video.deleteMany({ _id: { $in: videoIds } });

  // Remove channel subscriptions from all users
  await newUser.updateMany(
    { subscriptions: channelId },
    { $pull: { subscriptions: channelId } }
  );

  // Remove channel likes from videos
  await newUser.updateMany(
    { likes: { $in: videoIds } },
    { $pull: { likes: { $in: videoIds } } }
  );

  // Delete the channel itself
  await channel.deleteOne();

  // Update the user's channel ownership data
  const user = await newUser.findById(userId);
  if (user) {
    user.hasChannel = false;
    user.channelId = null;
    await user.save();
  }

  // Return success response
  res
    .status(200)
    .json(new ApiResponse(200, {}, "Channel and associated data deleted successfully"));
});
