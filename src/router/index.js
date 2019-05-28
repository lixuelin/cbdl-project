import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'

const Home = () => import("@/views/home")
const Login = () => import("@/views/login")
const Index = () => import("@/views/index")
const Bonus = () => import("@/views/bonus")
const Income = () => import("@/views/income")
const Help = () => import("@/views/help")
const Bank = () => import("@/views/bank")
const ChangePwd = () => import("@/views/change_pwd")

// const Invest = () => import("@/views/invest")
// const Finder = () => import("./views/finder")
// const Manage = () => import("./views/manage")
// const Mine = () => import("./views/mine")
// const MineCash = () => import("./views/mine/cash_pwd")
// const MineAbout = () => import("./views/mine/about")

Vue.use(Router)

export default new Router({
    routes: [
        {
          path: '/home/',
          name: 'home',
          component: Home,
          children: [
            {
              path: '/',
              name: 'index',
              component: Index,
            }, {
              path: '/income',
              name: 'income',
              component: Income,
            },
            {
              path: '/bonus',
              name: 'bonus',
              component: Bonus,
            },
            {
              path: '/help',
              name: 'help',
              component: Help,
            },
            {
              path: '/change_pwd',
              name: 'change_pwd',
              component: ChangePwd,
            },
            {
              path: '/bank',
              name: 'bank',
              component: Bank,
            }

          ]
        },
        {
          path: '/login',
          name: 'login',
          component: Login

        }
    ]
})
