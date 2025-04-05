// frontend/src/components/AllVideo.jsx
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAllUserVideos, deleteVideo, resetUserVideos } from '../Redux/slice/videoSlice';
import { Link } from 'react-router-dom';
import { useToast } from "../hooks/use-toast";
import FormatDate from './FormatDate'; 

function AllVideo() {
  const dispatch = useDispatch();
  const userdata = useSelector((state) => state.auth.user);
  const videos = useSelector((state) => state.video.userVideos);
  const loading = useSelector((state) => state.video?.loading || false);

  // Custom hook for showing toasts
  const { toast } = useToast();

  // useEffect hook to fetch videos when the user ID is available
  useEffect(() => {
    // Check if user is authenticated and has an ID
    if (userdata?._id) {
      console.log('Fetching videos for user:', userdata._id);
      // Dispatch action to fetch all videos for the authenticated user
      dispatch(fetchAllUserVideos(userdata._id))
        .unwrap() // Handles promise resolution/rejection
        .catch((error) => console.error('Error fetching user videos:', error));
    }

    // Cleanup function to reset videos when the component is unmounted or user changes
    return () => {
      dispatch(resetUserVideos());
    };
  }, [userdata?._id, dispatch]);

  // Function to handle video deletion
  const handleDelete = (videoId) => {
    // Ask for confirmation before deleting the video
    if (confirm('Are you sure you want to delete this video?')) {
      // Dispatch delete action and handle success or error
      dispatch(deleteVideo(videoId))
        .unwrap()
        .then(() => {
          // Show success toast if deletion is successful
          toast({
            title: "Video Deleted Successfully",
          });
        })
        .catch((error) => console.error('Error deleting video:', error));
    }
  };

  // State for managing the visibility of the video options menu
  const [menuOpen, setMenuOpen] = useState(null);

  // Function to toggle the menu for each video
  const toggleMenu = (videoId) => {
    // Toggle menu visibility
    setMenuOpen(menuOpen === videoId ? null : videoId);
  };

  // If data is still loading, show a loading spinner
  if (loading) {
    return (
      <div className="text-center my-44">
        <div className="p-4 text-center">
          <div role="status">
            <span>Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  // Main return block, rendering the video list
  return (
    <div className="lg:mt-8 bg-white grid grid-cols-1  pt-5 xl:grid-cols-3 xl:gap-3">
      <div className="mb-4 col-span-full xl:mb-2">
        <section>
          <div className="container">
            <div className="grid grid-cols-1 px-4 pt-3 md:grid-cols-2 xl:grid-cols-3 xl:gap-4">
              {/* Map over the list of videos and display each one */}
              {videos.map((video) => (
                <div key={video._id} className="bg-white m-1 rounded-lg max-w-[360px] relative">
                  <div className="relative">
                    {/* Link to video page */}
                    <Link to={`/watch/${video._id}`}>
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-48 object-cover rounded-md"
                      />
                    </Link>
                  </div>
                  <div className="p-4 flex">
                    {/* Link to channel page */}
                    <Link to={`/Channel/${video.channelId._id}`}>
                      <img
                        src={video.channelId.avatar}
                        alt={video.channelId.name}
                        className="w-10 h-10 rounded-full mr-4"
                      />
                    </Link>
                    <div className="flex-1">
                      {/* Video title with a link */}
                      <h3 className="text-md font-semibold text-gray-800 line-clamp-2">
                        <Link to={`/watch/${video._id}`} className="hover:text-black">
                          {video.title}
                        </Link>
                      </h3>
                      {/* Channel name link */}
                      <Link to={`/Channel/${video.channelId._id}`}>
                        <h4 className="text-sm text-gray-500 hover:text-black">{video.channelId.name}</h4>
                      </Link>
                      <div className="mt-2 text-sm text-gray-500 flex items-center">
                        <span>{video.views} views</span>
                        <span className="ml-2">
                          {/* Display the formatted date */}
                          <FormatDate dateString={video.createdAt} />
                        </span>
                      </div>
                      {/* Three dots menu button */}
                      <button
                        onClick={() => toggleMenu(video._id)}
                        className="absolute bottom-2 right-2 text-gray-500 hover:text-gray-800"
                      >
                        &#8230;
                      </button>

                      {/* Conditional rendering of the menu for the video */}
                      {menuOpen === video._id && (
                        <div className="absolute bottom-10 right-2 bg-white border shadow-md rounded-lg w-40">
                          {/* Delete button */}
                          <button
                            onClick={() => handleDelete(video._id)}
                            className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                          >
                            Delete
                          </button>
                          {/* Edit button (link to edit page) */}
                          <Link
                            to={`update/${video._id}`}
                            className="w-full text-left px-4 py-2 text-blue-600 hover:bg-gray-100"
                          >
                            Edit
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default AllVideo;
