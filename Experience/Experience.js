import * as THREE from 'three';
import gsap from 'gsap';
import Stats from 'three/addons/libs/stats.module.js';



// Scene Settings
import createRenderer from './SceneManagement/Renderer.js'; // Has The hdr, affects lighting settings with toneMapping property
import { setupLights } from './SceneManagement/Lighting/BaseLighting.js';
// Scene Settings


// Load Assets
import LoadLevel from './LoadLevel.js';
import assets from './AssetsManagement/EnvironmentFiles.js';
import setupVideo from './VideoPlayer.js';
// Load Assets


//Controls
import { keyboardControls } from './Controls/KeyboardControls.js';
import { screenControls } from './Controls/ScreenControls.js';
import { 
  handleMouseDown,
  handleMouseUp,
  handleMouseMove 
} from './Controls/MouseControls.js';
import { setupTouchControls } from './Controls/TouchControls.js';
import handleRegularMouseScroll from './Controls/ZoomControls/regularMouseScroll.js';
import handleAppleDeviceScroll from './Controls/ZoomControls/appleDeviceScroll.js';


//Toggle Full Screen
import { toggleFullscreen } from './Controls/ZoomControls/FullScreen.js';






export default class Experience{
    constructor(canvas){
        this.canvas = canvas;
        
        this.init();
    }
   
      
        
    init(){
      


      const scene = new THREE.Scene();
                             
                            
      const renderer = createRenderer(scene);
      
      const camera = new THREE.PerspectiveCamera(
        50,
        window.innerWidth / window.innerHeight,
        0.1,
        100
      );
      let cameraHeight  = 1.8;
      

      camera.position.set(0, 0, 0);
        
      setupLights(scene);





        const loadedScenes = new Map(); // Map to store the loaded scene objects
        const roomMixersMap = new Map();
        let interactableObjects = [];
   
        
        const loadSceneObjects = async (desiredRoom) => {
          console.log("Loading scene objects for room", desiredRoom);
        
          if (loadedScenes.has(desiredRoom)) {
            // If the scene is already loaded, return the corresponding scene objects
            console.log("Scene objects already loaded for room", desiredRoom);
            return Promise.resolve(loadedScenes.get(desiredRoom));
          }
        
          // Otherwise, load the scene objects
          return LoadLevel.loadSceneObjects(scene, assets, desiredRoom)
          .then((result) => {
            console.log("Loaded scene objects for room", desiredRoom, ":", result.sceneObjects);
            loadedScenes.set(desiredRoom, result.sceneObjects); // Store the loaded scene objects in the map
            roomMixersMap.set(desiredRoom, result.mixers);
            console.log(roomMixersMap);

            return result; // Return the loaded scene objects and mixers
          });
        };
        


        
        // Load and print the scene objects for room 0
        const desiredRoomInit = "0";
        loadSceneObjects(desiredRoomInit)
        .then((result) => {
          findInteractableObjects(desiredRoomInit);
          playanimation(desiredRoomInit, result);
        })
        .catch((error) => {
          console.log("Error loading scene objects for room", desiredRoomInit, ":", error);
        });

        function playanimation(desiredRoomInit, result) {
          const mixers = roomMixersMap.get(desiredRoomInit);
          if (mixers && mixers.length > 0) {
            mixers.forEach((mixer) => {
              console.log(mixer);
              result.sceneObjects.forEach((object) => {
                console.log(object.animations);
                if (object.animations && object.animations.length > 0) {
                  object.animations.forEach((animationClip) => {
                    const action = mixer.clipAction(animationClip);
                    action.play();
                  });
                }
              });
            });
          }
        }




        //////////////////////////////// Load/Instantiate Files //////////////////////////////////////




        

        renderer.debug.checkShaderErrors = true;


        let stats = new Stats();
        document.body.appendChild( stats.dom );

        camera.position.set(0,0,-10);



        // Audio Video Creation


        // Create an AudioListener
        // const listener = new THREE.AudioListener();
        // camera.add(listener); // Attach the listener to the camera or any object in the scene


        // // Create an AudioLoader
        // const audioLoader = new THREE.AudioLoader();

        // // Declare the audio variable outside the callback function
        // let audio;

        // // Load the audio file
        // audioLoader.load('./RawTextures/AudioFiles/182147GKaudio1.mp3', function(buffer) {
        //   // Create an Audio object and set the buffer
        //   audio = new THREE.Audio(listener);
        //   audio.setBuffer(buffer);
        // });

          // if (audio) {
          //   audio.play(); // Play the audio if it's loaded
          // }



        moveCamera(-0.020159, 0,4.3341);
        
        ///////////////////////////////////////////////////////////////// START EVENTS PC/LAPTOP /////////////////////////////////////////////////////////////////
      

       
      
      ///////// Control Events ////////////
      


      const fullscreenButton = document.getElementById('fullscreenButton');
      fullscreenButton.addEventListener('click', toggleFullscreen);











// Check the platform and apply the appropriate event listener
if (/Macintosh|iPad|iPhone|iPod/.test(navigator.userAgent)) {
  // Apple device scroll event listener
  document.addEventListener("wheel", (event) => handleAppleDeviceScroll(event, camera));
} else {
  // Regular mouse scroll event listener
  document.addEventListener("wheel", (event) => handleRegularMouseScroll(event, camera));
}

// Check if the device is a touchscreen
const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0);

// Add event listeners based on device
if (isTouchDevice) {
  setupTouchControls(camera);
} else {
  // Mouse controls listeners
  document.addEventListener('mousedown', handleMouseDown);
  document.addEventListener('mouseup', handleMouseUp);
  document.addEventListener('mousemove', event => handleMouseMove(event, camera));
}

const keyControls = keyboardControls(camera);
screenControls(camera);


      // ///////// ~Control Events //////////


      /// Button Navigation Events


    // Get the navigation menu items of the specific menu
    const menuItems = document.querySelectorAll('.primary-navigation li > a');

    // Add click event listener to each menu item
    menuItems.forEach((menuItem) => {
      menuItem.addEventListener('click', handleMenuItemClick);
    });

    // Function to handle menu item click event
    function handleMenuItemClick(event) {
      event.preventDefault(); // Prevent the default link behavior

      const menuItemHref = event.target.getAttribute('href');
      if (menuItemHref === '#scene0') 
      {
        loadScene("0");
      } 
      else if (menuItemHref === '#scene1') 
      {
        loadScene("1");
      } 
      else if (menuItemHref === '#scene2') 
      {
        loadScene("2");
      }
      else if (menuItemHref === '#scene3') 
      {
        loadScene("3");
      }
      else if (menuItemHref === '#scene4') 
      {
        loadScene("4");
      }
      else if (menuItemHref === '#scene5') 
      {
        loadScene("5");
      }
      else if (menuItemHref === '#scene6') 
      {
        loadScene("6");
      }
      else if (menuItemHref === '#scene7') 
      {
        loadScene("7");
      }
    }



    ///////////////////////////////////////////////////////////////// ~END EVENTS /////////////////////////////////////////////////////////////////
                                                                    //////////
                                                                    //////////
                                                                    //////////                                                                
                                                                    //////////
                                                                    //////////
                                                                    //////////
                                                                    //////////
                                                                    //////////
                                                                    //////////
    ///////////////////////////////////////////////////////////// START GSAP FUNCTIONS /////////////////////////////////////////////////////////////
    
    function moveCamera(x, y, z) {
      const lvlLim = 20;
        if(camera.position.x < -lvlLim || camera.position.x > lvlLim || camera.position.x  < -lvlLim || camera.position.z > lvlLim)
        {
          console.log("Out of level bounds");
        }
        else
        {
          let tween = gsap.to(camera.position, {
            x,
            y,
            z,
            duration: 4
        });
        //tween.delay(0.2);
        }
        
    }

    function objToObj(x, y, z, toObj) {
        let tween = gsap.to(toObj.position, {
            x,
            y,
            z,
            duration: 4
        });
        //tween.delay(0.2);
    }

    function rotateCamera(x, y, z) {
        gsap.to(camera.rotation, {
            x,
            y: y,
            z,
            duration: 2.2
        });
    }

    
    const startingIntensity = 1.5;
    const rendererProperties = { toneMappingExposure: startingIntensity };
    
    function gsapDirLightIntensityInit() {
      gsap.to(rendererProperties, {
        toneMappingExposure: startingIntensity,
        duration: 2,
        onUpdate: () => {
          renderer.toneMappingExposure = rendererProperties.toneMappingExposure;
        }
      });
    }
    
    const targetIntensity = 0.2;
    function gsapDirLightIntensityTarget() {
      gsap.to(rendererProperties, {
        toneMappingExposure: targetIntensity,
        duration: 2,
        onUpdate: () => {
          renderer.toneMappingExposure = rendererProperties.toneMappingExposure;
        }
      });
    }
    

    // color transition
    // let targetColor = new THREE.Color(0x1a1a1a);
    // function changeDirLight(light) {
    //   gsap.to(light.color, {
    //     r: targetColor.r, // Target red component
    //     g: targetColor.g, // Target green component
    //     b: targetColor.b, // Target blue component
    //     duration: 2, // Duration of the animation in seconds
    //   });
    // }

    // let originColor = new THREE.Color(0xc5ba9d);
    // function changeDirLightBack(light) {
    //   gsap.to(light.color, {
    //     r: originColor.r, // Target red component
    //     g: originColor.g, // Target green component
    //     b: originColor.b, // Target blue component
    //     duration: 2, // Duration of the animation in seconds
    //   });
    // }

    // function viewRendererGSAPin() {
    //   if(smallRenderer.domElement.style.display === "none")
    //   {
    //     smallRenderer.domElement.style.opacity = 0;
    //     gsap.fromTo(
    //       smallRenderer.domElement,
    //       { opacity: 0 },
    //       { opacity: 1, duration: 1 } // Adjust the duration as desired
    //     );
    //   }
    // }

    
    // function viewRendererGSAPout() {
    //   if(smallRenderer.domElement.style.display === "block")
    //   {
    //     smallRenderer.domElement.style.opacity = 1;
    //     gsap.fromTo(
    //       smallRenderer.domElement,
    //       { opacity: 1 },
    //       { opacity: 0, duration: 1 } // Adjust the duration as desired
    //     );
    //   }
      
    // }
      ///////////////////////////////////////////////////////////// ~END GSAP FUNCTIONS /////////////////////////////////////////////////////////////
      
      
        

       ///////////////////////////////////////////////////// Main Renderer functions ////////////////////////////////////////////////////////////////////
     
       const pointer = new THREE.Vector2();
        

       function listAllEventListeners() {
         const allElements = Array.prototype.slice.call(document.querySelectorAll('*'));
         allElements.push(document);
         allElements.push(window);
       
         const types = [];
       
         for (let ev in window) {
           if (/^on/.test(ev)) types[types.length] = ev;
         }
       
         let elements = [];
         for (let i = 0; i < allElements.length; i++) {
           const currentElement = allElements[i];
           for (let j = 0; j < types.length; j++) {
             if (typeof currentElement[types[j]] === 'function') {
               elements.push({
                 "node": currentElement,
                 "type": types[j],
                 "func": currentElement[types[j]].toString(),
               });
             }
           }
         }
       
         return elements.sort(function(a,b) {
           return a.type.localeCompare(b.type);
         });
       }


     function onClick( event ) {
 


       pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
       pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

       document.onpointerdown = function(event) {

         switch ( event.button ) {
             case 0:
               mainRendererRaycaster(pointer, event);
               break;
             case 1: 
             
               console.log("Active Drawcalls:", renderer.info.render.calls);
               console.log("Number of Vertices:", renderer.info.render.vertices);
               console.log("Number of Triangles :", renderer.info.render.triangles);
               console.log("Geometries in Memory", renderer.info.memory.geometries);
               console.log("Textures in Memory", renderer.info.memory.textures);
               console.log("Programs(Shaders) in Memory", renderer.info.programs.length);
               console.table(listAllEventListeners());

               console.log("------------------------------------------");

               break;
             case 2: 
               break;
       }
       
     }
     
     if (!timer) {
       timer = setTimeout(() => {
         // Reset the timer after x seconds 1000 = 1 second.
         timer = null;
       }, 1000);
     }
   
      
    }

    function destroyVideoElement() {

      const videoMesh = scene.getObjectByName("videoMesh");

      if(videoMesh)
      {
        console.log("Destroyed");
        scene.remove(videoMesh);

        // Optionally, you can dispose of the mesh's geometry and material to release additional resources:
        videoMesh.geometry.dispose();
        videoMesh.material.dispose();
      }

    }
    


    


      let activeStep = "step1";
      let scaleSelect = false;
      let objBackToScale = null;
      const raycaster = new THREE.Raycaster();
      function mainRendererRaycaster(pointer, event)
      {
        
        raycaster.setFromCamera(pointer, camera);
       
       // const intersects = raycaster.intersectObjects([...interactableObjects/*, */]);
       const intersects = raycaster.intersectObjects(interactableObjects, true);
        
        for (let i=0; i < intersects.length; i++)
        {
           console.log(intersects[i].object.name);
          
          if (intersects[i].object.name.includes("exhibit")) 
          {
            moveCameraToObject(intersects[i].object);
            break;
          }


          if(intersects[i].object.name.includes("tab"))
          {
            objBackToScale = intersects[i].object;
            if(!scaleSelect)
            {
              gsap.to(intersects[i].object.scale, {
                duration: 1,
                x: 1.1,
                y: 1.1,
                z: 1.1,
                // onComplete: () => {
                //   scaleSelect = true;
                // },
              });
              scaleSelect = true;
            }
            else
            {
              if(intersects[i].object.name.includes("tab00"))
              {
                loadScene("0");

                break;
              }
              if(intersects[i].object.name.includes("tab01"))
              {
                loadScene("1");

                break;
              }
              if(intersects[i].object.name.includes("tab02"))
              {
                const roomNumber = "0";
                const searchString = "Mov";
                
                setupVideo(roomNumber, searchString, camera, scene);
                //loadScene("1");

                break;
              }
              if(intersects[i].object.name.includes("tab08"))
              {

                loadScene("4");
                break;
              }
            
                      
              //scaleSelect = false;
            }
          }



          if (intersects[i].object.name.includes("step")) {

            activeStep = intersects[i].object.name;
            let x = 0;
            let z = 0;
            
            x = (intersects[i].object.position.x );
            z = (intersects[i].object.position.z );
            moveCamera(x, 1, z);
            break;
            
          }
        }
      
      }



      // Add an event listener to the document to detect general mouse clicks
      document.addEventListener('click', function(event) {
        // Check if the left or right mouse button was clicked
        if (event.button === 0 || event.button === 2) {
          // Scale the object back to its original scale using GSAP
          if(objBackToScale === null)
          {
            console.log("No object to scale back");
          }
          else
          {
            gsap.to(objBackToScale.scale, {
              duration: 1, // Animation duration in seconds
              x: 1,       // Scale back to 1 on the X-axis
              y: 1,       // Scale back to 1 on the Y-axis
              z: 1,       // Scale back to 1 on the Z-axis
            });
            scaleSelect = false;
          }
          
          objBackToScale = null;
        }
      });



    
      
      // Function to move the camera close to the object and adjust zoom
      function moveCameraToObject(intersectObj) {

        // Calculate the desired position based on the desired object's position
        const desiredPosition = intersectObj.position.clone();

        // Define the duration of the animation in seconds
        const animationDuration = 3; // Adjust as needed

        // Use GSAP to animate the camera to the desired position
        gsap.to(camera.position, {
          duration: animationDuration,
          x: desiredPosition.x,
          y: desiredPosition.y,
          z: desiredPosition.z + 1.8,
          onUpdate: () => {
            // Optionally, update the camera's lookAt target while moving
            camera.lookAt(desiredPosition);
          },
          onComplete: () => {
            // Animation completed callback (if needed)
            console.log('Camera animation completed');
          },
        });
              
      }







      // Load Senes System ///

      let activeRoom = "0";
      // Function to handle switching to a different room
      function loadScene(desiredRoom) {
        
        if (loadedScenes.has(desiredRoom)) {
          console.log(`Room ${desiredRoom} is already loaded.`);
          // Perform your logic for making the room visible here

          findObjectsToActDeact(activeRoom);
          findObjectsToActDeact(desiredRoom);
          
          findInteractableObjects(desiredRoom); // Update the interactableObjects array for the current room
          
          activeRoom = desiredRoom;
        } 
        else 
        {
          console.log(`Room ${desiredRoom} is not yet loaded.`);
          loadSceneObjects(desiredRoom).then((loadedSceneObjects) => {
          findObjectsToActDeact(activeRoom);
          findInteractableObjects(desiredRoom); // Update the interactableObjects array for the current room
         
          
          activeRoom = desiredRoom;
          });
        }
      }





    function findInteractableObjects(desiredRoom) {
      interactableObjects.length = 0;
      if (loadedScenes.has(desiredRoom)) {
        const loadedSceneObjects = loadedScenes.get(desiredRoom);

        loadedSceneObjects.forEach((object) => {
          traverseRayHierarchy(object);
        });
      } else {
        console.log(`No loaded objects found for room ${desiredRoom}`);
      }
    }





    function traverseRayHierarchy(object) {


      if (object instanceof THREE.Mesh) {
        if (
          object.name.includes("exhibit") ||
          object.name.includes("tab") ||
          object.name.includes("step") ||
          object.name.includes("media")
        ) {
          interactableObjects.push(object); // Add the object to the interactableObjects array
        }
        if(object.name.includes("step1") && object.visible)
        {
          moveCamera(object.position.x, camera.position.y, object.position.z);
        }
      }

      if (object instanceof THREE.Group) {

        for (let i = 0; i < object.children.length; i++) {
          traverseRayHierarchy(object.children[i]);
        }
      }
    }


    function findObjectsToActDeact(desiredRoom) {

      if (loadedScenes.has(desiredRoom)) {
        const loadedSceneObjects = loadedScenes.get(desiredRoom);

        loadedSceneObjects.forEach((object) => {
          traverseActDeactHierarchy(object);
        });
      } else {
        console.log(`No loaded objects found for room ${desiredRoom}`);
      }
    }


    function traverseActDeactHierarchy(object) {

      if (object instanceof THREE.Mesh) {
        
        if(object.visible)
        {
          object.visible = false;
        }
        else 
        {
          object.visible = true;
        }
        
      } 

      if (object instanceof THREE.Group) {
        for (let i = 0; i < object.children.length; i++) {
          traverseActDeactHierarchy(object.children[i]);
        }
      }
    }


    function traverseRayHierarchy(object) {


      if (object instanceof THREE.Mesh) {
        if (
          object.name.includes("exhibit") ||
          object.name.includes("tab") ||
          object.name.includes("step") ||
          object.name.includes("media")
        ) {
          interactableObjects.push(object); // Add the object to the interactableObjects array
        }
        if(object.name.includes("step1") && object.visible)
        {
          moveCamera(object.position.x, camera.position.y, object.position.z);
        }
      }

      if (object instanceof THREE.Group) {

        for (let i = 0; i < object.children.length; i++) {
          traverseRayHierarchy(object.children[i]);
        }
      }
    }


    ////////////// Object select animation part //////////////////////

        
    // Create a raycaster and initialize it
    const onMoveRaycaster = new THREE.Raycaster();
    const onMoveMouse = new THREE.Vector2();
    const scaledObjects = new Set();

    // Function to handle mousemove events
    function onMouseMove(event, camera, scene) {
      // Calculate normalized device coordinates (NDC) from mouse position
      const rect = event.target.getBoundingClientRect();
      onMoveMouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      onMoveMouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      // Update the raycaster with the mouse's NDC
      onMoveRaycaster.setFromCamera(onMoveMouse, camera);

      // Perform raycasting and get the intersections
      const intersects = onMoveRaycaster.intersectObjects(scene.children, true);

      // Filter the intersections to include only objects with names containing "tab"
      const tabIntersects = intersects.filter((intersect) => {
        return intersect.object.name.includes("tab");
      });

      // Log the names of the filtered objects
      tabIntersects.forEach((intersect) => {
        

        if (!scaledObjects.has(intersect.object)) {


          gsap.to(intersect.object.position, {
            duration: 2,
            x: intersect.object.position.x,
            y: intersect.object.position.y + 0.4,
            z: intersect.object.position.z,
          });




          // Object was not previously scaled, scale it up
          gsap.to(intersect.object.scale, {
            duration: 2,
            x: 1.1,
            y: 1.1,
            z: 1.1,
          });

          // Add the object to the set of scaled objects
          scaledObjects.add(intersect.object);
        }
      });

      // Check if any previously scaled objects are no longer intersected
      scaledObjects.forEach((object) => {
        if (!tabIntersects.some((intersect) => intersect.object === object)) {

          gsap.to(object.position, {
            duration: 2,
            x: object.position.x,
            y: -0.4,
            z: object.position.z,
          });

          // Object is no longer intersected, scale it back down
          gsap.to(object.scale, {
            duration: 2,
            x: 1,
            y: 1,
            z: 1,
          });

          // Remove the object from the set of scaled objects
          scaledObjects.delete(object);
        }
      });
    }

    // Add a mousemove event listener to your canvas or window
    window.addEventListener('mousemove', (event) => {
      onMouseMove(event, camera, scene); // Replace "camera" and "scene" with your camera and scene objects
    });



    ////////////// ~ Object select animation part //////////////////////



    let mouseDown = false;
    let timer = null;
    
    // Event listener for mouse down
    document.addEventListener('mousedown', (event) => {
      
      mouseDown = true;
    
      // Call the function if the timer is not active
      if (!timer) {
        onClick(event);
      }
      
      
    });

    // Event listener for mouse up
    document.addEventListener('mouseup', () => {
      mouseDown = false;
    });



    //////////////////////////////////////////////////// ~Main Renderer functions ////////////////////////////////////////////////////////////////////
    


      

      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // Create a new div element for the renderer and add it to the page
      
      ////////////////////////////////////// Update Animate ////////////////////////////////////////////////////////
      
      // let effectController = {
      //   fov : 50
      // };
      // let gui = new GUI();
      // let element = gui.add( effectController, "fov", 1.0, 179.0);
      // element.name("field of view");

      var clock = new THREE.Clock();
      
     
      function animate() {
        requestAnimationFrame(animate);

        keyControls.update();
           
        var delta = clock.getDelta();
        
        
        const mixers = roomMixersMap.get(activeRoom);
        if (mixers) {
          mixers.forEach((mixer) => {
            mixer.update(delta); 
          });
        }


        if(camera.position.x > 20){
          camera.position.x = 20;
        } 
        if(camera.position.z > 20){
          camera.position.z = 20;
        } 
        camera.position.y = cameraHeight;


        //camera.fov = effectController.fov;
        camera.updateProjectionMatrix();
        renderer.render(scene, camera);

        

        
        //updatGrabablePosition();
        stats.update();

      }
      animate();
      //renderer.setAnimationLoop(animate);
      ////////////////////////////////////// ~Update Animate ////////////////////////////////////////////////////////





      ///////////////////////////////////////////////////////////// Math FUNCTIONS /////////////////////////////////////////////////////////////

      function measureDistance(obj1, obj2)
      {
        const dx = obj1.position.x - obj2.position.x;
        const dz = obj1.position.z - obj2.position.z;
        const dy = obj1.position.y - obj2.position.y;
        // Ignore the Y component
        const distance = Math.sqrt(dx * dx + dz * dz + dy * dy);
      
        return distance;
      };

      // Update the cylinder's position to always be in front of the camera
      // const updatGrabablePosition = () => {
      //   if(stepDir)
      //   {
      //     const cameraPosition = new THREE.Vector3();
      //     camera.getWorldPosition(cameraPosition);
      //     const cameraDirection = new THREE.Vector3();
      //     camera.getWorldDirection(cameraDirection);
      //     const distance = -3.5; // Adjust the distance of the cylinder from the camera
  
      //     stepDir.position.copy(cameraPosition).add(cameraDirection.multiplyScalar(-distance));
      //     stepDir.position.y = 0.2;
      //   }
       
      // };


      ///////////////////////////////////////////////////////////// ~Math FUNCTIONS /////////////////////////////////////////////////////////////
      
  
      window.addEventListener("resize", () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);


      });
        
        
      window.addEventListener('contextmenu', function (e) { 
          // do something here... 
          e.preventDefault(); 
      }, false);



  }

}

