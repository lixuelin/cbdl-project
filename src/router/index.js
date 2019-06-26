// import Vue from 'vue'
// import Router from 'vue-router'

const Home = () => import("@/views/home");
const Login = () => import("@/views/login");
const Index = () => import("@/views/index");
const Bonus = () => import("@/views/bonus");
const Income = () => import("@/views/income");
const Help = () => import("@/views/help");
const Bank = () => import("@/views/bank");
const ChangePwd = () => import("@/views/change_pwd");
const Register = () => import("@/views/register");
const Forget = () => import("@/views/forget");
const Invest = () => import("@/views/invest");

const Manager = () => import("@/views/manager");
const Admin = () => import("@/views/admin/home");
const AdminIndex = () => import("@/views/admin/index");
const InvestmentFlow = () => import("@/views/admin/investment_flow");
const InvestmentSummary = () => import("@/views/admin/investment_summary");
const BonusFlow = () => import("@/views/admin/bonus_flow");
const BonusSecondFlow = () => import("@/views/admin/bonus_second_flow");
const BonusSummary = () => import("@/views/admin/bonus_summary");
const WithdrawFlow = () => import("@/views/admin/withdraw_flow");
const WithdrawSummary = () => import("@/views/admin/withdraw_summary");
const UserManagement = () => import("@/views/admin/user_management");

// Vue.use(Router)

export default new VueRouter({
    routes: [
        {
            path: "/",
            name: "login",
            component: Login
        },
        {
            path: "/home",
            component: Home,
            children: [
                {
                    path: "/",
                    name: "index",
                    component: Index
                }, {
                    path: "/income",
                    name: "income",
                    component: Income
                },
                {
                    path: "/bonus",
                    name: "bonus",
                    component: Bonus
                },
                {
                    path: "/help",
                    name: "help",
                    component: Help
                },
                {
                    path: "/change_pwd",
                    name: "change_pwd",
                    component: ChangePwd
                },
                {
                    path: "/bank",
                    name: "bank",
                    component: Bank
                },
                {
                    path: "/invest",
                    name: "invest",
                    component: Invest
                }
            ]
        },
    
        {
            path: "/register",
            name: "register",
            component: Register
        },
        {
            path: "/forget",
            name: "forget",
            component: Forget
        },
        {
            path: "/manager",
            name: "manager",
            component: Manager
        },
        {
            path: "/admin",
            component: Admin,
            children: [
                {
                    path: "/",
                    name: "admin_index",
                    component: AdminIndex
                },
                {
                    path: "/admin/investment_flow",
                    name: "investment_flow",
                    component: InvestmentFlow
                },
                {
                    path: "/admin/investment_summary",
                    name: "investment_summary",
                    component: InvestmentSummary
                },
                {
                    path: "/admin/bonus_flow",
                    name: "bonus_flow",
                    component: BonusFlow
                },
                {
                    path: "/admin/bonus_second_flow",
                    name: "bonus_second_flow",
                    component: BonusSecondFlow
                },
                {
                    path: "/admin/bonus_summary",
                    name: "bonus_summary",
                    component: BonusSummary
                },
                {
                    path: "/admin/withdraw_flow",
                    name: "withdraw_flow",
                    component: WithdrawFlow
                },
                {
                    path: "/admin/withdraw_summary",
                    name: "withdraw_summary",
                    component: WithdrawSummary
                },
                {
                    path: "/admin/user_management",
                    name: "user_management",
                    component: UserManagement
                }
            ]
        }
    ]
});
