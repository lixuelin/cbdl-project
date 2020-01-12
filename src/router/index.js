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
const Financial = () => import("@/views/financial");
const Balance = () => import("@/views/balance");
const Deposit = () => import("@/views/balance/deposit");
const DepositNote = () => import("@/views/balance/deposit_note");
const CashOut = () => import("@/views/balance/cash_out");
const CashOutNote = () => import("@/views/balance/cash_out_note");

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
const AdminDeposit = () => import("@/views/admin/deposit");
const BalanceFlow = () => import("@/views/admin/balance_flow");

const Agent = () => import("@/views/admin/agent/agent_manager");
const AddAgent = () => import("@/views/admin/agent/add_agent");
const AgentInterest = () => import("@/views/admin/agent/agent_interest");

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
                },
                {
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
                },
                {
                    path: "/financial",
                    name: "financial",
                    component: Financial
                },
                {
                    path: "/balance",
                    name: "balance",
                    component: Balance
                },
                {
                    path: "/deposit",
                    name: "deposit",
                    component: Deposit
                },
                {
                    path: "/deposit_note",
                    name: "deposit_note",
                    component: DepositNote
                },
                {
                    path: "/cash_out",
                    name: "cash_out",
                    component: CashOut
                },
                {
                    path: "/cash_note",
                    name: "cash_note",
                    component: CashOutNote
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
                },
                {
                    path: "/admin/deposit",
                    name: "admin_deposit",
                    component: AdminDeposit
                },
                {
                    path: "/admin/balance_flow",
                    name: "balance_flow",
                    component: BalanceFlow
                },
                {
                    path: "/admin/agent",
                    name: "agent",
                    component: Agent
                },
                {
                    path: "/admin/add_agent",
                    name: "add_agent",
                    component: AddAgent
                },
                {
                    path: "/admin/agent_interest",
                    name: "agent_interest",
                    component: AgentInterest
                }
            ]
        }
    ]
});
