export const toggleFullscreen = () => {
    if (document.fullscreenElement || document.webkitFullscreenElement ||
        document.mozFullScreenElement || document.msFullscreenElement) {
      // Check if the document is currently in full-screen mode
  
      if (document.exitFullscreen) {
        document.exitFullscreen(); // Standard method for modern browsers
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen(); // Firefox-specific method
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen(); // Chrome, Safari, and Opera-specific method
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen(); // Internet Explorer-specific method
      }
    } else {
      // If not in full-screen mode, enter full screen
  
      const element = document.documentElement; // Get the root element of your document
  
      if (element.requestFullscreen) {
        element.requestFullscreen(); // Standard method for modern browsers
      } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen(); // Firefox-specific method
      } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen(); // Chrome, Safari, and Opera-specific method
      } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen(); // Internet Explorer-specific method
      }
    }
  };