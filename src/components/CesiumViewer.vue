<script lang="ts">
import SceneManager from "../managers/SceneManager";
import { AttributesObj } from "../types";
import Sidebar from "./Sidebar.vue";

export default {
  data(): {
    manager: SceneManager;
    // viewer: Viewer;
    clickedObjectAttr: any;
    sidebarClosed: boolean;
  } {
    return {
      // viewer: null as any,
      clickedObjectAttr: null as any,
      sidebarClosed: true,
      manager: null as any,
    };
  },
  methods: {
    onSidebarClose(): void {
      this.sidebarClosed = true;
      console.log("close-btn click", this.sidebarClosed);
    },

    setClickedObject(attributes: AttributesObj): void {
      console.log("setClickedObject", attributes);
      if (attributes) {
        this.clickedObjectAttr = attributes;
        this.sidebarClosed = false;
      } else {
        this.sidebarClosed = true;
      }
    },
  },
  mounted() {
    this.manager = new SceneManager(this.setClickedObject);
  },
  beforeDestroy() {
    this.manager?.destroy();
  },
  components: {
    Sidebar,
  },
};
</script>

<template>
  <div id="cesiumContainer" class="full-size"></div>
  <Sidebar
    :is-closed="sidebarClosed"
    :attributes="clickedObjectAttr"
    :on-close-cb="setClickedObject"
  />
</template>

<style>
:root {
  --color-blue: #15a0b9;
  --color-green: #105333;
  --color-green-hover: #157949;
  --color-green-light: #3c9d76;
  --color-green-yellow: #84b026;
}

.mb-4 {
  margin-bottom: 1rem;
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

/* Cesium Widgets style override */
.cesium-navigationHelpButton-wrapper {
  /* background-color: white; */
}

.cesium-toolbar-button {
  box-shadow: 2.4px 2.4px 3.7px rgba(0, 0, 0, 0.087),
    6.5px 6.5px 10.1px rgba(0, 0, 0, 0.125),
    15.7px 15.7px 24.4px rgba(0, 0, 0, 0.163),
    52px 52px 81px rgba(0, 0, 0, 0.25);
  border-radius: 50% !important;
  background-color: var(--color-green) !important;
  height: 40px !important;
  width: 40px !important;
}

.cesium-toolbar-button:hover {
  background-color: var(--color-green-hover) !important;
  border: 0 !important;
  box-shadow: 2.4px 2.4px 3.7px rgba(0, 0, 0, 0.087),
    6.5px 6.5px 10.1px rgba(0, 0, 0, 0.125),
    15.7px 15.7px 24.4px rgba(0, 0, 0, 0.163),
    52px 52px 81px rgba(0, 0, 0, 0.25) !important;
}
</style>
