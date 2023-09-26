import * as THREE from 'three'; // Import the THREE module


let movementSpeed = 0.05;
const keyboard = {};
const cameraAreaLim = 20;

function updateCameraPosition(camera) {
  const forward = new THREE.Vector3(0, 0, -1);
  const right = new THREE.Vector3(1, 0, 0);

  forward.applyQuaternion(camera.quaternion);
  right.applyQuaternion(camera.quaternion);


  if (keyboard['ArrowUp'] || keyboard['KeyW']) {
    camera.position.add(forward.multiplyScalar(movementSpeed));
  }
  if (keyboard['ArrowDown'] || keyboard['KeyS']) {
    camera.position.add(forward.multiplyScalar(-movementSpeed));
  }
  if (keyboard['ArrowLeft'] || keyboard['KeyA']) {
    camera.position.add(right.multiplyScalar(-movementSpeed));
  }
  if (keyboard['ArrowRight'] || keyboard['KeyD']) {
    camera.position.add(right.multiplyScalar(movementSpeed));
  }
}

document.addEventListener("keydown", onShiftkeyDown);
function onShiftkeyDown(event) {
    var keyCode = event.which;
    if (keyCode == 16/* For shift key */) {
      movementSpeed = 0.1;
    }
};
document.addEventListener("keyup", onShiftkeyUp);
function onShiftkeyUp(event) {
  var keyCode = event.which;
  // up
  if (keyCode == 16/* For shift key */) {
    movementSpeed = 0.05;
      // down
  }
};



export function keyboardControls(camera) {
  document.addEventListener('keydown', (event) => {
    keyboard[event.code] = true;
  });
  document.addEventListener('keyup', (event) => {
    keyboard[event.code] = false;
  });

  function update() {
    // if(camera.position.x > cameraAreaLim || camera.position.x < -cameraAreaLim || camera.position.z > cameraAreaLim || camera.position.z < -cameraAreaLim)
    // {
    //   console.log("Camera out of level bounds.");
    // }
    // else
    // {
      updateCameraPosition(camera);
    //}   
  }

  return { update };
}
