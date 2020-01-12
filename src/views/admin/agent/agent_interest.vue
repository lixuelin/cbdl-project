<template>
    <div class="admin-main">
        <title-view :title="title"></title-view>
        <div class="admin-main-search">
            <div class="admin-main-search-box">
                <div class="admin-main-search-box-fields">
                    <span>代理商：</span>
                    <Input
                        v-model="search.name"
                        placeholder="请输入代理商"
                        clearable
                        style="width: 200px"
                    />
                </div>
                <div class="admin-main-search-box-fields">
                    <span>上级代理：</span>
                    <Input
                        v-model="search.super_name"
                        placeholder="请输入下级代理"
                        clearable
                        style="width: 200px"
                    />
                </div>
                <div class="admin-main-search-box-fields">
                    <div class="admin-main-search-box-btns">
                        <Button type="primary" @click="getAgents(1)"
                            >搜索</Button
                        >
                    </div>
                </div>
            </div>
        </div>
        <div>
            <Table stripe :columns="columns" :data="agents"></Table>
            <div class="admin-main-flow-page">
                <Page
                    :total="pageInfo.userTotal"
                    :current="pageInfo.currentPage"
                    :page-size="pageInfo.currentPageSize"
                    @on-change="changePage"
                />
            </div>
        </div>
    </div>
</template>

<script>
import pageTitle from "./../../../components/title";

export default {
    name: "agent_manager",
    data() {
        return {
            title: "代理商列表",
            search: {
                name: "",
                super_name: ""
            },
            columns: [
                {
                    title: "#",
                    key: "index_num",
                    width: 56
                },
                {
                    title: "代理商",
                    key: "super_name"
                },
                {
                    title: "下级代理商",
                    key: "sub_name"
                },
                {
                    title: "下级代理级别",
                    key: "agent_name"
                },
                {
                    title: "收益",
                    key: "agent_num"
                },
                {
                    title: "收益基础",
                    key: "agent_base"
                },
                {
                    title: "收益比例",
                    key: "agent_rate"
                },
                {
                    title: "创建时间",
                    key: "create_time"
                }
            ],
            agents: [],
            pageInfo: {
                agentTotal: 10,
                currentPage: 1,
                currentPageSize: 10
            }
        };
    },
    components: {
        "title-view": pageTitle
    },
    created() {
        this.getAgents();
    },
    methods: {
        async getAgents(init_page) {
            let data = {
                name: this.search.name,
                super_name: this.search.super_name,
                start_time: this.search.start_time,
                end_time: this.search.end_time,
                currentPage: init_page ? init_page : this.pageInfo.currentPage,
                pageSize: this.pageInfo.currentPageSize
            };
            let res = null;
            try {
                res = await this.$Http.queryAgentInterest(data);
                this.agents = res.data.agents;
                this.pageInfo.agentTotal = res.data.total;
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
@import "./../../../assets/admin/components";
</style>
