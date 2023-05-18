import * as THREE from 'three';

export default class RoomCreation{
    constructor(){
        



    }



    fbxType(object)
    {
        return new Promise((resolve, reject) => {
            const fbxLoader = new FBXLoader();
            fbxLoader.load(url, (fbx) => {
                resolve(fbx);
            }, null, reject);
            });
    }

    LoadGLTFType()
    {

        return new Promise((resolve, reject) => {
            const gltfLoader = new GLTFLoader();
            gltfLoader.load(url, (gltf) => {
                resolve(gltf.scene);
            }, null, reject);
            });

    }

    

}
