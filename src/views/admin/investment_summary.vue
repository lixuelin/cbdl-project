<template>
    <div class="admin-main">
        <title-view :title="title"></title-view>
        <div class="admin-main-search">
            <div class="admin-main-search-box">
                <div class="admin-main-search-box-fields">
                    <span>收益金额：</span>
                    <Input
                        v-model="search.username"
                        placeholder="请输入用户账号"
                        clearable
                        style="width: 200px"
                    />
                </div>
                <div class="admin-main-search-box-fields">
                    <span>总收益金额：</span>
                    <Input
                        v-model="search.card"
                        placeholder="请输入银行卡号"
                        clearable
                        style="width: 200px"
                    />
                </div>
            </div>
            <div class="admin-main-search-box">
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
                        <Button type="primary" @click="getInvestEveryday(1)"
                            >搜索</Button
                        >
                        <Button type="primary">导出excel</Button>
                    </div>
                </div>
            </div>
        </div>
        <div class="admin-main-flow">
            <div class="admin-main-flow-table">
                <div class="admin-main-flow-table-box">
                    <Table stripe :columns="columns" :data="invests"></Table>
                    <div class="admin-main-flow-page">
                        <Page
                            :total="invest_pageInfo.total"
                            :current="invest_pageInfo.currentPage"
                            :page-size="invest_pageInfo.currentPageSize"
                            @on-change="changePage"
                        />
                    </div>
                </div>
                <div class="admin-main-flow-table-box">
                    <Table
                        stripe
                        :columns="columns_income"
                        :data="incomes"
                    ></Table>
                    <div class="admin-main-flow-page">
                        <Page
                            :total="income_pageInfo.total"
                            :current="income_pageInfo.currentPage"
                            :page-size="income_pageInfo.currentPageSize"
                            @on-change="changePageIncome"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import pageTitle from "./../../components/title";

export default {
    name: "investment_summary",
    data() {
        return {
            title: "投资汇总",
            search: {
                username: "",
                card: "",
                master: "",
                cash: "",
                pay: "",
                invest_num: "",
                start_time: "",
                end_time: ""
            },
            invest_pageInfo: {
                total: 10,
                currentPage: 1,
                currentPageSize: 10
            },
            income_pageInfo: {
                total: 10,
                currentPage: 1,
                currentPageSize: 10
            },
            columns: [
                {
                    title: "投资时间",
                    key: "create_time"
                },
                {
                    title: "总投资金额",
                    key: "invest_sum"
                },
                {
                    title: "投资笔数",
                    key: "invest_count"
                }
            ],
            invests: [],
            columns_income: [
                {
                    title: "投资时间",
                    key: "create_time"
                },
                {
                    title: "总投资收益",
                    key: "income_num"
                },
                {
                    title: "收益笔数",
                    key: "income_count"
                }
            ],
            incomes: []
        };
    },
    components: {
        "title-view": pageTitle
    },
    mounted() {
        this.getInvestEveryday();
        this.getIncomeEveryday();
    },
    methods: {
        changePage(page) {
            this.invest_pageInfo.currentPage = page;
            this.getInvestEveryday();
        },
        changePageIncome(page) {
            this.income_pageInfo.currentPage = page;
            this.getIncomeEveryday();
        },
        changeDate(date) {
            this.search.start_time = date[0];
            this.search.end_time = date[1];
        },
        async getInvestEveryday(init_page) {
            let data = {
                start_time: this.search.start_time,
                end_time: this.search.end_time,
                currentPage: init_page
                    ? init_page
                    : this.invest_pageInfo.currentPage,
                pageSize: this.invest_pageInfo.currentPageSize
            };
            let res = null;
            try {
                res = await this.$Http.queryInvestEveryDay(data);
                this.invests = res.data.invests;
                this.invest_pageInfo.total = res.data.total;
            } catch (error) {
                if (res.msg) {
                    return this.$Message.error(`请求失败:${res.msg}`);
                }
                this.$Message.error(`请求失败:${error}`);
            }
        },
        async getIncomeEveryday() {
            let data = {
                start_time: this.search.start_time,
                end_time: this.search.end_time,
                currentPage: this.income_pageInfo.currentPage,
                pageSize: this.income_pageInfo.currentPageSize
            };
            let res = null;
            try {
                res = await this.$Http.queryIncomeEveryDay(data);
                this.incomes = res.data.incomes;
                this.income_pageInfo.total = res.data.total;
            } catch (error) {
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
