<template>
  <div class="admin-main">
    <title-view :title="title"></title-view>
    <div class="admin-main-search">
      <div class="admin-main-search-box">
        <div class="admin-main-search-box-fields">
          <span>代理商：</span>
          <Input v-model="search.name" placeholder="请输入代理商" clearable style="width: 200px" />
        </div>
        <div class="admin-main-search-box-fields">
          <span>上级代理：</span>
          <Input v-model="search.super_name" placeholder="请输入上级代理" clearable style="width: 200px" />
        </div>
        <div class="admin-main-search-box-fields">
          <div class="admin-main-search-box-btns">
            <Button type="primary" @click="getAgents(1)">搜索</Button>
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
          key: "name"
        },
        {
          title: "上级代理",
          key: "super_name"
        },
        {
          title: "代理级别",
          key: "agent_level"
        },
        {
          title: "审核状态",
          key: "is_pass",
          render: (h, params) => {
            if (params.row.is_pass === 0) {
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
                      click: async () => {
                        await this.getBalance(params.row.user_id);
                        this.updateAgent(params.row);
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
                  "已审核"
                )
              ]);
            }
          }
        },
        {
          title: "代理商升级",
          key: "is_pass",
          render: (h, params) => {
            if (params.row.agent_id !== 3) {
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
                      click: async () => {
                        await this.getBalance(params.row.user_id);
                        this.updateAgent(params.row);
                      }
                    }
                  },
                  "是否升级"
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
                  ""
                )
              ]);
            }
          }
        },
        {
          title: "注册时间",
          key: "create_time"
        }
      ],
      agents: [],
      pageInfo: {
        agentTotal: 10,
        currentPage: 1,
        currentPageSize: 10
      },
      balance_count: 0,
      agent_list: {}
    };
  },
  components: {
    "title-view": pageTitle
  },
  created() {
    this.getAgents();
    this.getAgent();
  },
  methods: {
    async getAgent() {
      try {
        let res = await this.$Http.queryAgentList();
        res.data.forEach(item => {
          this.agent_list[item.id] = item.cost;
        });
        console.log(this.agent_list, "ss");
      } catch (error) {
        this.$Message.error(`请求失败:${error}`);
      }
    },
    async getBalance(user_id) {
      let data = {
        user_id: user_id,
        is_cash: 1
      };

      let res = null;
      try {
        res = await this.$Http.queryBalanceTotal(data);
        this.balance_count = res.data.count;
      } catch (error) {
        if (res.msg) {
          return this.$Message.error(`请求失败:${res.msg}`);
        }

        this.$Message.error(`请求失败:${error}`);
      }
    },
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
        res = await this.$Http.queryAdminAgents(data);
        this.agents = res.data.agents;
        this.pageInfo.agentTotal = res.data.total;
      } catch (error) {
        if (res.msg) {
          return this.$Message.error(`请求失败:${res.msg}`);
        }
        this.$Message.error(`请求失败:${error}`);
      }
    },
    async updateAgent(agent) {
      let agent_many = this.agent_list[agent.agent_id];
      if (this.balance_count < agent_many) {
        return this.$Message.warning(`当前用户余额不足！请提醒充值`);
      }

      let data = {
        id: agent.id,
        is_super: false,
        user_id: agent.user_id,
        agent_id: agent.agent_id,
        super_agent: agent.super_agent,
        super_user_id: agent.super_user_id,
        balance_num: agent_many
      };

      if (agent.super_name !== "") {
        data.is_super = true;
      }

      try {
        let res = await this.$Http.updateAgent(data);
        if (res.success === false) {
          return this.$Message.error(`请求失败:${res.msg}`);
        }
        this.$Message.success("审核成功");
        this.getAgents();
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
