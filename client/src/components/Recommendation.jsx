//frontend/src/components/Recommendation.jsx
// Import necessary dependencies
import React, { useEffect, useState } from 'react'; 
import { useSelector } from 'react-redux'; 
import { Link } from 'react-router-dom'; 


function Recommendation({ currentVideoTags, currentVideoId }) {
  
  const [recommendedVideos, setRecommendedVideos] = useState([]);

  // Select all videos from the Redux store
  const allVideos = useSelector((state) => state.video.videos);

  // Effect hook to filter and update the recommended videos whenever 
  // `allVideos`, `currentVideoTags`, or `currentVideoId` change
  useEffect(() => {
    // Check if `allVideos` and `currentVideoTags` exist before filtering
    if (allVideos && currentVideoTags) {
      // Filter videos with at least one common tag and exclude the current video
      const filteredVideos = allVideos.filter(
        (video) =>
          video._id !== currentVideoId && // Exclude the current video by ID
          video.tags.some((tag) => currentVideoTags.includes(tag)) // Check if the video shares any tag with the current video
      );
      setRecommendedVideos(filteredVideos); // Update the state with filtered videos
    }
  }, [allVideos, currentVideoTags, currentVideoId]); // Dependencies to rerun the effect

  // If no recommended videos are found, display a message
  if (!recommendedVideos.length) {
    return <p>No recommendations available.</p>;
  }

  return (
    <div className="space-y-4 mt-8">
      {/* Title for the recommendations section */}
      <h2 className="mb-4 text-lg font-semibold">Up Next</h2>
      
      {/* Map through the recommended videos and render each one */}
      {recommendedVideos.map((video) => (
        <Link to={`/watch/${video._id}`} key={video._id} className="flex gap-4">
          {/* Display the video thumbnail */}
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-32 h-20 rounded-md object-cover" // Styling for the thumbnail
          />
          <div>
            {/* Display the video title with truncation for long titles */}
            <h3 className="text-sm font-semibold line-clamp-2">{video.title}</h3>
            {/* Display channel name and views count */}
            <p className="text-xs text-gray-500">
              {video.channelId.name} · {video.views} views
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}


export default Recommendation;
