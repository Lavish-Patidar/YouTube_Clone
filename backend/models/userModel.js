//backend/models/userModel.js
// Importing required modules
import mongoose, { Schema } from "mongoose"; 
import jwt from "jsonwebtoken"; 

// Schema definition for the user model
const userSignUp = new Schema(
    {
        // User's name
        name: {
            type: String,           // Data type is String
            required: true,         // Name is required
            trim: true,             // Remove any leading or trailing spaces
            index: true             // Index the name for faster searching
        },
        
        // User's email address
        email: {
            type: String,           // Data type is String
            required: true,         // Email is required
            unique: true,           // Email must be unique
            lowercase: true,        // Store email in lowercase
            trim: true              // Remove any leading or trailing spaces
        },
        
        // User's password
        password: {
            type: String,           // Data type is String
            required: true          // Password is required
        },

        // User's avatar (profile picture)
        avatar: {
            type: String            // Data type is String, storing URL or file path
        },

        // Whether the user has a channel or not
        hasChannel: {
            type: Boolean,          // Data type is Boolean
            default: false,         // Default value is false (user doesn't have a channel)
        },

        // Reference to the user's channel (if they have one)
        channelId: {
            type: Schema.Types.ObjectId, // Type is ObjectId, referencing the 'channel' collection
            ref: "channel"               // Refers to the 'channel' model for population
        },

        // Array of channels the user is subscribed to
        subscriptions: [
            {
                type: Schema.Types.ObjectId,  // Type is ObjectId, referencing 'channel'
                ref: "channel"                 // Refers to the 'channel' model for population
            }
        ],

        // Array of videos the user has liked
        likes: [
            {
                type: Schema.Types.ObjectId,  // Type is ObjectId, referencing 'Video' collection
                ref: "Video"                   // Refers to the 'Video' model for population
            }
        ]
    },
    {
        timestamps: true  // Automatically add createdAt and updatedAt fields
    }
);

// Method to compare the entered password with the stored password
userSignUp.methods.isPasswordCorrect = async function (password) {
    // In a real application, you should hash the input password and compare it to the stored hashed password
    return this.password === password; // Comparing plain text passwords (this should ideally be hashed)
};

// Method to generate an access token for the user
userSignUp.methods.generateAccessToken = function () {
    // JWT sign method creates a token
    return jwt.sign(
        {
            _id: this._id,        // User's unique identifier (_id)
            email: this.email,    // User's email
            name: this.name       // User's name
        },
        process.env.ACCESS_TOKEN_SECRET, // Secret key for signing the token (stored in environment variables)
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY // Token expiration time (also from environment variables)
        }
    );
}

// Exporting the user model
export const newUser = mongoose.model("newUser", userSignUp);
