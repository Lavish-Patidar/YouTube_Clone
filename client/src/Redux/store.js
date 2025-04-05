// frontend/src/Redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Use localStorage for state persistence
import authReducer from './slice/authSlice.js';
import channelReducer from './slice/channelSlice.js';
import videoReducer from './slice/videoSlice.js';
import commentsReducer from './slice/commentsSlice.js';

// Persistence configuration for each reducer
const authPersistConfig = {
    key: 'auth', // Unique key for auth state
    storage,     // Storage engine (localStorage)
};

const channelPersistConfig = {
    key: 'channel', // Unique key for channel state
    storage,
};

const videoPersistConfig = {
    key: 'video', // Unique key for video state
    storage,
};

const commentsPersistConfig = {
    key: 'comments', // Unique key for comments state
    storage,
};

// Wrap each reducer with persistReducer
const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);
const persistedChannelReducer = persistReducer(channelPersistConfig, channelReducer);
const persistedVideoReducer = persistReducer(videoPersistConfig, videoReducer);
const persistedCommentsReducer = persistReducer(commentsPersistConfig, commentsReducer);

// Create the Redux store
const store = configureStore({
    reducer: {
        auth: persistedAuthReducer,       // Persisted auth slice
        channel: persistedChannelReducer, // Persisted channel slice
        video: persistedVideoReducer,     // Persisted video slice
        comments: persistedCommentsReducer, // Persisted comments slice
    },
    // Middleware setup (optional, could add custom middlewares if needed)
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false, // Required for redux-persist to work with non-serializable data
        }),
});

// Persistor to persist and rehydrate the store
export const persistor = persistStore(store);

export default store;
