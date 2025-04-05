// Importing required models and utilities
import { newUser } from "../models/userModel.js";
import { Video } from "../models/videoModel.js";
import { Comment } from "../models/CommentModel.js";
import { Channel } from "../models/channelModel.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// Function to generate a new access token for the user
const generateAccessToken = async (userId) => {
    try {
        // Find user by ID
        const user = await newUser.findById(userId);
        // Generate a new access token using the user's method
        const accessToken = user.generateAccessToken();
        // Save the user without validation (optional)
        await user.save({ validateBeforeSave: false });
        return { accessToken };
    } catch (error) {
        // Throw an error if token generation fails
        throw new ApiError(500, "Something went wrong while generating access token");
    }
};

// Controller for user registration
export const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    // Check if all required fields are provided
    if (!name || !email || !password) {
        throw new ApiError(400, "All fields are required");
    }

    // Check if user with the same email or name already exists
    const checkUser = await newUser.findOne({ $or: [{ name }, { email }] });
    if (checkUser) {
        throw new ApiError(409, "User with email or username already exists");
    }

    // Set a default avatar image
    const avatar = "https://res.cloudinary.com/dpdwl1tsu/image/upload/v1733578739/egt2sufg3qzyn1ofws9t_xvfn00.jpg";

    // Create a new user in the database
    const user = await newUser.create({ name, email, password, avatar });

    // Send success response
    return res.status(201).json(new ApiResponse(200, user, "User created successfully"));
});

// Controller for user login
export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
        throw new ApiError(400, "All fields are required");
    }

    // Find user by email
    const userfind = await newUser.findOne({ email });
    if (!userfind) {
        throw new ApiError(404, "User does not exist");
    }

    // Check if the provided password is correct
    const isPasswordValid = await userfind.isPasswordCorrect(password);
    if (!isPasswordValid) {
        throw new ApiError(400, "Invalid password");
    }

    // Generate access token
    const { accessToken } = await generateAccessToken(userfind._id);
    const loggedInUser = await newUser.findById(userfind._id).select('-password');

    // Cookie options
    const options = { httpOnly: true, secure: true };

    // Send success response with access token
    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .json(new ApiResponse(200, { user: loggedInUser, accessToken }, "User logged in successfully"));
});

// Controller to log out a user
export const logoutUser = asyncHandler(async (req, res) => {
    const options = { httpOnly: true, secure: true };

    // Clear the access token cookie
    return res
        .status(200)
        .clearCookie("accessToken", options)
        .json(new ApiResponse(200, {}, "User logged out"));
});

// Controller to update account details
export const updateAccount = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    // Ensure all required fields are provided
    if (!name || !email || !password) {
        throw new ApiError(400, "All fields are required");
    }

    let avatarName;

    // If a new avatar file is uploaded, upload it to Cloudinary
    if (req.file) {
        const avatarLocalPath = req.file.path;
        avatarName = await uploadOnCloudinary(avatarLocalPath);
    }

    // Prepare data to update
    const updateData = { name, email, password };
    if (avatarName) {
        updateData.avatar = avatarName.url;
    }

    // Update the user details
    const user = await newUser.findByIdAndUpdate(
        req.params.id,
        { $set: updateData },
        { new: true }
    );

    // Send success response
    return res.status(200).json(new ApiResponse(200, user, "Account details updated successfully"));
});

// Controller to get user details by ID
export const getUserById = asyncHandler(async (req, res) => {
    const userId = req.params.id;

    // Find user by ID
    const user = await newUser.findById(userId);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // Send success response
    res.status(200).json(new ApiResponse(200, user, "User data retrieved successfully"));
});

// Controller to delete a user account and associated data
export const deleteAccount = asyncHandler(async (req, res) => {
    const userId = req.params.id;

    // Find user by ID
    const user = await newUser.findById(userId);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // If the user has a channel, delete channel and related videos
    if (user.channelId) {
        const channelId = user.channelId;
        const channelVideos = await Video.find({ channelId }).select('_id');
        const videoIds = channelVideos.map(video => video._id);

        // Delete all videos in the channel
        await Video.deleteMany({ channelId });

        // Remove video likes from other users
        if (videoIds.length > 0) {
            await newUser.updateMany(
                { likes: { $in: videoIds } },
                { $pull: { likes: { $in: videoIds } } }
            );
        }

        // Remove the channel from subscribers' subscriptions
        await newUser.updateMany(
            { subscriptions: channelId },
            { $pull: { subscriptions: channelId } }
        );

        // Delete the channel
        await Channel.findByIdAndDelete(channelId);
    }

    // Remove the user from subscribed channels' subscribers list
    if (user.subscriptions && user.subscriptions.length > 0) {
        await Channel.updateMany(
            { _id: { $in: user.subscriptions } },
            { $pull: { subscribers: userId } }
        );
    }

    // Delete all videos owned by the user
    await Video.deleteMany({ owner: userId });

    // Delete all comments made by the user
    await Comment.deleteMany({ userId });

    // Remove likes by the user from videos
    await Video.updateMany(
        { likes: userId },
        { $pull: { likes: userId } }
    );

    // Delete the user
    await user.deleteOne();

    // Send success response
    res.status(200).json(new ApiResponse(200, {}, "Account and associated data deleted successfully"));
});
