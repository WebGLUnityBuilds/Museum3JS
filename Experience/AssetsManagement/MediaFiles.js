let AVfiles;


export default AVfiles = {
    rooms: [
        {
            room: "0",
            assets: [
            {
                classification: "level",
                type: "mp4",
                path: "./RawTextures/VideoTextures/Mov1_1821.mp4"
            },
            ]
        },
        {
            room: "1",
            assets: [
            {
                classification: "level",
                type: "mp4",
                path: "./RawTextures/VideoTextures/Mov1_1821.mp4"
            },
            ]
        },
        {
            room: "2",
            assets: [
            {
                classification: "level",
                type: "mp4",
                path: "./RawTextures/VideoTextures/Mov1_1821.mp4"
            },
            {
                classification: "exhibit",
                type: "mp4",
                path: "./RawTextures/VideoTextures/Mov1_1821.mp4"
            },
            {
                classification: "exhibit",
                type: "mp4",
                path: "./RawTextures/VideoTextures/Mov1_1821.mp4"
            }
            ]
        }
        ]
          //path: "https://your-site.com/wp-json/wp/v2/media?slug=your-media-file"
    };
    
    


//--------------------------------------------- audio mp3 files ---------------------------------------------



// Create an AudioListener
// const listener = new THREE.AudioListener();
// camera.add(listener); // Attach the listener to the camera or any object in the scene


// // Create an AudioLoader
// const audioLoader = new THREE.AudioLoader();

// // Declare the audio variable outside the callback function
// let audio;

// // Load the audio file
// audioLoader.load("./RawTextures/AudioFiles/182147GKaudio1.mp3", function(buffer) {
//   // Create an Audio object and set the buffer
//   audio = new THREE.Audio(listener);
//   audio.setBuffer(buffer);
// });

// if (audio) {
//   audio.play(); // Play the audio if it"s loaded
// }
// document.addEventListener("click", startVideoPlayback);

//--------------------------------------------- video mp4 files ---------------------------------------------


// const video = document.createElement("video");
// video.src = "/RawTextures/VideoTextures/Mov1_1821.mp4";
// video.crossOrigin = "anonymous";
// video.loop = true;
// video.muted = true; // Mute the video to comply with autoplay policies
// video.playsInline = true; // Ensure video playback on mobile devices

// // Create a texture from the video element
// const videoTexture = new THREE.VideoTexture(video);
// videoTexture.minFilter = THREE.LinearFilter;
// videoTexture.magFilter = THREE.LinearFilter;

// // Create a material and assign the video texture
// const material = new THREE.MeshBasicMaterial({ map: videoTexture });

// // Create a geometry and mesh
// const geometry = new THREE.PlaneGeometry(2, 1.125); // Adjust the size of the plane as needed
// const mesh = new THREE.Mesh(geometry, material);
// mesh.position.set(-4.3,1.4,-8);
// // Add the mesh to the scene
// scene.add(mesh);

// const svideo = document.getElementById("myVideo");
// function startVideoPlayback() {
//     if (video) {
//     video.play(); // Play the audio if it"s loaded
//     }
// }
// document.addEventListener("click", startVideoPlayback);

//------------------------------------------------------------------------------------------------------------
