import { gsap } from 'gsap';

let targetZoomLevel = 0.5; // set the initial zoom level

function handleAppleDeviceScroll(event, camera) {
  // Adjust the deltaY value based on the device
  const deltaY = event.deltaY / 100;

  // Adjust the target zoom level based on the scroll direction
  targetZoomLevel += deltaY * -0.1;
  // Make sure the target zoom level stays within a reasonable range
  targetZoomLevel = Math.max(1, Math.min(2, targetZoomLevel));

  // Create a GSAP animation to smoothly transition the zoom level
  gsap.to(camera, {
    duration: 0.5,
    zoom: targetZoomLevel,
    onUpdate: function () {
      // Set the camera zoom
      camera.updateProjectionMatrix();
    }
  });
}

export default handleAppleDeviceScroll;
