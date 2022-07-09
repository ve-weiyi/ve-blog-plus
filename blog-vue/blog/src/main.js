import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
//  安装ElementUI
import "./plugins/element.js";

// 引入Vuetify 与Element UI相似
import vuetify from "./plugins/vuetify";

//引入css
import animated from "animate.css";
import "./assets/css/index.css";
import "./assets/css/iconfont.css";
import "./assets/css/markdown.css";
import "./assets/css/vue-social-share/client.css";

import config from "./assets/js/config";
import Share from "vue-social-share";
import dayjs from "dayjs";
import { vueBaberrage } from "vue-baberrage";

import axios from "axios";
import VueAxios from "vue-axios";

import InfiniteLoading from "vue-infinite-loading";
import "highlight.js/styles/atom-one-dark.css";
import VueImageSwipe from "vue-image-swipe";
import "vue-image-swipe/dist/vue-image-swipe.css";

import Toast from "./components/toast/index";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

//阻止 vue 在启动时生成生产提示
Vue.prototype.config = config;
Vue.config.productionTip = false;
Vue.use(animated);
Vue.use(Share);
Vue.use(vueBaberrage);
Vue.use(InfiniteLoading);
Vue.use(VueAxios, axios);
Vue.use(VueImageSwipe);
Vue.use(Toast);

Vue.filter("date", function(value) {
  return dayjs(value).format("YYYY-MM-DD");
});

Vue.filter("year", function(value) {
  return dayjs(value).format("YYYY");
});

Vue.filter("hour", function(value) {
  return dayjs(value).format("HH:mm:ss");
});

Vue.filter("time", function(value) {
  return dayjs(value).format("YYYY-MM-DD HH:mm:ss");
});

Vue.filter("num", function(value) {
  if (value >= 1000) {
    return (value / 1000).toFixed(1) + "k";
  }
  return value;
});

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  NProgress.start();
  // to 将要访问的路径
  // from 代表从哪个路径跳转而来
  // next 是一个函数，表示放行
  //     next()  放行    next('/login')  强制跳转
  console.log(to.path);
  if (to.path === "/login") return next();
  // 获取token
  const tokenStr = window.sessionStorage.getItem("token");
  // 后端指定接口验证了token的正确性
  if (!tokenStr && to.path === "/blogs") return next("/login");

  if (to.meta.title) {
    document.title = to.meta.title;
  }
  next();
});

router.afterEach(() => {
  window.scrollTo({
    top: 0,
    behavior: "instant"
  });
  NProgress.done();
});

// 请求拦截器，为了加上token
axios.interceptors.request.use(
    function(config) {
      console.log(config.url);
      if (window.sessionStorage.getItem("tokenStr")) {
        //请求携带自定义token
        config.headers["Authorization"] = window.sessionStorage.getItem(
            "tokenStr"
        );
      }
      return config;
    },
    function(error) {
      console.log(error);
      return error;
    }
);

//响应拦截器
axios.interceptors.response.use(
    //业务逻辑错误，200是返回成功
    function(response) {
      //状态码是自己定的
      switch (response.data.code) {
        case 50000:
          Vue.prototype.$toast({ type: "error", message: "系统异常" });
      }
      return response;
    },
    function(error) {
      return Promise.reject(error);
    }
);

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");
