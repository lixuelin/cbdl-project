<template>
  <div class="admin-main">
    <title-view :title="title"></title-view>
    <div class="agent-create">
      <div class="agent-create-form">
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">
          <FormItem label="选择用户" prop="name">
            <Select v-model="formValidate.name">
              <template v-for="user in users">
                <Option :value="user.name" :key="user.id">
                  {{
                  user.name
                  }}
                </Option>
              </template>
            </Select>
          </FormItem>
          <FormItem label="选择VIP" prop="agent_id">
            <RadioGroup v-model="formValidate.agent_id">
              <Radio label="1">黄金VIP</Radio>
              <Radio label="2">钻石VIP</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="选择上级VIP" prop="super_name">
            <Select v-model="formValidate.super_name">
              <template v-for="agent in agents">
                <Option :value="agent.name" :key="agent.id">
                  {{
                  agent.name
                  }}
                </Option>
              </template>
            </Select>
          </FormItem>
          <FormItem>
            <Button type="primary" @click="handleSubmit('formValidate')">保存</Button>
          </FormItem>
        </Form>
      </div>
    </div>
  </div>
</template>

<script>
import pageTitle from "./../../../components/title";

export default {
  name: "agent_manager",
  data() {
    const validateName = async (rule, value, callback) => {
      if (this.formValidate.name !== "") {
        callback();
      } else {
        callback(new Error("请选择用户!"));
      }
    };

    return {
      title: "添加VIP",
      formValidate: {
        name: "",
        user_id: "",
        agent_id: "1",
        super_agent: "",
        super_name: ""
      },
      ruleValidate: {
        name: [
          {
            required: true,
            type: "string",
            message: "账号名称不能为空！",
            trigger: "blur"
          },
          { validator: validateName, trigger: "blur" }
        ]
      },
      users: [],
      agents: []
    };
  },
  components: {
    "title-view": pageTitle
  },
  created() {
    this.getUsersAgent();
  },
  mounted() {},
  methods: {
    async getUsersAgent() {
      let arr = [
        this.$Http.queryNotAgentUsers(),
        this.$Http.querySuperAgents()
      ];
      let res = null;
      try {
        res = await Promise.all(arr);
        this.users = res[0].data || [];
        this.agents = res[1].data || [];
      } catch (error) {
        let error_msg = [];
        res.forEach(result => {
          if (result.msg) {
            error_msg.push(result.msg);
          }
        });
        if (error_msg) {
          this.$Message.error(`请求失败:${error_msg.join(",")}`);
        } else {
          this.$Message.error(`请求失败: ${error}`);
        }
      }
    },
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        this.is_validate = valid;
        if (valid) {
          this.createAgent();
        } else {
          this.$Message.error("VIP添加失败!");
        }
      });
    },
    async createAgent() {
      let data = this.formValidate;
      let agent_info = this.users.filter(user => user.name === data.name);
      data.user_id = agent_info[0].id;
      if (data.super_name) {
        let super_agent_info = this.agents.filter(
          agent => agent.name === data.super_name
        );
        data.super_agent = super_agent_info[0].id;
      } else {
        delete data.super_agent;
        delete data.super_name;
      }

      let res;
      try {
        res = await this.$Http.createAgent(data);
        this.$Message.success("注册成功!");
        this.$router.push({ name: "agent" });
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
@import "./../../../assets/admin/components";
@import "./../../../assets/admin/agent";
</style>
