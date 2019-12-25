<template>
    <div class="forget">
        <div class="forget-form">
            <Form
                ref="formValidate"
                :model="formValidate"
                :rules="ruleValidate"
                :label-width="80"
            >
                <FormItem label="账户名称" prop="username">
                    <Input
                        type="text"
                        v-model="formValidate.username"
                        placeholder="请输入账户名称"
                    ></Input>
                </FormItem>
                <FormItem label="银行卡号" prop="card">
                    <Input
                        type="text"
                        v-model="formValidate.card"
                        placeholder="请输入绑定银行卡号"
                    ></Input>
                </FormItem>
                <FormItem label="所属银行">
                    <span>{{ formValidate.bank_name }}</span>
                </FormItem>
                <FormItem label="户主" prop="household">
                    <Input
                        type="text"
                        v-model="formValidate.household"
                        placeholder="请输入户主"
                    ></Input>
                </FormItem>
                <FormItem class="login-pwd-form-btn">
                    <Button type="primary" @click="handleSubmit('formValidate')"
                        >找回密码</Button
                    >
                </FormItem>
            </Form>
        </div>
        <Modal v-model="insert_pwd" width="460">
            <p slot="header" style="text-align:left">
                <span>忘记密码</span>
            </p>
            <div class="admin-main-verify">
                <Form
                    ref="user_pwd"
                    :model="user_pwd"
                    :rules="pwdValidate"
                    :label-width="20"
                >
                    <FormItem label=" " prop="password">
                        <Input
                            type="password"
                            v-model="user_pwd.password"
                            placeholder="请设置最新密码"
                        ></Input>
                    </FormItem>
                    <FormItem label=" " prop="passwordCheck">
                        <Input
                            type="password"
                            v-model="user_pwd.passwordCheck"
                            placeholder="请重新输入密码"
                        ></Input>
                    </FormItem>
                </Form>
            </div>
            <div slot="footer">
                <Button
                    type="primary"
                    size="large"
                    long
                    :loading="modal_loading"
                    @click="writePwd('user_pwd')"
                    >确定
                </Button>
            </div>
        </Modal>
    </div>
</template>

<script>
import BIN from "bankcardinfo";

export default {
    name: "forget",
    data() {
        const validateUsername = (rule, value, callback) => {
            if (this.formValidate.oldPassWord !== "") {
                let reg = /^[a-zA-Z0-9_\u4e00-\u9fa5]{6,12}$/;
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
        const validateCard = (rule, value, callback) => {
            if (this.formValidate.password !== "") {
                BIN.getBankBin(this.formValidate.card)
                    .then(data => {
                        this.formValidate.bank_name = data.bankName;
                        callback();
                    })
                    .catch(err => {
                        callback(new Error("银行卡号输入错误，请重新输入！"));
                    });
            }
        };
        const validateHousehold = (rule, value, callback) => {
            if (this.formValidate.password !== "") {
                let reg = /^[\u4E00-\u9FA5]{2,8}$/;
                let is_reg = reg.test(value);
                if (is_reg) {
                    callback();
                } else {
                    callback(new Error("只可输入汉字，最大8位!"));
                }
            }
        };
        const validatePassword = (rule, value, callback) => {
            if (this.user_pwd.password !== "") {
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
            if (value !== this.user_pwd.password) {
                callback(new Error("账号密码不一致，请重新输入！"));
            } else {
                callback();
            }
        };
        return {
            formValidate: {
                username: "",
                card: "",
                bank_name: "",
                household: ""
            },
            is_validate: false,
            ruleValidate: {
                username: [
                    {
                        required: true,
                        type: "string",
                        message: "账户名称不能为空",
                        trigger: "blur"
                    },
                    { validator: validateUsername, trigger: "blur" }
                ],
                card: [
                    {
                        required: true,
                        type: "string",
                        message: "银行卡号不能为空！",
                        trigger: "blur"
                    },
                    { validator: validateCard, trigger: "blur" }
                ],
                household: [
                    {
                        required: true,
                        type: "string",
                        message: "户主姓名不能为空！",
                        trigger: "blur"
                    },
                    { validator: validateHousehold, trigger: "blur" }
                ]
            },
            insert_pwd: false,
            user_pwd: {
                password: "",
                passwordCheck: ""
            },
            user_id: null,
            pwdValidate: {
                password: [
                    {
                        required: true,
                        type: "string",
                        message: "登录密码不能为空",
                        trigger: "blur"
                    },
                    { validator: validatePassword, trigger: "blur" }
                ],
                passwordCheck: [
                    {
                        required: true,
                        type: "string",
                        message: "确认登录密码不能为空！",
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
                    this.getUserMsg();
                }
            });
        },
        writePwd(name) {
            this.$refs[name].validate(valid => {
                if (valid) {
                    this.changeLoginPwd();
                }
            });
        },
        async getUserMsg() {
            let data = {
                username: this.formValidate.username,
                card: this.formValidate.card,
                household: this.formValidate.household
            };
            let res = await this.$Http.queryUser(data);
            if (res.status !== 200) {
                return this.$Message.warning("没有找到用户！");
            }
            this.insert_pwd = true;
            this.user_id = res.data.id;
        },
        async changeLoginPwd() {
            let data = {
                password: this.user_pwd.password,
                id: this.user_id
            };
            this.modal_loading = true;
            let res = null;
            try {
                res = await this.$Http.updateUser(data);
                this.modal_loading = false;
                this.$Message.success("登录密码修改成功!");
                setTimeout(() => {
                    this.$router.push({ path: "/" });
                }, 1000);
            } catch (error) {
                this.modal_loading = false;
                return this.$Message.error("登录密码修改失败!");
            }
        }
    }
};
</script>

<
<style lang="less" scoped>
@import "./../assets/css/login";
</style>
