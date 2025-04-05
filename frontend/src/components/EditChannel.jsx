// frontend/src/components/EditChannel.jsx
import React, { useState, useEffect } from 'react';  
import { useNavigate } from 'react-router-dom';  
import { useSelector, useDispatch } from 'react-redux';  
import { updateChannel, getChannel, clearError, clearSuccessMessage } from '../Redux/slice/channelSlice';  
import { useToast } from "../hooks/use-toast" 

function EditChannel() {
  const dispatch = useDispatch(); 
  const navigate = useNavigate();  

  // Accessing user data and channel state from Redux store
  const { user } = useSelector((state) => state.auth); 
  const { channel, error, successMessage } = useSelector((state) => state.channel);

  // Local state for form fields and loading state
  const [file, setFile] = useState('');  
  const [avatar, setAvatar] = useState('');  
  const [name, setName] = useState('');  
  const [handle, setHandle] = useState('');  
  const [description, setDescription] = useState('');  
  const [loading, setLoading] = useState(false);  
  const { toast } = useToast();  

  // useEffect to set initial form values when channel data is available
  useEffect(() => {
    if (channel) {
      setName(channel.name || '');  
      setHandle(channel.handle || '');  
      setDescription(channel.description || '');  
    }
  }, [channel]);  

  // Handle file input change for banner image
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];  
    setFile(selectedFile);  
  };

  // Handle file input change for avatar image
  const handleAvatarChange = (event) => {
    const selectedAvatar = event.target.files[0];  
    setAvatar(selectedAvatar);  
  };

  // Handle form submission for updating channel
  const handleFormSubmit = async (e) => {
    e.preventDefault();  

    const formData = new FormData(); 
    formData.append('name', name);  
    formData.append('handle', handle);  
    formData.append('description', description);  
    if (file) {  
      formData.append('banner', file);
    }
    if (avatar) {  // If there's an avatar image selected, append it to the form data
      formData.append('avatar', avatar);
    }
    setLoading(true);  // Set loading state to true
    dispatch(updateChannel({ channelId: channel?._id, formData }));  
  };

  // Handle cancel action (navigate back to channel page without making changes)
  const handleCancel = () => {
    navigate('/your_channel');  // Navigate back to the user's channel page
  };

  // useEffect to handle errors and success messages from the update action
  useEffect(() => {
    if (error) {  // If there was an error, show a toast message
      toast({
        variant: "destructive",  // Destructive variant for errors
        title: `Error: ${error}`,  // Display the error message
      });
      dispatch(clearError());  // Clear the error from the Redux store
    }
    if (successMessage) {  // If the update was successful, show a success toast message
      setLoading(false);  // Stop the loading state
      toast({
        title: successMessage,  // Display the success message
      });
      dispatch(clearSuccessMessage());  // Clear the success message from the Redux store
      navigate('/your_channel');  // Navigate to the user's channel page
    }
  }, [error, successMessage, navigate, dispatch]);  // Runs when error, successMessage, or navigate changes

  return loading ? (  // If the loading state is true, show the loading spinner
    <div className="text-center my-72">
      <div className="p-4 text-center">
        <div role="status">
          <span className="">Loading...</span>
        </div>
      </div>
    </div>
  ) : (  // If not loading, show the form
    <>
      <div className="lg:mt-8 bg-white grid grid-cols-1 px-8 pt-6 xl:grid-cols-3 xl:gap-4">
        <div className="mb-4 col-span-full xl:mb-2">
          {channel ? (  // If channel data is available, show the form
            <form onSubmit={handleFormSubmit} encType="multipart/form-data" className="max-w-3xl">
              {/* Name input field */}
              <label htmlFor="name" className="block mb-1 text-sm font-medium text-gray-900">Name</label>
              <p id="helper-text-explanation" className="mb-3 text-sm text-gray-500">
                Choose a channel name that represents you and your content. You can change your name twice in 14 days.
              </p>
              <input
                type="text"
                name="name"
                id="name"
                value={name}  
                onChange={(e) => setName(e.target.value)}  
                className="mb-3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="Enter Name"
              />

              {/* Handle input field */}
              <label htmlFor="handle" className="block mb-1 text-sm font-medium text-gray-900">Handle</label>
              <input
                type="text"
                name="handle"
                id="handle"
                value={handle}  
                onChange={(e) => setHandle(e.target.value)}  
                className="mb-3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="Enter Handle"
              />

              {/* Banner image input field */}
              <label htmlFor="channelBanner" className="block mb-1 text-sm font-medium text-gray-900">Banner</label>
              <p id="helper-text-explanation" className="mb-3 text-sm text-gray-500">
                Use a PNG or GIF file that’s at least 98 x 98 pixels and 4MB or less.
              </p>
              <input
                type="file"
                name="channelBanner"
                id="channelBanner"
                onChange={handleFileChange}  
                className="mb-3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              />

              {/* Avatar image input field */}
              <label htmlFor="avatar" className="block mb-1 text-sm font-medium text-gray-900">Avatar</label>
              <p id="helper-text-explanation" className="mb-3 text-sm text-gray-500">
                Use a PNG or GIF file that’s at least 98 x 98 pixels and 4MB or less.
              </p>
              <input
                type="file"
                name="avatar"
                id="avatar"
                onChange={handleAvatarChange}  
                className="mb-3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              />

              {/* Description input field */}
              <label htmlFor="description" className="block mb-1 text-sm font-medium text-gray-900">Description</label>
              <input
                type="text"
                name="description"
                id="description"
                value={description}  
                onChange={(e) => setDescription(e.target.value)}  
                className="mb-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="Description"
              />

              {/* Cancel and Edit buttons */}
              <button
                onClick={handleCancel}  
                type="button"
                className="text-white bg-gray-700 hover:bg-black focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 inline-flex items-center me-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 inline-flex items-center"
              >
                Edit
              </button>
            </form>
          ) : (
            <div>Loading user data...</div>  
          )}
        </div>
      </div>
    </>
  );
}

export default EditChannel;
