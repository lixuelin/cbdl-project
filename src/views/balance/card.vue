<template>
  <div class="card">
    <div class="card-box" v-if="exists_bank" :style="bankBg(bank)">
      <div class="bank-list-cont">
        <div class="bank-list-cont-name">
          <h3>{{ bank.bank_name }}</h3>
        </div>
        <div class="bank-list-cont-type">
          <p>{{ bank.card_type }}</p>
        </div>
        <div class="bank-list-cont-card">
          <p>{{ bank.card }}</p>
        </div>
      </div>
      <div class="bank-list-logo">
        <span :class="bankIcon(bank)"></span>
      </div>
    </div>
    <div class="card-add" v-else>
      +
      <span>添加银行卡</span>
    </div>
    <div class="card-update" v-if="!exists_bank">
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
        <FormItem label="银行账号" prop="card">
          <Input v-model="formValidate.card" placeholder="请输入银行卡号" />
        </FormItem>
        <FormItem label="重复账户" prop="cardCheck">
          <Input v-model="formValidate.cardCheck" placeholder="请再次输入银行卡号" />
        </FormItem>
        <FormItem label="所属银行">
          <span>{{ formValidate.bank_name }}</span>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleSubmit('formValidate')">修改</Button>
        </FormItem>
      </Form>
    </div>
  </div>
</template>

<script>
import { CardBin } from "bankcard";
import { checkBackInfo } from "./../../utils/bank";
export default {
  data() {
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
      }
    };
    const validateCardCheck = (rule, value, callback) => {
      if (value !== this.formValidate.card) {
        callback(new Error("银行卡号不一致，请重新输入！"));
      } else {
        callback();
      }
    };
    return {
      exists_bank: false,
      bank: {},
      formValidate: {
        card: "",
        cardCheck: "",
        bank_name: "",
        bank_code: "",
        card_type: ""
      },
      is_validate: false,
      ruleValidate: {
        card: [
          {
            required: true,
            type: "string",
            message: "银行卡号不能为空！",
            trigger: "blur"
          },
          { validator: validateCard, trigger: "blur" }
        ],
        cardCheck: [
          {
            required: true,
            type: "string",
            message: "银行卡号不一致！",
            trigger: "blur"
          },
          { validator: validateCardCheck, trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getBankInfo();
  },
  methods: {
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        this.is_validate = valid;
        if (valid) {
          this.updateBank();
        } else {
          this.$Message.error("修改失败!");
        }
      });
    },
    async getBankInfo() {
      let data = {
        id: localStorage.getItem("user_id")
      };
      let res = await this.$Http.queryUser(data);
      let userInfo = res.data;
      if (userInfo.card) {
        this.exists_bank = true;
        this.bank = userInfo;
      }
    },
    bankBg(bank) {
      var r = Math.floor(Math.random() * 256);
      var g = Math.floor(Math.random() * 256);
      var b = Math.floor(Math.random() * 256);
      let color = "#" + r.toString(16) + g.toString(16) + b.toString(16);
      return { background: color };
    },
    bankIcon(bank) {
      // let bankInfo = checkBackInfo(bank);
      let className = ["iconfont"];
      // if (bankInfo) {
      //   className.push(bankInfo.icon);
      // }
      return className;
    },
    async getBankCard(value, callback) {
      let data = {
        card: value
      };
      let res = null;
      try {
        res = await this.$Http.queryUser(data);
        console.log(res.data, "dd");

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
    },
    async updateBank() {
      let data = {
        id: localStorage.getItem("user_id"),
        card: this.formValidate.card,
        bank_name: this.formValidate.bank_name,
        bank_code: this.formValidate.bank_code,
        card_type: this.formValidate.card_type
      };
      let res = null;
      try {
        res = await this.$Http.updateUser(data);
        this.bank = data;
        this.exists_bank = true;
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
@import "./../../assets/css/bank.less";
@import url("./../../assets/css/card.less");
</style>