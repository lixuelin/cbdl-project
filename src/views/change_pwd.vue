<template>
  <div class="login-pwd">
    <div class="login-pwd-type">
      <div class="login-pwd-type-label">
        <span>选择修改密码</span>
      </div>
      <div class="login-pwd-type-cont">
        <div class="login-pwd-type-cont-box" @click="checkType = 0">
          <div :class="{'login-pwd-type-cont-check': true, 'active': checkType ===0}">
            <span class="checked"></span>
          </div>
          <span>登录密码</span>
        </div>
        <div class="login-pwd-type-cont-box" @click="checkType = 1">
          <div :class="{'login-pwd-type-cont-check': true, 'active': checkType ===1}">
            <span class="checked"></span>
          </div>
          <span>提现密码</span>
        </div>
      </div>
    </div>
    <div class="login-pwd-form">
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120">
        <FormItem label="请输入原密码" prop="oldPassWord">
          <Input type="password" v-model="formValidate.oldPassWord" placeholder="请输入登录密码"></Input>
        </FormItem>
        <FormItem label="请输入新密码" prop="password">
          <Input type="password" v-model="formValidate.password" placeholder="请输入登录密码"></Input>
        </FormItem>
        <FormItem label="请再次输入新密码" prop="passwordCheck">
          <Input type="password" v-model="formValidate.passwordCheck" placeholder="请再次输入登录密码"></Input>
        </FormItem>
        <FormItem class="login-pwd-form-btn">
          <Button type="primary" @click="handleSubmit('formValidate')">确认提交</Button>
        </FormItem>
      </Form>
    </div>
  </div>
</template>

<script>
  import {mylocalStorage, checkLoginPwd, updateLoginPwd, checkCashPwd, updateCashPwd} from "./../utils/request_api";
  import {delCookie} from "./../utils/cookie";
  export default {
    name: "change-pwd",
    data () {
      const validateoldPassWord = (rule, value, callback) => {
        if (this.formValidate.oldPassWord !== '') {
          let reg = /^[a-zA-Z0-9]{6,30}$/;
          let is_reg = reg.test(value)
          console.log(this.formValidate, "form")
          if (is_reg) {
            this.validateLoginPwd(callback);
          } else {
            callback(new Error('限制6-30位密码,只可以输入大小写字母、数字!'));
          }
        }
      };
      const validatePassword = (rule, value, callback) => {
        if (this.formValidate.password !== '') {
          let reg = /^[a-zA-Z0-9]{6,30}$/;
          let is_reg = reg.test(value)
          if (is_reg) {
            callback();
          } else {
            callback(new Error('限制6-30位密码,只可以输入大小写字母、数字!'));
          }
        }
      };
      const validatePasswordCheck = (rule, value, callback) => {
        if (value !== this.formValidate.password) {
          callback(new Error('账号密码不一致，请重新输入！'));
        } else {
          callback();
        }
      };
      return {
        checkType: 0,
        formValidate: {
          oldPassWord: "",
          password: '',
          passwordCheck: '',
        },
        is_validate: false,
        ruleValidate: {
          oldPassWord: [
            { required: true, type: 'string', message: '原始提现密码不能为空', trigger: 'blur' },
            { validator: validateoldPassWord, trigger: 'blur' }
          ],
          password: [
            { required: true, type: 'string', message: '账号密码不能为空！', trigger: 'blur' },
            { validator: validatePassword, trigger: 'blur' }
          ],
          passwordCheck: [
            { required: true, type: 'string', message: '再次输入账号密码不能为空！', trigger: 'blur' },
            { validator: validatePasswordCheck, trigger: 'blur' }
          ],
        }
      }
    },
    methods: {
      handleSubmit (name) {
        this.$refs[name].validate((valid) => {
          this.is_validate = valid
          if (valid) {
            console.log(this.checkType, "ddd")
            if(this.checkType === 0) {
              this.changeLoginPwd()
            } else {
              this.changeCashPwd()
            }
          } else {
            this.$Message.error('Fail!');
          }
        })
      },
      validateLoginPwd (callback) {
        let data = {
          user_id: mylocalStorage.getItem("user_id"),
          cash_pwd: this.formValidate.oldPassWord
        }
        if (this.checkType=== 0) {
          this.checkLogin(data, callback)
        } else {
          this.checkCash(data, callback)
        }

      },
      checkCash(data, callback) {
        checkCashPwd(data).then(response => {
          console.log(response)
          if(response.data.data.is_exist) {
            callback();
          } else {
            this.formValidate.oldPassWord = "";
            callback(new Error('原始提现密码输入错误!'));
          }
        }).catch(error => {
          this.formValidate.oldPassWord = "";
          this.$Message.error("原始提现密码验证失败");
          console.log(error)
        });
      },
      changeCashPwd(){
        let data = this.formValidate;
        data.user_id = mylocalStorage.getItem("user_id");
        updateCashPwd(data).then(res => {
          this.$Message.success('提现密码修改成功!');
        }).catch(err => {
          console.log(err)
          this.$Message.error('提现密码修改失败!');
        })
      },
      checkLogin(data, callback) {
        checkLoginPwd(data).then(response => {
          console.log(response, "ddd")
          if(response.data.data.is_exist) {
            callback();
          } else {
            this.formValidate.oldPassWord = "";
            callback(new Error('原始登录密码输入错误!'));
          }
        }).catch(error => {
          this.formValidate.oldPassWord = "";
          this.$Message.error("原始登录密码验证失败");
          console.log(error)
        });
      },
      changeLoginPwd(){
        let data = this.formValidate;
        data.user_id = mylocalStorage.getItem("user_id");
        updateLoginPwd(data).then(res => {
          this.$Message.success('登录密码修改成功!');
          mylocalStorage.setItem("user_id", "")
          mylocalStorage.setItem("session_id", "")
          mylocalStorage.setItem("username", "")
          mylocalStorage.setItem("code", "")
          delCookie("session_id")
          setTimeout(() => {
            this.$router.push({path: "/login"})
          }, 1000)
        }).catch(err => {
          this.$Message.error('登录密码修改失败!');
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "./../assets/css/other";
</style>
