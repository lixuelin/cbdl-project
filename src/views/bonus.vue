<template>
  <div class="bonus">
    <header class="bonus-head">
      <div class="bonus-head-img">
        <img src="./../assets/image/bonus_bg.png" alt="">
      </div>
      <div class="bonus-head-total">
        <p>总奖金</p>
        <div class="bonus-head-total-cont">
          <countTo :startVal='total.startVal' :endVal='bonus.total' :duration='total.speed' :decimals="total.float"></countTo>
        </div>
        <div class="bonus-head-total-other">
          <div>
            <p class="bonus-head-total-other-num">{{bonus.allTotal}}</p>
            <p class="bonus-head-total-other-tip">累计奖金</p>
          </div>
          <div>
            <p class="bonus-head-total-other-num">{{bonus.todayTotal}}</p>
            <p class="bonus-head-total-other-tip">我的总投资</p>
          </div>
        </div>
        <div class="bonus-head-total-handler">
          <template v-if="bonus.total < 100">
            <Button size="default" disabled="">不足100元不可提现</Button>
          </template>
          <template v-else>
            <Button type="primary" size="default" @click="draw_modal = true">提现</Button>
          </template>
          <Button size="primary" @click="showNextUser">查看团队成员</Button>
        </div>
      </div>
    </header>
    <div class="bonus-body">
      <h3>我的团队分享</h3>
      <div class="bonus-body-next">
        <ul>
          <li>
            <div class="bonus-body-next-part">
              用户账号
            </div>
            <div class="bonus-body-next-flex">
              <div class="bonus-body-next-grid">
                奖金计算金额
              </div>
              <div class="bonus-body-next-grid">
                投资时间
              </div>
              <div class="bonus-body-next-grid">
                我的奖金
              </div>
            </div>
          </li>
          <template v-for="item in next_list">
            <li>
              <div class="bonus-body-next-part bonus-body-next-name">
                <div>
                  <p>{{item.household}}</p>
                  <p @click="showNext(item)">团队分享</p>
                </div>
              </div>
              <div class="bonus-body-next-cont">
                  <template v-for="invest in item.invest_list">
                      <div class="bonus-body-next-cont-flex">
                        <div class="bonus-body-next-grid">
                          <div>
                            <p class="bonus-body-next-grid-num">{{invest.invest_num}}</p>
                          </div>
                        </div>
                        <div class="bonus-body-next-grid">
                          <p>{{invest.create_time}}</p>
                        </div>
                        <div class="bonus-body-next-grid">
                          <p class="bonus-body-next-grid-num">{{invest.income_num}}</p>
                        </div>
                    </div>
                  </template>
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
          <p>{{bonus.total}}</p>
        </div>
        <hr-view></hr-view>
        <p class="bonus-head-total-handler-tips">资金返回至投资时使用的微信或支付宝零钱内</p>
      </div>
      <div slot="footer">
        <Button type="success" size="default" long @click="draw_modal_sure = true">确定</Button>
        <Modal v-model="draw_modal_sure" width="220">
          <p slot="header">
            <span>提现</span>
          </p>
          <div>
            <p>请输入提现密码：</p>
            <div class="bonus-head-total-handler-password">
              <i-input v-model="cash_pwd" type="password" placeholder="请输入提现密码" style="width: 220px"></i-input>
            </div>
          </div>
          <div slot="footer">
            <Button type="success" size="default" long :loading="modal_loading" @click="cashBonusSure">确定</Button>
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
          <div class="bonus-body-next-list-cont">
            <span >{{item.household}}</span>
            <button></button>
            <Button type="primary" size="small" @click="showNextNextUser(item)">团队分享</Button>
          </div>
        </template>
      </div>
      <div slot="footer">
        <Button type="primary" size="default" long  @click="next_user=false">确定</Button>
      </div>
    </Modal>
    <Modal v-model="next_next_user" width="220">
      <p slot="header">
        <span>团队分享</span>
      </p>
      <div class="bonus-body-next-list">
        <template v-for="item in second_user_list">
          <div class="bonus-body-next-list-cont">
            <span>{{item.household}}</span>
          </div>
        </template>
      </div>
      <div slot="footer">
        <Button type="primary" size="default" long @click="next_next_user=false">确定</Button>
      </div>
    </Modal>
    <Modal v-model="show_next" width="220">
      <p slot="header">
        <span>查看{{next_household}}的下层</span>
      </p>
      <div class="bonus-body-next-list">
        <div class="bonus-body-next-list-cont">
          <span>用户账号</span>
          <span>奖金计算金额</span>
          <span>投资时间</span>
          <span>我的奖金</span>
        </div>
        <template v-for="item in next_invest">
          <div class="bonus-body-next-list-cont">
            <span>{{item.household}}</span>
            <span>{{item.invest_num}}</span>
            <span>{{item.create_time}}</span>
            <span>{{item.bonus_num}}</span>
          </div>
        </template>
      </div>
      <div slot="footer">
        <Button type="primary" size="default" long :loading="modal_loading" @click="show_next=false">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import countTo from 'vue-count-to';
  import {uniqBy} from "lodash"
  import {
    bonusCashMoney,
    checkCashPwd,
    mylocalStorage,
    queryBonusList,
    queryBonusNextList,
    queryBonusTotal,
    findNext
  } from "../utils/request_api";
  import cut from "./../components/cut"
  import foot from "./../components/foot"

  export default {
    name: "bonus",
    data () {
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
        next_list: [{
          household: "李学麟",
          invest_list: []
        }],
        next_household: "",
        next_invest: [],
        next_user: false,
        first_user_list: [],
        next_next_user: false,
        second_user_list: []
      }
    },
    components: {
      "hr-view": cut,
      countTo,
      foot
    },
    mounted () {
      this.bonusTotal()
      this.getList()
    },
    methods: {
      getList () {
        let user_id = mylocalStorage.getItem("user_id")
        let data ={
          user_id
        };
        if (mylocalStorage.getItem("user_id") === "" || mylocalStorage.getItem("user_id") === null) {
          return
        }
        this.getBonusList(data)
      },
      getBonusList(data) {
        if (mylocalStorage.getItem("user_id") === "" || mylocalStorage.getItem("user_id") === null) {
          return
        }
        queryBonusList(data).then(response => {
          let data = response.data.data.bonus_list;
          if (data.length !== 0) {
            this.next_list = data
          }
          else {
            this.next_list = []
          }
        }).catch(error => {
          this.$Message.error("奖金列表获取失败！")
        })
      },
      bonusTotal() {
        let data ={
          user_id: mylocalStorage.getItem("user_id")
        }
        if (mylocalStorage.getItem("user_id") === "" || mylocalStorage.getItem("user_id") === null) {
          return
        }
        queryBonusTotal(data).then(response => {
          this.bonus = response.data.data;
          console.log(this.bonus, "bonus")
        }).catch(error => {
          this.$Message.error("奖金获取失败")
          console.log(error)
        });
      },
      cashBonusSure () {
        this.modal_loading = true;
        let user_id = mylocalStorage.getItem("user_id")
        if (this.cash_pwd === "") {
          return this.$Message.error("密码不能为空！")
        }

        if (mylocalStorage.getItem("user_id") === "" || mylocalStorage.getItem("user_id") === null) {
          return
        }

        let data = {
          user_id,
          cash_pwd: this.cash_pwd
        };
        checkCashPwd(data).then(response => {
          let is_exist = response.data.data.is_exist;
          if (is_exist) {
            this.cashBonus(user_id);
          } else {
            this.$Message.error("密码错误！")
          }
        }).catch(error => {
          console.log(error)
        });
      },
      cashBonus(user_id) {
        let data ={
          user_id
        };
        if (mylocalStorage.getItem("user_id") === "" || mylocalStorage.getItem("user_id") === null) {
          return
        }
        bonusCashMoney(data).then(response => {
          console.log(response)
          this.modal_loading = false;
          this.draw_modal = false;
          this.draw_modal_sure = false;
          this.bonusTotal();
          this.$Message.success("提现成功！");
        }).catch(error => {
          this.$Message.error("提现失败！");
          console.log(error)
        })
      },
      showNext(item) {
        let data = {
          user_id: item.id
        }
        this.next_household = item.household;
        this.show_next = true;
        if (mylocalStorage.getItem("user_id") === "" || mylocalStorage.getItem("user_id") === null) {
          return
        }
        queryBonusNextList(data).then(response => {
          let data = response.data.data.list;
          if (data.length !== 0) {
            this.next_invest = data
          }
          else {
            this.next_invest = []
          }
        }).catch(error => {
          this.$Message.error("奖金列表获取失败！")
        })
      },
      showNextUser() {
        let data = {
          user_id: mylocalStorage.getItem("user_id")
        }
        findNext(data).then(response => {
          let data = response.data.data
          if (data.length === 0) {
            this.$Message.warning("当前用户没有下级")
          } else {
            this.next_user = true
            this.first_user_list = data
          }
        }).catch(error => {
          console.log(error)
        })
      },
      showNextNextUser(item) {
        let data = {
          user_id: item.lower_id
        }
        findNext(data).then(response => {
          let data = response.data.data
          if (data.length === 0) {
            this.$Message.warning("当前用户没有下级")
          } else {
            this.next_next_user = true
            this.second_user_list = data
          }

        }).catch(error => {
          console.log(error)
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "./../assets/css/bonus";
</style>
