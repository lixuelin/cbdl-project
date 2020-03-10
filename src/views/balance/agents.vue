<template>
  <div class="agents">
    <div class="agents-nothing" v-if="agent_list.length === 0">
      <p>暂无下级代理</p>
    </div>
    <div class="agents-show" v-else>
      <ul>
        <li>
          <span>代理级别</span>
          <span>代理商</span>
          <span>创建时间</span>
        </li>
        <template v-for="item in agent_list">
          <li :key="item.id">
            <span>{{item.agent_name}}</span>
            <span>{{item.household}}</span>
            <span>{{item.create_time}}</span>
          </li>
        </template>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "agents",
  data() {
    return {
      agent_list: [],
      agents: {}
    };
  },
  created() {
    this.getAgent();
    this.getNextAgents();
  },
  methods: {
    async getAgent() {
      try {
        let res = await this.$Http.queryAgentList();
        res.data.forEach(item => {
          this.agents[`name_${item.id}`] = item.name;
        });
      } catch (error) {
        this.$Message.error(`请求失败:${error}`);
      }
    },
    async getNextAgents() {
      let data = {
        id: localStorage.getItem("user_id")
      };
      let res;
      try {
        res = await this.$Http.queryNextAgents(data);
        res.data.forEach(item => {
          item["agent_name"] = this.agents[`name_${item.agent_id}`];
        });

        this.agent_list = res.data;
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
@import "./../../assets/css/agent.less";
</style>
