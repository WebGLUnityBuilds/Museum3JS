import * as THREE from 'three';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

let hdrTexture = null; // Global variable to store the HDR texture

const createRenderer = (scene) => {
  const renderer = new THREE.WebGLRenderer({ antialias: true });

  renderer.setPixelRatio(window.devicePixelRatio * 0.95);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  renderer.setClearColor(0x95adbf);

  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap ;
  
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.3;



  // If you want to check display if supports hdri use this code.
  // also need replicate of all assets with metallic property set close to 0.
  // Lighting settings might need tweaking too.
  
  // console.log("SDR:", window.matchMedia("(dynamic-range: standard)").matches)
  // console.log("HDR:", window.matchMedia("(dynamic-range: high)").matches)


  let materialArray = [];
  let texture_bk = new THREE.TextureLoader().load('./Models/Environment/Skybox/arid2_bk.jpg');
  let texture_dn = new THREE.TextureLoader().load('./Models/Environment/Skybox/arid2_dn.jpg');
  let texture_ft = new THREE.TextureLoader().load('./Models/Environment/Skybox/arid2_ft.jpg');
  let texture_lf = new THREE.TextureLoader().load('./Models/Environment/Skybox/arid2_lf.jpg');
  let texture_rt = new THREE.TextureLoader().load('./Models/Environment/Skybox/arid2_rt.jpg');
  let texture_up = new THREE.TextureLoader().load('./Models/Environment/Skybox/arid2_up.jpg');

  materialArray.push(new THREE.MeshBasicMaterial({map: texture_bk}));
  materialArray.push(new THREE.MeshBasicMaterial({map: texture_dn}));
  materialArray.push(new THREE.MeshBasicMaterial({map: texture_ft}));
  materialArray.push(new THREE.MeshBasicMaterial({map: texture_lf}));
  materialArray.push(new THREE.MeshBasicMaterial({map: texture_rt}));
  materialArray.push(new THREE.MeshBasicMaterial({map: texture_up}));

  for(let i=0; i<6; i++)
  {
    materialArray[i].side = THREE.BackSide;
  }

  let skyboxGeo = new THREE.BoxGeometry(10000,10000,10000);
  let skybox = new THREE.Mesh(skyboxGeo, materialArray);
  scene.add(skybox);
  

  // if (hdrTexture) {
  //   // HDR texture is already loaded, apply it to the scene
  //   setSceneBackgroundAndEnvironment(scene, hdrTexture);
  // } else {
  //   // Load the HDR texture
  //   const loader = new RGBELoader();
  //   loader.load('../heavyAssets/HDRIs/kloppenheim_06_puresky_4k.hdr', function (texture) {
  //     hdrTexture = texture; // Store the HDR texture globally
  //     setSceneBackgroundAndEnvironment(scene, hdrTexture); // Apply the texture to the scene
  //   });
  // }

  return renderer;
};

// Helper function to set the scene's background and environment
// function setSceneBackgroundAndEnvironment(scene, texture) {
//   texture.mapping = THREE.EquirectangularReflectionMapping;
//   texture.rotation = Math.PI / 2; 

//   scene.background = texture;
//   scene.environment = texture;
// }

export default createRenderer;



// import * as THREE from 'three';
// import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

// const createRenderer = (scene) => {
//   const renderer = new THREE.WebGLRenderer({ antialias: true });

//   renderer.setPixelRatio(window.devicePixelRatio * 0.86); //*0.8);
//   renderer.setSize(window.innerWidth, window.innerHeight);
//   document.body.appendChild(renderer.domElement);
//   renderer.shadowMap.enabled = true;
//   renderer.shadowMap.type = THREE.PCFShadowMap;
  
  
//   const hdrTexture = '../heavyAssets/HDRIs/kloppenheim_06_puresky_4k.hdr';
//   renderer.outputColorSpace = THREE.SRGBColorSpace;
//   renderer.toneMapping = THREE.ACESFilmicToneMapping;
//   renderer.toneMappingExposure = 1.8;

//   const loader = new RGBELoader();
//   loader.load(hdrTexture, function (texture) {
//     texture.mapping = THREE.EquirectangularReflectionMapping;
    
//     scene.background = texture;
//     scene.environment = texture;
//   });

//   return renderer;
// };

// export default createRenderer;