let AVfiles;

//--------------------------------------------- audio mp3 files ---------------------------------------------


// fetch("https://your-site.com/wp-json/wp/v2/media/123")
//   .then(response => response.json())
//   .then(data => {
//     // Get the file URL from the response
//     const fileUrl = data.media_details.sizes.full.source_url;
    
//     // Load the audio file using the audio loader
//     audioLoader.load(fileUrl, buffer => {
//       // Set up the audio object and add it to the scene
//       audio = new THREE.Audio(listener);
//       audio.setBuffer(buffer);
//       audio.setLoop(false);
//       audio.setVolume(0.5);
//       scene.add(audio);

//       // Play the audio file when the user clicks the screen
//       document.body.addEventListener("click", () => {
//         audio.play();
//       });
//     });
//   });

//--------------------------------------------- video mp4 files ---------------------------------------------


// Load video file from WordPress media
// const videoElement = document.createElement('video');
// videoElement.src = 'http://your-wordpress-url.com/wp-content/uploads/your-video-file.mp4';
// videoElement.load();
// videoElement.play();

// // Create video texture
// const videoTexture = new THREE.VideoTexture(videoElement);
// videoTexture.minFilter = THREE.LinearFilter;
// videoTexture.magFilter = THREE.LinearFilter;
// videoTexture.format = THREE.RGBFormat;

// // Create material with video texture
// const material = new THREE.MeshBasicMaterial({ map: videoTexture });

// // Create mesh with material and add to scene
// const geometry = new THREE.BoxGeometry(1, 1, 1);
// const mesh = new THREE.Mesh(geometry, material);
// scene.add(mesh);

//------------------------------------------------------------------------------------------------------------

export default AVfiles = [
    {
        room: "1",
        objectToAssign: "",
        type: ".mp3",
        path: "https://your-site.com/wp-json/wp/v2/media?slug=your-media-file"
    },
    {
        room: "1",
        objectToAssign: "",
        type: ".mp3",
        path: "https://your-site.com/wp-json/wp/v2/media?slug=your-media-file"
    },
    {
        room: "1",
        objectToAssign: "",
        type: ".mp3",
        path: "https://your-site.com/wp-json/wp/v2/media?slug=your-media-file"
    },
    {
        room: "1",
        objectToAssign: "",
        type: ".mp4",
        path: "https://your-site.com/wp-json/wp/v2/media?slug=your-media-file"
    },
    {
        room: "1",
        objectToAssign: "",
        type: ".mp3",
        path: "https://your-site.com/wp-json/wp/v2/media?slug=your-media-file"
    }
];

