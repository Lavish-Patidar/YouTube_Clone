// frontend/src/App.jsx
// Importing necessary components and hooks
import { Navbar, Sidebar } from "./components";
import { Outlet, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

function App() {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const isVideoPage = location.pathname.startsWith("/watch");

  // Function to handle updates to the search term
  const handleSearch = (term) => {
    setSearchTerm(term); // Update the search term state
  };

  // Effect to handle sidebar visibility based on screen size and current page
  useEffect(() => {
    // If on a video page, automatically hide the sidebar
    if (isVideoPage) {
      setIsOpen(false);
    } 
    // If screen width is large (>= 769px), ensure sidebar is visible
    else if (window.innerWidth >= 769) {
      setIsOpen(true);
    }

    // Function to handle window resize events
    const handleResize = () => {
      if (window.innerWidth < 769) {
        // If the window is small, hide the sidebar
        setIsOpen(false);
      } else if (!isVideoPage) {
        // If not on a video page and window is large, show the sidebar
        setIsOpen(true);
      }
    };

    // Attach the resize event listener
    window.addEventListener("resize", handleResize);
    handleResize(); // Call once initially to set the sidebar state correctly

    // Cleanup: Remove the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isVideoPage]); // Rerun this effect when `isVideoPage` changes

  return (
    <>
      {/* Navbar Component */}
      <Navbar 
        openChange={() => setIsOpen((prev) => !prev)} // Toggle sidebar open/close state
        onSearch={handleSearch} // Pass the search handler to Navbar
      />

      {/* Main Layout: Sidebar and Main Content */}
      <div
        className={`flex pt-8 overflow-hidden bg-white ${
          isVideoPage && isOpen ? "relative" : "" // Adjust layout styling on video page
        }`}
      >
        {/* Sidebar Component */}
        <Sidebar hidden={isOpen} />

        {/* Main Content Area */}
        <div
          id="main-content"
          className={`w-full h-full overflow-y-auto bg-white ${
            !isVideoPage && isOpen ? "lg:ml-52" : "ml-0" // Adjust margin based on sidebar state
          }`}
          style={{
            position: isVideoPage && isOpen ? "relative" : "static", // Adjust positioning on video page
            zIndex: isVideoPage && isOpen ? 10 : "auto", // Set zIndex for layout stacking
          }}
        >
          <main>
            {/* Outlet: Renders the nested routes */}
            {/* Context provides `searchTerm` to child components */}
            <Outlet context={{ searchTerm }} />
          </main>
        </div>
      </div>
    </>
  );
}

export default App;
