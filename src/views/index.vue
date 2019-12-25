<template>
    <div class="b-home">
        <header class="b-home-header">
            <div>
                <h2>GRF生态理财</h2>
            </div>
            <template v-if="is_login">
                <div class="b-home-header-top">
                    <p class="b-home-header-welcome">
                        普通用户-{{ name }}，您的邀请码：{{ code }}
                    </p>
                    <p>
                        <span @click="loginOut">退出</span>
                    </p>
                </div>
            </template>
            <template v-else>
                <div class="b-home-header-top">
                    <p>
                        <span @click="goToLogin">登录</span>
                        <span class="b-home-header-top-hr">/</span>
                        <span @click="goToRegister">注册</span>
                    </p>
                </div>
            </template>
        </header>
        <div class="b-home-main">
            <div class="b-home-main-means" v-if="true">
                <div class="b-home-main-means-total">
                    <div class="b-home-main-means-total-cont">
                        <p class="b-home-main-means-tip">
                            <span>总资产</span>
                            <span class="b-home-main-means-hide">
                                <Icon type="eye-disabled"></Icon>
                                <!-- <Icon type="ios-eye"></Icon> -->
                            </span>
                        </p>
                        <h3>
                            <countTo
                                :startVal="total.startVal"
                                :endVal="total.endVal"
                                :duration="total.speed"
                                :decimals="total.float"
                            ></countTo>
                        </h3>
                    </div>
                    <div class="b-home-main-means-total-btn">
                        <Button type="success" size="small" @click="goToDeposit"
                            >充值</Button
                        >
                    </div>
                </div>
                <div class="b-home-main-means-class">
                    <div class="b-home-main-means-class-money">
                        <p class="b-home-main-means-tip">
                            余额
                            <span v-if="balance.income"
                                >+ {{ balance.income }}</span
                            >
                        </p>
                        <h4>
                            <countTo
                                :startVal="balance.startVal"
                                :endVal="balance.endVal"
                                :duration="balance.speed"
                                :decimals="balance.float"
                            ></countTo>
                        </h4>
                    </div>
                    <div class="b-home-main-means-class-money">
                        <p class="b-home-main-means-tip">投资收益</p>
                        <h4>
                            <countTo
                                :startVal="income.startVal"
                                :endVal="income.endVal"
                                :duration="income.speed"
                                :decimals="income.float"
                            ></countTo>
                        </h4>
                    </div>
                    <div class="b-home-main-means-class-money">
                        <p class="b-home-main-means-tip">分享奖金</p>
                        <h4>
                            <countTo
                                :startVal="bonus.startVal"
                                :endVal="bonus.endVal"
                                :duration="bonus.speed"
                                :decimals="bonus.float"
                            ></countTo>
                        </h4>
                    </div>
                </div>
            </div>
            <div class="b-home-main-newcomer">
                <div class="b-home-main-newcomer-box">
                    <p class="b-home-main-newcomer-invest">3.42-4.45%</p>
                    <p class="b-home-main-newcomer-year">月收益</p>
                </div>
                <div class="b-home-main-newcomer-box">
                    <h3>生态1号</h3>
                    <div class="b-home-main-newcomer-tip">
                        <p>期限30天</p>
                    </div>
                </div>
                <div class="b-home-main-newcomer-box">
                    <h4>500W</h4>
                    <p>总发行量</p>
                </div>
            </div>
            <div class="b-home-main-newcomer">
                <div class="b-home-main-newcomer-box">
                    <p class="b-home-main-newcomer-invest">5.3-6.1%</p>
                    <p class="b-home-main-newcomer-year">月收益</p>
                </div>
                <div class="b-home-main-newcomer-box">
                    <h3>生态2号</h3>
                    <div class="b-home-main-newcomer-tip">
                        <p>期限15天</p>
                    </div>
                </div>
                <div class="b-home-main-newcomer-box">
                    <h4>300W</h4>
                    <p>总发行量</p>
                </div>
            </div>
            <div class="b-home-main-menu">
                <div class="b-home-main-menu-help">
                    <ul>
                        <li @click="gotoHelp">
                            <span class="iconfont icon-help"></span>
                            <span>投资规则</span>
                        </li>
                        <li @click="modal2 = true">
                            <span class="iconfont icon-help"></span>
                            <span>咨询客服</span>
                        </li>
                    </ul>
                </div>
                <menu-view :menu="menu" :isLogin="is_login"></menu-view>
            </div>
            <Modal v-model="modal2" width="220">
                <p slot="header">
                    <span>扫码联系我们</span>
                </p>
                <div class="b-home-main-ma">
                    <div class="b-home-main-ma-box">
                        <p>微信</p>
                        <div>
                            <img src="./../assets/image/wx.png" />
                        </div>
                    </div>
                    <div class="b-home-main-ma-box">
                        <p>QQ</p>
                        <div>
                            <img src="./../assets/image/qq.jpg" />
                        </div>
                    </div>
                </div>
                <div slot="footer">
                    <Button type="success" size="default" long @click="del"
                        >确定</Button
                    >
                </div>
            </Modal>
        </div>
        <foot></foot>
    </div>
</template>

<script>
import countTo from "vue-count-to";
import menuView from "./../components/menu_card";
import contentCard from "./../components/content_card";
import newCard from "./../components/news_card";
import foot from "./../components/foot";
import { mylocalStorage, queryInvestTotal } from "./../utils/request_api";
import { delCookie } from "./../utils/cookie";
import { log } from "util";

export default {
    name: "index",
    inject: ["reload"],
    data() {
        return {
            is_login: false,
            modal2: false,
            name: "李学麟",
            code: "",
            amount: {
                financial_first: "500W",
                financial_two: "300W"
            },
            userInfo: {
                name: "李雪莉",
                photo: "./../assets/image/photo.jpeg",
                income: 100,
                bonus: 20
            },
            total: {
                startVal: 0,
                endVal: 0,
                duration: 100,
                float: 1
            },
            balance: {
                startVal: 0,
                endVal: 0,
                duration: 300,
                float: 1,
                income: 0
            },
            income: {
                startVal: 0,
                endVal: 0,
                duration: 300,
                float: 1
            },
            bonus: {
                startVal: 0,
                endVal: 0,
                duration: 300,
                float: 1
            },
            banner: {
                speed: 1500
            },
            invest_list: {
                title: "精选投资",
                invest: [
                    {
                        rate: "2.33%",
                        tip: "七日收益率",
                        title: "创博动力最新投资",
                        cont: "这是最新开时发放的投资收益"
                    },
                    {
                        rate: "4.33%",
                        tip: "七日收益率",
                        title: "创博动力最新投资",
                        cont: "这是最新开时发放的投资收益"
                    }
                ]
            },
            help: [
                {
                    name: "规则介绍",
                    type: "iconfont icon-help",
                    route: "/help"
                },
                {
                    name: "咨询客服",
                    type: "iconfont icon-hot",
                    route: "/customer"
                }
            ],
            menu: [
                {
                    name: "我的银行卡",
                    type: "iconfont icon-credit-card",
                    route: "/bank"
                },
                {
                    name: "修改密码",
                    type: "iconfont icon-icon_eye",
                    route: "/change_pwd"
                }
            ]
        };
    },
    components: {
        contentCard,
        newCard,
        countTo,
        foot,
        menuView
    },
    mounted() {
        this.isLogin();
        // wxapi.wxRegister(this.wxRegCallback)
        if (localStorage.getItem("username")) {
            this.name = localStorage.getItem("username");
            this.code = localStorage.getItem("code");
        }

        // this.queryTotal();
        this.queryCapital();
    },
    methods: {
        loginOut() {
            localStorage.setItem("user_id", "");
            localStorage.setItem("session_id", "");
            localStorage.setItem("username", "");
            localStorage.setItem("code", "");
            localStorage.setItem("type", "");
            delCookie("session_id");
            this.$router.push({
                path: "/",
                query: { timestamp: new Date().getTime() }
            });
        },
        gotoHelp() {
            this.$router.push({ name: "help" });
        },
        goToLogin() {
            this.$router.push({ path: "/login" });
        },
        goToRegister() {
            this.$router.push({ path: "/register" });
        },
        isLogin() {
            if (mylocalStorage.getItem("username")) {
                this.is_login = true;
                this.userInfo.name = localStorage.getItem("username");
            }
        },
        goToDeposit() {
            this.$router.push({ path: "/deposit" });
        },
        wxRegCallback() {
            // 用于微信JS-SDK回调
            this.wxShareTimeline();
            this.wxShareAppMessage();
        },
        wxShareTimeline() {
            // 微信自定义分享到朋友圈
            let option = {
                title: "限时团购周 挑战最低价", // 分享标题, 请自行替换
                link: window.location.href.split("#")[0], // 分享链接，根据自身项目决定是否需要split
                imgUrl: "logo.png", // 分享图标, 请自行替换，需要绝对路径
                success: () => {
                    alert("分享成功");
                },
                error: () => {
                    alert("已取消分享");
                }
            };
            // 将配置注入通用方法
            wxapi.ShareTimeline(option);
        },
        wxShareAppMessage() {
            // 微信自定义分享给朋友
            let option = {
                title: "限时团购周 挑战最低价", // 分享标题, 请自行替换
                desc: "限时团购周 挑战最低价", // 分享描述, 请自行替换
                link: window.location.href.split("#")[0], // 分享链接，根据自身项目决定是否需要split
                imgUrl: "logo.png", // 分享图标, 请自行替换，需要绝对路径
                success: () => {
                    alert("分享成功");
                },
                error: () => {
                    alert("已取消分享");
                }
            };
            // 将配置注入通用方法
            wxapi.ShareAppMessage(option);
        },
        wxShare() {
            this.$Message.warning("分享功能正在维护中！！");
        },
        goToInvest() {
            this.$router.push({
                name: "invest",
                params: {
                    financial_id: 2
                }
            });
        },
        async queryCapital() {
            let data = {
                user_id: localStorage.getItem("user_id")
            };
            let arr = [
                this.$Http.queryBalanceTotal(data),
                this.$Http.queryInvestTotal(data),
                this.$Http.queryIncomeTotal(data),
                this.$Http.queryBonusTotal(data)
            ];
            try {
                let res = await Promise.all(arr);
                this.balance.endVal = res[0].data.count;
                this.balance.income = res[0].data.income;
                this.invest_total = Number(res[1].data.total);
                this.income.endVal = res[2].data.total;
                this.bonus.endVal = res[3].data.total;
                this.total.endVal =
                    this.balance.endVal +
                    this.invest_total +
                    this.income.endVal +
                    this.bonus.endVal;
            } catch (error) {
                return this.$Message.error("请求失败");
            }
        },
        del() {
            setTimeout(() => {
                this.modal2 = false;
            }, 1000);
        }
    }
};
</script>

<style lang="less" scoped>
@import "./../assets/css/index";
@import "./../assets/fonts/iconfont.css";
</style>
