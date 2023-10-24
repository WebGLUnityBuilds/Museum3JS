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


// import { VRButton } from 'three/addons/webxr/VRButton.js';
// import { XRControllerModelFactory } from 'three/addons/webxr/XRControllerModelFactory.js';



export default class Experience{
    constructor(canvas){
        this.canvas = canvas;
        
        this.init();
    }
   
      
        
    init(){
      


      const scene = new THREE.Scene();
                             
                            
      const renderer = createRenderer(scene);
      
///// XR


      // const geometry = new THREE.BufferGeometry();
      // geometry.setFromPoints( [ new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, - 5 ) ] );

      // const controller1 = renderer.xr.getController( 0 );
      // controller1.add( new THREE.Line( geometry ) );
      // scene.add( controller1 );

      // const controller2 = renderer.xr.getController( 1 );
      // controller2.add( new THREE.Line( geometry ) );
      // scene.add( controller2 );



      // const controllerModelFactory = new XRControllerModelFactory();

      // const controllerGrip1 = renderer.xr.getControllerGrip( 0 );
      // controllerGrip1.add( controllerModelFactory.createControllerModel( controllerGrip1 ) );
      // scene.add( controllerGrip1 );

      // const controllerGrip2 = renderer.xr.getControllerGrip( 1 );
      // controllerGrip2.add( controllerModelFactory.createControllerModel( controllerGrip2 ) );
      // scene.add( controllerGrip2 );

      // document.body.appendChild(VRButton.createButton(renderer));

/////// XR



      const camera = new THREE.PerspectiveCamera(
        50,
        window.innerWidth / window.innerHeight,
        0.1,
        100
      );
      let cameraHeight  = 2;
      

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
            return result; // Return the loaded scene objects and mixers
          });
        };
        


        
        // Load and print the scene objects for room 0
        const desiredRoomInit = "0";
        loadSceneObjects(desiredRoomInit)
        .then((result) => {
          findInteractableObjects(desiredRoomInit);
          //playanimation(desiredRoomInit, result);
        })
        .catch((error) => {
          console.log("Error loading scene objects for room", desiredRoomInit, ":", error);
        });






        function playanimation(desiredRoomInit, result) {
          const mixers = roomMixersMap.get(desiredRoomInit);
          if (mixers && mixers.length > 0) {
            mixers.forEach((mixer) => {
              result.sceneObjects.forEach((object) => {
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



        moveCamera(0, 0, 2.3);
        
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
        moveIsAnimating = true;
        loadScene("0");
        gsapDirLightIntensityInit();
      } 
      else if (menuItemHref === '#scene1') 
      {
        moveIsAnimating = true;
        loadScene("1");
        gsapDirLightIntensityTarget(0.1);
      } 
      else if (menuItemHref === '#scene2') 
      {
        moveIsAnimating = true;
        loadScene("2");
        gsapDirLightIntensityTarget(0.1);
      }
      else if (menuItemHref === '#scene3') 
      {
        loadScene("3");
        gsapDirLightIntensityTarget(0.1);
      }
      else if (menuItemHref === '#scene4') 
      {
        loadScene("4");
        gsapDirLightIntensityTarget(0.1);
      }
      else if (menuItemHref === '#scene5') 
      {
        loadScene("5");
        gsapDirLightIntensityTarget(0.1);
      }
      else if (menuItemHref === '#scene6') 
      {
        loadScene("6");
        gsapDirLightIntensityTarget(0.1);
      }
      else if (menuItemHref === '#scene7') 
      {
        loadScene("7");
        gsapDirLightIntensityTarget(0.1);
      }
      else if (menuItemHref === '#scene8') 
      {
        loadScene("8");
        gsapDirLightIntensityTarget(0.1);
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
          gsap.to(camera.position, {
            x,
            y,
            z,
            duration: 4,
            overwrite: "auto",
        });
        //tween.delay(0.2);
        }
        
    }
    
    let tabAnim_i = 0;
    let moveIsAnimating = true;
    function objToPos(x, y, z, obj) {
      gsap.to(obj.position, {
        x,
        y: y,
        z,
        duration: 1.5,    // Animation duration in seconds
        onComplete: () => {
          tabAnim_i = 0;
          if(obj.name.includes("8"))
            moveIsAnimating = false;
        },
        
      });
    }

    function rotateCamera(x, y, z) {
        gsap.to(camera.rotation, {
            x,
            y: y,
            z,
            duration: 2.2
        });
    }

    const startingIntensity = 0.1;
    const rendererProperties = { toneMappingExposure: startingIntensity };
    
    function gsapDirLightIntensityInit(targetIntensity) {
      gsap.to(rendererProperties, {
        toneMappingExposure: startingIntensity,
        duration: 2,
        onUpdate: () => {
          renderer.toneMappingExposure = rendererProperties.toneMappingExposure;
        }
      });
    }
    
    const targetIntensity = 0.5;
    function gsapDirLightIntensityTarget(targetIntensity) {
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

       document.onpointerup = function (event) {
        const elementsToIgnore = ['BUTTON', 'UL'];
    
        let elementUnderMouse = document.elementFromPoint(event.clientX, event.clientY);
    
        while (elementUnderMouse) {
          if (elementsToIgnore.includes(elementUnderMouse.tagName)) {
            // Mouse is over an element to be ignored, don't perform raycasting
            return;
          }
    
          elementUnderMouse = elementUnderMouse.parentElement;
        }


        
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
    
   
      
    }

    function destroyVideoElement() {
      const videoElement = document.getElementById('CurrentVideo');
      if (videoElement) {
        videoElement.pause();
        videoElement.removeAttribute('src');
        videoElement.load();
    
        const videoMesh = scene.getObjectByName("videoMesh");
        if (videoMesh) {
          const material = videoMesh.material;
          if (material.map) {
            material.map.dispose();
          }
          scene.remove(videoMesh);
        }
    
        videoElement.parentNode.removeChild(videoElement);
      }
      destroyVideoPlane();
    }

    function destroyVideoPlane() {

    const videoMesh = scene.getObjectByName("videoMesh");

    function removeObjWithChildren(obj) {
      if (obj.children.length > 0) {
          for (var x = obj.children.length - 1; x >= 0; x--) {
              removeObjWithChildren(obj.children[x])
          }
      }
      if (obj.isMesh) {
          obj.geometry.dispose();
          obj.material.dispose();
      }
      if (obj.parent) {
          obj.parent.remove(obj)
  
      }
    }
    removeObjWithChildren(videoMesh);
    }
    
    document.addEventListener("keydown", onShiftkeyDown);
    function onShiftkeyDown(event) {
        var keyCode = event.which;
        if (keyCode == 27/* For shift key */) {
          console.log("Escape Hit");
          destroyVideoElement();
        }
    };

      let rayNoHit = true;
      let activeStep = "step1";
      
      const raycaster = new THREE.Raycaster();






      function mainRendererRaycaster(pointer, event)
      {

        raycaster.setFromCamera(pointer, camera, 0.0 ,0.1);
        
        const intersects = raycaster.intersectObjects(interactableObjects, true);
        rayNoHit = true;

        if (intersects.length) {
  
        const intersectedObject = intersects[0].object;
    
      
        let o_name = intersectedObject.name;
        
       

          switch (true) {
            case o_name.includes("exhibit"):
              moveCameraToObject(intersectedObject);
              
              // const roomNumber = "0";
              // const searchString = "Mov";
              //setupVideo(roomNumber, searchString, camera, scene);

              rayNoHit = false;
            break;
            case o_name.includes("exit"):
              loadScene("0");
              gsapDirLightIntensityInit(0.1);

              rayNoHit = false;
            break;
            case o_name.includes("tab00"):
              moveIsAnimating = true;
              loadScene("0");
              gsapDirLightIntensityInit(0.1);

              rayNoHit = false;
            break;
            case o_name.includes("tab01"):
              moveIsAnimating = true;
              loadScene("1");
              gsapDirLightIntensityTarget(0.1);

              rayNoHit = false;
            break;
            case o_name.includes("tab02"):
              const roomNumber = "0";
              const searchString = "Mov";
              setupVideo(roomNumber, searchString, camera, scene);
              //loadScene("2");
              //gsapDirLightIntensityTarget(0.1);

              rayNoHit = false;
            break;
            case o_name.includes("tab03"):
              //loadScene("3");
              //gsapDirLightIntensityTarget(0.1);

              rayNoHit = false;
            break;
            case o_name.includes("tab04"):
              moveIsAnimating = true;
              loadScene("4");
              gsapDirLightIntensityTarget(0.1);

              rayNoHit = false;
            break;
            case o_name.includes("tab05"):
              //loadScene("5");
              //gsapDirLightIntensityTarget(0.1);

              rayNoHit = false;
            break;
            case o_name.includes("tab06"):
              //loadScene("6");
              //gsapDirLightIntensityTarget(0.1);

              rayNoHit = false;
            break;
            case o_name.includes("tab07"):
              //loadScene("7");
              //gsapDirLightIntensityTarget(0.1);

              rayNoHit = false;
            break;
            case o_name.includes("tab08"):
              //loadScene("8");
              //gsapDirLightIntensityTarget(0.1);

              rayNoHit = false;
            break;
            case o_name.includes("step"):
              activeStep = intersectedObject;
              let x = 0;
              let z = 0;
              
              x = (intersectedObject.position.x );
              z = (intersectedObject.position.z );
              moveCamera(x, 1, z);


            break;
            default:
              rayNoHit = true;
              // Handle cases where the name contains both "tab" and "bear" or neither.
              console.log("Intersected object's name doesn't match the desired conditions.");
              // You can handle other cases or log an error message here
              break;
          }
          
        
        }

      


        if(rayNoHit)
        {
          // Define a point on the XZ plane (Y=0) where the ray starts
          // Define the direction of the ray based on the mouse click
          // Calculate the parameter 't' for the ray-plane intersection
          // Calculate the intersection point
          const rayOrigin = camera.position.clone();
          const rayDirection = raycaster.ray.direction;
          const t = -rayOrigin.y / rayDirection.y;
          if (t >= 0) {
            const intersection = rayOrigin.clone().add(rayDirection.clone().multiplyScalar(t));
            
            const geometry = new THREE.BoxGeometry( 0.1, 0.1, 0.1 ); 
            const material = new THREE.MeshBasicMaterial( {color: 0x000000} ); 
            const cube = new THREE.Mesh( geometry, material ); 
            
            scene.add( cube );
            cube.position.copy( intersection );
            cube.visible = false;

            const d = measureDistance(cube, camera);
            if(d < 10)
            {
              moveCamera(intersection.x, intersection.y, intersection.z);
            }
          }
        }





        }

    
      
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
          overwrite: "auto",
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





    function findObjectsToActDeact(desiredRoom) {

      if (loadedScenes.has(desiredRoom)) {
        const loadedSceneObjects = loadedScenes.get(desiredRoom);

        loadedSceneObjects.forEach((object) => {
          tabsReset(object);
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
      
      if (object.name.includes("tab")) {
        //object.position.z = 2;
        setTimeout(() => {
          objToPos(object.position.x, object.position.y, object.position.z - 4, object);
        }, 100 * tabAnim_i);
        tabAnim_i++;
      }
     
      if (object instanceof THREE.Mesh) {
        if (
          object.name.includes("exhibit") ||
          object.name.includes("tab") ||
          object.name.includes("step") ||
          object.name.includes("light") ||
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
    function tabsReset(object) {
      
      if (object.name.includes("tab")) {
        object.position.set(object.position.x, object.position.y, 0);
      }

      if (object instanceof THREE.Group) {

        for (let i = 0; i < object.children.length; i++) {
          tabsReset(object.children[i]);
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

      // Create a temporary set to keep track of objects currently intersected
      const currentlyIntersectedObjects = new Set();

      // Filter the intersections to include only objects with names containing "tab"
      const tabIntersects = intersects.filter((intersect) => {
        return intersect.object.name.includes("tab");
      });

      console.log(moveIsAnimating);
      if(!moveIsAnimating)
      {
        // Log the names of the filtered objects
        tabIntersects.forEach((intersect) => {
          currentlyIntersectedObjects.add(intersect.object);

          if (!scaledObjects.has(intersect.object)) {
            // Object was not previously scaled, scale it up
            gsap.to(intersect.object.position, {
              duration: 2,
              x: intersect.object.position.x,
              y: 0.25,
              z: intersect.object.position.z,
              overwrite: "auto",
            });

            gsap.to(intersect.object.scale, {
              duration: 2,
              x: 1.03,
              y: 1.03,
              z: 1.03,
              overwrite: "auto",
            });

            // Add the object to the set of scaled objects
            scaledObjects.add(intersect.object);
          }
        });

        // Check if any previously scaled objects are no longer intersected
        scaledObjects.forEach((object) => {
          if (!currentlyIntersectedObjects.has(object)) {
            gsap.to(object.position, {
              duration: 2,
              x: object.position.x,
              y: -0.25,
              z: object.position.z,
              overwrite: "auto",
            });

            // Object is no longer intersected, scale it back down
            gsap.to(object.scale, {
              duration: 2,
              x: 1,
              y: 1,
              z: 1,
              overwrite: "auto",
            });

            // Remove the object from the set of scaled objects
            scaledObjects.delete(object);
          }
        });
      }
    }

    // Add a mousemove event listener to your canvas or window
    window.addEventListener('mousemove', (event) => {
      onMouseMove(event, camera, scene);
    });




    ////////////// ~ Object select animation part //////////////////////

    
    // Event listener for mouse down
    document.addEventListener('mousedown', (event) => {
      
        onClick(event);
      
      
    });




    window.addEventListener("resize", () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);


    });
      
      
    window.addEventListener('contextmenu', function (e) { 
        // do something here... 
        e.preventDefault(); 
    }, false);

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
      const mapLim = 8;
     

      const spotLight = new THREE.SpotLight(0xEFEFEF);
      scene.add(spotLight);
      spotLight.position.set(0,0,0);
      spotLight.intensity = 2;
      spotLight.angle = Math.PI/20;
      spotLight.penumbra = 0.3;
      spotLight.castShadow = true;

      spotLight.shadow.mapSize.width = 512;
      spotLight.shadow.mapSize.height = 512;
      spotLight.shadow.camera.near = 0.5;
      spotLight.shadow.camera.far = 10;
      spotLight.shadow.focus = 1;


      const rlwidth = 1.0;
      const rlheight = 1.0;

      let rectLight = new THREE.RectAreaLight(0xfaf0b5, 15.0, rlwidth, rlheight);
      rectLight.position.set(0,1,0);
      rectLight.lookAt(0,0,0);
    
      scene.add(rectLight);
    
			function render() {

		
        keyControls.update();
           
        var delta = clock.getDelta();
        //requestAnimationFrame( animate );
        
        const mixers = roomMixersMap.get(activeRoom);
        if (mixers) {
          mixers.forEach((mixer) => {
            mixer.update(delta); 
          });
        }


        if(camera.position.x > mapLim ){
          camera.position.x = mapLim;
        } 
        if(camera.position.x < -mapLim ){
          camera.position.x = -mapLim;
        } 
        if(camera.position.z > mapLim){
          camera.position.z = mapLim;
        } 
        if(camera.position.z < -mapLim + 4){
          camera.position.z = -mapLim + 4;
        } 
        camera.position.y = cameraHeight;


     

        if(Array.isArray(interactableObjects))
        {
          interactableObjects.forEach(exhibit => {
            
            let shadowedExhibit = null;
            if( exhibit.name.includes("exhibit"))
            {
              let dist  = measureDistance(camera, exhibit);
              
              if (dist < 5)
              {
                exhibit.traverse(function(node)
                {
                  if(node.isMesh)
                    shadowedExhibit = exhibit;
                });
                if (shadowedExhibit) 
                {
                  spotLight.position.copy(shadowedExhibit.position);

                  //Set the target of the spotlight to the shadowedExhibit's position
                  spotLight.target = shadowedExhibit;
                  
                  spotLight.position.set(0,3.5,0);

                  //console.log(spotLight.position);


                  //rectLight.position.copy(shadowedExhibit.position);
                  rectLight.position.set(shadowedExhibit.position.x,shadowedExhibit.position.y + 0.4,shadowedExhibit.position.z);
                  spotLight.lookAt(shadowedExhibit);
                }
                
              }
              
            }
          });


          camera.updateProjectionMatrix();
          renderer.render(scene, camera);
  
        }
        //updatGrabablePosition();
        stats.begin();
				//renderer.render( scene, camera );
				stats.end();

			}
      //requestAnimationFrame( animate );

      renderer.setAnimationLoop( render);

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
      




  }

}

