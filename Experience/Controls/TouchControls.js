export function handleTouchStart(event) {
  startX = event.touches[0].clientX;
  startY = event.touches[0].clientY;
  startCameraRotation = camera.rotation.y;
}

export function handleTouchMove(event, camera) {
  var deltaX = event.touches[0].clientX - startX;
  var deltaY = event.touches[0].clientY - startY;

  // Calculate the rotation based on the touch movement
  var rotationX = startCameraRotation + deltaX * 0.01;
  var rotationY = camera.rotation.y + deltaY * 0.01;

  // Set the new rotation values to the camera
  camera.rotation.set(0, rotationY, 0);
}

export function handleTouchEnd() {
  // Handle touch end event if needed
}

export function handleTouchZoom(event, camera) {
  // Handle touch zoom event if needed
}