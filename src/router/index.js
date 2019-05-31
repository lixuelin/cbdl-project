// import Vue from 'vue'
// import Router from 'vue-router'

const Home = () => import("@/views/home")
const Login = () => import("@/views/login")
const Index = () => import("@/views/index")
const Bonus = () => import("@/views/bonus")
const Income = () => import("@/views/income")
const Help = () => import("@/views/help")
const Bank = () => import("@/views/bank")
const ChangePwd = () => import("@/views/change_pwd")
const Register = () => import("@/views/register")
const Forget = () => import("@/views/forget")
const Invest = () => import("@/views/invest")

// Vue.use(Router)

export default new VueRouter({
    routes: [
        {
          path: '/',
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
            },
            {
              path: '/invest',
              name: 'invest',
              component: Invest,
            }
          ]
        },
        {
          path: '/login',
          name: 'login',
          component: Login
        },
        {
          path: '/register',
          name: 'register',
          component: Register
        },
      {
        path: '/forget',
        name: 'forget',
        component: Forget
      }
    ]
})
