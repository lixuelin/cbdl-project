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
            </div>
            <div class="admin-main-search-box">
                <div class="admin-main-search-box-fields">
                    <span>收益时间：</span>
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
    </div>
</template>

<script>
import pageTitle from "./../../components/title";
export default {
    name: "deposit",
    data() {
        return {
            title: "余额日流水",
            search: {
                username: "",
                household: "",
                start_time: "",
                end_time: ""
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
                    title: "收益金额",
                    key: "deposit_num"
                },
                {
                    title: "余额",
                    key: "balance_interest"
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
                res = await this.$Http.queryBalanceIncome(data);
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
        }
    }
};
</script>

<style lang="less" scoped>
@import "./../../assets/admin/components";
</style>
