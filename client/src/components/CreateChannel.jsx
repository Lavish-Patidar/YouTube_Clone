// frontend/src/components/CreateChannel.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { createChannel, clearError, clearSuccessMessage } from "../Redux/slice/channelSlice";
import { getUserData } from "../Redux/slice/authSlice";
import { useToast } from "../hooks/use-toast"

// CreateChannel component: Allows users to create a new channel
const CreateChannel = ({ isOpen, onClose }) => {
  // If the modal is not open, return null to hide the modal
  if (!isOpen) return null;

  // State variables to manage form inputs and loading state
  const [name, setName] = useState('');
  const [handle, setHandle] = useState('');
  const { toast } = useToast()  
  const dispatch = useDispatch();  
  const { error, successMessage } = useSelector((state) => state.channel);  
  const [loading, setLoading] = useState(false);  
  const userId = useSelector((state) => state.auth.user._id); 

  // Handle input field changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'name') setName(value);  // Update 'name' state
    if (name === 'handle') setHandle(value);  // Update 'handle' state
  };

  // Handle form submission (creating a channel)
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);  // Set loading to true when the form is being submitted

    // Check if the 'name' or 'handle' are empty
    if (!name || !handle) {
      dispatch(clearError());  // Clear any previous error if the fields are invalid
      return;
    }

    // Dispatch the action to create a channel with the 'name' and 'handle'
    dispatch(createChannel({ name, handle })).then((result) => {
      // If the channel creation is successful
      if (result.meta.requestStatus === "fulfilled") {
        dispatch(getUserData(userId));  // Update the user's data
        onClose();  // Close the modal
        toast({  // Show a success toast
          title: "Channel Created Successfully",
        });
        setLoading(false);  // Set loading to false after the channel is created
        dispatch(clearError());  // Clear any previous errors
        dispatch(clearSuccessMessage());  // Clear success message after the toast
      }
    });
  };

  return (
    // Modal background and structure to center the modal on screen
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-xl font-semibold text-gray-800">How you’ll appear</h2>
        <div className="mt-4">
          {/* Form for creating a new channel */}
          <form className="mt-6" onSubmit={handleSubmit}>
            {/* Input field for channel name */}
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-600">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={handleInputChange}  // Updates 'name' state
                placeholder="Name"
                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-300 focus:outline-none"
              />
            </div>

            {/* Input field for channel handle */}
            <div className="mb-4">
              <label htmlFor="handle" className="block text-sm font-medium text-gray-600">Handle</label>
              <input
                type="text"
                id="handle"
                name="handle"
                value={handle}
                onChange={handleInputChange}  // Updates 'handle' state
                placeholder="@Handle"
                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-300 focus:outline-none"
              />
            </div>

            {/* Display errors or success message */}
            {error && <div className="text-red-500 text-sm">{error}</div>} 
            {successMessage && <div className="text-green-500 text-sm">{successMessage}</div>}  
            {/* Footer with Cancel and Submit buttons */}
            <div className="flex items-center justify-end space-x-4 mt-6">
              {/* Cancel button to close the modal */}
              <button
                type="button"
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                onClick={onClose}  // Call onClose function to close modal
              >
                Cancel
              </button>

              {/* Submit button to create the channel */}
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                disabled={loading}  // Disable button while loading
              >
                {loading ? 'Creating...' : 'Create channel'}  
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateChannel;
