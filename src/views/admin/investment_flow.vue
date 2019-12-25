<template>
    <div id="investment_flow" class="admin-main">
        <title-view :title="title"></title-view>
        <div class="investment_flow_financial">
            <div>
                <span>生态1号</span>
                <p>¥{{ financial.first.total }}</p>
            </div>
            <div>
                <span>剩余投资</span>
                <p>¥{{ financial.first.surplus }}</p>
            </div>
            <div>
                <span>已投资</span>
                <p>¥{{ financial.first.invest_num }}</p>
            </div>
        </div>
        <div class="investment_flow_financial">
            <div>
                <span>生态2号</span>
                <p>¥{{ financial.two.total }}</p>
            </div>
            <div>
                <span>剩余投资</span>
                <p>¥{{ financial.two.surplus }}</p>
            </div>
            <div>
                <span>已投资</span>
                <p>¥{{ financial.two.invest_num }}</p>
            </div>
        </div>
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
                    <span>银行卡号：</span>
                    <Input
                        v-model="search.card"
                        placeholder="请输入银行卡号"
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
            </div>
            <div class="admin-main-search-box">
                <div class="admin-main-search-box-fields">
                    <span>投资金额：</span>
                    <Select
                        v-model="search.invest_num"
                        placeholder="全部"
                        style="width:200px"
                    >
                        <Option value="">全部</Option>
                        <Option value="1000">1000</Option>
                        <Option value="5000">5000</Option>
                        <Option value="10000">10000</Option>
                        <Option value="30000">30000</Option>
                    </Select>
                </div>
                <div class="admin-main-search-box-fields">
                    <span>审核状态：</span>
                    <Select
                        v-model="search.invest_pay"
                        placeholder="全部"
                        style="width:200px"
                    >
                        <Option value="all">全部</Option>
                        <Option value="0">未审核</Option>
                        <Option value="1">已到账</Option>
                    </Select>
                </div>
                <div class="admin-main-search-box-fields">
                    <span>是否提现：</span>
                    <Select
                        v-model="search.cash_status"
                        placeholder="全部"
                        style="width:200px"
                    >
                        <Option value="all">全部</Option>
                        <Option value="1">已提现</Option>
                        <Option value="0">未提现</Option>
                    </Select>
                </div>
            </div>
            <div class="admin-main-search-box">
                <div class="admin-main-search-box-fields">
                    <span>所属银行：</span>
                    <Select
                        v-model="search.bank_name"
                        placeholder="全部"
                        style="width:200px"
                    >
                        <Option value="all">全部</Option>
                        <template v-for="bank in bankList">
                            <Option :value="bank.bank_name" :key="bank">{{
                                bank.bank_name
                            }}</Option>
                        </template>
                    </Select>
                </div>
                <div class="admin-main-search-box-fields">
                    <span>投资时间：</span>
                    <DatePicker
                        type="daterange"
                        show-week-numbers
                        placement="bottom-end"
                        placeholder="Select date"
                        @on-change="changeDate"
                        style="width: 200px"
                    >
                    </DatePicker>
                </div>
                <div class="admin-main-search-box-fields">
                    <div class="admin-main-search-box-btns">
                        <Button type="primary" @click="getInvestList"
                            >搜索</Button
                        >
                        <Button type="primary" @click="download"
                            >导出excel</Button
                        >
                    </div>
                </div>
            </div>
        </div>
        <div class="admin-main-flow">
            <Table :columns="columns" :data="invests"></Table>
            <div class="admin-main-flow-page">
                <Page
                    :total="pageInfo.total"
                    :current="pageInfo.currentPage"
                    :page-size="pageInfo.currentPageSize"
                    @on-change="changePage"
                />
            </div>
        </div>
        <Modal v-model="change_invest" width="460">
            <p slot="header" style="text-align:left">
                <span>确定实际金额</span>
            </p>
            <div class="admin-main-verify">
                <div class="admin-main-verify-line">
                    <label>用户择投资金额: </label
                    ><span>{{ invest_info.invest_num }}</span>
                </div>
                <div class="admin-main-verify-line">
                    <label>实际到账金额: </label
                    ><input
                        type="text"
                        v-model="invest_info.verify_num"
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
                    @click="verifyInvestNum"
                    >确认已到账
                </Button>
            </div>
        </Modal>
    </div>
</template>

<script>
import {
    queryInvestList,
    queryBanks,
    downloadEveryExecl,
    updateVerify
} from "./../../utils/admin_api";
import pageTitle from "./../../components/title";

export default {
    name: "investment_flow",
    data() {
        return {
            title: "投资日流水",
            search: {
                username: "",
                card: "",
                household: "",
                start_time: "",
                end_time: "",
                bank_name: "",
                cash_status: "",
                invest_pay: "",
                invest_num: ""
            },
            change_invest: false,
            invest_info: {
                invest_id: 0,
                invest_num: 100,
                verify_num: 0
            },
            pageInfo: {
                total: 10,
                currentPage: 1,
                currentPageSize: 10
            },
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
                    title: "投资金额",
                    key: "invest_num"
                },
                {
                    title: "实际投资",
                    key: "verify_num"
                },
                {
                    title: "理财类型",
                    key: "financial_type"
                },
                {
                    title: "操作",
                    key: "action",
                    width: 100,
                    align: "center",
                    render: (h, params) => {
                        if (params.row.verify_status === 0) {
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
                                                this.change_invest = true;
                                                this.invest_info.invest_num =
                                                    params.row.invest_num;
                                                this.invest_info.invest_id =
                                                    params.row.id;
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
                    title: "收益金额",
                    key: "income_num"
                },
                {
                    title: "收益状态",
                    key: "income_status"
                },
                {
                    title: "提现金额",
                    key: "stop_income"
                },
                {
                    title: "提现状态",
                    key: "cash_status"
                },
                {
                    title: "手续费",
                    key: "brokerage"
                },
                {
                    title: "支付方式",
                    key: "invest_pay"
                },
                {
                    title: "提现状态",
                    key: "cash_status"
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
                    title: "投资时间",
                    key: "verify_time"
                },
                {
                    title: "创建时间",
                    key: "create_time"
                }
            ],
            invests: [],
            bankList: [],
            financial: {
                first: {
                    total: 0,
                    invest_num: 0,
                    surplus: 0
                },
                two: {
                    total: 0,
                    invest_num: 0,
                    surplus: 0
                }
            }
        };
    },
    components: {
        "title-view": pageTitle
    },
    created() {
        this.queryBankList();
        this.getInvestList();
        this.getFinancialNum();
    },
    mounted() {},
    methods: {
        changePage(page) {
            this.pageInfo.currentPage = page;
            this.getInvestList();
        },
        changeDate(date) {
            this.search.start_time = date[0];
            this.search.end_time = date[1];
        },
        download() {
            window.location = "/invest/download_invest";
        },
        async getFinancialNum() {
            let res = null;
            try {
                res = await this.$Http.queryFinancialNum();
                this.financial.first.total = res.data.first.financial_count;
                this.financial.two.total = res.data.two.financial_count;
                this.financial.first.invest_num = res.data.first.invests;
                this.financial.two.invest_num = res.data.two.invests;
                this.financial.first.surplus =
                    res.data.first.financial_count - res.data.first.invests;
                this.financial.two.surplus =
                    res.data.two.financial_count - res.data.two.invests;
            } catch (error) {
                this.$Message.error(`请求失败: ${res.msg}`);
            }
        },
        async queryBankList() {
            let res = null;
            try {
                res = await this.$Http.queryUserBanks();
                this.bankList = res.data;
            } catch (error) {
                this.$Message.error(`请求失败: ${res.msg}`);
            }
        },
        async getInvestList() {
            let data = {
                username: this.search.username,
                card: this.search.card,
                household: this.search.household,
                bank_name: this.search.bank_name,
                start_time: this.search.start_time,
                end_time: this.search.end_time,
                currentPage: this.pageInfo.currentPage,
                pageSize: this.pageInfo.currentPageSize,
                invest_num: this.search.invest_num,
                invest_pay: this.search.invest_pay,
                cash_status: this.search.cash_status
            };
            let res = null;
            try {
                res = await this.$Http.queryAdminInvestList(data);
                this.invests = res.data.invests;
                this.pageInfo.total = res.data.total;
            } catch (error) {
                this.$Message.error(`请求失败: ${res.msg}`);
            }
        },
        async verifyInvestNum() {
            let data = {
                invest_id: this.invest_info.invest_id,
                verify_num: this.invest_info.verify_num
            };

            if (
                this.invest_info.verify_num <= 0 ||
                this.invest_info.verify_num === "" ||
                isNaN(this.invest_info.verify_num)
            ) {
                this.$Message.warning("请输入正确的投资金额！");
                return;
            }
            let res = null;
            try {
                res = await this.$Http.updateInvestVerify(data);
                this.change_invest = false;
                this.invest_info.verify_num = 0;
                this.invest_info.invest_id = null;
                this.$Message.success("修改成功！");
                this.getInvestList();
            } catch (error) {
                this.$Message.error(`请求失败: ${res.msg}`);
            }
        }
    }
};
</script>

<style lang="less" scoped>
@import "./../../assets/admin/components";
@import "./../../assets/admin/invest";
</style>
