import * as THREE from 'three';

export function setupLights(scene) {


  const ambientLight = new THREE.HemisphereLight(0xffffff, 0x00ffff, 0.1);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0x4380e0, 0.2);
  directionalLight.position.set(-6, 3, 5);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 512;
  directionalLight.shadow.mapSize.height = 512;
  directionalLight.shadow.camera.near = 0.5;
  directionalLight.shadow.camera.far = 500;
  scene.add(directionalLight);


}