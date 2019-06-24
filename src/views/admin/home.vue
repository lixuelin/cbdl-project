<template>
	<div class="admin-home">
		<div class="admin-home-sidebar">
			<header class="admin-home-sidebar-head">
				<div class="">
					<h1>创博动力</h1>
				</div>
			</header>
			<menu-view></menu-view>
		</div>
		<article class="admin-home-article">
			<header class="admin-home-article-head">
				<div class="admin-home-article-head-photo">
					<div class="admin-home-article-head-photo-box">
						<img src="./../../assets/image/photo.jpg" alt="">
					</div>
				</div>
				<div class="admin-home-article-head-user">
					<div class="admin-home-article-head-user-box">
						<p>{{username}}</p>
						<p @click="goOut">退出</p>
					</div>
				</div>
			</header>
			<article class="admin-home-article-body">
				<div>
					<router-view></router-view>
				</div>
			</article>
		</article>
	</div>
</template>

<script>
    import { mylocalStorage } from "./../../utils/admin_api";
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
            this.username = mylocalStorage.getItem("username");
        },
        methods: {
            goOut() {
                mylocalStorage.setItem("user_id", "");
                mylocalStorage.setItem("session_id", "");
                mylocalStorage.setItem("username", "");
                mylocalStorage.setItem("type", "");
                mylocalStorage.setItem("role_id", "");
                delCookie("session_id");
                this.$router.push({ path: "/manager" });
            }
        }
    };
</script>

<style lang="less" scoped>
	@import "./../../assets/admin/home";
</style>
