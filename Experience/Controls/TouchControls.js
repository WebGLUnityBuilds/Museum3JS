export function setupTouchControls(camera, rotationSpeed, minVerticalAngle, maxVerticalAngle) {
  let isMouseDown = false;
  let previousMousePosition = { x: 0, y: 0 };
  const rotationEuler = { x: 0, y: 0, z: 0 };

  document.addEventListener('touchstart', event => {
    isMouseDown = true;
    previousMousePosition = {
      x: event.touches[0].clientX,
      y: event.touches[0].clientY
    };
  });

  document.addEventListener('touchmove', event => {
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
  });
}