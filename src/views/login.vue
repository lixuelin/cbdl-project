<template>
    <div class="login">
        <div class="login-box">
            <header class="login-title">
                <h1>
                    欢迎来到创博动力!
                </h1>
            </header>
            <div class="login-form">
                <Form ref="formInline" :model="formInline" :rules="ruleInline">
                    <FormItem prop="user">
                        <Input
                            type="text"
                            v-model="formInline.username"
                            placeholder="请输入用户名称"
                        >
                            <Icon type="ios-contact" slot="prepend"></Icon>
                        </Input>
                    </FormItem>
                    <FormItem prop="password">
                        <Input
                            type="password"
                            v-model="formInline.password"
                            placeholder="请输入密码"
                        >
                            <Icon type="ios-lock" slot="prepend"></Icon>
                        </Input>
                    </FormItem>
                    <div class="login-form-btns">
                        <div class="login-form-btns-submit">
                            <FormItem>
                                <Button
                                    type="primary"
                                    @click="handleSubmit('formInline')"
                                    >登录</Button
                                >
                            </FormItem>
                        </div>
                        <div class="login-form-btns-other">
                            <span @click="gotoRegister">注册</span
                            ><span class="login-form-btns-other-line">|</span>
                            <span @click="gotoForget">忘记密码</span>
                        </div>
                    </div>
                </Form>
            </div>
        </div>
    </div>
</template>

<script>
import { setCookie } from "./../utils/cookie";

export default {
    name: "login",
    data() {
        return {
            formInline: {
                username: "",
                password: ""
            },
            ruleInline: {
                username: [
                    {
                        required: true,
                        message: "请输入您的用户名",
                        trigger: "blur"
                    }
                ],
                password: [
                    {
                        required: true,
                        message: "请输登录密码.",
                        trigger: "blur"
                    },
                    {
                        type: "string",
                        min: 6,
                        message: "密码长度最少6位",
                        trigger: "blur"
                    }
                ]
            }
        };
    },
    methods: {
        handleSubmit(name) {
            this.$refs[name].validate(valid => {
                if (valid) {
                    let data = this.formInline;
                    this.loginUser(data);
                } else {
                    this.$Message.error("Fail!");
                }
            });
        },
        async loginUser(data) {
            let res = null;
            try {
                res = await this.$Http.userLogin(data);
                let user_info = res.data;
                if (user_info.role_id !== 3) {
                    return this.$Message.error("用户不存在!");
                }
                localStorage["username"] = user_info.username;
                localStorage["user_id"] = user_info.user_id;
                localStorage["session_id"] = user_info.token;
                localStorage["code"] = user_info.code;
                localStorage["type"] = "web";
                setCookie("session_id", user_info.token);
                this.$Message.success("登录成功!");
                this.$router.push({ path: "/home" });
            } catch (error) {
                this.$Message.error(`请求失败:${res.msg}`);
            }
        },
        gotoRegister() {
            this.$router.push({ name: "register" });
        },
        gotoForget() {
            this.$router.push({ name: "forget" });
        }
    }
};
</script>

<style lang="less" scoped>
@import "./../assets/css/login";
</style>
