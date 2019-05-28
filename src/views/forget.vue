<template>
  <div class="forget">
    <div class="forget-form">
      <Form ref="formInline" :model="formInline" :rules="ruleInline">
        <FormItem prop="user">
          <Input type="text" v-model="formInline.user" placeholder="请输入用户名称">
          </Input>
        </FormItem>
        <FormItem prop="password">
          <Input  type="password" v-model="formInline.password" placeholder="请输入密码">
          </Input>
        </FormItem>
        <FormItem>
          <Input  type="text" value="工商银行" placeholder="工商银行">
          </Input>
        </FormItem>
        <FormItem prop="household">
          <Input  type="text" v-model="formInline.household" placeholder="请输入户主">
          </Input>
        </FormItem>
        <div class="login-form-btns">
          <div class="login-form-btns-submit">
            <FormItem>
              <Button type="primary" @click="handleSubmit('formInline')">找回密码</Button>
            </FormItem>
          </div>
        </div>
      </Form>
    </div>
  </div>
</template>

<script>
  export default {
    name: "forget",
    data () {
      return {
        formInline: {
          user: '',
          password: '',
          household: ''
        },
        ruleInline: {
          user: [
            { required: true, message: 'Please fill in the user name', trigger: 'blur' }
          ],
          password: [
            { required: true, message: 'Please fill in the password.', trigger: 'blur' },
            { type: 'string', min: 6, message: 'The password length cannot be less than 6 bits', trigger: 'blur' }
          ],
          household: [
            { required: true, message: 'Please fill in the password.', trigger: 'blur' },
            { type: 'string', min: 6, message: 'The password length cannot be less than 6 bits', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      handleSubmit(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.$Message.success('Success!');
          } else {
            this.$Message.error('Fail!');
          }
        })
      },
      gotoRegister() {
        this.$router.push({"name": "register"})
      }
    }
  }
</script>

<<style lang="less" scoped>
  @import "./../assets/css/login";
</style>
