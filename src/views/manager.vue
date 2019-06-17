<template>
	<div class="admin" :style="{'height': clientHeight + 'px'}">
		<div class="admin-login">
			<header class="admin-login-head">
				<h1>创博动力</h1>
			</header>
			<article class="admin-login-body">
				<div class="admin-login-body-text">
					<Input prefix="ios-contact" v-model="user.username" placeholder="请输入用户名" type="text" size="large"/>
				</div>
				<div class="admin-login-body-text">
					<Input prefix="ios-lock" v-model="user.password" placeholder="请输入密码" type="password" size="large"/>
				</div>
			</article>
			<footer class="admin-login-foot">
				<div>
					<Button type="primary" size="default" @click="login">登录</Button>
				</div>
			</footer>
		</div>
	</div>
</template>

<script>
    import { setCookie } from "./../utils/cookie";
    import { mylocalStorage, loginRequest } from "./../utils/admin_api";
    
    export default {
        name: "login",
        data() {
            return {
                clientHeight: document.documentElement.clientHeight,
                user: {
                    username: "",
                    password: ""
                }
            };
        },
        mounted() {
            console.log(document.documentElement.clientHeight, "height");
        },
        methods: {
            login() {
                if (this.user.username === "") {
                    this.$Message.error("用户名称不能为空！");
                    return;
                }
                if (this.user.password === "") {
                    this.$Message.error("用户密码不能为空！");
                    return;
                }
                
                loginRequest(this.user).then(res => {
                    let data = res.data;
                    if (data.status === 200) {
                        mylocalStorage["username"] = data.data["username"];
                        mylocalStorage["user_id"] = data.data["user_id"];
                        mylocalStorage["session_id"] = data.data["token"];
                        mylocalStorage["type"] = "manager";
                        setCookie("session_id", data.data["token"]);
                        this.$Message.success("登录成功!");
                        this.$router.push({ "path": "/admin" });
                    } else {
                        this.$Message.error("登录失败!");
                    }
                }).catch(err => {
                    console.log(err);
                    this.$Message.error("登录失败!");
                });
            }
        }
    };
</script>

<style lang="less" scoped>
	@import "./../assets/admin/login";
	
	html, body {
		width: 100%;
		height: 100%;
	}
	
	.admin {
		height: 100%;
	}
</style>
