import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import * as THREE from 'three'; // Import the THREE module

//"three": "^0.145.0" updated to "three": "^0.153.0",
export default class LoadFiles {
  constructor() {}

  
  async gltfloaderFunc(scene, assetsData) {
    function loadFile(url) {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'arraybuffer';
  
        xhr.onprogress = (event) => {
          if (event.lengthComputable) {
            const progress = (event.loaded / event.total) * 100;
            updateProgressBar(progress);
          }
        };
  
        xhr.onload = () => {
          if (xhr.status === 200) {
            resolve(xhr.response);
          } else {
            reject(new Error(`Failed to load file: ${url}`));
          }
        };
  
        xhr.onerror = () => {
          reject(new Error(`Failed to load file: ${url}`));
        };
  
        xhr.send();
      });
    }
  
    function updateProgressBar(progress) {
      const progressBar = document.getElementById('progress-bar');
      progressBar.value = progress;
    }
  
    async function loadAsset(type, url) {
      let data;
      let loader;
  
      switch (type) {
        case 'gltf':
          data = await loadFile(url);
          loader = new GLTFLoader();
          const gltf = await loader.parse(data);
          return gltf.scene;
  
        case 'glb':
          data = await loadFile(url);
          loader = new GLTFLoader();
          return new Promise((resolve, reject) => {
            loader.parse(data, '', (gltf) => {
              resolve(gltf.scene);
            }, reject);
          });

        case 'glbDraco':
          data = await loadFile(url);
          loader = new GLTFLoader();
          const dracoLoader = new DRACOLoader();
          dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
          dracoLoader.setDecoderConfig({ type: 'js' });
          dracoLoader.preload();
          loader.setDRACOLoader(dracoLoader);
          return new Promise((resolve, reject) => {
            loader.parse(data, '', (gltf) => {
              resolve(gltf.scene);
            }, reject);
          });

  
        case 'fbx':
          data = await loadFile(url);
          loader = new FBXLoader();
          return loader.parse(data);
  
        default:
          throw new Error(`Unsupported asset type: ${type}`);
      }
    }
  
    const progressBarContainer = document.querySelector('.progress-bar-container');
    const content = document.getElementById('scene-area');
  
    function hideProgressBar() {
      progressBarContainer.style.display = 'none';
      content.style.display = 'block';
    }
  
    try {
      const objects = await Promise.all(assetsData.map(({ type, path }, index) => loadAsset(type, path)));
      const allSceneObjects = [];
  
      objects.forEach((object) => {
        scene.add(object);
        a(object);
        function a(object) {

          console.log(object.name);
          if (object instanceof THREE.Mesh) {
            if (
              object.name.includes("exhibit") ||
              object.name.includes("tab") ||
              object.name.includes("media") 
            ) 
            {
              object.castShadow = true;
              object.receiveShadow = true;
            }

            if(
              object.name.includes("floor") ||
              object.name.includes("step") ||
              object.name.includes("wall")||
              object.name.includes("stand") ||
              object.name.includes("stand001") 
              )
            {
              object.receiveShadow = true;
            }
        
          
           
          } 
    
          if (object instanceof THREE.Group) {
            for (let i = 0; i < object.children.length; i++) {
              a(object.children[i]);
            }
          }
        }
    


        allSceneObjects.push(object);
      });
  
      handleLoadedObjects(allSceneObjects);
      
  
            

      function handleLoadedObjects(objects) {
        hideProgressBar();
      }

  
      return allSceneObjects;
    } catch (error) {
      console.error(error);
      // Handle the error appropriately (e.g., show an error message to the user)
      throw error;
    }
  }
}
