<template>
	<div class="admin-main">
		<title-view :title="title"></title-view>
		<div class="admin-main-search">
			<div class="admin-main-search-box">
				<div class="admin-main-search-box-fields">
					<span>收益金额：</span> <Input v-model="search.username" placeholder="请输入收益金额" clearable
					                          style="width: 200px"/>
				</div>
				<div class="admin-main-search-box-fields">
					<span>总收益金额：</span> <Input v-model="search.card" placeholder="请输入总收益金额" clearable
					                           style="width: 200px"/>
				</div>
			</div>
			<div class="admin-main-search-box">
				<div class="admin-main-search-box-fields">
					<span>投资时间：</span>
					<DatePicker type="daterange" show-week-numbers
					            placement="bottom-end"
					            placeholder="Select date"
					            @on-change="changeDate"
					            style="width: 200px">
					</DatePicker>
				</div>
				<div class="admin-main-search-box-fields">
					<div class="admin-main-search-box-btns">
						<Button>搜索</Button>
						<Button>导出excel</Button>
					</div>
				</div>
			</div>
		</div>
		<div class="admin-main-flow">
			<Table stripe :columns="columns" :data="data"></Table>
			<div class="admin-main-flow-page">
				<Page :total="pageInfo.total" :current="pageInfo.currentPage"
				      :page-size="pageInfo.currentPageSize"
				      @on-change="changePage"/>
			</div>
		</div>
	</div>
</template>

<script>
    import { queryBonusEveryDay } from "./../../utils/admin_api";
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
                    ent_time: ""
                },
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
            };
        },
        components: {
            "title-view": pageTitle
        },
        mounted() {
            this.getBouns();
        },
        methods: {
            changePage(page) {
                this.pageInfo.currentPage = page;
                this.getInvestList();
            },
            changeDate(date) {
                console.log(date);
                this.search.start_time = date[0];
                this.search.end_time = date[1];
            },
            getBouns() {
                let data = {
                    start_time: this.search.start_time,
                    end_time: this.search.end_time,
                    currentPage: this.pageInfo.currentPage,
                    pageSize: this.pageInfo.currentPageSize
                };
                
                queryBonusEveryDay(data).then(response => {
                    if (response.data.data.bonusList.length > 0) {
                        this.data = response.data.data.bonusList;
                    }
                    this.pageInfo.userTotal = response.data.data.total;
                }).catch(error => {
                    this.$Message.error("获取每日奖金失败");
                });
            }
        }
    };
</script>

<style lang="less" scoped>
	@import "./../../assets/admin/components";
</style>
