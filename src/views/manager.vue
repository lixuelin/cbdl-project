<template>
    <div class="admin" :style="{ height: clientHeight + 'px' }">
        <div class="admin-login">
            <header class="admin-login-head">
                <h1>创博动力</h1>
            </header>
            <article class="admin-login-body">
                <div class="admin-login-body-text">
                    <Input
                        prefix="ios-contact"
                        v-model="user.username"
                        placeholder="请输入用户名"
                        type="text"
                        size="large"
                    />
                </div>
                <div class="admin-login-body-text">
                    <Input
                        prefix="ios-lock"
                        v-model="user.password"
                        placeholder="请输入密码"
                        type="password"
                        size="large"
                    />
                </div>
            </article>
            <footer class="admin-login-foot">
                <div>
                    <Button type="primary" size="default" @click="login"
                        >登录</Button
                    >
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
    mounted() {},
    methods: {
        async login() {
            if (this.user.username === "") {
                this.$Message.error("用户名称不能为空！");
                return;
            }
            if (this.user.password === "") {
                this.$Message.error("用户密码不能为空！");
                return;
            }
            let res = null;
            try {
                res = await this.$Http.adminUserLogin(this.user);
                if (!res.data) {
                    this.$Message.error(res.msg);
                }
                localStorage["username"] = res.data.username;
                localStorage["user_id"] = res.data.user_id;
                localStorage["session_id"] = res.data.token;
                localStorage["type"] = "manager";
                localStorage["role_id"] = res.data.role_id;
                setCookie("session_id", res.data.token);
                this.$Message.success("登录成功!");
                if (res.data.role_id === 2) {
                    this.$router.push({ path: "/admin/investment_flow" });
                } else {
                    this.$router.push({ path: "/admin" });
                }
            } catch (error) {
                this.$Message.error(`${res.msg}`);
            }
        }
    }
};
</script>

<style lang="less" scoped>
@import "./../assets/admin/login";

html,
body {
    width: 100%;
    height: 100%;
}

.admin {
    height: 100%;
}
</style>
