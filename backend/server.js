// backend/server.js
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import userAccount from './routes/accountRoutes.js';
import videoRouter from './routes/videoRoutes.js';
import channelRouter from './routes/channelRoutes.js';
import commentsRouter from './routes/commentsRoutes.js';
import tagsRouter from './routes/tagsRoutes.js';

// Load environment variables
dotenv.config();

// Database connection function
const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(process.env.MONGO_DB);
        console.log(`MongoDB connected Successfully `);
    } catch (error) {
        console.error("Error connecting to database:", error);
        process.exit(1); // Exit the process with failure
    }
};

// Initialize Express app
const app = express();

// Middlewares
app.use(cors({
    origin: 'https://you-tube-clone-sepia.vercel.app',
    credentials: true,
}));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());


// Route definitions
app.use("/api/v1/account", userAccount);
app.use("/api/v1/videos", videoRouter);
app.use("/api/v1/channel", channelRouter)
app.use('/api/v1/comments', commentsRouter);
app.use('/api/v1/tags', tagsRouter);

// Start the server after connecting to the database
connectDB();

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});

