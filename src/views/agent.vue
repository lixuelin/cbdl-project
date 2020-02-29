<template>
  <div class="agent">
    <div class="agent-module">
      <h3>选择代理商</h3>
      <div class="agent-module-bank">
        <ul>
          <template v-for="(item, index) in agent_list">
            <li @click="checkAgent(item, index)" :key="item">
              <div
                :class="{'agent-module-bank-num': true,'agent-module-bank-checked': index === agent_index}"
              >
                <span>{{item.name | format_agent}}</span>
              </div>
            </li>
          </template>
        </ul>
      </div>
    </div>
    <div class="agent-module agent-module-abeam">
      <h3>推荐码</h3>
      <div class="agent-module-recommend">
        <Input type="text" v-model="recommend" placeholder="请输入邀请码"></Input>
      </div>
    </div>
    <template v-if="is_vip === '普通用户'">
      <div class="agent-module agent-module-abeam">
        <h3>我要当代理商</h3>
        <div class="agent-module-way">
          <ul>
            <li @click="joinAgent">
              <div class="agent-module-pay">
                <span>{{agent_check_pay[0]}}</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </template>
    <div class="agent-module">
      <h3>代理商协议</h3>
      <div class="agent-module-description">
        <p class="agent-module-description-title">白银代理一次性投资15000万</p>
        <p class="agent-module-description-title">黄金代理一次性投资30000万</p>
        <p class="agent-module-description-title">钻石代理一次性投资60000万</p>
        <p class="agent-module-description-title">代理商收益</p>
        <p class="agent-module-description-cont">白银代理拿团体盈利的百分之25</p>
        <p class="agent-module-description-cont">白银代理直推荐白银代理得5000和盈利的百分之20,间接拿一代2000</p>
        <p class="agent-module-description-cont">黄金代理直推白银代理得7000和盈利的百分之20,间接无限2000</p>
        <p class="agent-module-description-cont">黄金代理直推黄金代理得1万和拿盈利的百分之15，间接拿一代3000</p>
        <p class="agent-module-description-cont">钻石代理直推白银代理得1万和拿盈利的百分之20，间接拿无限1000</p>
        <p class="agent-module-description-cont">钻石代理直推黄金代理得1.6万和拿盈利的百分之15,间接拿无限3000</p>
        <p class="agent-module-description-cont">钻石代理直推荐钻石代理得2万和盈利的百分之10,间接拿一代1万</p>
      </div>
    </div>
    <div class="agent-sure">
      <div class="agent-sure-btn"></div>
    </div>
    <foot></foot>
    <Modal v-model="show_module" width="220">
      <p slot="header">
        <span>加入代理商</span>
      </p>
      <div>
        <p>请输入交易密码：</p>
        <div class="card-body-handler-password">
          <i-input v-model="cash_pwd" type="password" placeholder="请输入交易密码" style="width: 220px"></i-input>
        </div>
      </div>
      <div slot="footer">
        <i-button type="primary" long :loading="loading" @click="trade_Sure">
          <span>确定</span>
        </i-button>
      </div>
    </Modal>
  </div>
</template><script>
import Clipboard from "clipboard";
import card from "./../components/card_list";
import foot from "./../components/foot";

export default {
  name: "agent",
  data() {
    return {
      invest_show_way: false,
      show_module: false,
      balance_count: 0,
      show_text_trade: false,
      cash_pwd: "",
      agent_list: ["普通代理商", "黄金代理商", "钻石代理商"],
      agent_index: null,
      check_agent: null,
      agent_check_pay: ["余额转账"],
      is_sure: true,
      recommend: "",
      is_vip: "普通用户",
      super_agent: {}
    };
  },

  created() {
    this.getBalance();
    this.getAgent();
    this.is_vip = localStorage.getItem("is_vip");
  },

  filters: {
    format_agent(value) {
      return value + "商";
    }
  },

  components: {
    "card-view": card,
    foot
  },

  methods: {
    async getAgent() {
      try {
        let res = await this.$Http.queryAgentList();
        this.agent_list = res.data;
      } catch (error) {
        this.$Message.error(`请求失败:${error}`);
      }
    },

    checkAgent(item, index) {
      this.agent_index = index;
      this.check_agent = item;
    },
    async joinAgent() {
      if (this.agent_index === null) {
        return this.$Message.warning("请先选择一个代理商");
      }

      if (Number(this.balance_count) < Number(this.check_agent.cost)) {
        return this.$Message.warning("您的余额不足，请先去充值中心充值！");
      }

      if (this.recommend !== "") {
        let data = {
          invite_code: this.recommend
        };
        let res = await this.$Http.queryInviteAgent(data);

        if (res.success === false) {
          let msg = "请求错误";
          if (res.msg) {
            msg = res.msg;
          }
          return this.$Message.error(msg);
        }
        if (this.check_agent.id > res.data.id) {
          return this.$Message.warning(
            "当前选择代理商级别不能高于推荐代理商！"
          );
        }
        this.super_agent = res.data;
      }

      this.show_module = true;
    },
    async getBalance() {
      let data = {
        user_id: localStorage.getItem("user_id"),
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

    async trade_Sure() {
      if (this.cash_pwd === "") {
        return this.$Message.error("密码不能为空！");
      }

      let data = {
        id: localStorage.getItem("user_id"),
        cash_pwd: this.cash_pwd
      };

      this.loading = true;
      let res = null;

      try {
        res = await this.$Http.queryUser(data);
        this.createAgent();
      } catch (error) {
        this.loading = false;

        if (res.msg) {
          return this.$Message.error(`请求失败:${res.msg}`);
        }

        this.$Message.error(`请求失败:${error}`);
      }
    },

    async createAgent() {
      let data = {
        user_id: localStorage.getItem("user_id"),
        agent_id: this.check_agent.id,
        name: localStorage.getItem("username"),
        super_name: this.super_agent.super_name,
        super_agent: this.super_agent.id,
        super_user_id: this.super_agent.user_id
      };
      let res = null;
      try {
        res = await this.$Http.createAgent(data);
        this.loading = false;
        this.show_module = false;
        this.cash_pwd = "";
        this.$Message.success(`创建成功`);
      } catch (error) {
        this.loading = false;
        this.show_module = false;
        if (res.msg) {
          return this.$Message.error(`请求失败:${res.msg}`);
        }

        this.$Message.error(`请求失败:${error}`);
      }
    },
    modal_common(msg) {
      this.modal2 = true;
      this.modal_loading = true;
      this.invest_msg = msg;
    }
  }
};
</script><style lang="less"scoped>
@import "./../assets/css/agent.less";
</style>