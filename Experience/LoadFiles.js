import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";


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
          return loader.parse(data);
  
        case 'glb':
          data = await loadFile(url);
          return new Promise((resolve, reject) => {
            loader = new GLTFLoader();
            loader.parse(data, '', (gltf) => {
              resolve(gltf.scene);
            }, reject);
          });

        case 'glbDraco':
        data = await loadFile(url);
        return new Promise((resolve, reject) => {
          
          loader = new GLTFLoader();
          let dracoLoader = new DRACOLoader(); // Create a new instance of the DRACOLoader

        // or use dracoLoader.setDecoderPath('/draco/');
          dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/'); // Set the path to the Draco decoder files
          dracoLoader.setDecoderConfig({type: 'js'})

          loader.setDRACOLoader(dracoLoader); // Set the DRACOLoader for the GLTFLoader

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
        allSceneObjects.push(object);
      });
  
      handleLoadedObjects(allSceneObjects);
      hideProgressBar();
  
            

      function handleLoadedObjects(objects) {
        // const menuRoom = objects[0];
        // menuRoom.position.set(0, 0, 0);

        
        // traverseHierarchyAnim(menuRoom);

        // const room1 = objects[1];
        // room1.position.set(0, 0.1, 0);
        // room1.name = 'room01';
        // room1.visible = false;


        // const MoveArrow = objects[2];
        // MoveArrow.name = "movearrow";
        // MoveArrow.position.set(0, 0.3, 0);

        // rooms.push(menuRoom);
        // rooms.push(room1);
        // rooms.push(MoveArrow);
      }

            

      function traverseHierarchyAnim(object) {
        if (object instanceof THREE.Mesh) {
          // Check if the object's name contains "TAB" to determine if it has an animation
          
          if (object.name.toLowerCase().includes('tab')) {
            // Create a mixer for the object
            const mixer = new THREE.AnimationMixer(object);

            // Play the animations of the object
            object.animations.forEach((animationClip) => {
              const action = mixer.clipAction(animationClip);
              action.setLoop(THREE.LoopOnce);
              action.play();
            });
          }
        }

        if (object.children.length > 0) {
          object.children.forEach((child) => {
            traverseHierarchyAnim(child);
          });
        }
      }
  
      return allSceneObjects;
    } catch (error) {
      console.error(error);
      // Handle the error appropriately (e.g., show an error message to the user)
      throw error;
    }
  }
}
