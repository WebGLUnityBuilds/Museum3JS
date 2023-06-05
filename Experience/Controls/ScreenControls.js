import * as THREE from 'three';
import { gsap } from 'gsap';



const movementSpeed = 1.8; 
const cameraLimits = 20;
export function screenControls(camera) {
  
    const moveDistance = movementSpeed; // Set the movement distance

    function moveForward() {
        const direction = new THREE.Vector3();
        camera.getWorldDirection(direction);
        const delta = direction.multiplyScalar(moveDistance);
        gsap.to(camera.position, { duration: 1, x: `+=${delta.x}`, y: `+=${delta.y}`, z: `+=${delta.z}` });
    }

    function moveBackward() {
        const direction = new THREE.Vector3();
        camera.getWorldDirection(direction);
        const delta = direction.multiplyScalar(moveDistance);
        gsap.to(camera.position, { duration: 1, x: `-=${delta.x}`, y: `-=${delta.y}`, z: `-=${delta.z}` });
    }

    function moveLeft() {
        const right = new THREE.Vector3();
        camera.getWorldDirection(right);
        right.cross(new THREE.Vector3(0, 1, 0));
        const delta = right.multiplyScalar(moveDistance);
        gsap.to(camera.position, { duration: 1, x: `-=${delta.x}`, y: `-=${delta.y}`, z: `-=${delta.z}` });
    }

    function moveRight() {
        const right = new THREE.Vector3();
        camera.getWorldDirection(right);
        right.cross(new THREE.Vector3(0, 1, 0));
        const delta = right.multiplyScalar(moveDistance);
        gsap.to(camera.position, { duration: 1, x: `+=${delta.x}`, y: `+=${delta.y}`, z: `+=${delta.z}` });
    }

    const forwardButton = document.getElementById('forwardCB_action');
    const backwardButton = document.getElementById('backwardsCB_action');
    const leftButton = document.getElementById('leftCB_action');
    const rightButton = document.getElementById('rightCB_action');

    
    forwardButton.addEventListener('click', moveForward);
    backwardButton.addEventListener('click', moveBackward);
    leftButton.addEventListener('click', moveLeft);
    rightButton.addEventListener('click', moveRight);
  
}
