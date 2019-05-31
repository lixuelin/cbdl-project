<template>
  <div class="invest">
    <!--<div class="invest-module">-->
    <!--<h3>项目详情</h3>-->
    <!--<div class="invest-module-about">-->
    <!--<p>据悉，双方商定将发挥各自优势，集聚创新资源，在引导支持民营企业强化关键核心技术攻关、引导支持民营企-->
    <!--业加强创新能力建设、深入推进科技创新政策的宣传普及等9个方面开展战略合作，进一步提升民营企业创新能力，-->
    <!--为经济高质量发展提供强有力的科技支撑。</p>-->
    <!--<p>据悉，双方商定将发挥各自优势，集聚创新资源，在引导支持民营企业强化关键核心技术攻关、引导支持民营企-->
    <!--业加强创新能力建设、深入推进科技创新政策的宣传普及等9个方面开展战略合作，进一步提升民营企业创新能力，-->
    <!--为经济高质量发展提供强有力的科技支撑。</p>-->
    <!--</div>-->
    <!--</div>-->
    <div class="invest-module">
      <h3>选择投资金额</h3>
      <div class="invest-module-bank">
        <ul>
          <template v-for="(item, index) in invest_check_money">
            <li @click="checkInvestMoney(index)">
              <div :class="{'invest-module-bank-num': true,'invest-module-bank-checked': index === checked_money.index}">
                <span>{{item}}</span>
              </div>
            </li>
          </template>
        </ul>
      </div>
    </div>
    <div class="invest-module">
      <h3>选择支付方式</h3>
      <div class="invest-module-way">
        <ul>
          <template v-for="(item, index) in invest_check_pay">
            <li @click="checkInvestPay(index)">
              <div :class="{'invest-module-pay': true,
                            'invest-module-wx': index === 0,
                            'invest-module-ali': index === 1,
                            'invest-module-pay-checked': index === checked_pay.index}">
                <template v-if="index === 0">
                  <span class="iconfont icon-weixinzhifu"></span>
                </template>
                <template v-else>
                  <span class="iconfont icon-alipay"></span>
                </template>
                <span>{{item}}</span>
              </div>
            </li>
          </template>
        </ul>
      </div>
    </div>
    <div class="invest-sure">
      <div class="invest-sure-btn">
        <Button type="primary" icon="md-checkmark-circle" :loading="modal_loading" @click="sureInvest">投资</Button>
        <Modal v-model="modal2" width="220">
          <p slot="header">
            <span>投资</span>
          </p>
          <div class="invest-sure-tips">
            <Icon type="md-checkmark-circle-outline" />
            <p>{{invest_msg}}</p>
          </div>
          <div slot="footer">
            <Button type="success" size="default" long @click="del">确定</Button>
          </div>
        </Modal>
      </div>
    </div>
    <div class="invest-hot">
      <!--<Carousel autoplay :autoplay-speed="banner.speed">-->
      <!--<Carousel-item>-->
      <!--<div class="demo-carousel">-->
      <!--<div class="invest-hot-img">-->
      <!--<img src="./../assets/image/banner_02.jpg" alt="">-->
      <!--</div>-->
      <!--</div>-->
      <!--</Carousel-item>-->
      <!--<Carousel-item>-->
      <!--<div class="demo-carousel">-->
      <!--<div class="invest-hot-img">-->
      <!--<img src="./../assets/image/banner_02.jpg" alt="">-->
      <!--</div>-->
      <!--</div>-->
      <!--</Carousel-item>-->
      <!--<Carousel-item>-->
      <!--<div class="demo-carousel">-->
      <!--<div class="invest-hot-img">-->
      <!--<img src="./../assets/image/banner_02.jpg" alt="">-->
      <!--</div>-->
      <!--</div>-->
      <!--</Carousel-item>-->
      <!--<Carousel-item>-->
      <!--<div class="demo-carousel">-->
      <!--<div class="invest-hot-img">-->
      <!--<img src="./../assets/image/banner_02.jpg" alt="">-->
      <!--</div>-->
      <!--</div>-->
      <!--</Carousel-item>-->
      <!--</Carousel>-->
    </div>
    <foot></foot>
  </div>
</template>

<script>
  import foot from "./../components/foot"
  import {mylocalStorage, userInvest} from "./../utils/request_api";

  export default {
    name: "invest",
    data () {
      return {
        modal2: false,
        modal_loading: false,
        invest_msg: "",
        banner: {
          speed: 1500
        },
        checked_money: {
          index: 0,
          money: 1000
        },
        invest_check_money: [
          1000, 5000, 10000, 30000
        ],
        checked_pay: {
          index: 0,
          pay: "微信"
        },
        invest_check_pay: [
          "微信", "支付宝"
        ]
      }
    },
    components: {
      foot
    },
    methods: {
      checkInvestMoney (index) {
        this.checked_money.index = index;
        this.checked_money.money = this.invest_check_money[index];
      },
      checkInvestPay (index) {
        this.checked_pay.index = index;
        this.checked_pay.pay = this.invest_check_pay[index];
      },
      sureInvest () {
        let data = {
          user_id: mylocalStorage.getItem("user_id"),
          money: this.checked_money.money,
          pay: this.checked_pay.pay
        }
        console.log(mylocalStorage.getItem("user_id"), "dd")
        if (mylocalStorage.getItem("user_id") === "" || mylocalStorage.getItem("user_id") === null) {
          this.$Message.warning("请先登录后操作！")
          return
        }
        this.modal_loading = true;
        userInvest(data).then(response => {
          console.log(response)
          let code = response.status;
          console.log(code)
          this.modal_loading = false;
          if (code === 200) {
            this.modal_common("恭喜您，投资成功！")
          } else {
            this.modal_common("抱歉投资失败！")
          }
        }).catch(error => {
          this.modal_common ("请求失败！")
          console.log(error, "error")
        });
      },
      modal_common (msg) {
        this.modal2 = true;
        this.modal_loading = true;
        this.invest_msg = msg;
        setTimeout(() => {
          this.modal_loading = false;
          this.modal2 = false;
          // this.$Message.success(this.invest_msg);
        }, 2000);
      },
      del () {
        // this.modal_loading = true;
        setTimeout(() => {
          // this.modal_loading = false;
          this.modal2 = false;
        }, 2000);
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "./../assets/css/invest";
</style>
