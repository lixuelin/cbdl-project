<template>
    <div class="login-pwd">
        <div class="login-pwd-type">
            <div class="login-pwd-type-label">
                <span>选择修改密码</span>
            </div>
            <div class="login-pwd-type-cont">
                <div class="login-pwd-type-cont-box" @click="checkType = 0">
                    <div
                        :class="{
                            'login-pwd-type-cont-check': true,
                            active: checkType === 0
                        }"
                    >
                        <span class="checked"></span>
                    </div>
                    <span>登录密码</span>
                </div>
                <div class="login-pwd-type-cont-box" @click="checkType = 1">
                    <div
                        :class="{
                            'login-pwd-type-cont-check': true,
                            active: checkType === 1
                        }"
                    >
                        <span class="checked"></span>
                    </div>
                    <span>提现密码</span>
                </div>
            </div>
        </div>
        <div class="login-pwd-form">
            <Form
                ref="formValidate"
                :model="formValidate"
                :rules="ruleValidate"
                :label-width="120"
            >
                <FormItem label="请输入原密码" prop="oldPassWord">
                    <Input
                        type="password"
                        v-model="formValidate.oldPassWord"
                        placeholder="请输入登录密码"
                    ></Input>
                </FormItem>
                <FormItem label="请输入新密码" prop="password">
                    <Input
                        type="password"
                        v-model="formValidate.password"
                        placeholder="请输入登录密码"
                    ></Input>
                </FormItem>
                <FormItem label="请再次输入新密码" prop="passwordCheck">
                    <Input
                        type="password"
                        v-model="formValidate.passwordCheck"
                        placeholder="请再次输入登录密码"
                    ></Input>
                </FormItem>
                <FormItem class="login-pwd-form-btn">
                    <Button type="primary" @click="handleSubmit('formValidate')"
                        >确认提交</Button
                    >
                </FormItem>
            </Form>
        </div>
    </div>
</template>

<script>
import {
    mylocalStorage,
    checkLoginPwd,
    updateLoginPwd,
    checkCashPwd,
    updateCashPwd
} from "./../utils/request_api";
import { delCookie } from "./../utils/cookie";

export default {
    name: "change-pwd",
    data() {
        const validateoldPassWord = (rule, value, callback) => {
            if (this.formValidate.oldPassWord !== "") {
                let reg = /^[a-zA-Z0-9]{6,30}$/;
                let is_reg = reg.test(value);
                if (is_reg) {
                    this.validateLoginPwd(callback);
                } else {
                    callback(
                        new Error("限制6-30位密码,只可以输入大小写字母、数字!")
                    );
                }
            }
        };
        const validatePassword = (rule, value, callback) => {
            if (this.formValidate.password !== "") {
                let reg = /^[a-zA-Z0-9]{6,30}$/;
                let is_reg = reg.test(value);
                if (is_reg) {
                    callback();
                } else {
                    callback(
                        new Error("限制6-30位密码,只可以输入大小写字母、数字!")
                    );
                }
            }
        };
        const validatePasswordCheck = (rule, value, callback) => {
            if (value !== this.formValidate.password) {
                callback(new Error("账号密码不一致，请重新输入！"));
            } else {
                callback();
            }
        };
        return {
            checkType: 0,
            formValidate: {
                oldPassWord: "",
                password: "",
                passwordCheck: ""
            },
            is_validate: false,
            ruleValidate: {
                oldPassWord: [
                    {
                        required: true,
                        type: "string",
                        message: "原始提现密码不能为空",
                        trigger: "blur"
                    },
                    { validator: validateoldPassWord, trigger: "blur" }
                ],
                password: [
                    {
                        required: true,
                        type: "string",
                        message: "账号密码不能为空！",
                        trigger: "blur"
                    },
                    { validator: validatePassword, trigger: "blur" }
                ],
                passwordCheck: [
                    {
                        required: true,
                        type: "string",
                        message: "再次输入账号密码不能为空！",
                        trigger: "blur"
                    },
                    { validator: validatePasswordCheck, trigger: "blur" }
                ]
            }
        };
    },
    methods: {
        handleSubmit(name) {
            this.$refs[name].validate(valid => {
                this.is_validate = valid;
                if (valid) {
                    if (this.checkType === 0) {
                        this.changePassword("login");
                    } else {
                        this.changePassword("cash");
                    }
                } else {
                    this.$Message.error("验证失败!");
                }
            });
        },
        validateLoginPwd(callback) {
            if (this.checkType === 0) {
                let data = {
                    id: localStorage.getItem("user_id"),
                    password: this.formValidate.oldPassWord
                };
                this.checkPassword(data, callback, "登录密码");
            } else {
                let data = {
                    id: localStorage.getItem("user_id"),
                    cash_pwd: this.formValidate.oldPassWord
                };
                this.checkPassword(data, callback, "提现密码");
            }
        },
        async checkPassword(data, callback, tips) {
            let res = null;
            try {
                res = await this.$Http.queryUser(data);
                if (res.data) {
                    callback();
                } else {
                    this.formValidate.oldPassWord = "";
                    callback(new Error(`原始${tips}输入验证失败`));
                }
            } catch (error) {
                this.formValidate.oldPassWord = "";
                return this.$Message.error(`${res.msg}`);
            }
        },
        async changePassword(tip) {
            let data = {
                id: localStorage.getItem("user_id")
            };
            let tips = null;
            if (tip === "login") {
                data.password = this.formValidate.password;
                tips = "登录密码";
            } else {
                data.cash_pwd = this.formValidate.cash_pwd;
                tips = "提现密码";
            }
            this.is_load = true;
            let res = null;
            try {
                res = await this.$Http.updateUser(data);
                this.is_load = false;
                this.$Message.success("修改成功!");
                if (tip === "login") {
                    localStorage.setItem("user_id", "");
                    localStorage.setItem("session_id", "");
                    localStorage.setItem("username", "");
                    localStorage.setItem("code", "");
                    delCookie("session_id");
                    setTimeout(() => {
                        this.$router.push({ path: "/" });
                    }, 1000);
                }
            } catch (error) {
                this.is_load = false;
                return this.$Message.error(`${tips}请求失败:${res.msg}`);
            }
        }
    }
};
</script>

<style lang="less" scoped>
@import "./../assets/css/other";
</style>
