<template>
  <div class="home">
    <header class="home-header">
      <div class="home-header-cont">
        <h1 class="home-header-cont-title">{{ this.$menu.name }}</h1>
      </div>
    </header>
    <router-view v-if="isRouterAlive"></router-view>
    <div class="home-foot">
      <ul>
        <li v-for="(item, index) in menu" :key="item.name" @click="checkedPage(item, index)">
          <template v-if="item.route == '/pay'">
            <a>
              <div
                :class="{
                                'home-foot-menu': true,
                                'home-foot-active': menu_active === index
                            }"
              >
                <div>
                  <span :class="item.type"></span>
                </div>
                <span>{{ item.name }}</span>
              </div>
            </a>
          </template>
          <template v-else>
            <router-link :to="item.route">
              <div
                :class="{
                                'home-foot-menu': true,
                                'home-foot-active': menu_active === index
                            }"
              >
                <div>
                  <span :class="item.type"></span>
                </div>
                <span>{{ item.name }}</span>
              </div>
            </router-link>
          </template>
        </li>
      </ul>
    </div>
    <Modal v-model="choosePay" width="220" class="pay-model">
      <p slot="header">
        <span>选择支付类型</span>
      </p>
      <div class="pay-model-body">
        <div class="pay-model-type" @click="goToPay(2)">商家付款</div>
        <div class="pay-model-type" @click="goToPay(1)">个人付款</div>
      </div>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
export default {
  name: "home",
  provide() {
    return {
      reload: this.reload
    };
  },
  data() {
    return {
      title: "首页",
      menu_active: 0,
      choosePay: false,
      menu: [
        {
          name: "首页",
          type: "iconfont icon-home",
          route: "/home"
        },
        {
          name: "支付",
          type: "iconfont icon-funds-line",
          route: "/pay"
        },
        {
          name: "奖金",
          type: "iconfont icon-Dollar",
          route: "/bonus"
        },
        {
          name: "余额",
          type: "iconfont icon-Dollar",
          route: "/balance"
        }
      ],
      isRouterAlive: true
    };
  },
  mounted() {
    this.title = this.$menu.name;
  },
  methods: {
    goToPay(type) {
      let title = "优惠加油";
      let description = "中国供销汽油";
      if (type === 1) {
        title = "转账";
        description = "通过输入用户账号转给其他人，3分钟未到账，请及时联系客服";
      }
      this.$router.push({
        name: "pay",
        query: {
          pay_type: type
        },
        params: {
          title,
          description
        }
      });
      this.choosePay = false;
      this.menu_active = 1;
      this.title = "支付";
      this.$menu.index = 1;
      this.$menu.name = "支付";
    },
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(function() {
        this.isRouterAlive = true;
      });
    },
    checkedPage(item, index) {
      if (this.$route.path === "/pay") {
        return;
      }
      if (item.route === "/pay") {
        this.choosePay = true;
        return;
      }
      this.menu_active = index;
      this.title = item.name;
      this.$menu.index = index;
      this.$menu.name = item.name;
    }
  }
};
</script>

<style lang="less" scoped>
@import "./../assets/css/home";
</style>
<style lang="css" scoped>
@import "./../assets/fonts/iconfont.css";
</style>
