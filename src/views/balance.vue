<template>
  <div class="balance">
    <div class="balance-header">
      <div class="balance-header-user">
        <h1>{{ userInfo.name }}</h1>
      </div>
      <div class="balance-header-photo">
        <div class="balance-header-photo-box">
          <img src="./../assets/image/photo.jpg" alt />
        </div>
      </div>
    </div>
    <div class="balance-property">
      <div class="balance-property-content">
        <p class="balance-property-content-title">我的余额</p>
        <p class="balance-property-content-num">
          ¥
          <countTo
            :startVal="total.startVal"
            :endVal="total.endVal"
            :duration="total.speed"
            :decimals="total.float"
          ></countTo>
        </p>
        <div class="balance-property-content-btn">
          <button @click="goToDeposit">转账</button>
          <button @click="goToCash">提现</button>
        </div>
      </div>
    </div>
    <menu-view class="balance-menu" :menu="menu" :isLogin="is_login"></menu-view>
    <foot></foot>
  </div>
</template>

<script>
import countTo from "vue-count-to";
import menuView from "./../components/menu_card";
import foot from "./../components/foot";
export default {
  name: "balance",
  data() {
    return {
      is_login: false,
      userInfo: {
        name: "李雪莉",
        photo: "./../assets/image/photo.jpeg",
        income: 100,
        bonus: 20
      },
      total: {
        startVal: 0,
        endVal: 23434.45,
        duration: 100,
        float: 2
      },
      menu: [
        {
          name: "下级代理",
          type: "iconfont icon-credit-card",
          route: "/agents"
        },
        {
          name: "转账记录",
          type: "iconfont icon-credit-card",
          route: "/deposit_note"
        },
        {
          name: "提现记录",
          type: "iconfont icon-icon_eye",
          route: "/cash_note"
        }
      ]
    };
  },
  components: {
    menuView,
    countTo,
    foot
  },
  mounted() {
    this.isLogin();
    this.getBalance();
  },
  methods: {
    isLogin() {
      if (localStorage.getItem("username")) {
        this.is_login = true;
        this.userInfo.name = localStorage.getItem("username");
      }
    },
    async getBalance() {
      let data = {
        user_id: localStorage.getItem("user_id")
      };
      let res = null;
      try {
        res = await this.$Http.queryBalanceTotal(data);
        this.total.endVal = res.data.count;
      } catch (error) {
        if (res.msg) {
          return this.$Message.error(`请求失败:${res.msg}`);
        }
        this.$Message.error(`请求失败:${error}`);
      }
    },
    goToDeposit() {
      this.$router.push({ path: "/deposit" });
    },
    goToCash() {
      this.$router.push({
        path: "/cash_out",
        query: {
          num: this.total.endVal.toFixed(1)
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
@import url("./../assets/css/balance");
</style>
