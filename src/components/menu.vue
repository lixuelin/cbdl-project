<template>
    <div class="admin-menu">
        <Menu :theme="theme2" :accordion="true">
            <template v-for="(item, index) in menu">
                <Submenu :name="index">
                    <template slot="title">
                        <Icon type="ios-paper" />
                        <span>{{item.title}}</span>
                    </template>
                    <template v-for="(child, i) in item.child">
                        <MenuItem :name="index+ '-'+ i" :to="child.path">
                            <span>{{child.name}}</span>
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
        data () {
            return {
                theme2: 'light',
                menu: [
                    {
                        title: "投资管理",
                        child: [
                            {
                                name: "投资日流水",
                                path: "/admin"
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
                                name: "奖金日流水",
                                path: "/admin/bonus_flow"
                            },
                            {
                                name: "奖金汇总",
                                path: "/admin/bonus_summary"
                            }
                        ]
                    },
                    {
                        title: "提现管理",
                        child: [
                            {
                                name: "提现日流水",
                                path: "/admin/withdraw_flow"
                            },
                            {
                                name: "提现汇总",
                                path: "/admin/withdraw_summary"
                            }
                        ]
                    },
                    {
                        title: "用户中心",
                        child: [
                            {
                                name: "用户管理",
                                path: "/admin/user_management"
                            },
                            // {
                            //     name: "角色管理",
                            //     path: "/pages/user_management"
                            // }
                        ]
                    }
                ]
            }
        },
        methods: {
            goto (child) {
                console.log(child)
            }
        }
    }
</script>

<style lang="less" scoped>
    @import "./../assets/admin/home";
</style>
