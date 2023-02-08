import {
  Viewer,
  ScreenSpaceEventHandler,
  HeadingPitchRange,
  Cesium3DTileset,
  CesiumTerrainProvider,
  ScreenSpaceEventType,
  Cartesian2,
  PostProcessStageLibrary,
  Color,
  defined,
  PostProcessStage,
} from "cesium";

class SceneManager {
  private viewer: Viewer;
  private silhouetteGreen: PostProcessStage;

  constructor(setActiveObjectCb: Function, clearActiveObjectCb: Function) {
    this.viewer = new Viewer("cesiumContainer", {
      terrainProvider: new CesiumTerrainProvider({
        url: "https://www.virtualcitymap.de/datasource-data/globalterrain_5_9",
        requestVertexNormals: true,
      }),
      baseLayerPicker: false,
      sceneModePicker: false,
      projectionPicker: false,
      homeButton: false,
      geocoder: false,
      animation: false,
      timeline: false,
      fullscreenButton: false,
    });

    /* Highlight clicked Object setup */
    this.silhouetteGreen = PostProcessStageLibrary.createEdgeDetectionStage();
    this.silhouetteGreen.uniforms.color = Color.LIME;
    this.silhouetteGreen.uniforms.length = 0.1;
    this.clearHighlight();

    this.viewer.scene.postProcessStages.add(
      PostProcessStageLibrary.createSilhouetteStage([this.silhouetteGreen])
    );

    /**
     * Override default InputAction for Left-Click
     * Also avoids opening default Infobox
     * */
    this.viewer.screenSpaceEventHandler.setInputAction(
      (movement: { position: Cartesian2 }) => {
        this.clearHighlight();

        const clickedEntity = this.viewer.scene.pick(movement.position);
        if (defined(clickedEntity)) {
          this.silhouetteGreen.selected = [clickedEntity];

          const attr = clickedEntity.getProperty("attributes");
          setActiveObjectCb(attr);
        } else {
          clearActiveObjectCb();
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

  public clearHighlight() {
    this.silhouetteGreen.selected = [];
  }

  public destroy(): void {
    this.viewer?.destroy();
  }
}

export default SceneManager;
