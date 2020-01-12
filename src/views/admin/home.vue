<template>
  <div class="admin-home">
    <header class="admin-home-head">
      <div class="admin-home-head-box">
        <div class="admin-home-head-photo">
          <div class="admin-home-head-photo-box">
            <img src="./../../assets/image/photo.jpg" alt />
          </div>
        </div>
        <div class="admin-home-head-user">
          <div class="admin-home-head-user-box">
            <p>{{ username }}</p>
            <p @click="goOut">退出</p>
          </div>
        </div>
      </div>
    </header>
    <div class="admin-home-sidebar">
      <header class="admin-home-sidebar-head">
        <div class>
          <h1>创博动力</h1>
        </div>
      </header>
      <menu-view></menu-view>
    </div>
    <article class="admin-home-article">
      <article class="admin-home-article-body">
        <div>
          <router-view></router-view>
        </div>
      </article>
    </article>
  </div>
</template>

<script>
import sideMenu from "./../../components/menu";
import Header from "./../../components/header";
import { delCookie } from "./../../utils/cookie";

export default {
  name: "admin-home",
  data() {
    return {
      username: ""
    };
  },
  components: {
    Header,
    "menu-view": sideMenu
  },
  mounted() {
    this.username = localStorage.getItem("username");
  },
  methods: {
    goOut() {
      localStorage.setItem("user_id", "");
      localStorage.setItem("session_id", "");
      localStorage.setItem("username", "");
      localStorage.setItem("type", "");
      localStorage.setItem("role_id", "");
      delCookie("session_id");
      this.$router.push({ path: "/manager" });
    }
  }
};
</script>

<style lang="less" scoped>
@import "./../../assets/admin/home";
</style>
