<script lang="ts">
import {
  Viewer,
  ScreenSpaceEventHandler,
  HeadingPitchRange,
  Cesium3DTileset,
  CesiumTerrainProvider,
  ScreenSpaceEventType,
  Cartesian2,
} from "cesium";

export default {
  data(): { viewer: Viewer; clickedObjectAttr: any; sidebarClosed: boolean } {
    return {
      viewer: null as any,
      clickedObjectAttr: null as any,
      sidebarClosed: true,
    };
  },
  methods: {
    onSidebarClose() {
      this.sidebarClosed = true;
      console.log("close-btn click", this.sidebarClosed);
    },
  },
  mounted() {
    this.viewer = new Viewer("cesiumContainer", {
      terrainProvider: new CesiumTerrainProvider({
        url: "https://www.virtualcitymap.de/datasource-data/globalterrain_5_9",
        requestVertexNormals: true,
      }),
      baseLayerPicker: false,
      navigationHelpButton: false,
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

        console.log("clicked cleared:", this.clickedObjectAttr);

        const pickedFeature = this.viewer.scene.pick(movement.position);

        if (pickedFeature) {
          console.log("clicked:", pickedFeature.getProperty("attributes"));
          console.log("obj:", pickedFeature);

          this.clickedObjectAttr = pickedFeature.getProperty("attributes");
          this.sidebarClosed = false;

          // TODO: set infobox state/content
        } else {
          console.log("nothing hit");
          // this.clickedObjects = [];
          // TODO: clear infobox
        }
      },
      ScreenSpaceEventType.LEFT_CLICK
    );

    const tileset = new Cesium3DTileset({
      url: "https://www.virtualcitymap.de/datasource-data/f892f6af-180a-4eef-917f-5ff03c260b32/tileset.json",
      debugShowBoundingVolume: true,
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

        // const infobox = new InfoBox("my-infobox-container");
        // const infoboxViewModel = new InfoBoxViewModel();

        // cesium#longitude	13.41765
        // cesium#latitude	52.49975
      })
      .catch((err) => {
        console.error(err);
      });

    const handler = new ScreenSpaceEventHandler(this.viewer.scene.canvas);
  },
  beforeDestroy() {
    // if (this.viewer) {
    //   this.viewer.destroy();
    // }
  },
};
</script>

<template>
  <div id="cesiumContainer" class="full-size"></div>
  <div class="sidebar" :class="{ closed: sidebarClosed }">
    <div class="header">
      <h2>Info Attributes</h2>
      <button @click="onSidebarClose">x</button>
    </div>

    <div class="attributes" v-if="clickedObjectAttr !== null">
      <!-- externalReference externalObjectName -->
      <!-- measuredHeight -->
      <div
        v-if="
          clickedObjectAttr['externalReference externalObjectName'] !== null
        "
        class="refId mb-4"
      >
        <h3>ExternalReference ExternalObjectName:</h3>
        <span
          >{{ clickedObjectAttr["externalReference externalObjectName"] }}
        </span>
      </div>

      <div v-if="clickedObjectAttr.Address !== null" class="address mb-4">
        <h3>Adresse:</h3>
        <div class="data">
          <span
            >{{ clickedObjectAttr.Address.Street }}
            {{ clickedObjectAttr.Address.HouseNumber }}</span
          >
          <span>{{ clickedObjectAttr.Address.City }} </span>
        </div>
        <!-- {{ JSON.stringify(clickedObjectAttr["Address"]) }} -->
      </div>
      <hr />
      <h3>Zusätzliche Attribute:</h3>
      <div class="misc-data">
        <ul>
          <li v-for="(value, key) in clickedObjectAttr">
            <b>{{ key }}</b
            >: {{ value }}
          </li>
        </ul>
      </div>

      <!-- <pre v-if="clickedObjectAttr !== null">
        {{ JSON.stringify(clickedObjectAttr) }}
      </pre> -->
    </div>
    <div v-else>Klicke ein Gebäude</div>
  </div>
</template>

<style>
:root {
  --color-blue: #15a0b9;
  --color-green: #105333;
  --color-green-light: #3c9d76;
  --color-green-yellow: #84b026;
}

.mb-4 {
  margin-bottom: 1rem;
}

hr {
  opacity: 0.3;
  color: #e1e6e9;
}

.full-size {
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  border: none;
  width: 100%;
  height: 100%;
}

#cesiumContainer {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
  position: relative;
}

.sidebar {
  position: absolute;
  display: flex;
  flex-direction: column;
  top: 30px;
  left: 30px;
  /* bottom: 100px; */
  width: 500px;
  /* padding: 10px 15px; */
  background-color: #fff;
  border-radius: 8px;
  color: black;
  height: auto;

  box-shadow: 2.4px 2.4px 3.7px rgba(0, 0, 0, 0.087),
    6.5px 6.5px 10.1px rgba(0, 0, 0, 0.125),
    15.7px 15.7px 24.4px rgba(0, 0, 0, 0.163),
    52px 52px 81px rgba(0, 0, 0, 0.25);

  transition: transform 0.3s ease-in-out;
  transform: translateX(0);
}

.sidebar pre {
  word-break: break-word;
  white-space: normal;
}

.sidebar.closed {
  /* display: none; */
  transform: translateX(-660px);
}

.sidebar .header {
  display: flex;
  justify-content: space-between;
  background-color: var(--color-green-yellow);
  padding: 12px 10px 13px 15px;
  border-radius: 5px 5px 0 0;
  align-items: center;
}

.sidebar .header h2 {
  margin: 0;
  line-height: 1;
  color: white;
  font-weight: 300;
}

.sidebar .header button {
  background-color: var(--color-green);
  border-radius: 50%;
  display: flex;
  /* align-items: center; */
  line-height: 100%;
  justify-content: center;
  height: 40px;
  width: 40px;
  border: 0;
}

.sidebar .header button:hover {
  background-color: #157949;
}

.sidebar .attributes {
  padding: 15px 10px;
}

.sidebar .attributes h1,
.sidebar .attributes h2,
.sidebar .attributes h3,
.sidebar .attributes h4 {
  font-size: 1rem;
  margin-bottom: 5px;
  margin-top: 0;
  text-transform: uppercase;
}

.sidebar .address .data {
  display: flex;
  flex-direction: column;
}

.sidebar ul {
  margin: 0;
  list-style: none;
  padding: 0;
}

.sidebar ul li:hover {
  background-color: #c6d0d6;
}

.sidebar .misc-data {
  font-family: "SFMono-Regular", "Menlo", "Monaco", "Consolas",
    "Liberation Mono", "Courier New", monospace;
  background-color: #e1e6e9;
  border-radius: 3px;
  padding: 10px;
  max-height: 300px;
  overflow-y: scroll;
}
</style>
