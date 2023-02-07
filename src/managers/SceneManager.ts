import {
  Viewer,
  ScreenSpaceEventHandler,
  HeadingPitchRange,
  Cesium3DTileset,
  CesiumTerrainProvider,
  ScreenSpaceEventType,
  Cartesian2,
} from "cesium";

class SceneManager {
  public viewer: Viewer;
  sidebarClosed: boolean = true;
  clickedObjectAttr: any;

  callbackFn: any;

  constructor(setCallback: (attributes: any) => void) {
    this.callbackFn = setCallback;
    this.viewer = new Viewer("cesiumContainer", {
      terrainProvider: new CesiumTerrainProvider({
        url: "https://www.virtualcitymap.de/datasource-data/globalterrain_5_9",
        requestVertexNormals: true,
      }),
      baseLayerPicker: false,
      // navigationHelpButton: false,
      sceneModePicker: false,
      projectionPicker: false,
      homeButton: false,
      geocoder: false,
      animation: false,
      timeline: false,
      fullscreenButton: false,
      // infoBox: false,
    });

    this.viewer.selectedEntityChanged.addEventListener((selectedEntity) => {
      console.log("selectedEntity", selectedEntity);
    });

    this.viewer.screenSpaceEventHandler.setInputAction(
      (movement: { position: Cartesian2 }) => {
        this.clickedObjectAttr = null;
        this.sidebarClosed = true;

        this.callbackFn(undefined);

        console.log("clicked cleared:", this.clickedObjectAttr);

        const pickedFeature = this.viewer.scene.pick(movement.position);

        if (pickedFeature) {
          console.log("clicked:", pickedFeature.getProperty("attributes"));
          console.log("obj:", pickedFeature);

          this.clickedObjectAttr = pickedFeature.getProperty("attributes");
          this.sidebarClosed = false;
          this.callbackFn(this.clickedObjectAttr);

          // TODO: set infobox state/content
        } else {
          console.log("nothing hit");
          // TODO: clear infobox
        }
      },
      ScreenSpaceEventType.LEFT_CLICK
    );

    const tileset = new Cesium3DTileset({
      url: "https://www.virtualcitymap.de/datasource-data/f892f6af-180a-4eef-917f-5ff03c260b32/tileset.json",
      // debugShowBoundingVolume: true,
    });
    tileset.readyPromise
      .then((tileset) => {
        this.viewer.scene.primitives.add(tileset);
        const offset = new HeadingPitchRange(
          0.0,
          -0.75,
          tileset.boundingSphere.radius * 0.1
        );
        this.viewer.zoomTo(tileset, offset);
      })
      .catch((err) => {
        console.error(err);
      });

    const handler = new ScreenSpaceEventHandler(this.viewer.scene.canvas);
  }

  public destroy(): void {
    this.viewer?.destroy();
  }
}

export default SceneManager;
