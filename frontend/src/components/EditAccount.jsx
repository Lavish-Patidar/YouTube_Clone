// frontend/src/components/EditAccount.jsx
import React, { useState, useEffect } from 'react';  
import { useNavigate } from 'react-router-dom';  
import { useSelector, useDispatch } from 'react-redux';  
import { getUserData, updateAccount } from '../Redux/slice/authSlice'; 
import { useToast } from "../hooks/use-toast"  

function CustomizeAccount() {
  const dispatch = useDispatch();  
  const data = useSelector((state) => state.auth.user);  
  const navigate = useNavigate();  
  const { toast } = useToast(); 
  const [userdata, setUserData] = useState(null);  
  const [loader, setLoader] = useState(false);  

  // State variables for form inputs
  const [file, setFile] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // useEffect hook to dispatch the action for fetching user data when component mounts
  useEffect(() => {
    if (data._id) {
      dispatch(getUserData(data._id)); 
    }
  }, [data._id, dispatch]);  

  // Another useEffect hook to set form values from the fetched user data
  useEffect(() => {
    if (data && !userdata) {
      setUserData(data);  
      setName(data.name);  
      setEmail(data.email);  
      setPassword(data.password);  
    }
  }, [data]);  // Runs when `data` changes

  // Event handler for file input change
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];  // Access the selected file
    setFile(selectedFile);  // Store file in state
  };

  // Handle form submission (update account data)
  const handleFormSubmit = async (e) => {
    e.preventDefault();  // Prevent default form submission

    const formData = new FormData();  
    formData.append('name', name);  
    formData.append('email', email);  
    formData.append('password', password);  
    if (file) {  // If there's a file (avatar), append it to the formData
      formData.append('avatar', file);
    }

    try {
      setLoader(true);  
      dispatch(updateAccount({ userId: userdata._id, formData }));  
      setLoader(false);  
      toast({
        title: "Account Updated Successfully",  
      });
      navigate('/settings');  
    } catch (error) {
      setLoader(false);  
      console.log('Update Account error', error);  
      toast({
        variant: "destructive",  
        title: "Something went wrong!",
      });
    }
  };

  // Handle cancel action (navigate to settings page without making changes)
  const handleCancel = () => {
    navigate('/settings');  // Navigate to settings page
  };

  return (
    loader ? (  // If loader is true, show loading state
      <div className="text-center my-72">
        <div className="p-4 text-center">
          <div role="status">
            <span className="">Loading...</span>  // Show loading message
          </div>
        </div>
      </div>
    ) : (  // If loader is false, show the form
      <>
        <div className="lg:mt-8 bg-white grid grid-cols-1 px-8 pt-6 xl:grid-cols-3 xl:gap-4">
          <div className="mb-4 col-span-full xl:mb-2">
            {userdata ? (  // Check if user data is available
              <>
                <form onSubmit={handleFormSubmit} encType="multipart/form-data" className="max-w-3xl">
                  {/* Name input field */}
                  <label htmlFor="name" className="block mb-1 text-sm font-medium text-gray-900">Name</label>
                  <input 
                    type="text" 
                    name="name" 
                    id="name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}  // Update name state on change
                    className="mb-3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
                    placeholder="Enter Name" 
                    required 
                  />

                  {/* Email input field */}
                  <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-900">Email</label>
                  <input 
                    type="email" 
                    name="email" 
                    id="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}  // Update email state on change
                    className="mb-3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
                    placeholder="Enter Email" 
                    required 
                  />

                  {/* Avatar (file) input field */}
                  <label htmlFor="avatar" className="block mb-1 text-sm font-medium text-gray-900">Avatar</label>
                  <input 
                    type="file" 
                    name="avatar" 
                    id="avatar" 
                    onChange={handleFileChange}  // Handle file change
                    className="mb-3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
                  />

                  {/* Password input field */}
                  <label htmlFor="password" className="block mb-1 text-sm font-medium text-gray-900">Password</label>
                  <input 
                    type="password" 
                    name="password" 
                    id="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}  // Update password state on change
                    className="mb-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
                    placeholder="********" 
                    required 
                  />

                  {/* Cancel button */}
                  <button 
                    onClick={handleCancel} 
                    type="button" 
                    className="text-white bg-gray-700 hover:bg-black focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 inline-flex items-center me-2">
                    Cancel
                  </button>
                  {/* Submit button */}
                  <button 
                    type="submit" 
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 inline-flex items-center">
                    Edit
                  </button>
                </form>
              </>
            ) : (
              <div>Loading user data...</div>  
            )}
          </div>
        </div>
      </>
    )
  );
}

export default CustomizeAccount;
