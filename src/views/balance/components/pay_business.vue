<template>
  <div class="pay">
    <div class="pay-business">
      <ul>
        <template v-for="(item,index) in business_list">
          <li
            :class="{'active': current_business === index}"
            :key="item.name"
            @click="chooseBusiness(item, index)"
          >{{item.household}}</li>
        </template>
      </ul>
    </div>
    <i-form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
      <Form-item label="对方账户" prop="username">
        <i-input v-model="formValidate.username" placeholder="请输入对方账户" disabled></i-input>
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
</template>

<script>
import loginVue from "../../login.vue";
export default {
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
      if (value === 0) {
        callback(new Error("交易金额不能为0"));
      } else if (value !== 0) {
        this.validateNum(this.formValidate.money, callback);
      }
    };

    const validatePassword = async (rule, value, callback) => {
      console.log(value, "ddd");
      if (value !== "") {
        let data = {
          id: localStorage.getItem("user_id"),
          cash_pwd: value
        };
        let res = await this.$Http.queryUser(data);
        if (Object.keys(res.data).length === 0) {
          callback(new Error("交易密码错误!"));
        }
        callback();
      }
    };
    return {
      current_business: 99999,
      business_list: [],
      formValidate: {
        username: "",
        money: null,
        final_num: 0,
        password: ""
      },
      initial: 4.68,
      discount: 4.48,
      total: 0,
      profit_info: {},
      rebate: 0,
      ruleValidate: {
        username: [
          {
            required: true,
            message: "转账用户名称不能为空",
            trigger: "blur"
          },
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
          {
            required: true,
            message: "交易密码不能为空",
            trigger: "blur"
          },
          { validator: validatePassword, trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getBalance();
    this.getBusinessUser();
  },
  methods: {
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
    async getBusinessUser() {
      let res = null;
      try {
        res = await this.$Http.queryBusinessUser();
        this.business_list = res.data;
        this.business_user = res.data.list;
      } catch (error) {
        if (res.msg) {
          return this.$Message.error(`请求失败:${res.msg}`);
        }
        this.$Message.error(`请求失败:${error}`);
      }
    },
    chooseBusiness(data, index) {
      this.formValidate.username = data.username;
      this.current_business = index;
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
          this.current_business = 9999;
          let data = {
            num: this.formValidate.final_num,
            profit_id: this.profit_info.id,
            final_num: (this.formValidate.final_num - this.rebate).toFixed(2),
            account: this.profit_info.household
          };
          this.formValidate = {
            username: "",
            money: null,
            final_num: 0,
            password: ""
          };
          this.$emit("submitPay", data);
        } else {
          this.$Message.error("表单验证失败!");
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
@import url("./../../../assets/css/pay.less");
</style>