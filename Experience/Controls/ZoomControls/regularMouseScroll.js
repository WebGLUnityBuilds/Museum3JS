import { gsap } from 'gsap';


let targetZoomLevel = 0.7; // set the initial zoom level

function handleRegularMouseScroll(event, camera) {
  // Define the zoom level increments or steps
  const zoomStep = 0.1; // You can adjust this value as needed

  // Adjust the target zoom level based on the scroll direction
  if (event.deltaY > 0) {
    // Scrolling down
    targetZoomLevel -= zoomStep;
  } else {
    // Scrolling up
    targetZoomLevel += zoomStep;
  }

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



// function handleRegularMouseScroll(event, camera) {
//   // Adjust the target zoom level based on the scroll direction
//   targetZoomLevel += event.deltaY * -0.001;
//   // Make sure the target zoom level stays within a reasonable range
//   targetZoomLevel = Math.max(1, Math.min(2, targetZoomLevel));

//   // Create a GSAP animation to smoothly transition the zoom level
//   gsap.to(camera, {
//     duration: 0.5,
//     zoom: targetZoomLevel,
//     onUpdate: function () {
//       // Set the camera zoom
//       camera.updateProjectionMatrix();
//     }
//   });
// }

export default handleRegularMouseScroll;
