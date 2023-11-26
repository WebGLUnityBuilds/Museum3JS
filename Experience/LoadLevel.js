import LoadFiles from './LoadFiles.js';
import * as THREE from 'three';

const loadFiles = new LoadFiles();
const LoadLevel = {
  async loadSceneObjects(scene, exhibits, desiredRoom) {

    const progressBarContainer = document.querySelector('.progress-bar-container');
    progressBarContainer.style.display = 'block';
    const assetsData = getRoomAssets(exhibits, desiredRoom);

    const sceneObjects = await loadFiles.gltfloaderFunc(scene, assetsData);


    sceneObjects.forEach((object) => {
      scene.add(object);
      
    });

    // Now you can use the loaded sceneObjects for further processing or rendering
    return { sceneObjects };
  },
};

function getRoomAssets(exhibits, desiredRoom) {
    const rooms = exhibits.rooms; // Access 'rooms' instead of 'room'
    const assetsData = [];
  
    // Iterate over each room
    rooms.forEach((room) => { // Use 'rooms.forEach' instead of 'Object.values(rooms).forEach'
      // Check if the room matches the desired room (or skip the check if desiredRoom is not provided)
      if (!desiredRoom || room.room === desiredRoom) {
        // Iterate over each asset in the room
        room.assets.forEach((asset) => { // Access 'assets' instead of 'asset'
          const { classification, type, path } = asset; // Remove 'room' since it's already defined in the outer loop
  
          // Create an object with the desired data
          const assetData = {
            room: room.room, // Use 'room.room' instead of 'room'
            classification,
            type,
            path
          };
  
          // Add the asset data to the array
          assetsData.push(assetData);
        });
      }
    });
  
    return assetsData;
  }


  
export default LoadLevel;