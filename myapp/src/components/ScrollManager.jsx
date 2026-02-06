import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Object to store scroll positions for each path
const scrollPositions = {};

const ScrollManager = () => {
  const location = useLocation();

  useEffect(() => {
    // Restore scroll position when location changes
    const savedPosition = scrollPositions[location.pathname];
    if (savedPosition) {
      // Use setTimeout to ensure DOM is rendered before scrolling
      setTimeout(() => {
        window.scrollTo(0, savedPosition);
      }, 100);
    } else {
      // Scroll to top for new locations
      window.scrollTo(0, 0);
    }
    
    // Save scroll position when leaving the page
    return () => {
      scrollPositions[location.pathname] = window.pageYOffset;
    };
  }, [location]);

  return null;
};

export default ScrollManager;