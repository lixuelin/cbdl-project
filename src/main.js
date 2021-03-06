// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// import Vue from 'vue';
import App from "./App";
import router from "./router";
// import iView from 'iview';
import "./assets/css/reset.less";
import "./assets/css/common.less";
import Http from "./utils/http";

// import 'iview/dist/styles/iview.css';

Vue.prototype.$menu = {
    index: 0,
    name: "首页"
};

Vue.prototype.$Http = Http;

// Vue.use(iView);

router.beforeEach((to, from, next) => {
    iview.LoadingBar.start();
    next();
});

router.afterEach(route => {
    iview.LoadingBar.finish();
});

Vue.config.productionTip = false;

Vue.prototype.$Http = Http;

/* eslint-disable no-new */
new Vue({
    el: "#app",
    router,
    components: { App },
    template: "<App/>"
});