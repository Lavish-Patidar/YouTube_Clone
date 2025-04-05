// frontend/src/Redux/slice/authslice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Initial state for authentication slice
const initialState = {
    user: null,           // Stores user data
    loading: false,       // Indicates if an async action is in progress
    error: null,          // Holds any error messages from API requests
    accessToken: null,    // Stores user's access token after login/register
    status: false,        // Indicates if user is authenticated
    hasChannel: false,    // Indicates if the user has a channel
};

/* 
  Async thunk to register a new user 
  Makes a POST request to the signup API endpoint 
*/
export const register = createAsyncThunk(
    '/api/v1/account/signup',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axios.post('/api/v1/account/signup', userData);
            return response.data.data; // Return user data on success
        } catch (error) {
            return rejectWithValue(error.response.data.message); // Return error message
        }
    }
);

/* 
  Async thunk to log in a user 
  Makes a POST request to the login API endpoint 
*/
export const login = createAsyncThunk(
    '/api/v1/account/login',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axios.post('/api/v1/account/login', userData);
            return response.data.data; // Return user data and access token on success
        } catch (error) {
            return rejectWithValue(error.response.data.message); // Return error message
        }
    }
);

/* 
  Async thunk to log out a user 
  Makes a POST request to the logout API endpoint
*/
export const logout = createAsyncThunk(
    '/api/v1/account/logout',
    async (_, { rejectWithValue }) => {
        try {
            await axios.post('/api/v1/account/logout');
            return true; // Successful logout returns true
        } catch (error) {
            return rejectWithValue(error.response.data.message); // Return error message
        }
    }
);

/* 
  Async thunk to fetch user data based on user ID 
  Makes a GET request to fetch the user details
*/
export const getUserData = createAsyncThunk(
    '/api/v1/account/getUserData',
    async (userId, { rejectWithValue }) => {
        try {
            const response = await axios.get(`/api/v1/account/userData/${userId}`);
            return response.data.data; // Return the user data
        } catch (error) {
            return rejectWithValue(error.response.data.message); // Return error message
        }
    }
);

/* 
  Async thunk to delete a user's account 
  Makes a DELETE request to delete the user based on user ID 
*/
export const deleteAccount = createAsyncThunk(
    '/api/v1/account/deleteAccount',
    async (userId, { rejectWithValue }) => {
        try {
            const response = await axios.delete(`/api/v1/account/delete/${userId}`);
            return response.data.message; // Return success message
        } catch (error) {
            return rejectWithValue(error.response.data.message); // Return error message
        }
    }
);

/* 
  Async thunk to update a user's account 
  Makes a PUT request to update user details 
*/
export const updateAccount = createAsyncThunk(
    '/api/v1/account/updateAccount',
    async ({ userId, formData }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`/api/v1/account/update/${userId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Required for file uploads
                },
            });
            return response.data.data; // Return updated user data
        } catch (error) {
            return rejectWithValue(error.response.data.message); // Return error message
        }
    }
);

/*
  Authentication slice for managing user authentication state
*/
const authSlice = createSlice({
    name: 'auth', 
    initialState, 
    reducers: {}, 

    // Extra reducers to handle async thunks
    extraReducers: (builder) => {
        // Register actions
        builder
            .addCase(register.pending, (state) => {
                state.loading = true; 
                state.error = null;   
            })
            .addCase(register.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;          
                state.accessToken = action.payload.accessToken; 
                state.hasChannel = action.payload.hasChannel;   
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload; 
            });

        // Login actions
        builder
            .addCase(login.pending, (state) => {
                state.loading = true; 
                state.error = null;   
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.status = true;  
                state.user = action.payload.user;          
                state.accessToken = action.payload.accessToken; 
                state.hasChannel = action.payload.hasChannel;   
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.status = false; 
                state.error = action.payload; 
            });

        // Logout actions
        builder
            .addCase(logout.fulfilled, (state) => {
                state.status = false;    
                state.user = null;       
                state.accessToken = null; 
            })
            .addCase(logout.rejected, (state, action) => {
                state.error = action.payload; 
            });

        // Fetch user data actions
        builder
            .addCase(getUserData.pending, (state) => {
                state.loading = true; 
                state.error = null;   
            })
            .addCase(getUserData.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload; 
            })
            .addCase(getUserData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload; 
            });

        // Delete account actions
        builder
            .addCase(deleteAccount.pending, (state) => {
                state.loading = true; 
                state.error = null;  
            })
            .addCase(deleteAccount.fulfilled, (state) => {
                state.loading = false;
                state.user = null;        
                state.accessToken = null; 
                state.status = false;     
            })
            .addCase(deleteAccount.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload; 
            });

        // Update account actions
        builder
            .addCase(updateAccount.pending, (state) => {
                state.loading = true; 
                state.error = null;   
            })
            .addCase(updateAccount.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload; 
            })
            .addCase(updateAccount.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload; 
            });
    },
});


export default authSlice.reducer;
