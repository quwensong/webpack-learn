import Vue from "vue";
import App from "./App.vue";
import $ from "jquery";

new Vue({
  // el: "#app",
  // render: (h) => h("div", null, "hello world"),
  render: (h) => h(App),
}).$mount("#app");

console.log($("#app"))