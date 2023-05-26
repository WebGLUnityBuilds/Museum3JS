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
      
      function handleLoadedObjects(objects) {
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
        steps.position.set(0, -0.25, 0);
        
        rooms.push(menuRoom);
        rooms.push(room1);
        rooms.push(steps);
      }


      // Example usage:
      const promises = roomFilePath.map((url, index) => loadAsset(roomFileType[index], url));
      let i = -10;
      console.log(promises.length)
      Promise.all(promises)
        .then((objects) => {
          // All assets have been loaded successfully
          objects.forEach((object) => {
            scene.add(object); // Add object to the scene
            allSceneObjects.push(object);
          });
          handleLoadedObjects(allSceneObjects);

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










        //// Load FBX Files, mostly works

        // let room0;

        // const fbxLoader = new FBXLoader()
        // fbxLoader.load(
        //     './Models/Environment/Room0Tabs/room0tabs.fbx',
        //     (object) => {
        //         scene.add(object)
                
        //         object.scale.set(0.01,0.01,0.01);
        //         object.position.set(0,3,0);
        //         object.name = "fad"; // assign the name here
        //         room0 = object;
        //         allSceneObjects["room0"]= room0;
        //     },
        //     (xhr) => {
        //         console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
        //     },
        //     (error) => {
        //         console.log(error)
        //     }
        // )

      // const tabGltfFilepaths = [
        
      // ];
        
      // // Access the path array inside texturePaths using forEach
      // exhibits.room0.tabs.texturePaths.path.forEach((path, i) => {
      //   tabGltfFilepaths.push(path);
      // });
              
      

        ///////////////////////// Load all tabs as one from gltf
      // // Create a new texture loader
      // const textureLoader = new THREE.TextureLoader();

      // // Create a new GLTF loader
      // //const gltfLoader = new THREE.GLTFLoader();





      // gltfLoader.load("./Models/tabs/OneFileTabsGLTF/tabsEnter.gltf", (gltf) => {
      //   gltf.scene.traverse((child) => {
      //     if (child.isMesh) {
      //       // check if child.material is an array before looping over it
      //       if (Array.isArray(child.material)) {
      //         child.material.forEach((material, index) => {
      //           if (material) { // check if the material exists
      //             textureLoader.load(
      //               tabGltfFilepaths[index], // set the correct texture path for this material
      //               (texture) => {
      //                 texture.flipZ = true;
      //                 material.map = texture // set the texture map
      //                 material.needsUpdate = true // update the material
      //               },
      //               undefined,
      //               (error) => {
      //                 console.error(`Error loading texture: ${error}`)
      //               }
      //             )
      //           }
      //         })
      //       } else {
      //         // if child.material is not an array, just set the texture map for that material
      //         const material = child.material; // declare the material variable
      //         textureLoader.load(
      //           tabGltfFilepaths[0], // set the correct texture path for this material
      //           (texture) => {
      //             texture.flipY = true;
      //             material.map = texture // set the texture map
      //             material.needsUpdate = true // update the material
      //           },
      //           undefined,
      //           (error) => {
      //             console.error(`Error loading texture: ${error}`)
      //           }
      //         )
      //       }
      //     }
      //   })
      
      //   scene.add(gltf.scene)
      
      //   // set the scale and position of the gltf object
      //   gltf.scene.position.set(0, 3, 0)
      
      // }, 
      // (xhr) => {
      //   console.log(`${(xhr.loaded / xhr.total * 100)}% loaded`)
      // },
      // (error) => {
      //   console.error(`Error loading GLTF file: ${error}`)
      // })

      
      //   //Loading all tabs for room 0 with gltf loader and filepaths from EnciromentFiles.js 
      //   const tabGltfFilepaths = [
          
      //   ];
          

      //   Object.values(exhibits).forEach((room) => {
      //     Object.values(room).forEach((tab) => {
      //       const filePath = tab.path;
      //       tabGltfFilepaths.push(filePath);
      //     });
      //   });
        
      //   const loader = new GLTFLoader();
        

      //   let i = 0;
      //   let RoomOneObj = [];
        
      //   tabGltfFilepaths.forEach((filepath) => {
      //     loader.load(
      //       filepath,
      //       (gltf) => {
      //         const object = gltf.scene;
      //           scene.add(object);
      //           object.position.y = 3.1;
      //           object.position.x = i + (i*1.2) ;
      //           object.position.z = 5;
      //           i++;
      //       },
      //       (xhr) => {
      //         console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      //       },
      //       (error) => {
      //         console.log(`Error loading ${filepath}`, error);
      //       }
      //     );
      //   });


        

        


        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



        //////////////////////////////////// Temp Boxes For Future Spots ////////////////////////////////////const geometry = new THREE.CylinderGeometry( 5, 5, 20, 32 );


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


      // const floorGeo = new THREE.PlaneGeometry( 1000, 1000 );
      // const floorMaterial = new THREE.MeshStandardMaterial( {color: 0xc5ba9d, side: THREE.DoubleSide} );
      // const floor = new THREE.Mesh( floorGeo, floorMaterial );
      // floor.rotation.x = Math.PI / 2;
      // floor.position.y = -0.5;
      // scene.add( floor );
      // //rooms.push(floor);



      ///////////////////////////////////// Steps /////////////////////////////////////////////////////////////////////////////////////////////////////////////////

          console.log(rooms);

        return rooms;

    }



}
