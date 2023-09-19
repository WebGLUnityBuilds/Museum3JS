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

function handleMouseDown() {
  isMouseDown = true;
}

function handleMouseUp() {
  isMouseDown = false;
}

function handleMouseMove(event, camera) {
  if (isMouseDown) {
    camera.dispatchEvent({ type: 'update' });
    const deltaMove = {
      x: previousMousePosition.x - event.clientX,
      y: previousMousePosition.y - event.clientY
    };

    // To Reverse controls
    rotationEuler.y += -deltaMove.x * rotationSpeed;
    rotationEuler.x += -deltaMove.y * rotationSpeed;

    // Clamp the vertical rotation angle within the defined range
    rotationEuler.x = Math.max(minVerticalAngle, Math.min(maxVerticalAngle, rotationEuler.x));

    camera.rotation.set(rotationEuler.x, rotationEuler.y, rotationEuler.z, 'YXZ');
  }

  previousMousePosition = {
    x: event.clientX,
    y: event.clientY
  };

  camera.addEventListener('update', () => {
    // Update the rotationEuler with the camera's current rotation
    rotationEuler.copy(camera.rotation);
  });
  
}



export {
  handleMouseDown,
  handleMouseUp,
  handleMouseMove
};