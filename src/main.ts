import { createApp } from "vue";
import App from "./App.vue";

import "normalize.css/normalize.css";
import "cesium/Build/Cesium/Widgets/widgets.css";
import "./style.css";

declare global {
  interface Window {
    CESIUM_BASE_URL: any;
  }
}
window.CESIUM_BASE_URL = "/";

createApp(App).mount("#app");
