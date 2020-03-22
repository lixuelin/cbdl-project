<template>
    <div class="admin-main">
        <title-view :title="title"></title-view>
        <div class="admin-main-search">
            <div class="admin-main-search-box">
                <div class="admin-main-search-box-fields">
                    <span>用户账号：</span>
                    <Input
                        v-model="search.username"
                        placeholder="请输入用户账号"
                        clearable
                        style="width: 200px"
                    />
                </div>
                <div class="admin-main-search-box-fields">
                    <span>户主姓名：</span>
                    <Input
                        v-model="search.household"
                        placeholder="请输入户主名称"
                        clearable
                        style="width: 200px"
                    />
                </div>
                <div class="admin-main-search-box-fields">
                    <span>审核状态：</span>
                    <Select
                        v-model="search.status"
                        placeholder="全部"
                        style="width:200px"
                    >
                        <Option value="all">全部</Option>
                        <Option value="0">未审核</Option>
                        <Option value="1">已到账</Option>
                    </Select>
                </div>
            </div>
            <div class="admin-main-search-box">
                <div class="admin-main-search-box-fields">
                    <span>金额类型：</span>
                    <Select
                        v-model="search.type"
                        placeholder="全部"
                        style="width:200px"
                    >
                        <Option value="all">全部</Option>
                        <Option value="0">充值</Option>
                        <Option value="1">理财回收</Option>
                        <Option value="2">提现</Option>
                    </Select>
                </div>
                <div class="admin-main-search-box-fields">
                    <span>充值时间：</span>
                    <DatePicker
                        type="daterange"
                        show-week-numbers
                        placement="bottom-end"
                        placeholder="Select date"
                        @on-change="changeDate"
                        style="width: 200px"
                    ></DatePicker>
                </div>
                <div class="admin-main-search-box-fields">
                    <div class="admin-main-search-box-btns">
                        <Button type="primary" @click="getBalance(1)"
                            >搜索</Button
                        >
                    </div>
                </div>
            </div>
        </div>
        <div class="admin-main-flow">
            <Table :columns="columns" :data="deposit_list"></Table>
            <div class="admin-main-flow-page">
                <Page
                    :total="pageInfo.total"
                    :current="pageInfo.currentPage"
                    :page-size="pageInfo.currentPageSize"
                    @on-change="changePage"
                />
            </div>
        </div>
        <Modal v-model="change_deposit" width="460">
            <p slot="header" style="text-align:left">
                <span>确定实际金额</span>
            </p>
            <div class="admin-main-verify">
                <div class="admin-main-verify-line">
                    <label>用户充值金额:</label>
                    <span>{{ deposit_info.deposit_num }}</span>
                </div>
                <div class="admin-main-verify-line">
                    <label>实际到账金额:</label>
                    <input
                        type="text"
                        v-model="deposit_info.reality_num"
                        placeholder="请输入实际到账金额！"
                    />
                </div>
            </div>
            <div slot="footer">
                <Button
                    type="primary"
                    size="large"
                    long
                    :loading="modal_loading"
                    @click="updateDeposit"
                    >确认已到账</Button
                >
            </div>
        </Modal>
    </div>
</template>

<script>
import pageTitle from "./../../components/title";
export default {
    name: "deposit",
    data() {
        return {
            title: "充值记录",
            search: {
                username: "",
                household: "",
                start_time: "",
                end_time: "",
                status: "",
                type: ""
            },
            pageInfo: {
                total: 10,
                currentPage: 1,
                currentPageSize: 10
            },
            modal_loading: false,
            deposit_info: {
                id: 0,
                reality_num: 100,
                deposit_num: 0
            },
            change_deposit: false,
            columns: [
                {
                    title: "#",
                    key: "index_num",
                    width: 54
                },
                {
                    title: "用户账号",
                    key: "username"
                },
                {
                    title: "户主",
                    key: "household"
                },
                {
                    title: "充值金额",
                    key: "deposit_num"
                },
                {
                    title: "实际充值",
                    key: "reality_num"
                },
                {
                    title: "审核状态",
                    key: "status",
                    width: 100,
                    align: "center",
                    render: (h, params) => {
                        if (params.row.status === 0) {
                            return h("div", [
                                h(
                                    "Button",
                                    {
                                        props: {
                                            type: "primary",
                                            size: "small"
                                        },
                                        style: {
                                            marginRight: "5px"
                                        },
                                        on: {
                                            click: () => {
                                                this.change_deposit = true;
                                                this.deposit_info.deposit_num =
                                                    params.row.deposit_num;
                                                this.deposit_info.reality_num =
                                                    params.row.deposit_num;
                                                this.deposit_info.id =
                                                    params.row.id;
                                                this.deposit_info.user_id =
                                                    params.row.user_id;
                                                this.deposit_info.type =
                                                    params.row.type;
                                            }
                                        }
                                    },
                                    "未审核"
                                )
                            ]);
                        } else {
                            return h("div", [
                                h(
                                    "span",
                                    {
                                        props: {
                                            type: "primary",
                                            size: "small"
                                        },
                                        style: {
                                            marginRight: "5px"
                                        },
                                        on: {}
                                    },
                                    "已到账"
                                )
                            ]);
                        }
                    }
                },
                {
                    title: "银行名称",
                    key: "bank_name"
                },
                {
                    title: "银行卡号",
                    key: "card"
                },
                {
                    title: "金额类型",
                    key: "type"
                },
                {
                    title: "到账时间",
                    key: "account_time"
                },
                {
                    title: "投资时间",
                    key: "invest_time"
                },
                {
                    title: "创建时间",
                    key: "create_time"
                }
            ],
            deposit_list: []
        };
    },
    components: {
        "title-view": pageTitle
    },
    created() {
        this.getBalance();
    },
    methods: {
        async getBalance(init_page) {
            let data = this.search;
            data.pageSize = this.pageInfo.currentPageSize;
            data.currentPage = init_page
                ? init_page
                : this.pageInfo.currentPage;
            let res = null;
            try {
                res = await this.$Http.queryBalanceAdmin(data);
                this.deposit_list = res.data.balance_list;
                this.pageInfo.total = res.data.total;
            } catch (error) {
                if (res.msg) {
                    return this.$Message.error(`请求失败:${res.msg}`);
                }
                this.$Message.error(`请求失败:${error}`);
            }
        },
        changePage(page) {
            this.pageInfo.currentPage = page;
            this.getBalance();
        },
        changeDate(date) {
            this.search.start_time = date[0];
            this.search.end_time = date[1];
        },
        async updateDeposit() {
            if (Number(this.deposit_info.reality_num) <= 0) {
                return this.$Message.error("请输入准确的数值！");
            }
            let data = this.deposit_info;
            data.operator = localStorage.getItem("username");
            this.modal_loading = true;
            let res = null;
            try {
                res = await this.$Http.updateBalance(data);
                this.$Message.success("操作成功！");
                this.modal_loading = false;
                this.change_deposit = false;
                this.getBalance();
                this.deposit_info.reality_num = "";
            } catch (error) {
                this.modal_loading = false;
                this.change_deposit = false;
                this.deposit_info.reality_num = "";
                if (res.msg) {
                    return this.$Message.error(`请求失败:${res.msg}`);
                }
                this.$Message.error(`请求失败:${error}`);
            }
        }
    }
};
</script>

<style lang="less" scoped>
@import "./../../assets/admin/components";
</style>
