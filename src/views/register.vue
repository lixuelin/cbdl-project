<template>
  <div class="register">
    <div class="register-form">
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="20">
        <FormItem label=" " prop="username">
          <Input v-model="formValidate.username" placeholder="请输入账号" />
        </FormItem>
        <FormItem label=" " prop="password">
          <Input type="password" v-model="formValidate.password" placeholder="请输入账号密码" />
        </FormItem>
        <FormItem label=" " prop="passwordCheck">
          <Input type="password" v-model="formValidate.passwordCheck" placeholder="请再次输入账号密码" />
        </FormItem>
        <FormItem label=" " prop="card">
          <Input v-model="formValidate.card" placeholder="请输入银行卡号" />
        </FormItem>
        <FormItem label=" " prop="cardCheck">
          <Input v-model="formValidate.cardCheck" placeholder="请再次输入银行卡号" />
        </FormItem>
        <FormItem label=" ">
          所属银行：
          <span>{{ formValidate.bank_name }}</span>
        </FormItem>
        <FormItem label=" " prop="household">
          <Input v-model="formValidate.household" placeholder="请输入持卡人姓名" />
        </FormItem>
        <FormItem label=" " prop="cash_pwd">
          <Input type="password" v-model="formValidate.cash_pwd" placeholder="请输入提现密码" />
        </FormItem>
        <FormItem label=" " prop="cashPwdCheck">
          <Input type="password" v-model="formValidate.cashPwdCheck" placeholder="请再次输入提现密码" />
        </FormItem>
        <FormItem label=" " prop="be_invite_code">
          <Input type="text" v-model="formValidate.be_invite_code" placeholder="请输入邀请码" />
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleSubmit('formValidate')">注册</Button>
        </FormItem>
      </Form>
    </div>
  </div>
</template>

<script>
import BIN from "bankcardinfo";
import { CardBin } from "bankcard";

export default {
  name: "register",
  data() {
    const validateUsername = async (rule, value, callback) => {
      if (this.formValidate.username !== "") {
        let reg = /^[a-zA-Z0-9_\u4e00-\u9fa5]{6,12}$/;
        let is_reg = reg.test(value);
        if (is_reg) {
          let data = {
            username: value
          };
          let res = await this.$Http.queryUser(data);
          if (Object.keys(res.data).length !== 0) {
            callback(new Error("账号已存在!"));
          }
          callback();
        } else {
          callback(new Error("限制6-12个字,只可以输入中文、大小写字母、数字!"));
        }
      }
    };
    const validatePassword = (rule, value, callback) => {
      if (this.formValidate.password !== "") {
        let reg = /^[a-zA-Z0-9]{6,30}$/;
        let is_reg = reg.test(value);
        if (is_reg) {
          callback();
        } else {
          callback(new Error("限制6-30位密码,只可以输入大小写字母、数字!"));
        }
      }
    };
    const validatePasswordCheck = (rule, value, callback) => {
      if (value !== this.formValidate.password) {
        callback(new Error("账号密码不一致，请重新输入！"));
      } else {
        callback();
      }
    };
    const validateCard = (rule, value, callback) => {
      if (this.formValidate.card !== "") {
        const Bank = new CardBin();
        let bank_info = Bank.searchCardBin(this.formValidate.card);
        if (bank_info.bankName) {
          this.formValidate.bank_name = bank_info.bankName;
          this.formValidate.bank_code = bank_info.bankCode;
          this.formValidate.card_type = bank_info.cardTypeName;
          this.getBankCard(value, callback);
          callback();
        } else {
          callback(new Error("银行卡号输入错误，请重新输入！"));
        }
      } else {
        callback();
      }
    };
    const validateCardCheck = (rule, value, callback) => {
      if (value !== this.formValidate.card) {
        callback(new Error("银行卡号不一致，请重新输入！"));
      } else {
        callback();
      }
    };
    const validateHousehold = (rule, value, callback) => {
      if (this.formValidate.household !== "") {
        let reg = /^[\u4E00-\u9FA5]{2,8}$/;
        let is_reg = reg.test(value);
        if (is_reg) {
          callback();
        } else {
          callback(new Error("只可输入汉字，最大8位!"));
        }
      }
    };
    const validateCashPwd = (rule, value, callback) => {
      if (this.formValidate.cash_pwd !== "") {
        let reg = /^[a-zA-Z0-9]{6,30}$/;
        let is_reg = reg.test(value);
        if (is_reg) {
          callback();
        } else {
          callback(new Error("限制6-30位密码,只可以输入大小写字母、数字!"));
        }
      }
    };
    const validateCashPwdCheck = (rule, value, callback) => {
      if (value !== this.formValidate.cash_pwd) {
        callback(new Error("提现密码不一致，请重新输入！"));
      } else {
        callback();
      }
    };

    const validateInviteCode = (rule, value, callback) => {
      if (value !== "") {
        this.getInviteCode(value, callback);
      } else {
        callback();
      }
    };

    return {
      formValidate: {
        username: "",
        password: "",
        passwordCheck: "",
        card: "",
        cardCheck: "",
        bank_name: "",
        bank_code: "",
        card_type: "",
        household: "",
        cash_pwd: "",
        cashPwdCheck: "",
        be_invite_code: ""
      },
      is_validate: false,
      ruleValidate: {
        username: [
          {
            required: true,
            type: "string",
            message: "账号名称不能为空！",
            trigger: "blur"
          },
          { validator: validateUsername, trigger: "blur" }
        ],
        password: [
          {
            required: true,
            type: "string",
            message: "账号密码不能为空！",
            trigger: "blur"
          },
          { validator: validatePassword, trigger: "blur" }
        ],
        passwordCheck: [
          {
            required: true,
            type: "string",
            message: "再次输入账号密码不能为空！",
            trigger: "blur"
          },
          { validator: validatePasswordCheck, trigger: "blur" }
        ],
        card: [
          {
            required: false,
            type: "string",
            message: "银行卡号不能为空！",
            trigger: "blur"
          },
          { validator: validateCard, trigger: "blur" }
        ],
        cardCheck: [
          {
            required: false,
            type: "string",
            message: "银行卡号不一致！",
            trigger: "blur"
          },
          { validator: validateCardCheck, trigger: "blur" }
        ],
        bank: [
          {
            required: true,
            message: "Please select the date",
            trigger: "change"
          }
        ],
        household: [
          {
            required: true,
            type: "string",
            message: "名称不能为空！",
            trigger: "blur"
          },
          { validator: validateHousehold, trigger: "blur" }
        ],
        cash_pwd: [
          {
            required: true,
            type: "string",
            message: "提现密码不能为空",
            trigger: "blur"
          },
          { validator: validateCashPwd, trigger: "blur" }
        ],
        cashPwdCheck: [
          {
            required: true,
            type: "string",
            message: "再次输入提现密码不能为空",
            trigger: "blur"
          },
          { validator: validateCashPwdCheck, trigger: "blur" }
        ],
        be_invite_code: [
          { required: false, type: "string" },
          { validator: validateInviteCode, trigger: "blur" }
        ]
      }
    };
  },
  mounted() {},
  methods: {
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        this.is_validate = valid;
        if (valid) {
          this.registerUser();
        } else {
          this.$Message.error("注册失败!");
        }
      });
    },
    async registerUser() {
      let data = this.formValidate;
      delete data.passwordCheck;
      delete data.cardCheck;
      delete data.cashPwdCheck;
      this.is_load = true;
      let res = null;
      try {
        res = await this.$Http.createUser(data);
        this.$Message.success("注册成功!");
        this.$router.push({ name: "login" });
      } catch (error) {
        if (res.msg) {
          return this.$Message.error(`请求失败:${res.msg}`);
        }
        this.$Message.error(`请求失败:${error}`);
      }
    },
    async getInviteCode(value, callback) {
      let data = {
        invite_code: value
      };
      let res = null;
      try {
        let res = await this.$Http.queryUser(data);
        if (Object.keys(res.data).length === 0) {
          return callback(new Error("邀请码不存在请重新输入！"));
        }
        callback();
      } catch (error) {
        if (res.msg) {
          return this.$Message.error(`请求失败:${res.msg}`);
        }
        this.$Message.error(`请求失败:${error}`);
      }
    },
    async getBankCard(value, callback) {
      let data = {
        card: value
      };
      let res = null;
      try {
        res = await this.$Http.queryUser(data);
        if (Object.keys(res.data).length !== 0) {
          return callback(new Error("银行卡已经被使用，请重新输入！"));
        }
        callback();
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
@import "./../assets/css/login";
</style>
