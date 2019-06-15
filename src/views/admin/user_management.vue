<template>
	<div class="admin-main">
		<title-view :title="title"></title-view>
		<div class="admin-main-search">
			<div class="admin-main-search-box">
				<div class="admin-main-search-box-fields">
					<span>用户账号：</span> <Input v-model="search.username" placeholder="请输入用户账号" clearable
					                          style="width: 200px"/>
				</div>
				<div class="admin-main-search-box-fields">
					<span>户主：</span> <Input v-model="search.household" placeholder="请输入银行卡号" clearable
					                        style="width: 200px"/>
				</div>
				<div class="admin-main-search-box-fields">
					<span>银行卡号：</span> <Input v-model="search.card" placeholder="请输入用户账号" clearable
					                          style="width: 200px"/>
				</div>
			</div>
			<div class="admin-main-search-box">
				<div class="admin-main-search-box-fields">
					<span>所属银行：</span>
					<Select v-model="search.bank_name" placeholder="全部" style="width:200px">
						<Option value="all">全部</Option>
						<template v-for="bank in bankList">
							<Option :value="bank.bank_name">{{bank.bank_name}}</Option>
						</template>
					</Select>
				</div>
				<div class="admin-main-search-box-fields">
					<span>注册时间：</span>
					<DatePicker type="daterange" show-week-numbers
					            placement="bottom-end"
					            placeholder="Select date"
					            @on-change="changeDate"
					            style="width: 200px">
					</DatePicker>
				</div>
				<div class="admin-main-search-box-fields">
					<div class="admin-main-search-box-btns">
						<Button type="primary" @click="queryUserList">搜索</Button>
						<Button type="primary">导出excel</Button>
					</div>
				</div>
			</div>
		</div>
		<div class="admin-main-flow">
			<Table stripe :columns="columns" :data="users"></Table>
			<div class="admin-main-flow-page">
				<Page :total="pageInfo.userTotal" :current="pageInfo.currentPage"
				      :page-size="pageInfo.currentPageSize" @on-change="changePage"/>
			</div>
		</div>
		<Modal v-model="resetBankModal" width="460">
			<p slot="header" style="text-align:left">
				<span>修改提现密码</span>
			</p>
			<div>
				<Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">
					<FormItem label=" 银行卡号：" prop="card">
						<Input v-model="formValidate.card" placeholder="请输入银行卡号"></Input>
					</FormItem>
					<FormItem label=" 银行卡号：" prop="cardCheck">
						<Input v-model="formValidate.cardCheck" placeholder="请再次输入银行卡号"></Input>
					</FormItem>
					<FormItem label="所属银行：">
						<span>{{formValidate.bank_name}}</span>
					</FormItem>
					<FormItem label="户主：" prop="household">
						<Input v-model="formValidate.household" placeholder="请输入户主"></Input>
					</FormItem>
				</Form>
			</div>
			<div slot="footer">
				<Button type="primary" size="large" long @click="handleSubmit('formValidate')">确认修改</Button>
			</div>
		</Modal>
		<Modal v-model="resetCashModal" width="360">
			<p slot="header" style="text-align:left">
				<span>修改提现密码</span>
			</p>
			<div style="padding: 20px; color: #f54966; text-align:left">
				<p>重置提现密码为该用户绑定银行卡号后8位！</p>
				<p>请确定重置吗？</p>
			</div>
			<div slot="footer">
				<Button type="primary" size="large" long @click="resetCashPwd">重置</Button>
			</div>
		</Modal>
		<Modal v-model="resetLoginModal" width="360">
			<p slot="header" style="text-align:left">
				<span>修改提现密码</span>
			</p>
			<div style="padding: 20px; color: #f54966; text-align:left">
				<p>重置提现密码为该用户绑定银行卡号后6位！</p>
				<p>请确定重置吗？</p>
			</div>
			<div slot="footer">
				<Button type="primary" size="large" long @click="resetLoginPwd">重置</Button>
			</div>
		</Modal>
	</div>
</template>

<script>
    import BIN from "bankcardinfo";
    import { queryUsers, updateBankInfo, queryBanks } from "./../../utils/admin_api";
    import { updateCashPwd, updateLoginPwd } from "./../../utils/request_api";
    import pageTitle from "./../../components/title";
    
    export default {
        name: "user_management",
        data() {
            const validateCard = (rule, value, callback) => {
                if (this.formValidate.card !== "") {
                    BIN.getBankBin(this.formValidate.card)
                        .then((data) => {
                            console.log(data, "bank");
                            this.formValidate.bank_name = data.bankName;
                            this.formValidate.bank_code = data.bankCode;
                            this.formValidate.card_type = data.cardTypeName;
                            callback();
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
            return {
                title: "用户管理",
                search: {
                    username: "",
                    card: "",
                    household: "",
                    bank_name: "",
                    start_time: "",
                    end_time: ""
                },
                bankList: [],
                columns: [
                    {
                        title: "#",
                        key: "index_num",
                        width: 56
                    },
                    
                    {
                        title: "用户账号",
                        key: "username"
                    },
                    
                    {
                        title: "银行卡号",
                        key: "card"
                    },
                    {
                        title: "所属银行",
                        key: "bank_name"
                    },
                    {
                        title: "户主",
                        key: "household"
                    },
                    {
                        title: "我的邀请码",
                        key: "invite_code"
                    },
                    {
                        title: "受邀请码",
                        key: "be_invite_code"
                    },
                    {
                        title: "注册时间",
                        key: "create_time"
                    },
                    {
                        title: "操作",
                        key: "action",
                        width: 360,
                        align: "center",
                        render: (h, params) => {
                            return h("div", [
                                h("Button", {
                                    props: {
                                        type: "primary",
                                        size: "small"
                                    },
                                    style: {
                                        marginRight: "5px"
                                    },
                                    on: {
                                        click: () => {
                                            this.resetBankModal = true;
                                            this.resetBankCurrent = params.row;
                                            this.formValidate.card = params.row.card;
                                            this.formValidate.cardCheck = params.row.card;
                                        }
                                    }
                                }, "修改银行信息"),
                                h("Button", {
                                    props: {
                                        type: "primary",
                                        size: "small"
                                    },
                                    style: {
                                        marginRight: "5px"
                                    },
                                    on: {
                                        click: () => {
                                            this.resetLoginModal = true;
                                            this.resetLoginCurrent = params.row;
                                        }
                                    }
                                }, "重置账号密码"),
                                h("Button", {
                                    props: {
                                        type: "primary",
                                        size: "small"
                                    },
                                    style: {
                                        marginRight: "5px"
                                    },
                                    on: {
                                        click: () => {
                                            console.log(params.row);
                                            this.resetCashModal = true;
                                            this.resetCashCurrent = params.row;
                                        }
                                    }
                                }, "重置提现密码")
                            ]);
                        }
                    }
                
                ],
                pageInfo: {
                    userTotal: 10,
                    currentPage: 1,
                    currentPageSize: 10
                },
                modal_loading: false,
                resetCashModal: false,
                resetCashCurrent: null,
                resetLoginModal: false,
                resetLoginCurrent: null,
                resetBankModal: false,
                resetBankCurrent: null,
                users: [],
                formValidate: {
                    card: "6227003320240034988",
                    cardCheck: "6227003320240034988",
                    bank_name: "",
                    bank_code: "",
                    card_type: "",
                    household: "李学麟"
                },
                is_validate: false,
                ruleValidate: {
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
                        { required: true, type: "string", message: "户主名称不能为空！", trigger: "blur" },
                        { validator: validateHousehold, trigger: "blur" }
                    ]
                }
            };
        },
        components: {
            "title-view": pageTitle
        },
        mounted() {
            this.queryBankList();
            this.queryUserList();
        },
        methods: {
            changePage(page) {
                this.pageInfo.currentPage = page;
                this.queryUserList();
            },
            changeDate(date) {
                console.log(date);
                this.search.start_time = date[0];
                this.search.end_time = date[1];
            },
            queryUserList() {
                let data = {
                    username: this.search.username,
                    card: this.search.card,
                    household: this.search.household,
                    bank_name: this.search.bank_name,
                    start_time: this.search.start_time,
                    end_time: this.search.end_time,
                    currentPage: this.pageInfo.currentPage,
                    pageSize: this.pageInfo.currentPageSize
                };
                queryUsers(data).then(response => {
                    this.users = response.data.data.users;
                    this.pageInfo.userTotal = response.data.data.total;
                }).catch(error => {
                    this.$Message.error("获取用户失败！");
                    console.log(error);
                });
            },
            queryBankList() {
                queryBanks().then(response => {
                    console.log(response);
                    this.bankList = response.data.data;
                }).catch(error => {
                    this.$Message.error("获取银行信息失败！");
                    console.log(error);
                });
            },
            resetCashPwd() {
                let card = this.resetCashCurrent.card;
                let cashPwd = card.substring(card.length, card.length - 8);
                let data = {
                    user_id: this.resetCashCurrent.id,
                    cashPwd
                };
                this.modal_loading = true;
                updateCashPwd(data).then(res => {
                    console.log(res, "dss");
                    this.resetCashCurrent = null;
                    this.resetCashModal = false;
                    this.$Message.success("提现密码修改成功！");
                    this.queryUserList();
                }).catch(err => {
                    console.log(err);
                    this.$Message.error("提现密码修改失败！");
                });
            },
            resetLoginPwd() {
                let card = this.resetLoginCurrent.card;
                let password = card.substring(card.length, card.length - 6);
                let data = {
                    user_id: this.resetLoginCurrent.id,
                    password
                };
                this.modal_loading = true;
                updateLoginPwd(data).then(res => {
                    this.resetLoginCurrent = null;
                    this.resetLoginModal = false;
                    this.$Message.success("登录密码修改成功！");
                    this.queryUserList();
                }).catch(err => {
                    console.log(err);
                    this.$Message.error("登录密码修改失败！");
                });
            },
            handleSubmit(name) {
                this.$refs[name].validate((valid) => {
                    this.is_validate = valid;
                    if (valid) {
                        this.resetBankInfo();
                    } else {
                        this.$Message.error("注册失败!");
                    }
                });
            },
            resetBankInfo() {
                let data = this.formValidate;
                data.user_id = this.resetBankCurrent.id;
                this.modal_loading = true;
                updateBankInfo(data).then(res => {
                    this.resetCashCurrent = null;
                    this.resetBankModal = false;
                    this.modal_loading = false;
                    this.$Message.success("银行信息修改成功！");
                    this.queryUserList();
                }).catch(err => {
                    console.log(err);
                    this.$Message.error("银行信息修改失败！");
                });
            }
        }
    };
</script>

<style lang="less" scoped>
	@import "./../../assets/admin/components";
</style>
