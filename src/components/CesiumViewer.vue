<script lang="ts">
import SceneManager from "../managers/SceneManager";
import { AttributesObj } from "../types";
import Sidebar from "./Sidebar.vue";

export default {
  data(): {
    manager: SceneManager;
    activeObject: AttributesObj;
    sidebarClosed: boolean;
  } {
    /**
     * TODO: think about a proper way to set default value of activeObject, manager with type-annotation
     * throws [Vue warn]: Invalid prop: type check
     */
    return {
      activeObject: null as any,
      sidebarClosed: true,
      manager: null as any,
    };
  },
  methods: {
    clearActiveObject(): void {
      this.sidebarClosed = true;
      this.manager.clearHighlight();
    },

    setActiveObject(attributes: AttributesObj | undefined): void {
      if (attributes) {
        this.activeObject = attributes;
        this.sidebarClosed = false;
      }
    },
  },
  mounted() {
    this.manager = new SceneManager(
      this.setActiveObject,
      this.clearActiveObject
    );
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
    :attributes="activeObject"
    :on-close-cb="clearActiveObject"
  />
</template>

<style lang="sass">
:root
  --color-blue: #15a0b9
  --color-green: #105333
  --color-green-hover: #157949
  --color-green-light: #3c9d76
  --color-green-yellow: #84b026

.mb-4
  margin-bottom: 1rem

.full-size
  display: block
  position: absolute
  top: 0
  left: 0
  border: none
  width: 100%
  height: 100%

#cesiumContainer
  width: 100%
  height: 100%
  margin: 0
  padding: 0
  overflow: hidden
  position: relative

@mixin dropshadow
  box-shadow: 2.4px 2.4px 3.7px rgba(0, 0, 0, 0.087), 6.5px 6.5px 10.1px rgba(0, 0, 0, 0.125), 15.7px 15.7px 24.4px rgba(0, 0, 0, 0.163), 52px 52px 81px rgba(0, 0, 0, 0.25) !important

/* Cesium Widgets style override */
.cesium-toolbar-button
  +dropshadow
  border-radius: 50% !important
  background-color: var(--color-green) !important
  height: 40px !important
  width: 40px !important
.cesium-toolbar-button:hover
  background-color: var(--color-green-hover) !important
  border: 0 !important
  +dropshadow


.cesium-navigation-help-instructions
  background-color: #fff !important
  color: #000 !important
  border-radius: 0 0 8px 8px !important
  border: 0 !important

.cesium-navigation-help
  +dropshadow

/* Button styles */
.cesium-navigation-button
  border: 0 !important

.cesium-navigation-button-selected
  background-color: var(--color-green-light) !important
  &:hover
    background-color: var(--color-green-hover) !important

.cesium-navigation-button-unselected
  background-color: var(--color-green) !important
  &:hover
    background-color: var(--color-green-hover) !important

.cesium-navigation-help-details
  color: #000 !important
</style>
