<template>
    <div class="admin-main">
        <title-view :title="title"></title-view>
        <div class="admin-main-search">
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
                        <Button type="primary" @click="search_bonus"
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
                    <h4>{{ team.title }}</h4>
                    <Table
                        stripe
                        :columns="team.columns"
                        :data="team.data"
                    ></Table>
                    <div class="admin-main-flow-page">
                        <Page
                            :total="team.pageInfo.total"
                            :current="team.pageInfo.currentPage"
                            :page-size="team.pageInfo.currentPageSize"
                            @on-change="changePage"
                        />
                    </div>
                </div>
                <div class="admin-main-flow-table-box">
                    <h4>{{ team_share.title }}</h4>
                    <Table
                        stripe
                        :columns="team_share.columns"
                        :data="team_share.data"
                    ></Table>
                    <div class="admin-main-flow-page">
                        <Page
                            :total="team_share.pageInfo.total"
                            :current="team_share.pageInfo.currentPage"
                            :page-size="team_share.pageInfo.currentPageSize"
                            @on-change="changePage"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {
    queryBonusEveryDay,
    queryNextBonusEveryDay
} from "./../../utils/admin_api";
import pageTitle from "./../../components/title";

export default {
    name: "bonus_summary",
    data() {
        return {
            title: "奖金汇总",
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
            team: {
                title: "团队奖金统计",
                pageInfo: {
                    total: 10,
                    currentPage: 1,
                    currentPageSize: 15
                },
                columns: [
                    {
                        title: "奖金到账时间",
                        key: "create_time"
                    },
                    {
                        title: "奖金金额",
                        key: "bonus_sum"
                    },
                    {
                        title: "用户数量",
                        key: "bonus_count"
                    }
                ],
                data: []
            },
            team_share: {
                title: "团队分享奖金统计",
                pageInfo: {
                    total: 10,
                    currentPage: 1,
                    currentPageSize: 15
                },
                columns: [
                    {
                        title: "奖金到账时间",
                        key: "create_time"
                    },
                    {
                        title: "奖金金额",
                        key: "bonus_sum"
                    },
                    {
                        title: "用户数量",
                        key: "bonus_count"
                    }
                ],
                data: []
            }
        };
    },
    components: {
        "title-view": pageTitle
    },
    mounted() {
        this.getBouns();
        this.getNextBouns();
    },
    methods: {
        changePage(page) {
            this.team.pageInfo.currentPage = page;
            this.getInvestList();
        },
        changeDate(date) {
            this.search.start_time = date[0];
            this.search.end_time = date[1];
        },
        async getBouns() {
            let data = {
                start_time: this.search.start_time,
                end_time: this.search.end_time,
                currentPage: this.team.pageInfo.currentPage,
                pageSize: this.team.pageInfo.currentPageSize
            };
            let res = null;
            try {
                res = await this.$Http.queryBonusEveryDay(data);
                this.team.data = res.data.bonusList;
                this.team.pageInfo.userTotal = res.data.total;
            } catch (error) {
                this.$Message.error(`请求失败:${res.msg}`);
            }
        },
        async getNextBouns() {
            let data = {
                start_time: this.search.start_time,
                end_time: this.search.end_time,
                currentPage: this.team_share.pageInfo.currentPage,
                pageSize: this.team_share.pageInfo.currentPageSize
            };
            let res = null;
            try {
                res = await this.$Http.queryNextBonusEveryDay(data);
                this.team_share.data = res.data.bonusList;
                this.team_share.pageInfo.userTotal = res.data.total;
            } catch (error) {
                this.$Message.error(`请求失败:${res.msg}`);
            }
        },
        search_bonus() {
            this.getBouns();
            this.getNextBouns();
        }
    }
};
</script>

<style lang="less" scoped>
@import "./../../assets/admin/components";
</style>
