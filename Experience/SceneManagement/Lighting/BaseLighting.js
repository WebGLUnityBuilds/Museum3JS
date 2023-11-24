import * as THREE from 'three';
import { RectAreaLightHelper }  from 'three/examples/jsm/helpers/RectAreaLightHelper.js';
export function setupLights(scene) {





  const ambientLight = new THREE.HemisphereLight(0xffffff, 0xfffff, 0.8);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0x4380e0, 0.5);
  directionalLight.position.set(2, 3, 2);
  directionalLight.intensity = 2;
  directionalLight.castShadow = true;
  directionalLight.receiveShadow = true;
  directionalLight.shadow.mapSize.width = 1024;
  directionalLight.shadow.mapSize.height = 1024;
  directionalLight.shadow.camera.near = 0.5;
  directionalLight.shadow.camera.far = 400;
  scene.add(directionalLight);

  // const dwidth = 20.0;
  // const dheight = 10.0;

  // let tabLight = new THREE.RectAreaLight(0x4380e0, 16.0, dwidth, dheight);
  // tabLight.position.set(0,0.5,-14);
  // scene.add(tabLight);
  // tabLight.rotation.y = Math.PI;

  // const rectLight3 = new THREE.RectAreaLight( 0xffffff, 9, dwidth, dheight );
  // rectLight3.position.set( 0, 0.1, 0 );
  // scene.add( rectLight3 );




  const spotLightsc = new THREE.SpotLight(0xefefef);
  scene.add(spotLightsc);
  spotLightsc.position.set(0.5,4,-7);
  spotLightsc.intensity = 5;
  spotLightsc.angle = Math.PI;
  spotLightsc.penumbra = 0.25;
  spotLightsc.castShadow = true;

  spotLightsc.shadow.mapSize.width = 256;
  spotLightsc.shadow.mapSize.height = 256;
  spotLightsc.shadow.camera.near = 0.5;
  spotLightsc.shadow.camera.far = 10;
  spotLightsc.shadow.focus = 1;


}