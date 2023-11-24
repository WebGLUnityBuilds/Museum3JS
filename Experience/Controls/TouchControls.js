const rotationSpeed = 0.0018;
const minVerticalAngle = -Math.PI / 7;
const maxVerticalAngle = Math.PI / 7;

let isMouseDown = false;
let previousMousePosition = { x: 0, y: 0 };

function handleTouchStart(event) {
  isMouseDown = true;
  previousMousePosition = {
    x: event.touches[0].clientX,
    y: event.touches[0].clientY
  };
}

function handleTouchMove(event, camera) {
  if (isMouseDown) {
    const deltaMove = {
      x: event.touches[0].clientX - previousMousePosition.x,
      y: event.touches[0].clientY - previousMousePosition.y
    };

    camera.rotation.y += deltaMove.x * rotationSpeed;
    camera.rotation.x += deltaMove.y * rotationSpeed;

    camera.rotation.x = Math.max(minVerticalAngle, Math.min(maxVerticalAngle, camera.rotation.x));

    camera.rotation.order = 'YXZ';
    camera.rotation.set(camera.rotation.x, camera.rotation.y, 0);
  }

  previousMousePosition = {
    x: event.touches[0].clientX,
    y: event.touches[0].clientY
  };
}

export function setupTouchControls(camera) {
  document.addEventListener('touchstart', handleTouchStart);
  document.addEventListener('touchmove', event => handleTouchMove(event, camera));
}