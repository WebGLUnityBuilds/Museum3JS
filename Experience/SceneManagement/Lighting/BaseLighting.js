import * as THREE from 'three';

export function setupLights(scene) {





  const ambientLight = new THREE.HemisphereLight(0xffffff, 0x00ffff, 1);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0x4380e0, 1);
  directionalLight.position.set(2, 3, 2);
  directionalLight.intensity = 1;
  directionalLight.castShadow = true;
  directionalLight.receiveShadow = true;
  directionalLight.shadow.mapSize.width = 1024;
  directionalLight.shadow.mapSize.height = 1024;
  directionalLight.shadow.camera.near = 0.5;
  directionalLight.shadow.camera.far = 1000;
  scene.add(directionalLight);


  
  //RactAreaLightUniformsLib.init();



}