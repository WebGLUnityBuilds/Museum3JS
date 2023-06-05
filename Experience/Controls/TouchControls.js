// import * as THREE from 'three';


// function handleTouchStart(event) {
//     isMouseDown = true;
//     previousMousePosition = {
//       x: event.touches[0].clientX,
//       y: event.touches[0].clientY
//     };
//   }
  
//   function handleTouchMove(event, camera) {
//     if (isMouseDown) {
//       const deltaMove = {
//         x: previousMousePosition.x - event.touches[0].clientX,
//         y: previousMousePosition.y - event.touches[0].clientY
//       };
  
//       // Reverse controls
//       rotationEuler.y += -deltaMove.x * rotationSpeed;
//       rotationEuler.x += -deltaMove.y * rotationSpeed;
  
//       // Clamp the vertical rotation angle within the defined range
//       rotationEuler.x = Math.max(minVerticalAngle, Math.min(maxVerticalAngle, rotationEuler.x));
  
//       camera.rotation.set(rotationEuler.x, rotationEuler.y, rotationEuler.z, 'YXZ');
//     }
  
//     previousMousePosition = {
//       x: event.touches[0].clientX,
//       y: event.touches[0].clientY
//     };
//   }

// export {
//     handleTouchStart,
//     handleTouchMove
//   };

import * as THREE from 'three';
import { gsap } from 'gsap'; // Import the gsap library if not already imported

// Variables for rotation control
let isMouseDown = false;
let previousMousePosition = {
  x: 0,
  y: 0
};

// Euler rotation
const rotationSpeed = 0.0018 * window.devicePixelRatio; // Adjust the sensitivity factor as needed
const rotationEuler = new THREE.Euler(0, 0, 0, 'YXZ');

// Define the minimum and maximum vertical rotation angles in radians
const minVerticalAngle = -Math.PI / 7; // 30 degrees looking down
const maxVerticalAngle = Math.PI / 7; // 30 degrees looking up

// Variables for zoom control
let targetZoomLevel = 0.5; // set the initial zoom level
let previousDistance = 0; // store the previous touch distance for zoom calculation

function handleTouchStart(event) {
  event.preventDefault(); // Prevent default touch behavior
  isMouseDown = true;
  previousMousePosition = {
    x: event.touches[0].clientX,
    y: event.touches[0].clientY
  };
}

function handleTouchMove(event, camera) {
  event.preventDefault(); // Prevent default touch behavior
  if (isMouseDown) {
    const deltaMove = {
      x: previousMousePosition.x - event.touches[0].clientX,
      y: previousMousePosition.y - event.touches[0].clientY
    };

    // Reverse controls
    rotationEuler.y += -deltaMove.x * rotationSpeed;
    rotationEuler.x += -deltaMove.y * rotationSpeed;

    // Clamp the vertical rotation angle within the defined range
    rotationEuler.x = Math.max(minVerticalAngle, Math.min(maxVerticalAngle, rotationEuler.x));

    camera.rotation.set(rotationEuler.x, rotationEuler.y, rotationEuler.z, 'YXZ');
  }

  previousMousePosition = {
    x: event.touches[0].clientX,
    y: event.touches[0].clientY
  };
}

function handleTouchEnd() {
  isMouseDown = false;
}

function handleTouchZoom(event, camera) {
  const touch1 = event.touches[0];
  const touch2 = event.touches[1];

  if (touch1 && touch2) {
    const distance = Math.sqrt(
      Math.pow(touch2.clientX - touch1.clientX, 2) +
      Math.pow(touch2.clientY - touch1.clientY, 2)
    );

    // Adjust the target zoom level based on the pinch gesture
    targetZoomLevel += (distance - previousDistance) * -0.001;
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

    previousDistance = distance;
  }
}

export {
  handleTouchStart,
  handleTouchMove,
  handleTouchEnd,
  handleTouchZoom
};