<template>
    <div id="investment_flow" class="admin-main">
        <title-view :title="title"></title-view>
        <div class="admin-main-search">
            <div class="admin-main-search-box">
                <div class="admin-main-search-box-fields">
                    <span>分享人账号：</span>
                    <Input
                        v-model="search.username"
                        placeholder="请输入分享人账号"
                        clearable
                        style="width: 200px"
                    />
                </div>
                <div class="admin-main-search-box-fields">
                    <span>分享人姓名：</span>
                    <Input
                        v-model="search.household"
                        placeholder="请输入分享人姓名"
                        clearable
                        style="width: 200px"
                    />
                </div>
                <div class="admin-main-search-box-fields">
                    <span>下层账号：</span>
                    <Input
                        v-model="search.lower_household"
                        placeholder="请输入下层账号"
                        clearable
                        style="width: 200px"
                    />
                </div>
            </div>
            <div class="admin-main-search-box">
                <div class="admin-main-search-box-fields">
                    <span>下层姓名：</span>
                    <Input
                        v-model="search.lower_username"
                        placeholder="请输入下层姓名"
                        clearable
                        style="width: 200px"
                    />
                </div>
                <div class="admin-main-search-box-fields">
                    <span>下下层账号：</span>
                    <Input
                        v-model="search.lower_lower_username"
                        placeholder="请输入下下层账号"
                        clearable
                        style="width: 200px"
                    />
                </div>
                <div class="admin-main-search-box-fields">
                    <span>下下层姓名：</span>
                    <Input
                        v-model="search.lower_lower_household"
                        placeholder="请输入下下层姓名"
                        clearable
                        style="width: 200px"
                    />
                </div>
            </div>
            <div class="admin-main-search-box">
                <div class="admin-main-search-box-fields">
                    <span>分享人投资金额：</span>
                    <Select
                        v-model="search.invest_num"
                        placeholder="全部"
                        style="width:200px"
                    >
                        <Option value="all">全部</Option>
                        <Option value="1000">1000</Option>
                        <Option value="5000">5000</Option>
                        <Option value="10000">10000</Option>
                        <Option value="30000">30000</Option>
                    </Select>
                </div>
                <div class="admin-main-search-box-fields">
                    <span>分享时间：</span>
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
                        <Button type="primary" @click="getBonusList"
                            >搜索</Button
                        >
                        <Button type="primary">导出excel</Button>
                    </div>
                </div>
            </div>
        </div>
        <div class="admin-main-flow">
            <Table stripe :columns="columns" :data="data"></Table>
            <div class="admin-main-flow-page">
                <Page
                    :total="pageInfo.total"
                    :current="pageInfo.currentPage"
                    :page-size="pageInfo.currentPageSize"
                    @on-change="changePage"
                />
            </div>
        </div>
    </div>
</template>

<script>
import pageTitle from "./../../components/title";

export default {
    name: "bonus_flow",
    data() {
        return {
            title: "奖金日流水",
            search: {
                username: "",
                household: "",
                lower_username: "",
                lower_household: "",
                lower_lower_username: "",
                lower_lower_household: "",
                invest_num: "",
                start_time: "",
                end_time: ""
            },
            pageInfo: {
                total: 10,
                currentPage: 1,
                currentPageSize: 10
            },
            columns: [
                {
                    title: "分享人账号",
                    key: "username"
                },
                {
                    title: "分享人姓名",
                    key: "household"
                },
                {
                    title: "分享人获得奖金",
                    key: "bonus_num"
                },
                {
                    title: "奖金比例",
                    key: "bonus_rate"
                },
                {
                    title: "下层账号",
                    key: "lower_username"
                },
                {
                    title: "下层姓名",
                    key: "lower_household"
                },
                {
                    title: "下下层分享人账号",
                    key: "lower_lower_username"
                },
                {
                    title: "下下层分享人姓名",
                    key: "lower_lower_household"
                },
                {
                    title: "下下层分享人投资金额",
                    key: "invest_num"
                },
                {
                    title: "下下层分享投资时间",
                    key: "create_time"
                }
            ],
            data: []
        };
    },
    components: {
        "title-view": pageTitle
    },
    mounted() {
        this.getBonusList();
    },
    methods: {
        changePage(page) {
            this.pageInfo.currentPage = page;
            this.getBonusList();
        },
        changeDate(date) {
            this.search.start_time = date[0];
            this.search.end_time = date[1];
        },
        async getBonusList() {
            let data = {
                username: this.search.username,
                household: this.search.household,
                lower_username: this.search.lower_username,
                lower_household: this.search.lower_household,
                lower_lower_username: this.search.lower_lower_username,
                lower_lower_household: this.search.lower_lower_household,
                invest_num: this.search.invest_num,
                start_time: this.search.start_time,
                end_time: this.search.end_time,
                currentPage: this.pageInfo.currentPage,
                pageSize: this.pageInfo.currentPageSize
            };
            let res = null;
            try {
                res = await this.$Http.queryBonusAdminSecond(data);
                this.data = res.data.bonus;
                this.pageInfo.total = res.data.total;
            } catch (error) {
                this.$Message.error(`请求失败:${res.msg}`);
            }
        }
    }
};
</script>

<style lang="less" scoped>
@import "./../../assets/admin/components";
</style>
