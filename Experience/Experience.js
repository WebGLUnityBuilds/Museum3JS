import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import gsap from 'gsap';
import Stats from 'three/addons/libs/stats.module.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { CSS3DRenderer, CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js';
import { BoxHelper } from 'three';

import { RGBELoader } from  'three/examples/jsm/loaders/RGBELoader.js';


import LoadFiles from './LoadFiles.js'
import lineChartData from '../assets/listOfText.js';
import { TweenLite } from 'gsap/gsap-core.js';
//import ClickEvents from './ClickEvents.js'


export default class Experience{
    constructor(canvas){
        this.canvas = canvas;
        this.LoadFiles = new LoadFiles();
        
        //this.ClickEvents = new ClickEvents(canvas);


        this.init();


    }
   
    
    
    init(){
        let decDefineTrue = false;
       



        const renderer = new THREE.WebGLRenderer({antialias: true});

        renderer.setPixelRatio( window.devicePixelRatio ); // *0.8;
        renderer.setSize(window.innerWidth, window.innerHeight);

        document.body.appendChild(renderer.domElement);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFShadowMap; 

        const smallRenderer = new THREE.WebGLRenderer({antialias: true});
        smallRenderer.setSize(window.innerWidth / 2, window.innerHeight / 2);
        
        smallRenderer.domElement.classList.add("small-renderer");
        smallRenderer.domElement.style.display = "none";
        smallRenderer.toneMapping = THREE.ACESFilmicToneMapping;


        // Apply styles to the renderer's container element
        smallRenderer.domElement.style.border = "2px solid black";
        smallRenderer.domElement.style.borderRadius = "1%";

        // Append the small renderer's div to the desired parent element
        const parentElement = document.getElementById("cursor-div");
        parentElement.appendChild(smallRenderer.domElement);
        //document.body.appendChild(smallRenderer.domElement);
        

        const camera = new THREE.PerspectiveCamera(
          50,
          window.innerWidth / window.innerHeight,
          0.1,
          100
        );
        let cameraHeight  = 1.65;
        

        // set up the smaller scene
        const smallCamera = new THREE.PerspectiveCamera(
            45,
            window.innerWidth/2 / (window.innerHeight/2),
            0.1,
            50
        );
        camera.position.set(0, 0, 0);
        smallCamera.position.set(0, 0, 5);
          
        const scene = new THREE.Scene();
        const smallScene = new THREE.Scene();

        // Light Settings
        //scene.background = new THREE.Color( 0x66ccbe );


          const hdrTexture = new URL('../heavyAssets/industrial_sunset_puresky_4k.hdr', import.meta.url);
          renderer.outputColorSpace = THREE.SRGBColorSpace;
          renderer.toneMapping = THREE.ACESFilmicToneMapping;
          renderer.toneMappingExposure = 1.8;
            

          const loader = new RGBELoader();
          loader.load(hdrTexture, function(texture){
            texture.mapping = THREE.EquirectangularReflectionMapping;
            scene.background = texture;
            scene.environment = texture;
          });



        const light = new THREE.DirectionalLight(0xC5BA9D, 2);
        light.position.set(-20, 60, 10);
        light.castShadow = true;
        light.shadow.mapSize.width = 512;
        light.shadow.mapSize.height = 512;
        light.shadow.camera.near = 0.5;
        light.shadow.camera.far = 1000;
        scene.add(light);



        const helper = new THREE.CameraHelper( light.shadow.camera );
        //scene.add( helper );
        
        smallScene.background = new THREE.Color( 0xb9b8ff);
        const smallHemisphereLight = new THREE.HemisphereLight(0x5C59CE, 0xffffff, 0.8);
        smallScene.add(smallHemisphereLight);
                
        


        // Create cube for small Renderer. To Delete. v~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        const viewModel_geometry = new THREE.BoxGeometry();
        const viewModel_material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
        const viewModel = new THREE.Mesh(viewModel_geometry, viewModel_material);
        viewModel.position.set(0, 0.4, 0);
        viewModel.name = "active_exhibit";

        let activeObjSmallRenderer = [];
        activeObjSmallRenderer.push(viewModel);

        smallScene.add(viewModel);
                
        const modelPointLight = new THREE.PointLight(0xffff00, 1, 100);
        modelPointLight.position.set(-1, 1, 0);
        smallScene.add(modelPointLight);

        //smallRendererCloseB();


        let sceneObjects = this.LoadFiles.gltfloaderFunc(scene);
        
        
        //////////////////////////////// Load/Instantiate Files //////////////////////////////////////


        let stats = new Stats();
        document.body.appendChild( stats.dom );

        camera.position.set(0,0,-10);


        // // Access the first room from the sceneObjects array
        // const firstRoom = sceneObjects[0];
        // const firstRoomModel = firstRoom.model;
        // const firstRoomAnimations = firstRoom.animations;

        // // Play the animations if available
        // if (firstRoomAnimations.length > 0) {
        //   const mixer = new THREE.AnimationMixer(firstRoomModel);
        //   firstRoomAnimations.forEach((animation) => {
        //     const action = mixer.clipAction(animation);
        //     action.play();
        //   });
        // }
        
        // Create an AudioListener
        const listener = new THREE.AudioListener();
        camera.add(listener); // Attach the listener to the camera or any object in the scene




        
        // Create an AudioLoader
        const audioLoader = new THREE.AudioLoader();

        // Declare the audio variable outside the callback function
        let audio;

        // Load the audio file
        audioLoader.load('./RawTextures/AudioFiles/182147GKaudio1.mp3', function(buffer) {
          // Create an Audio object and set the buffer
          audio = new THREE.Audio(listener);
          audio.setBuffer(buffer);
        });



        
        const video = document.createElement('video');
        video.src = '/RawTextures/VideoTextures/Mov1_1821.mp4';
        video.crossOrigin = 'anonymous';
        video.loop = true;
        video.muted = true; // Mute the video to comply with autoplay policies
        video.playsInline = true; // Ensure video playback on mobile devices

        // Create a texture from the video element
        const videoTexture = new THREE.VideoTexture(video);
        videoTexture.minFilter = THREE.LinearFilter;
        videoTexture.magFilter = THREE.LinearFilter;

        // Create a material and assign the video texture
        const material = new THREE.MeshBasicMaterial({ map: videoTexture });

        // Create a geometry and mesh
        const geometry = new THREE.PlaneGeometry(2, 1.125); // Adjust the size of the plane as needed
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(-4.3,1.4,-8);
        // Add the mesh to the scene
        scene.add(mesh);

        const svideo = document.getElementById('myVideo');
        function startVideoPlayback() {
          if (video) {
            video.play(); // Play the audio if it's loaded
          }
          if (audio) {
            audio.play(); // Play the audio if it's loaded
          }
        }
        document.addEventListener('click', startVideoPlayback);

        



        moveCamera(-0.020159, 0,4.3341);
        
        ///////////////////////////////////////////////////////////////// START EVENTS PC/LAPTOP /////////////////////////////////////////////////////////////////
      

        const pointer = new THREE.Vector2();
      
      function onClick( event ) {

        pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

        
        document.onpointerdown = function(event) {

          switch ( event.button ) {
              case 0:
                mainRendererRaycaster(pointer, event);
                if(smallRenderer.domElement.style.opacity >= 0.9)
                {
                  closeRenderer();
                }
                break;
              case 1: 
                console.log("Number of Triangles :", renderer.info.render.triangles);
                console.log("Active Drawcalls:", renderer.info.render.calls);
                console.log("Textures in Memory", renderer.info.memory.textures);
                console.log("Geometries in Memory", renderer.info.memory.geometries);
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
      // document.onpointerup = function(event) {
      //     switch ( event.button ) {
              
      //         case 0: 
      //           break;
      //         case 1: 
      //           //Beware this work not on mac with magic mouse!
      //           break;
      //         case 2: 
      //           break;
      //     }
      // }
      }
  
      ////////////////////////////////////////////////////////////////////////////////
      //Movement Events
      
      let targetZoomLevel = 0.5; // set the initial zoom level
      let zoomLevel = camera.zoom; // current zoom level
      
      // Check the platform and apply the appropriate event listener
      if (/Macintosh|iPad|iPhone|iPod/.test(navigator.userAgent)) {
        // Apple device scroll event listener
        document.addEventListener("wheel", handleAppleDeviceScroll);
      }else {
        // Regular mouse scroll event listener
        document.addEventListener("wheel",handleRegularMouseScroll);
      }
      
      function handleAppleDeviceScroll(event) {
        // Adjust the deltaY value based on the device
        const deltaY = event.deltaY / 100;
      
        // Adjust the target zoom level based on the scroll direction
        targetZoomLevel += deltaY * -0.1;
        // Make sure the target zoom level stays within a reasonable range
        targetZoomLevel = Math.max(1, Math.min(2, targetZoomLevel));
      
        // Create a GSAP animation to smoothly transition the zoom level
        gsap.to({ zoom: zoomLevel }, {
          duration: 0.5,
          zoom: targetZoomLevel,
          onUpdate: function () {
            // Update the zoom level
            zoomLevel = this.targets()[0].zoom;
            // Set the camera zoom
            camera.zoom = zoomLevel;
            camera.updateProjectionMatrix();
          }
        });
      }
      function handleRegularMouseScroll(event) 
      {
          // adjust the target zoom level based on the scroll direction
          targetZoomLevel += event.deltaY * -0.001;
          // make sure the target zoom level stays within a reasonable range
          targetZoomLevel = Math.max(1, Math.min(2, targetZoomLevel));
      
          // create a GSAP animation to smoothly transition the zoom level
          gsap.to({ zoom: zoomLevel }, {
          duration: 0.5,
          zoom: targetZoomLevel,
          onUpdate: function () {
              // update the zoom level
              zoomLevel = this.targets()[0].zoom;
              // set the camera zoom
              camera.zoom = zoomLevel;
              camera.updateProjectionMatrix();
          }
          });
      };

      ///////// Control Events //////////
        
      // Variables for rotation control
      let isMouseDown = false;
      let previousMousePosition = {
        x: 0,
        y: 0
      };

      // Euler rotation
      const rotationSpeed = 0.0025 * window.devicePixelRatio; // Adjust the sensitivity factor as needed
      const rotationEuler = new THREE.Euler(0, 0, 0, 'YXZ');

      // Define the minimum and maximum vertical rotation angles in radians
      const minVerticalAngle = -Math.PI / 7; // 30 degrees looking down
      const maxVerticalAngle = Math.PI / 7.; // 30 degrees looking up

      // Event listeners
      document.addEventListener('mousedown', () => {
        isMouseDown = true;
      });

      document.addEventListener('mouseup', () => {
        isMouseDown = false;
      });

      document.addEventListener('mousemove', event => {
        if (isMouseDown) {
          const deltaMove = {
            x: previousMousePosition.x - event.clientX,
            y: previousMousePosition.y - event.clientY
          };

          //To Reverse controls
          rotationEuler.y += -deltaMove.x * rotationSpeed;
          rotationEuler.x += -deltaMove.y * rotationSpeed;

          // Clamp the vertical rotation angle within the defined range
          rotationEuler.x = Math.max(minVerticalAngle, Math.min(maxVerticalAngle, rotationEuler.x));

          camera.rotation.set(rotationEuler.x, rotationEuler.y, rotationEuler.z, 'YXZ');
        }

        previousMousePosition = {
          x: event.clientX,
          y: event.clientY
        };
      });
      
      // ///////// ~Control Events //////////

      
      function viewRenderer()
      {
        if (smallRenderer.domElement.style.display === "block") {
          viewRendererGSAPout();
          gsapDirLightIntensityInit(renderer);
          smallRenderer.domElement.style.display = "none";
          
        } else {
          viewRendererGSAPin();
          gsapDirLightIntensityTarget(renderer);
          smallRenderer.domElement.style.display = "block";
        }
      }

      function closeRenderer()
      {
        if (smallRenderer.domElement.style.display === "block") {
          viewRendererGSAPout();
          gsapDirLightIntensityInit(renderer);
          smallRenderer.domElement.style.display = "none";
        }
      }
      
    // // ///////////////////////////////////////////////////////////////////////

      
      
      

    window.addEventListener("resize", () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);


        smallCamera.aspect = (window.innerWidth/2) / (window.innerHeight/2);
        smallCamera.updateProjectionMatrix();
        smallRenderer.setSize(window.innerWidth/2, window.innerHeight/2);
        updateSmallRendererPosition();
    });
      
      
    window.addEventListener('contextmenu', function (e) { 
        // do something here... 
        e.preventDefault(); 
    }, false);



    // Get the navigation menu items of the specific menu
    const menuItems = document.querySelectorAll('.primary-navigation li > a');

    // Add click event listener to each menu item
    menuItems.forEach((menuItem) => {
      menuItem.addEventListener('click', handleMenuItemClick);
    });

    // Function to handle menu item click event
    function handleMenuItemClick(event) {
      event.preventDefault(); // Prevent the default link behavior

      // Get the href attribute of the clicked menu item
      const menuItemHref = event.target.getAttribute('href');

      // Check the href attribute and call the appropriate function in your Three.js file
      if (menuItemHref === '#scene1') 
      {
        loadScene0();
        console.log("Scene 1");
      } 
      else if (menuItemHref === '#scene2') 
      {
        loadScene1();
        console.log("Scene 2");
      } 
      else if (menuItemHref === '#scene3') 
      {
        console.log("Scene 3");
      }
    }


    //////////////////// Event Calls ///////////////////////
    //window.addEventListener( 'click', onClick );

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
        let tween = gsap.to(camera.position, {
            x,
            y,
            z,
            duration: 4
        });
        //tween.delay(0.2);
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
            y,
            z,
            duration: 3.2
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

    function viewRendererGSAPin() {
      if(smallRenderer.domElement.style.display === "none")
      {
        smallRenderer.domElement.style.opacity = 0;
        gsap.fromTo(
          smallRenderer.domElement,
          { opacity: 0 },
          { opacity: 1, duration: 1 } // Adjust the duration as desired
        );
      }
    }

    
    function viewRendererGSAPout() {
      if(smallRenderer.domElement.style.display === "block")
      {
        smallRenderer.domElement.style.opacity = 1;
        gsap.fromTo(
          smallRenderer.domElement,
          { opacity: 1 },
          { opacity: 0, duration: 1 } // Adjust the duration as desired
        );
      }
      
    }
      ///////////////////////////////////////////////////////////// ~END GSAP FUNCTIONS /////////////////////////////////////////////////////////////
      
      
        

       ///////////////////////////////////////////////////// Main Renderer functions ////////////////////////////////////////////////////////////////////
       
       
       let mainRendererActiveOBJINIT = true;
       let mainRendererActiveOBJ = [];
      function mainRendererRaycaster(pointer, event)
      {
        let raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(pointer, camera);
       

        if(mainRendererActiveOBJINIT)
        {
          mainRendererActiveOBJ = mainRendererActiveOBJ.concat(scene.children); // Concatenate the children of the scene
          mainRendererActiveOBJINIT = false;
        }

        const intersects = raycaster.intersectObjects(mainRendererActiveOBJ);
        
     
        
        for (let i=0; i < intersects.length; i++)
        {
          // let minDistance = Infinity; // Initialize with a large value
          // let closestExhibit = null;
          
          // mainRendererActiveOBJ.forEach((object) => {
          //   if(object.visible){
          //   object.children.forEach((child) => {
          //     if (child.name.includes("exhibit")) {
          //       let distance = measureDistance(camera, child);
          //       distance = distance;// / 100;
          //       if (distance < minDistance) {
          //         minDistance = distance;
          //         closestExhibit = child;
          //       }
          //     }
          //   });
          //   }
          // });

          // if (closestExhibit) {
          //   // console.log("Closest Exhibit: ", closestExhibit.name);
          //   console.log("Min Distance:", minDistance);
          //   if (minDistance < 12) {

          //     if(mainRendererActiveOBJ.length > 0)
          //     {
          //       activeObjSmallRenderer.length = 0; // Empty the array
          //     }
          //     removeExhibitObjectsFromScene(smallScene);
          //     addExhibitToScene(closestExhibit, smallScene);

          //   }
          // }
           

          if (intersects[i].object.name.includes("exhibit")) {
            
            if(mainRendererActiveOBJ.length > 0)
            {
              activeObjSmallRenderer.length = 0; // Empty the array
            }
            let sa_Exhibit = intersects[i].object;
            removeExhibitObjectsFromScene(smallScene);
            addExhibitToScene(sa_Exhibit, smallScene);
            viewRenderer();
            break;
          }

          if (intersects[i].object.name.includes("step")) {
            // let rayIndex = intersects[i].object.name.replace(/[^\d.-]/g, '');
            
            let x = 0;
            let z = 0;
            //To fix
            // if (sceneObjects[2].visible)
            // {
              
            //   x = (intersects[i].object.position.x /100);
            //   z = (intersects[i].object.position.z /100);
            // }
            // else 
            // {
            //   x = (intersects[i].object.position.x );
            //   z = (intersects[i].object.position.z );
            // }
            
            
            x = (intersects[i].object.position.x );
            z = (intersects[i].object.position.z );
            moveCamera(x, 1, z);
            break;
            
          }
          if(intersects[i].object.name.includes("tab01"))
          {
            loadScene1();

            break;
          }
        }
      
      }

      function loadScene1()
      {
        cameraHeight = 1.65;

        sceneObjects[0].visible = false;
        sceneObjects[1].visible = true;
        //sceneObjects[2].visible = false;

        if(mainRendererActiveOBJ.length > 0)
        {
          mainRendererActiveOBJ.length = 0; // Empty the array
        }
        mainRendererActiveOBJ.push(sceneObjects[1]);

        const objectAtIndex1 = sceneObjects[1];
        const step1 = objectAtIndex1.getObjectByName("step1");
        if (step1) {
          let x = (step1.position.x );
          let z = (step1.position.z );
          moveCamera(x, 1,z);
          
        } else {
          // Object "step1" not found
          console.log("Object not found");
        }
      }  
      function loadScene0()
      {
        cameraHeight = 1.65;

        sceneObjects[0].visible = true;
        sceneObjects[1].visible = false;
        //sceneObjects[2].visible = false;

        if(mainRendererActiveOBJ.length > 0)
        {
          mainRendererActiveOBJ.length = 0; // Empty the array
        }
        mainRendererActiveOBJ.push(sceneObjects[0]);

        const objectAtIndex1 = sceneObjects[0];
        const step1 = objectAtIndex1.getObjectByName("step1");
        if (step1) {
          let x = (step1.position.x );
          let z = (step1.position.z );
          moveCamera(x, 1,z);
          
        } else {
          // Object "step1" not found
          console.log("Object not found");
        }
      }  




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



    function removeExhibitObjectsFromScene(sceenToDeleteFrom) {
      const objectsToRemove = [];
    
      sceenToDeleteFrom.traverse((child) => {
        if (child instanceof THREE.Object3D && child.name.includes("exhibit")) {
          objectsToRemove.push(child);
        }
      });
    
      objectsToRemove.forEach((object) => {
        sceenToDeleteFrom.remove(object);
      });
    }


    function addExhibitToScene(exhibit, smallRenderer) {
      if (activeObjSmallRenderer.includes(exhibit)) {
        return;
      }
  
      // Create a new instance of the object's geometry and material for the second scene
      const clonedGeometry = exhibit.geometry.clone();
      const clonedMaterial = exhibit.material.clone();
      const clonedObject = new THREE.Mesh(clonedGeometry, clonedMaterial);
      clonedObject.position.set(0, 0.4, 0);
      clonedObject.name = "active_exhibit";
      
      activeObjSmallRenderer.push(clonedObject);

      smallRenderer.add(clonedObject);

      //Camera rescaling based on dimensions of object
      const boundingBox = new THREE.Box3().setFromObject(clonedObject);
      const dimensions = boundingBox.getSize(new THREE.Vector3());
      const diagonalDistance = dimensions.length();
      
      const desiredFov = 2 * Math.atan(diagonalDistance / (2 * smallCamera.position.z)) * (180 / Math.PI);
      smallCamera.fov = desiredFov;
      smallCamera.aspect = window.innerWidth/2 / (window.innerHeight/2);
      smallCamera.updateProjectionMatrix();
      
      
    }
    
    


    //////////////////////////////////////////////////// ~Main Renderer functions ////////////////////////////////////////////////////////////////////
    


      ///////////////////////////////////////////////////// Small Renderer functions ////////////////////////////////////////////////////////////////////
      let sRModelRotAcceleration = 0;
      const MAX_ROTATION = 3;
      const ROTATION_PERIOD = 8;
      

      function updateSmallRendererPosition() {
          if(decDefineTrue)
          {
              const mainRendererWidth = renderer.getSize().width;
              const mainRendererHeight = renderer.getSize().height;
              const smallRendererWidth = smallRenderer.getSize().width;
              const smallRendererHeight = smallRenderer.getSize().height;
              const smallRendererLeft = (mainRendererWidth - smallRendererWidth) / 2;
              const smallRendererTop = (mainRendererHeight - smallRendererHeight) / 2;
              smallRenderer.domElement.style.left = smallRendererLeft + "px";
              smallRenderer.domElement.style.top = smallRendererTop + "px";
          }
          else
          {
              console.log("Model viewer renderer not defined");
          }
      }

      updateSmallRendererPosition();
      
      //////////////////////////////////////////////////// ~Small Renderer functions ////////////////////////////////////////////////////////////////////




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
          var delta = clock.getDelta();

         

          smallCamera.position.y = 0.4;
          camera.position.y = cameraHeight;

          //camera.fov = effectController.fov;
          camera.updateProjectionMatrix();


          //renderer.setViewport(0,0,window.innerWidth, window.innerHeight);
          renderer.render(scene, camera);

          if(smallRenderer.domElement.style.display === "block" && activeObjSmallRenderer[0])
          {   
            sRModelRotAcceleration += delta;
            const rotationAngle = Math.sin((sRModelRotAcceleration / ROTATION_PERIOD) * Math.PI * 2) * MAX_ROTATION;

            activeObjSmallRenderer[0].rotation.set(rotationAngle / 10, rotationAngle / 10, 0);

            // Reset rotation acceleration if necessary
            if (sRModelRotAcceleration >= ROTATION_PERIOD) {
                sRModelRotAcceleration -= ROTATION_PERIOD;
            }
            // if (mixer) {
            //   mixer.update(delta); // deltaTime is the time since the last frame
            // }    
            smallRenderer.render(smallScene, smallCamera);
          }
          //console.log(camera.position);
          decDefineTrue = true;
          
          stats.update();

      }
      
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

      ///////////////////////////////////////////////////////////// ~Math FUNCTIONS /////////////////////////////////////////////////////////////
      
      renderer.setAnimationLoop(animate);
  
  }


}



