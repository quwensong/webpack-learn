import Vue from "vue";
import App from "./App.vue";

new Vue({
  // el: "#app",
  // render: (h) => h("div", null, "hello world"),
  render: (h) => h(App),
}).$mount("#app");
