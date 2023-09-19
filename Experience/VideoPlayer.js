import * as THREE from 'three';
import AVfiles from './AssetsManagement/MediaFiles.js';

export default function setupVideo(roomNumber, searchString, camera, scene) {
  const room = AVfiles.rooms.find(room => room.room === roomNumber);

  if (room) {
    const filteredAssets = room.assets.filter(asset => asset.classification === "level" && asset.path.includes(searchString));

    if (filteredAssets.length === 1) {
      const videoPath = filteredAssets[0].path;
      console.log("video found: " + videoPath);

      const video = document.createElement('video');
      video.id = "CurrentVideo";
      video.src = videoPath;
      video.crossOrigin = 'anonymous';
      video.loop = true;
      video.muted = true;
      video.playsInline = true;

      const videoTexture = new THREE.VideoTexture(video);
      videoTexture.minFilter = THREE.LinearFilter;
      videoTexture.magFilter = THREE.LinearFilter;

      const material = new THREE.MeshBasicMaterial({ map: videoTexture });

      const geometry = new THREE.PlaneGeometry(2, 1.125);
      const videoMesh = new THREE.Mesh(geometry, material);
      videoMesh.name = "videoMesh";
      function startVideoPlayback() {
        if (video) {
            camera.add(videoMesh); // Add the mesh as a child of the camera

            // Position the mesh relative to the camera
            const distance = -1.8; // Adjust the distance as needed
            videoMesh.position.set(0, 0, distance);
        
            scene.add(camera); // Add the camera to the scene
            video.play();
          //document.removeEventListener('click', startVideoPlayback);
        }
      }
      startVideoPlayback();
      //document.addEventListener('click', startVideoPlayback);

     
    } else if (filteredAssets.length > 1) {
      console.log("Duplicate conflict: Multiple videos found in room " + roomNumber + " with filename containing '" + searchString + "'");
    } else {
      console.log("No matching videos found in room " + roomNumber + " with filename containing '" + searchString + "'");
    }
  } else {
    console.log("Room not found");
  }
}
