<template>
    <div class="bonus">
        <header class="bonus-head">
            <div class="bonus-head-img">
                <img alt="" src="./../assets/image/bonus_bg.png" />
            </div>
            <div class="bonus-head-total">
                <p>总奖金</p>
                <div class="bonus-head-total-cont">
                    <countTo
                        :decimals="total.float"
                        :duration="total.speed"
                        :endVal="bonus.total"
                        :startVal="total.startVal"
                    ></countTo>
                </div>
                <div class="bonus-head-total-other">
                    <div>
                        <p class="bonus-head-total-other-num">
                            {{ bonus.allTotal }}
                        </p>
                        <p class="bonus-head-total-other-tip">累计奖金</p>
                    </div>
                    <div>
                        <p class="bonus-head-total-other-num">
                            {{ bonus.todayTotal }}
                        </p>
                        <p class="bonus-head-total-other-tip">我的总投资</p>
                    </div>
                </div>
                <div class="bonus-head-total-handler">
                    <template v-if="bonus.total < 100">
                        <Button disabled="" size="default"
                            >不足100元不可提现</Button
                        >
                    </template>
                    <template v-else>
                        <Button
                            @click="draw_modal = true"
                            size="default"
                            type="primary"
                            >提现</Button
                        >
                    </template>
                    <Button @click="showNextUser" size="primary"
                        >查看团队成员</Button
                    >
                </div>
            </div>
        </header>
        <div class="bonus-body">
            <h3>我的团队 总收益：¥{{ income_total }}</h3>
            <div class="bonus-body-next">
                <ul>
                    <li>
                        <div class="bonus-body-next-part">
                            用户账号
                        </div>
                        <div class="bonus-body-next-flex">
                            <div class="bonus-body-next-grid">
                                收益金额
                            </div>
                            <div class="bonus-body-next-grid">
                                更新时间
                            </div>
                            <div class="bonus-body-next-grid">
                                我的奖金
                            </div>
                        </div>
                    </li>
                    <template v-for="item in next_list">
                        <li :key="item">
                            <div
                                class="bonus-body-next-part bonus-body-next-name"
                            >
                                <div>
                                    <p>{{ item.household }}</p>
                                    <p
                                        class="showIteam"
                                        @click="showNext(item)"
                                    >
                                        团队分享
                                    </p>
                                </div>
                            </div>
                            <div class="bonus-body-next-grid">
                                <div>
                                    <p class="bonus-body-next-grid-num">
                                        {{ item.invest_num }}
                                    </p>
                                </div>
                            </div>
                            <div class="bonus-body-next-grid">
                                <p>{{ item.create_time }}</p>
                            </div>
                            <div class="bonus-body-next-grid">
                                <p class="bonus-body-next-grid-num">
                                    {{ item.bonus_num }}
                                </p>
                            </div>
                        </li>
                    </template>
                </ul>
            </div>
        </div>
        <foot></foot>
        <Modal v-model="draw_modal" width="220">
            <p slot="header">
                <span>提现</span>
            </p>
            <div>
                <div class="bonus-head-total-handler-draw">
                    <p>提现奖金：</p>
                    <p>{{ bonus.total }}</p>
                </div>
                <hr-view></hr-view>
                <p class="bonus-head-total-handler-tips">资金返回至余额内</p>
            </div>
            <div slot="footer">
                <Button
                    @click="draw_modal_sure = true"
                    long
                    size="default"
                    type="success"
                    >确定</Button
                >
                <Modal v-model="draw_modal_sure" width="220">
                    <p slot="header">
                        <span>提现</span>
                    </p>
                    <div>
                        <p>请输入交易密码：</p>
                        <div class="bonus-head-total-handler-password">
                            <i-input
                                placeholder="请输入交易密码"
                                style="width: 220px"
                                type="password"
                                v-model="cash_pwd"
                            ></i-input>
                        </div>
                    </div>
                    <div slot="footer">
                        <Button
                            :loading="modal_loading"
                            @click="cashBonusSure"
                            long
                            size="default"
                            type="success"
                            >确定
                        </Button>
                    </div>
                </Modal>
            </div>
        </Modal>
        <Modal v-model="next_user" width="220">
            <p slot="header">
                <span>我的团队</span>
            </p>
            <div class="bonus-body-next-list">
                <template v-for="item in first_user_list">
                    <div class="bonus-body-next-list-cont" :key="item">
                        <span>{{ item.household }}</span>
                        <button></button>
                        <Button
                            @click="showNextNextUser(item)"
                            size="small"
                            type="primary"
                            >团队分享</Button
                        >
                    </div>
                </template>
            </div>
            <div slot="footer">
                <Button
                    @click="next_user = false"
                    long
                    size="default"
                    type="primary"
                    >确定</Button
                >
            </div>
        </Modal>
        <Modal v-model="next_next_user" width="220">
            <p slot="header">
                <span>团队分享</span>
            </p>
            <div class="bonus-body-next-list">
                <template v-for="item in second_user_list">
                    <div class="bonus-body-next-list-cont" :key="item">
                        <span>{{ item.household }}</span>
                    </div>
                </template>
            </div>
            <div slot="footer">
                <Button
                    @click="next_next_user = false"
                    long
                    size="default"
                    type="primary"
                    >确定</Button
                >
            </div>
        </Modal>
        <Modal v-model="show_next" width="220">
            <p slot="header">
                <span>查看{{ next_household }}的团队</span>
            </p>
            <div class="bonus-body-next-list">
                <div class="bonus-body-next-list-cont">
                    <span>用户账号</span>
                    <span>收益金额</span>
                    <span>更新时间</span>
                    <span>我的奖金</span>
                </div>
                <template v-for="item in next_invest">
                    <div class="bonus-body-next-list-cont" :key="item">
                        <span>{{ item.household }}</span>
                        <span>{{ item.invest_num }}</span>
                        <span>{{ item.create_time }}</span>
                        <span>{{ item.bonus_num }}</span>
                    </div>
                </template>
            </div>
            <div slot="footer">
                <Button
                    @click="show_next = false"
                    long
                    size="default"
                    type="primary"
                    >确定</Button
                >
            </div>
        </Modal>
    </div>
</template>

<script>
import countTo from "vue-count-to";
import { uniqBy } from "lodash";
import cut from "./../components/cut";
import foot from "./../components/foot";

export default {
    name: "bonus",
    data() {
        return {
            bonus: {
                total: 0
            },
            total: {
                startVal: 0,
                endVal: 53204.43,
                duration: 3000,
                float: 2
            },
            draw_modal: false,
            draw_modal_sure: false,
            show_next: false,
            modal_loading: false,
            cash_pwd: "",
            next_list: [],
            next_household: "",
            next_invest: [],
            next_user: false,
            first_user_list: [],
            next_next_user: false,
            second_user_list: [],
            income_total: 0
        };
    },
    components: {
        "hr-view": cut,
        countTo,
        foot
    },
    mounted() {
        this.bonusTotal();
        this.getList();
        this.getTeamIncome();
    },
    methods: {
        async getTeamIncome() {
            let data = {
                user_id: localStorage.getItem("user_id")
            };
            let res = null;
            try {
                res = await this.$Http.queryTeamIncome(data);
                this.income_total = res.data ? res.data.total : 0;
            } catch (error) {
                this.$Message.error(`请求失败 ${res.msg}`);
            }
        },
        getList() {
            let user_id = localStorage.getItem("user_id");
            let data = {
                user_id
            };
            if (
                localStorage.getItem("user_id") === "" ||
                localStorage.getItem("user_id") === null
            ) {
                return;
            }
            this.getBonusList(data);
        },
        async getBonusList(data) {
            let res = null;
            try {
                res = await this.$Http.queryBonusList(data);
                this.next_list = res.data.bonus_list;
            } catch (error) {
                this.$Message.error(`奖金列表获取失败: ${res.msg}！`);
            }
        },
        async bonusTotal() {
            let data = {
                user_id: localStorage.getItem("user_id")
            };
            if (
                localStorage.getItem("user_id") === "" ||
                localStorage.getItem("user_id") === null
            ) {
                return;
            }
            let res = null;
            try {
                res = await this.$Http.queryBonusTotal(data);
                this.bonus = res.data;
            } catch (error) {
                this.$Message.error(`奖金获取失败: ${res.msg}`);
            }
        },
        async cashBonusSure() {
            if (this.cash_pwd === "") {
                return this.$Message.error("密码不能为空！");
            }

            if (
                localStorage.getItem("user_id") === "" ||
                localStorage.getItem("user_id") === null
            ) {
                return;
            }

            let data = {
                id: localStorage.getItem("user_id"),
                cash_pwd: this.cash_pwd
            };
            this.modal_loading = true;
            let res = null;
            try {
                res = await this.$Http.queryUser(data);
                console.log(res, "user");

                if (!res.data) {
                    return this.$Message.error("密码错误！");
                }
                this.cashBonus(localStorage.getItem("user_id"));
            } catch (error) {
                console.log(error, "rrr");
                this.$Message.error(`请求失败:${res.msg}`);
            }
        },
        async cashBonus(user_id) {
            let data = {
                user_id,
                cash_num: this.bonus.total
            };
            if (
                localStorage.getItem("user_id") === "" ||
                localStorage.getItem("user_id") === null
            ) {
                return;
            }
            this.cash_pwd = "";
            let res = null;
            try {
                res = await this.$Http.bonusCashMoney(data);
                this.draw_modal = false;
                this.draw_modal_sure = false;
                this.bonusTotal();
                this.modal_loading = false;
                this.$Message.success("提现成功，2小时内未到账请联系客服！");
            } catch (error) {
                this.$Message.error(`提现失败: ${res.msg}！`);
            }
        },
        async showNext(item) {
            let data = {
                user_id: item.user_id
            };
            this.next_household = item.household;
            this.show_next = true;
            if (
                localStorage.getItem("user_id") === "" ||
                localStorage.getItem("user_id") === null
            ) {
                return;
            }
            let res = null;
            try {
                res = await this.$Http.queryBonusNextList(data);
                this.next_invest = res.data.list;
            } catch (error) {
                this.$Message.error(`奖金列表获取失败: ${res.msg}！`);
            }
        },
        async showNextUser() {
            let data = {
                user_id: localStorage.getItem("user_id")
            };
            let res = null;
            try {
                res = await this.$Http.queryUserNext(data);
                if (res.data.length === 0) {
                    return this.$Message.warning("当前用户没有团队");
                }
                this.next_user = true;
                this.first_user_list = res.data;
            } catch (error) {
                this.$Message.error(`请求失败:${res.msg}`);
            }
        },
        async showNextNextUser(item) {
            let data = {
                user_id: item.lower_id
            };
            let res = null;
            try {
                res = await this.$Http.queryUserNext(data);
                if (res.data.length === 0) {
                    return this.$Message.warning("当前用户没有团队");
                }
                this.next_user = true;
                this.first_user_list = res.data;
            } catch (error) {
                this.$Message.error(`请求失败:${res.msg}`);
            }
        }
    }
};
</script>

<style lang="less" scoped>
@import "./../assets/css/bonus";

.showIteam {
    color: #3679ff;
}
</style>
