let assets;

export default assets = {
  rooms: [
    {
      room: "0",
      assets: [
        {
          classification: "level",
          type: "glb",
          path: "./Models/Environment/Room01/room12.glb"
        },
        {
          classification: "exhibit",
          type: "glbDraco",
          path: "./Models/Environment/Room00/Cannon3.glb"
        }
      ]
    },
    {
      room: "1",
      assets: [
        {
          classification: "level",
          type: "glbDraco",
          path: "./Models/Environment/Room00/MenuRoomMetNoAnimv2.glb"
        },
      ]
    }
    // {
    //   room: "2",
    //   assets: [
    //     {
    //       classification: "level",
    //       type: "glb",
    //       path: "./Models/Environment/Room00/MenuSceneR.glb"
    //     },
    //     {
    //       classification: "exhibit",
    //       type: "glb",
    //       path: "./Models/Environment/Room00/MenuRoomMetNoAnim.glb"
    //     },
    //     {
    //       classification: "exhibit",
    //       type: "glb",
    //       path: "./miscellaneous/mouse/MoveArrow.glb"
    //     }
    //   ]
    // }
  ]
};
