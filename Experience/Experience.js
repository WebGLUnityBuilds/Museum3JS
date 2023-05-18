import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import gsap from 'gsap';
import Stats from 'three/addons/libs/stats.module.js';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls';
import { CSS3DRenderer, CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js';
import { BoxHelper } from 'three';

import LoadFiles from './LoadFiles.js'
import lineChartData from '../assets/listOfText.js';
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

        renderer.setPixelRatio( window.devicePixelRatio );// * 0.8);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.3;

        document.body.appendChild(renderer.domElement);
        

        const smallRenderer = new THREE.WebGLRenderer({antialias: true});
        smallRenderer.setSize(window.innerWidth / 4, window.innerHeight / 2);
        
        smallRenderer.domElement.classList.add("small-renderer");
        // smallRenderer.domElement.style.position = "absolute";
        // smallRenderer.domElement.style.top = "25%";
        // smallRenderer.domElement.style.left = "25%";
        smallRenderer.domElement.style.display = "none";
        smallRenderer.toneMapping = THREE.ACESFilmicToneMapping;

        document.body.appendChild(smallRenderer.domElement);
        



        let cameraHeight  = 1.4;
        const camera = new THREE.PerspectiveCamera(
            45,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        // set up the smaller scene
        const smallCamera = new THREE.PerspectiveCamera(
            45,
            window.innerWidth/4 / (window.innerHeight/2),
            0.1,
            1000
        );
        camera.position.set(0, 0, 0);
        smallCamera.position.set(0, 0, 5);

        const scene = new THREE.Scene();
        const smallScene = new THREE.Scene();


        //scene.background = new THREE.Color( 0x8a0700 );
        scene.background = new THREE.Color( 0x9dbef5 );
        
        const hemisphereLight = new THREE.HemisphereLight(0x5C59CE, 0xffffff, 0.8);
        scene.add(hemisphereLight);
        
        smallScene.background = new THREE.Color( 0x2f457d);
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

   


        //////////////////////////////// Progress Bar //////////////////////////////////////
        
        const progressBar = document.getElementById('progress-bar');
        const content = document.getElementById('scene-area');
        const loadingManager = new THREE.LoadingManager();
        loadingManager.onProgress = function(url, loaded, total) {
            progressBar.value = (loaded / total) * 100;
        }
        const progressBarContainer = document.querySelector('.progress-bar-container');

        loadingManager.onLoad = function() {
            progressBarContainer.style.display = 'none';
            content.style.display = 'block';

        }
        //////////////////////////////// Progress Bar //////////////////////////////////////

        //////////////////////////////// Load/Instantiate Files //////////////////////////////////////
        const gltfLoader = new GLTFLoader(loadingManager);
        let sceneObjects = this.LoadFiles.gltfloaderFunc(gltfLoader, scene);
        
        
        //////////////////////////////// Load/Instantiate Files //////////////////////////////////////



        let stats = new Stats();
        document.body.appendChild( stats.dom );

        camera.position.set(0,0.4,20);


        ///////////////////////////////////////////////////////////////// START EVENTS PC/LAPTOP /////////////////////////////////////////////////////////////////
      

        const pointer = new THREE.Vector2();

        function onClick( event ) {
          if (!controls.enabled) return;

          pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
          pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
          document.onpointerdown = function(event) {

            switch ( event.button ) {
                case 0:
                  mainRendererRaycaster(pointer, event);
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
    
        
        document.onpointerup = function(event) {
            switch ( event.button ) {
                
                case 0: 
                  break;
                case 1: 
                  //Beware this work not on mac with magic mouse!
                  break;
                case 2: 
                  break;
            }
        }

    }
   
      ////////////////////////////////////////////////////////////////////////////////
      //Movement Events
      
      
      let targetZoomLevel = 0.5; // set the initial zoom level
      let zoomLevel = camera.zoom; // current zoom level
      
      document.addEventListener("wheel", (event) => {
          // adjust the target zoom level based on the scroll direction
          targetZoomLevel += event.deltaY * -0.001;
          // make sure the target zoom level stays within a reasonable range
          targetZoomLevel = Math.max(1, Math.min(10, targetZoomLevel));
      
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
      });

      ///////// Control Events //////////
  

      // create controls
      const controls = new PointerLockControls(camera, renderer.domElement);
      controls.minPolarAngle = Math.PI / 4; // Minimum vertical rotation angle (limit looking up)
      controls.maxPolarAngle = (3 * Math.PI) / 4;; // Maximum vertical rotation angle (limit looking down)
      controls.minAzimuthAngle = -Math.PI / 32; // Minimum horizontal rotation angle
      controls.maxAzimuthAngle = Math.PI / 32; // Maximum horizontal rotation angle
      scene.add(controls.getObject());
      unlockControls();


      // Add event listener to detect mouseenter on the scene area
      const sceneArea = document.getElementById("scene-area");

      sceneArea.addEventListener("mouseenter", lockControls);
      sceneArea.addEventListener("mouseleave", unlockControls);
      document.addEventListener("mousemove", onClick, false);
   
      
    

      // Add event listener for pointer lock change
      document.addEventListener(
        "pointerlockchange",
        function () {
          if (document.pointerLockElement === renderer.domElement) {
            unlockControls();
            //enableRaycasting(); // Trigger raycasting when controls are unlocked
          } else {
            lockControls();
          }
        },
        false
      );

      function unlockControls() {
        if (!controls.enabled) {
          controls.enabled = true;
        }
      }

      function lockControls() {
        if (controls.enabled) {
          controls.enabled = false;
        }
      }

      // Add event listener for pointer lock error
      document.addEventListener(
        "pointerlockerror",
        function () {
          console.error("Pointer lock error");
        },
        false
      );

      // Add event listeners for mouse events
      document.addEventListener(
        "mousedown",
        function () {
          if (!controls.enabled ) {
            renderer.domElement.requestPointerLock();
          }
        },
        false
      );

      document.addEventListener(
        "mouseup",
        function () {
          if (document.pointerLockElement === renderer.domElement) {
            document.exitPointerLock();
          }
        },
        false
      );

      // // Trigger raycasting function manually
      // function enableRaycasting() {
      //   //mainRendererRaycaster();
      // }


      ///////// ~Control Events //////////


      
      // add event listener to open button
      const openButton = document.getElementById("open-btn");
      openButton.addEventListener("click", () => {
        
      if (smallRenderer.domElement.style.display === "block") {
        smallRenderer.domElement.style.display = "none";
      } else {
        smallRenderer.domElement.style.display = "block";
      }
      });

      openButton.addEventListener("mouseenter", unlockControls);
      openButton.addEventListener("mouseleave", lockControls);

    // ///////////////////////////////////////////////////////////////////////

      
      
      

    updateSmallRendererPosition();
    window.addEventListener("resize", () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);


        smallCamera.aspect = window.innerWidth/4 / (window.innerHeight/2);
        smallCamera.updateProjectionMatrix();
        smallRenderer.setSize(window.innerWidth/4, window.innerHeight/2);
        updateSmallRendererPosition();
    });
      
      
    window.addEventListener('contextmenu', function (e) { 
        // do something here... 
        e.preventDefault(); 
    }, false);




    //////////////////// Event Calls ///////////////////////
    window.addEventListener( 'click', onClick );

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

    function objToObj(x, y, z) {
        let tween = gsap.to(sceneObjects[1].position, {
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

      ///////////////////////////////////////////////////////////// ~END GSAP FUNCTIONS /////////////////////////////////////////////////////////////
      
      
        

       ///////////////////////////////////////////////////// Main Renderer functions ////////////////////////////////////////////////////////////////////

       const raycaster = new THREE.Raycaster();
       let mainRendererActiveOBJINIT = true;
       let mainRendererActiveOBJ = [];
      function mainRendererRaycaster(pointer, event)
      {
        
        raycaster.setFromCamera(pointer, camera);
       

        if(mainRendererActiveOBJINIT)
        {
          mainRendererActiveOBJ = mainRendererActiveOBJ.concat(scene.children); // Concatenate the children of the scene
          mainRendererActiveOBJINIT = false;
        }

        const intersects = raycaster.intersectObjects(mainRendererActiveOBJ);
        
        
        for (let i=0; i < intersects.length; i++)
        {
          if (intersects[i].object.name.includes("step")) {
          let minDistance = Infinity; // Initialize with a large value
          let closestExhibit = null;
          
          mainRendererActiveOBJ.forEach((object) => {
            if(object.visible){
            object.children.forEach((child) => {
              if (child.name.includes("exhibit")) {
                let distance = measureDistance(camera, child);
                distance = distance;// / 100;
                if (distance < minDistance) {
                  minDistance = distance;
                  closestExhibit = child;
                }
              }
            });
            }
        });

        if (closestExhibit) {
          // console.log("Closest Exhibit: ", closestExhibit.name);
          console.log("Min Distance:", minDistance);
          if (minDistance < 7) {

            if(mainRendererActiveOBJ.length > 0)
            {
              activeObjSmallRenderer.length = 0; // Empty the array
            }
            removeExhibitObjectsFromScene(smallScene);
            addExhibitToScene(closestExhibit, smallScene);

          }
        }





        // let rayIndex = intersects[i].object.name.replace(/[^\d.-]/g, '');
        
        console.log(intersects[i].object.name);

        let x = 0;
        let z = 0;
        //To fix
        if (sceneObjects[2].visible)
        {
          x = (intersects[i].object.position.x / 100);
          z = (intersects[i].object.position.z / 100);

        }
        else 
        {
          x = (intersects[i].object.position.x );
          z = (intersects[i].object.position.z );
        }
        
        moveCamera(x, 1, z);
        
        
        
        // lineChartData needs to be a double array containing all text objects and images.
        // then clean the casted object's name string and keep the 1_1, 4_5 etc. and place in in
        // double array as -> 1_1 -> lineChartData[1][1];
        //document.getElementById("whereToPrint").innerHTML = JSON.stringify(lineChartData[rayIndex], null, 4);
      }
      if(intersects[i].object.name.includes("TAB_01"))
      {
        cameraHeight = 2.5;

        sceneObjects[0].visible = false;
        sceneObjects[1].visible = true;
        sceneObjects[2].visible = false;

        if(mainRendererActiveOBJ.length > 0)
        {
          mainRendererActiveOBJ.length = 0; // Empty the array
        }
        mainRendererActiveOBJ.push(sceneObjects[1]);

        const objectAtIndex1 = sceneObjects[1];
        const step1 = objectAtIndex1.getObjectByName("step1");
        if (step1) {
          // Object "step1" found
          // Perform actions on the found object
          scene.background = new THREE.Color( 0x8a0700 );

          let x = (step1.position.x );
          let z = (step1.position.z );
          moveCamera(x, 1,z);
          
        } else {
          // Object "step1" not found
          console.log("Object not found");
        }

        // sceneObjects.forEach((object) => {
        //   if(object.name.includes("room01"))
        // });
      }
    }

      
  }



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
      smallCamera.aspect = window.innerWidth/4 / (window.innerHeight/2);
      smallCamera.updateProjectionMatrix();
      
    }

    //////////////////////////////////////////////////// ~Main Renderer functions ////////////////////////////////////////////////////////////////////
    


      ///////////////////////////////////////////////////// Small Renderer functions ////////////////////////////////////////////////////////////////////
      let sRModelRotAcceleration = 0;
      const MAX_ROTATION = 3;
      const ROTATION_PERIOD = 8;
      // function smallRendererCloseB()
      // {
      //     // Create the "X" button
      //     const closeButton = document.createElement("div");
      //     closeButton.innerHTML = "X";
      //     closeButton.style.position = "absolute";
      //     closeButton.style.top = "10px";
      //     closeButton.style.right = "10px";
      //     closeButton.style.width = "25px";
      //     closeButton.style.height = "25px";
      //     closeButton.style.lineHeight = "25px";
      //     closeButton.style.fontSize = "20px";
      //     closeButton.style.backgroundColor = "black";
      //     closeButton.style.color = "white";
      //     closeButton.style.zIndex = "100";
      //     closeButton.style.border = "none";
      //     closeButton.style.borderRadius = "50%";
      //     closeButton.style.cursor = "pointer";
      //     smallRenderer.domElement.appendChild(closeButton);

      //     // Add event listener to the "X" button
      //     closeButton.addEventListener("click", () => {
      //         console.log("GIT GUT1");
      //         smallRenderer.domElement.style.display = "none";
      //     });
      // }


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
              //closeButton.style.left = smallRendererLeft + smallRendererWidth - 20 + "px";
              //closeButton.style.top = smallRendererTop + "px";

              
          }
          else
          {
              console.log("Model viewer renderer not defined");
          }
      }

      
      //////////////////////////////////////////////////// ~Small Renderer functions ////////////////////////////////////////////////////////////////////




      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // Create a new div element for the renderer and add it to the page
      
      ////////////////////////////////////// Update Animate ////////////////////////////////////////////////////////
      

      var clock = new THREE.Clock();
      function animate() {
          var delta = clock.getDelta();
          smallCamera.position.y = 0.4;
          camera.position.y = cameraHeight;

  


          //renderer.setViewport(0,0,window.innerWidth, window.innerHeight);
          renderer.render(scene, camera);
          if(smallRenderer.domElement.style.display === "block" && activeObjSmallRenderer[0])
          {   
            console.log(activeObjSmallRenderer[0].name);
            sRModelRotAcceleration += delta;
            const rotationAngle = Math.sin((sRModelRotAcceleration / ROTATION_PERIOD) * Math.PI * 2) * MAX_ROTATION;

            activeObjSmallRenderer[0].rotation.set(rotationAngle / 10, rotationAngle / 10, 0);

            // Reset rotation acceleration if necessary
            if (sRModelRotAcceleration >= ROTATION_PERIOD) {
                sRModelRotAcceleration -= ROTATION_PERIOD;
            }
                            
            smallRenderer.render(smallScene, smallCamera);
          }
          
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



