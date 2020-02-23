<template>
  <div class="admin-menu">
    <Menu :theme="theme2" :accordion="true" style="width: 200px">
      <template v-for="(item, index) in menu">
        <Submenu :name="index" :key="item.title">
          <template slot="title">
            <Icon type="ios-paper" />
            <span>{{ item.title }}</span>
          </template>
          <template v-for="(child, i) in item.child">
            <MenuItem :key="child.name" :name="index + '-' + i" :to="child.path">
              <span>{{ child.name }}</span>
            </MenuItem>
          </template>
        </Submenu>
      </template>
    </Menu>
  </div>
</template>

<script>
export default {
  name: "admin-menu",
  data() {
    return {
      theme2: "light",
      menu: [
        {
          title: "投资管理",
          child: [
            {
              name: "投资日流水",
              path: "/admin/investment_flow"
            },
            {
              name: "投资汇总",
              path: "/admin/investment_summary"
            }
          ]
        },
        {
          title: "奖金管理",
          child: [
            {
              name: "团队流水",
              path: "/admin/bonus_flow"
            },
            {
              name: "团队分享流水",
              path: "/admin/bonus_second_flow"
            },
            {
              name: "奖金汇总",
              path: "/admin/bonus_summary"
            }
          ]
        },

        {
          title: "充值中心",
          child: [
            {
              name: "充值记录",
              path: "/admin/deposit"
            },
            {
              name: "余额收益",
              path: "/admin/balance_flow"
            }
          ]
        },
        {
          title: "代理商管理",
          child: [
            {
              name: "代理商列表",
              path: "/admin/agent"
            }
            // {
            //     name: "添加代理商",
            //     path: "/admin/add_agent"
            // }
            // {
            //     name: "代理商收益",
            //     path: "/admin/agent_interest"
            // }
          ]
        },
        {
          title: "用户中心",
          child: [
            {
              name: "用户管理",
              path: "/admin/user_management"
            }
            // {
            //     name: "编辑用户",
            //     path: "/pages/user_management"
            // }
          ]
        }
      ]
    };
  },
  mounted() {
    let role_id = localStorage.getItem("role_id");
    if (Number(role_id) === 1) {
      this.menu.unshift({
        title: "首页",
        child: [
          {
            name: "数据统计",
            path: "/admin"
          }
        ]
      });
    }
  },
  methods: {
    goto(child) {
      console.log(child);
    }
  }
};
</script>

<style lang="less" scoped>
@import "./../assets/admin/home";
</style>
