<template>
	<div class="register">
		<div class="register-form">
			<Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="20">
				<FormItem label=" " prop="username">
					<Input v-model="formValidate.username" placeholder="请输入账号"></Input>
				</FormItem>
				<FormItem label=" " prop="password">
					<Input type="password" v-model="formValidate.password" placeholder="请输入账号密码"></Input>
				</FormItem>
				<FormItem label=" " prop="passwordCheck">
					<Input type="password" v-model="formValidate.passwordCheck" placeholder="请再次输入账号密码"></Input>
				</FormItem>
				<FormItem label=" " prop="card">
					<Input v-model="formValidate.card" placeholder="请输入银行卡号"></Input>
				</FormItem>
				<FormItem label=" " prop="cardCheck">
					<Input v-model="formValidate.cardCheck" placeholder="请再次输入银行卡号"></Input>
				</FormItem>
				<FormItem label=" ">
					所属银行：<span>{{formValidate.bank_name}}</span>
				</FormItem>
				<FormItem label=" " prop="household">
					<Input v-model="formValidate.household" placeholder="请输入持卡人姓名"></Input>
				</FormItem>
				<FormItem label=" " prop="cashPwd">
					<Input type="password" v-model="formValidate.cashPwd" placeholder="请输入提现密码"></Input>
				</FormItem>
				<FormItem label=" " prop="cashPwdCheck">
					<Input type="password" v-model="formValidate.cashPwdCheck" placeholder="请再次输入提现密码"></Input>
				</FormItem>
				<FormItem label=" " prop="beInviteCode">
					<Input type="text" v-model="formValidate.beInviteCode" placeholder="请输入邀请码"></Input>
				</FormItem>
				<FormItem>
					<Button type="primary" @click="handleSubmit('formValidate')">注册</Button>
				</FormItem>
			</Form>
		</div>
	</div>
</template>

<script>
    import BIN from "bankcardinfo";
    import {
        registerRequest,
        registerRequestUserName,
        registeInviteCode,
        registeBankCard
    } from "./../utils/request_api";
    
    export default {
        name: "register",
        data() {
            const validateUsername = (rule, value, callback) => {
                if (this.formValidate.username !== "") {
                    let reg = /^[a-zA-Z0-9_\u4e00-\u9fa5]{6,12}$/;
                    let is_reg = reg.test(value);
                    if (is_reg) {
                        let data = {
                            username: value
                        };
                        registerRequestUserName(data).then(response => {
                            if (response.data.data.is_exist === 0) {
                                callback();
                            } else {
                                callback(new Error("姓名名称已存在!"));
                            }
                        }).catch(error => {
                            this.$Message.error("接口请求失败");
                        });
                    } else {
                        callback(new Error("限制6-12个字,只可以输入中文、大小写字母、数字!"));
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
                        callback(new Error("限制6-30位密码,只可以输入大小写字母、数字!"));
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
            const validateCard = (rule, value, callback) => {
                if (this.formValidate.card !== "") {
                    BIN.getBankBin(this.formValidate.card)
                        .then((data) => {
                            this.formValidate.bank_name = data.bankName;
                            this.formValidate.bank_code = data.bankCode;
                            this.formValidate.card_type = data.cardTypeName;
                            this.getBankCard(value, callback);
                        })
                        .catch((err) => {
                            callback(new Error("银行卡号输入错误，请重新输入！"));
                        });
                }
            };
            const validateCardCheck = (rule, value, callback) => {
                if (value !== this.formValidate.card) {
                    callback(new Error("银行卡号不一致，请重新输入！"));
                } else {
                    callback();
                }
            };
            const validateHousehold = (rule, value, callback) => {
                if (this.formValidate.household !== "") {
                    let reg = /^[\u4E00-\u9FA5]{2,8}$/;
                    let is_reg = reg.test(value);
                    if (is_reg) {
                        callback();
                    } else {
                        callback(new Error("只可输入汉字，最大8位!"));
                    }
                }
            };
            const validateCashPwd = (rule, value, callback) => {
                if (this.formValidate.cashPwd !== "") {
                    let reg = /^[a-zA-Z0-9]{6,30}$/;
                    let is_reg = reg.test(value);
                    if (is_reg) {
                        callback();
                    } else {
                        callback(new Error("限制6-30位密码,只可以输入大小写字母、数字!"));
                    }
                }
            };
            const validateCashPwdCheck = (rule, value, callback) => {
                if (value !== this.formValidate.cashPwd) {
                    callback(new Error("提现密码不一致，请重新输入！"));
                } else {
                    callback();
                }
            };
    
            const validateInviteCode = (rule, value, callback) => {
                if (value !== "") {
                    this.getInviteCode(value, callback);
                }
            };
            
            return {
                formValidate: {
                    username: "",
                    password: "",
                    passwordCheck: "",
                    card: "",
                    cardCheck: "",
                    bank_name: "",
                    bank_code: "",
                    card_type: "",
                    household: "",
                    cashPwd: "",
                    cashPwdCheck: "",
                    beInviteCode: ""
                },
                is_validate: false,
                ruleValidate: {
                    username: [
                        { required: true, type: "string", message: "账号名称不能为空！", trigger: "blur" },
                        { validator: validateUsername, trigger: "blur" }
                    ],
                    password: [
                        { required: true, type: "string", message: "账号密码不能为空！", trigger: "blur" },
                        { validator: validatePassword, trigger: "blur" }
                    ],
                    passwordCheck: [
                        { required: true, type: "string", message: "再次输入账号密码不能为空！", trigger: "blur" },
                        { validator: validatePasswordCheck, trigger: "blur" }
                    ],
                    card: [
                        { required: true, type: "string", message: "银行卡号不能为空！", trigger: "blur" },
                        { validator: validateCard, trigger: "blur" }
                    ],
                    cardCheck: [
                        { required: true, type: "string", message: "再次输入银行卡号不能为空！", trigger: "blur" },
                        { validator: validateCardCheck, trigger: "blur" }
                    ],
                    bank: [
                        { required: true, message: "Please select the date", trigger: "change" }
                    ],
                    household: [
                        { required: true, type: "string", message: "名称不能为空！", trigger: "blur" },
                        { validator: validateHousehold, trigger: "blur" }
                    ],
                    cashPwd: [
                        { required: true, type: "string", message: "提现密码不能为空", trigger: "blur" },
                        { validator: validateCashPwd, trigger: "blur" }
                    ],
                    cashPwdCheck: [
                        { required: true, type: "string", message: "再次输入提现密码不能为空", trigger: "blur" },
                        { validator: validateCashPwdCheck, trigger: "blur" }
                    ],
                    beInviteCode: [
                        { required: false, type: "string" },
                        { validator: validateInviteCode, trigger: "blur" }
                    ]
                }
            };
        },
        mounted() {
        },
        methods: {
            handleSubmit(name) {
                this.$refs[name].validate((valid) => {
                    this.is_validate = valid;
                    if (valid) {
                        this.registerUser();
                    } else {
                        this.$Message.error("注册失败!");
                    }
                });
            },
            registerUser() {
                let data = this.formValidate;
                registerRequest(data).then(res => {
                    this.$Message.success("注册成功!");
                    this.$router.push({ "name": "login" });
                }).catch(err => {
                    console.log(err);
                    this.$Message.error("注册失败!");
                });
            },
            getInviteCode(value, callback) {
                let data = {
                    code: value
                };
                registeInviteCode(data).then(response => {
                    let is_exist = response.data.data.is_exist;
                    if (!is_exist) {
                        callback(new Error("邀请码不存在请重新输入！"));
                    } else {
                        callback();
                    }
                }).catch(error => {
                    this.$Message.error("验证码请求失败！");
                });
            },
            getBankCard(value, callback) {
                let data = {
                    card: value
                };
                registeBankCard(data).then(response => {
                    let is_exist = response.data.data.is_exist;
                    if (is_exist) {
                        callback(new Error("银行卡已经被使用，请重新输入！"));
                    } else {
                        callback();
                    }
                }).catch(error => {
                    this.$Message.error("银行卡请求失败！");
                });
            }
        }
    };
</script>

<style lang="less" scoped>
	@import "./../assets/css/login";
</style>
