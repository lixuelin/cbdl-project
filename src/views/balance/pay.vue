<template>
  <div class="pay">
    <h1 class="pay-title">{{title}}</h1>
    <article class>
      <p>{{description}}</p>
      <div class="pay-form">
        <template v-if="pay_type === info.business">
          <pay-business :total="total" @submitPay="payMoney"></pay-business>
        </template>
        <template v-else>
          <pay-person :total="total" @submitPay="payMoney"></pay-person>
        </template>
      </div>
    </article>
    <template></template>
  </div>
</template>

<script>
import { setCookie } from "./../../utils/cookie";
import PayBusiness from "./components/pay_business";
import PayPerson from "./components/pay_person";
export default {
  name: "pay",
  data() {
    return {
      title: "",
      description: "",
      info: {
        person: 1,
        business: 2
      },
      pay_type: 2,
      current_user: localStorage.getItem("username")
    };
  },
  created() {
    this.title = this.$route.params.title;
    this.description = this.$route.params.description;
    this.pay_type = this.$route.query.pay_type;
  },
  components: {
    PayBusiness,
    PayPerson
  },
  mounted() {},
  methods: {
    async payMoney(params) {
      let data = {
        user_id: Number(localStorage.getItem("user_id")),
        username: localStorage.getItem("username"),
        pay_type: this.pay_type
      };
      let final_params = Object.assign(data, params);
      this.loading = true;
      console.log(final_params, "data");
      // return;
      let res = null;
      try {
        res = await this.$Http.createTransferAccount(data);
        if (!res.success) {
          return this.$Message.error(`请求失败:${res.msg}`);
        }
        this.$Message.success("支付成功！");
        this.loading = false;
        this.isTextSure = true;
      } catch (error) {
        this.loading = false;
        this.$Message.error(`请求失败:${error}`);
      }
    }
  }
};
</script>

<style lang="less" scoped>
@import url("./../../assets/css/pay.less");
</style>
