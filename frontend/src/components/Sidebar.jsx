//frontend/src/components/Sidebar.jsx
// Importing necessary dependencies and icons
import React from "react"; 
import { Link } from "react-router-dom"; 
import { useSelector } from "react-redux"; 
import { 
  FiHome, FiPlay, FiUser, FiLogIn, FiList, FiHeart, FiSettings 
} from "react-icons/fi"; 
import { 
  MdSubscriptions, MdExplore, MdTrendingUp, MdHistory 
} from "react-icons/md"; 

function Sidebar({ hidden }) {
  // Fetch authentication status and user data from Redux store
  const authStatus = useSelector((state) => state.auth.status);
  const user = useSelector((state) => state.auth.user);
  const hasChannel = user ? user.hasChannel : false; // Check if the user has a channel

  // Define the sidebar navigation items
  const navItems = [
    // Default navigation items visible to everyone
    { name: "Home", path: "/", icon: <FiHome className="h-5 w-5 ml-2 mr-3" />, active: true },
    { name: "Shorts", path: "/shorts", icon: <FiPlay className="h-5 w-5 ml-2 mr-3"/>, active: authStatus }, 
    { name: "Sign Up", path: "/signup", icon: <FiUser className="h-5 w-5 ml-2 mr-3"/>, active: !authStatus }, 
    { name: "Login", path: "/login", icon: <FiLogIn className="h-5 w-5 ml-2 mr-3"/>, active: !authStatus }, 
  ];

  return (
    <>
      {/* Conditionally render the sidebar based on the `hidden` prop */}
      {hidden && (
        <aside
          id="sidebar"
          className="fixed border-none pt-5 left-0 z-30 flex flex-col flex-shrink-0 w-52 h-full bg-white border-r border-gray-200"
          aria-label="Sidebar"
          style={{
            zIndex: 20,
            position: "absolute",
          }}
        >
          <div className="relative flex flex-col flex-1 min-h-0 pt-0 ">
            <div className="flex flex-col flex-1 pt-3 pb-4 overflow-y-auto">
              <div className="flex-1 px-3 space-y-1 divide-y divide-gray-200">
                <ul>
                  {/* Loop through navigation items and render those that are active */}
                  {navItems.map(
                    (item, index) =>
                      item.active && ( // Render only active items
                        <li key={index}>
                          <Link
                            to={item.path} // Navigate to the item path
                            className="flex items-center p-2 text-base text-gray-900 rounded-lg hover:bg-gray-100 group "
                          >
                            {item.icon} {/* Render the respective icon */}
                            <span className="ml-3 text-md">{item.name}</span> {/* Render the item name */}
                          </Link>
                        </li>
                      )
                  )}
                  {/* Render additional options for authenticated users */}
                  {authStatus && (
                    <>
                      {/* Section for authenticated users */}
                      <div className="divide-y divide-gray-200">
                        <li>
                          <Link
                            to="/"
                            className="flex items-center p-2 text-base text-gray-900 rounded-lg hover:bg-gray-100 group"
                          >
                            <MdSubscriptions className="h-5 w-5 ml-2 mr-3" />
                            <span className="ml-3">Subscriptions</span>
                          </Link>
                        </li>
                        {/* Render 'Your Channel' link if the user has a channel */}
                        <li>
                          {hasChannel && (
                            <Link
                              to="/your_channel"
                              className="flex items-center p-2 text-base text-gray-900 rounded-lg hover:bg-gray-100 group"
                            >
                              <FiUser className="h-5 w-5 ml-2 mr-3"/>
                              <span className="ml-3">Your Channel</span>
                            </Link>
                          )}
                        </li>
                      </div>
                      {/* Additional links for authenticated users */}
                      <li>
                        <Link
                          to="/history"
                          className="flex items-center p-2 text-base text-gray-900 rounded-lg hover:bg-gray-100 group"
                        >
                          <MdHistory className="h-5 w-5 ml-2 mr-3"/>
                          <span className="ml-3">History</span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/playlist"
                          className="flex items-center p-2 text-base text-gray-900 rounded-lg hover:bg-gray-100 group"
                        >
                          <FiList className="h-5 w-5 ml-2 mr-3"/>
                          <span className="ml-3">Playlist</span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/"
                          className="flex items-center p-2 text-base text-gray-900 rounded-lg hover:bg-gray-100 group"
                        >
                          <FiHeart className="h-5 w-5 ml-2 mr-3"/>
                          <span className="ml-3">Liked</span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/"
                          className="flex items-center p-2 text-base text-gray-900 rounded-lg hover:bg-gray-100 group"
                        >
                          <MdExplore className="h-5 w-5 ml-2 mr-3"/>
                          <span className="ml-3">Explore</span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/"
                          className="flex items-center p-2 text-base text-gray-900 rounded-lg hover:bg-gray-100 group"
                        >
                          <MdTrendingUp className="h-5 w-5 ml-2 mr-3"/>
                          <span className="ml-3">Trending</span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/settings"
                          className="flex items-center p-2 text-base text-gray-900 rounded-lg hover:bg-gray-100 group"
                        >
                          <FiSettings className="h-5 w-5 ml-2 mr-3"/>
                          <span className="ml-3">Settings</span>
                        </Link>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </aside>
      )}
    </>
  );
}

export default Sidebar;
