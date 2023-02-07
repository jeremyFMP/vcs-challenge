import { createApp } from "vue";
import App from "./App.vue";

import "cesium/Build/Cesium/Widgets/widgets.css";
import "normalize.css/normalize.css";
import "./style.css";

declare global {
  interface Window {
    CESIUM_BASE_URL: any;
  }
}
window.CESIUM_BASE_URL = "/";

createApp(App).mount("#app");
