<template>
  <div>
    <i-form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
      <Form-item label="转入账户" prop="username">
        <i-input v-model="formValidate.username" placeholder="请输入对方账户"></i-input>
      </Form-item>
      <Form-item label="转出金额" prop="money">
        <i-input v-model="formValidate.money" placeholder="请输入转出金额"></i-input>
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
export default {
  data() {
    const validateUsername = async (rule, value, callback) => {
      if (this.formValidate.username !== "") {
        let data = {
          username: value
        };
        let res = await this.$Http.queryUser(data);
        if (Object.keys(res.data).length === 0) {
          callback(new Error("转入账号不存在!"));
        }
        this.profit_info = res.data;
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
      business_list: [],
      formValidate: {
        username: "",
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
    validateNum(num, callback) {
      if (isNaN(num) || num === "" || Number(num) <= 0) {
        callback(new Error("填写的交易金额错误!"));
      } else if (this.isFloat(Number(num) / 10)) {
        callback(new Error("购买金额为10的倍数!"));
      } else if (Number(num) > this.total) {
        callback(new Error("您的余额不足，请先充值!"));
      } else {
        callback();
      }
    },
    isFloat(n) {
      return n + ".0" != n;
    },
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          let data = {
            num: Number(this.formValidate.money),
            profit_id: this.profit_info.id,
            final_num: Number(this.formValidate.money),
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
</style>