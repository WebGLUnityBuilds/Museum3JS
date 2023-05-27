import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import gsap from 'gsap';
import { SimplifyModifier } from 'three/addons/modifiers/SimplifyModifier.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";

import {
    CSS3DObject,
    CSS3DSprite
  } from "three/examples/jsm/renderers/CSS3DRenderer";
import { element1, element2, element3 } from "/assets/txtElements.js";


import exhibits from "./SceneManagement/EnvironmentFiles.js";


export default class LoadFiles{
    constructor(){
        

        
        //this.gltfloaderFunc();


    }

    gltfloaderFunc(gltfLoader, scene){

        
      
        
      let allSceneObjects = [];
      let rooms = [];
      ///////////////////// Load Files using Promises /////////////////////////////
        
      
      // const tabGltfFilepaths = [];

      // // Access the path array inside texturePaths using forEach
      // exhibits.room0.tabs.texturePaths.path.forEach((path, i) => {
      //   tabGltfFilepaths.push(path);
      // });
      const roomFileType = [];
      const roomFilePath = [];
      
      // Access the path and type arrays inside exhibits using forEach
      Object.values(exhibits.room0).forEach((tab) => {
        roomFilePath.push(tab.path);
        roomFileType.push(tab.type);
      });
      
      function fbxType(url) {
        return new Promise((resolve, reject) => {
          const fbxLoader = new FBXLoader();
          fbxLoader.load(url, (fbx) => {
            resolve(fbx);
          }, null, reject);
        });
      }
      
      function LoadGLTFType(url) {
        return new Promise((resolve, reject) => {
          const gltfLoader = new GLTFLoader();
          gltfLoader.load(url, (gltf) => {
            resolve(gltf.scene);
          }, null, reject);
        });
      }
      
       function loadAsset(type, url) {
        switch (type) {
          case 'gltf':
            return LoadGLTFType(url);
          case 'glb':
            return LoadGLTFType(url);
          case 'fbx':
            return fbxType(url);
          default:
            throw new Error(`Unsupported asset type: ${type}`);
        }
      }
      
      function handleLoadedObjects(objects, animations) {
        // Access and manipulate the stored objects
        const menuRoom = objects[0];
        //menuRoom.scale.multiplyScalar(0.01);
        menuRoom.position.set(0, 5, 13);
        
        menuRoom.traverse((child) => {
          // Enable receive shadows for each child object
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
          }
        });

        const room1 = objects[1];
        //room1.scale.multiplyScalar(0.1);
        room1.position.set(0, 0.1, 1);
        room1.name = "room01";
        room1.visible = false;
        //room1.castShadow = true; //default is false
        //room1.receiveShadow = false;
    
        const steps = objects[2];
        steps.scale.multiplyScalar(0.01);
        steps.traverse((child) => {
          // Enable receive shadows for each child object
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
          }
        });
        steps.position.set(0, 0, 0);
        

        const animeC = objects[3];
        animeC.traverse((child) => {
          // Enable receive shadows for each child object
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
          }
        });
        animeC.position.set(0, 1, 0);


        rooms.push({
          model: menuRoom,
          animations: animations[0], // Store the animations along with the model
        });
        
        rooms.push({
          model: room1,
          animations: animations[1] || [], // Add animations for this model if available
        });
      
        rooms.push({
          model: steps,
          animations: animations[2] || [], // Add animations for this model if available
        });

        rooms.push({
          model: steps,
          animations: animations[3] || [], // Add animations for this model if available
        });
        rooms.forEach((d) => {
          console.log(d.animations);
        });


      }

      // Example usage:
      const promises = roomFilePath.map((url, index) => loadAsset(roomFileType[index], url));
      console.log(promises.length);
      Promise.all(promises)
        .then((objects) => {
          // All assets have been loaded successfully
          objects.forEach((object, index) => {
            scene.add(object); // Add object to the scene
            allSceneObjects.push(object);
          });
          //scene.add(object); // Add object to the scene
          //allSceneObjects.push(object);
          handleLoadedObjects(allSceneObjects, objects.map((obj) => obj.animations || []));
          //handleLoadedObjects(allSceneObjects);

        })
        .catch((error) => {
          // An error occurred while loading one of the assets
          console.error(error);
        });


      

        // let room0;

        // //const gltfLoader = new GLTFLoader();
        // const dracoLoader = new DRACOLoader();
        // dracoLoader.setDecoderPath('./draco/');
        // gltfLoader.setDRACOLoader(dracoLoader);

        // gltfLoader.load(
        //   './Models/tabs/OneFileTabsGLTF/tabsEnter.gltf',
        //   (gltf) => {
        //     const object = gltf.scene;
        //     scene.add(object);
                        
        //     object.scale.set(1, 1, 1);
        //     object.position.set(0, 3, 0);
        //     object.name = "fad"; // assign the name here
        //     room0 = object;
        //     allSceneObjects["room0"] = room0;
        //   },
        //   (xhr) => {
        //     console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
        //   },
        //   (error) => {
        //     console.log(error);
        //   }
        // );

        
        // let room0;

        // //const gltfLoader = new GLTFLoader();
        // const dracoLoader = new DRACOLoader();
        // dracoLoader.setDecoderPath('./draco/');
        // gltfLoader.setDRACOLoader(dracoLoader);  


        // gltfLoader.load(
        //   './tabsGLB/1matGLB.glb',
        //   (gltf) => {
        //     // Set the model's position and scale
        //     gltf.scene.position.set(0, 0, 0);
        //     gltf.scene.scale.set(10, 10, 10);
        
        //     // Add the model to the scene
        //     scene.add(gltf.scene);
        //   },
        //   (xhr) => {
        //     console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
        //   },
        //   (error) => {
        //     console.log('An error happened', error);
        //   }
        // );





        // const dracoLoader = new DRACOLoader();
        // dracoLoader.setDecoderPath('./draco/');
        // gltfLoader.setDRACOLoader(dracoLoader);  


        // gltfLoader.load(
        //   './tabsGLB/FixedCTT.glb',
        //   (gltf) => {
        //     // Set the model's position and scale
        //     gltf.scene.position.set(-1, 0.5, 0);
        //     gltf.scene.scale.set(1,1,1);
        
        //     // Add the model to the scene
        //     scene.add(gltf.scene);
        //   },
        //   (xhr) => {
        //     console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
        //   },
        //   (error) => {
        //     console.log('An error happened', error);
        //   }
        // );






          ///////////////////////////////Floor///////////////////////////////////////////////////////////////////////////////
        
          gltfLoader.load('./Models/Environment/Floor/floor.gltf', (gltf) => {
            const model = gltf.scene;
            
            model.name = "floor";
            model.scale.set(0.8,0.1,0.8);
            
            model.position.set(0,-0.3,0);
            model.rotation.z = -Math.PI * 2;
            model.traverse((child) => {
              // Enable receive shadows for each child object
              if (child instanceof THREE.Mesh) {
                child.receiveShadow = true;
              }
            });
              
            //scene.add(model);
          },(xhr) => {
              console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
            },
            (error) => {
              console.log(`Error loading ${filepath}`, error);
          }
      );



      ///////////////////////////////////// Steps /////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        //console.log(rooms);
        
        return rooms;

    }



}
