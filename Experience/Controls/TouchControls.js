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

export {
  handleTouchStart,
  handleTouchMove
};