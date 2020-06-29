<template>
  <div class="pay">
    <h1 class="pay-title">优惠购</h1>
    <article class>
      <p>中国供销汽油</p>
      <div class="pay-form">
        <i-form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
          <Form-item label="对方账户" prop="username">
            <!-- <i-input v-model="formValidate.username" placeholder="请输入对方账户" disabled></i-input> -->
            <Select v-model="formValidate.username">
              <Option
                v-for="item in business_list"
                :value="item.username"
                :key="item"
              >{{ item.household }}</Option>
            </Select>
          </Form-item>
          <Form-item label="初始油价">
            <i-input v-model="initial" placeholder="请输入对方账户" disabled></i-input>
          </Form-item>
          <Form-item label="购买金额" prop="money">
            <i-input v-model="formValidate.money" placeholder="请输入购买金额"></i-input>
          </Form-item>
          <Form-item label="优惠油价">
            <i-input v-model="discount" placeholder="请输入对方账户" disabled></i-input>
          </Form-item>
          <Form-item label="最终价格">
            <i-input v-model="formValidate.final_num" placeholder="请输入对方账户" disabled></i-input>
          </Form-item>
          <Form-item label="交易密码" prop="password">
            <i-input v-model="formValidate.password" type="password" placeholder="请输入密码"></i-input>
          </Form-item>
          <Form-item>
            <i-button type="primary" @click="handleSubmit('formValidate')">提交</i-button>
          </Form-item>
        </i-form>
      </div>
    </article>
  </div>
</template>

<script>
import { setCookie } from "./../../utils/cookie";

export default {
  name: "pay",
  data() {
    const validateUsername = async (rule, value, callback) => {
      if (this.formValidate.username !== "") {
        let data = {
          username: value
        };
        let res = await this.$Http.queryUser(data);
        this.profit_info = res.data;
        if (Object.keys(res.data).length === 0) {
          callback(new Error("账号不存在!"));
        }
        callback();
      }
    };

    const validateMoney = async (rule, value, callback) => {
      console.log(value, "value");
      if (value === 0) {
        callback(new Error("交易金额不能为0"));
      } else if (value !== 0) {
        this.validateNum(this.formValidate.money, callback);
      }
    };

    const validatePassword = async (rule, value, callback) => {
      if (this.formValidate.password !== "") {
        let data = {
          id: localStorage.getItem("user_id"),
          cash_pwd: this.formValidate.password
        };
        let res = await this.$Http.queryUser(data);
        if (!res.data) {
          callback(new Error("交易密码错误!"));
        }
        callback();
      }
    };
    return {
      show_text_trade: false,
      current_user: localStorage.getItem("username"),
      business_list: [],
      formValidate: {
        username: "gas_station",
        money: null,
        final_num: 0,
        password: ""
      },
      initial: 4.88,
      discount: 4.48,
      profit_info: {},
      rebate: 0,
      total: 0,
      ruleValidate: {
        username: [
          { required: true, message: "转账用户名称不能为空", trigger: "blur" },
          { validator: validateUsername, trigger: "blur" }
        ],
        money: [
          {
            required: true,
            message: "输入金额只能为不等于0的整数",
            trigger: "blur"
          },
          { validator: validateMoney, trigger: "blur" }
        ],
        password: [
          { required: true, message: "交易密码不能为空", trigger: "blur" },
          { validator: validatePassword, trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getBusinessUser();
    this.getBalance();
    console.log(localStorage.getItem("username"), "ise");
  },
  mounted() {
    if (localStorage.getItem("username") == this.formValidate.username) {
      this.formValidate.username = "";
    }
  },
  methods: {
    async getBusinessUser() {
      console.log("dddd");
      let res = null;
      try {
        res = await this.$Http.queryBusinessUser();
        this.business_list = res.data;
        console.log(res.data);
        this.business_user = res.data.list;
      } catch (error) {
        if (res.msg) {
          return this.$Message.error(`请求失败:${res.msg}`);
        }
        this.$Message.error(`请求失败:${error}`);
      }
    },
    async getBalance() {
      let data = {
        user_id: localStorage.getItem("user_id"),
        is_cash: 1
      };
      let res = null;
      try {
        res = await this.$Http.queryBalanceTotal(data);
        this.total = Number(res.data.count);
      } catch (error) {
        if (res.msg) {
          return this.$Message.error(`请求失败:${res.msg}`);
        }
        this.$Message.error(`请求失败:${error}`);
      }
    },
    validateNum(num, callback) {
      if (isNaN(num) || num === "" || Number(num) <= 0) {
        callback(new Error("填写的交易金额错误!"));
      } else if (this.isFloat(Number(num) / 10)) {
        callback(new Error("购买金额为10的倍数!"));
      } else if (Number(num) > this.total) {
        callback(new Error("您的余额不足，请先充值!"));
      } else {
        this.rebate = ((num / this.initial) * 0.1).toFixed(2);
        this.formValidate.final_num = (
          (num / this.initial) *
          this.discount
        ).toFixed(2);
        callback();
      }
    },
    isFloat(n) {
      return n + ".0" != n;
    },
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.payMoney();
        } else {
          this.$Message.error("表单验证失败!");
        }
      });
    },
    async payMoney() {
      let data = {
        user_id: Number(localStorage.getItem("user_id")),
        num: this.formValidate.final_num,
        profit_id: this.profit_info.id,
        final_num: (this.formValidate.final_num - this.rebate).toFixed(2)
      };
      this.loading = true;
      console.log(data, "data");

      return;
      let res = null;
      try {
        res = await this.$Http.createTransferAccount(data);
        if (!res.success) {
          return this.$Message.error(`请求失败:${res.msg}`);
        }
        this.$Message.success("支付成功！");
        this.loading = false;
        this.formValidate.password = "";
        this.formValidate.money = 0;
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
