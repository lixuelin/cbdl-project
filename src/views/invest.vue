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
						<li @click="checkInvestMoney(index)" :key="item">
							<div
								:class="{'invest-module-bank-num': true,'invest-module-bank-checked': index === checked_money.index}">
								<span>{{item}}</span>
							</div>
						</li>
					</template>
				</ul>
			</div>
		</div>
		<div class="invest-module">
			<h3>支付方式</h3>
			<div class="invest-module-way">
				<ul>
					<template v-for="(item, index) in invest_check_pay">
						<li @click="checkInvestPay(index)" :key="item">
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
				<!--<Button type="primary" icon="md-checkmark-circle" :loading="invest_show_way" @click="invest_show_way=true">投资</Button>-->
				<Modal v-model="invest_show_way" width="220">
					<p slot="header">
						<span>投资</span>
					</p>
					<div>
						<p>请您将投资款转账到公司账户，收到后将计算收益：</p>
						<div class="invest-sure-count">
							<p class="ctrlBtn" @click="ctrlCBtn" :data-clipboard-text="company">
								<span>账户：</span>
								<span>深圳市鑫鼎翔电子商务有限公司</span>
								<Button type="primary" size="small" data-clipboard-text="深圳市鑫鼎翔电子商务有限公司">复制</Button>
							</p>
							<p class="ctrlBtn" @click="ctrlCBtn" :data-clipboard-text="bank_add">
								<span>开户行：</span>
								<span>中国农业银行深圳中心区支行</span>
								<Button type="primary" size="small" data-clipboard-text="中国农业银行深圳中心区支行">复制</Button>
							</p>
							<p class="ctrlBtn" @click="ctrlCBtn" :data-clipboard-text="bank_code">
								<span>银行账号：</span>
								<span>41005000040046406</span>
								<Button type="primary" size="small" data-clipboard-text="41005000040046406">复制</Button>
							</p>
						</div>
					</div>
					<div slot="footer">
						<i-button type="primary" long :loading="loading" @click="sureInvest">
							<span>确定</span>
						</i-button>
					</div>
				</Modal>
				<Modal v-model="modal2" width="220">
					<p slot="header">
						<span>投资</span>
					</p>
					<div class="invest-sure-tips">
						<Icon type="md-checkmark-circle-outline"/>
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
    import Clipboard from "clipboard";
    import foot from "./../components/foot";
    import { mylocalStorage, userInvest } from "./../utils/request_api";
    
    export default {
        name: "invest",
        data() {
            return {
                invest_show_way: false,
                modal2: false,
                modal_loading: false,
                invest_msg: "",
                banner: {
                    speed: 1500
                },
                company: "深圳市鑫鼎翔电子商务有限公司",
                bank_code: "41005000040046406",
                bank_add: "中国农业银行深圳中心区支行",
                checked_money: {
                    index: null,
                    money: null
                },
                invest_check_money: [
                    1000, 5000, 10000, 30000
                ],
                checked_pay: {
                    index: null,
                    pay: "转账"
                },
                invest_check_pay: [
                    "银行转账", "支付宝"
                ]
            };
        },
        components: {
            foot
        },
        methods: {
            checkInvestMoney(index) {
                this.checked_money.index = index;
                this.checked_money.money = this.invest_check_money[index];
            },
            checkInvestPay(index) {
                this.checked_pay.index = index;
                this.checked_pay.pay = this.invest_check_pay[index];
                if (index === 0) {
                    this.checked_pay.index = 0;
                    this.checked_pay.pay = this.invest_check_pay[0];
                    if (this.checked_money.index === null) {
                        this.$Message.warning("请先选择投资金额！");
                        return;
                    }
                    this.invest_show_way = true;
                }
                if (index === 1) {
                    this.$Message.warning("支付宝功能正在维护中！");
                    this.checked_pay.index = 0;
                    this.checked_pay.pay = this.invest_check_pay[0];
                }
            },
            ctrlCBtn() {
                let clipboard = new Clipboard(".ctrlBtn");
                clipboard.on("success", e => {
                    this.$Message.warning("已复制至剪贴板");
                    setTimeout(() => {
                        //  self.$emit("closeshare")
                    }, 2000);
                    e.clearSelection();
                    // 释放内存
                    clipboard.destroy();
                });
                //失败回调
                clipboard.on("error", e => {
                    this.$Message.warning("该浏览器不支持一键复制,请手动复制");
                    setTimeout(() => {
                        this.$emit("closeshare");
                    }, 2000);
                    // 释放内存
                    clipboard.destroy();
                });
            },
            sureInvest() {
                let data = {
                    user_id: mylocalStorage.getItem("user_id"),
                    money: this.checked_money.money,
                    pay: this.checked_pay.pay
                };
                if (mylocalStorage.getItem("user_id") === "" || mylocalStorage.getItem("user_id") === null) {
                    this.$Message.warning("请先登录后操作！");
                    return;
                }
                
                this.modal_loading = true;
                userInvest(data).then(response => {
                    let code = response.status;
                    this.modal_loading = false;
                    if (code === 200) {
                        this.modal_common("投资成功，10分钟内未到账请联系客服!");
                        this.invest_show_way = false;
                    } else {
                        this.modal_common("抱歉投资失败！");
                        this.invest_show_way = false;
                    }
                }).catch(error => {
                    this.modal_common("请求失败！");
                    this.modal2 = false;
                    console.log(error, "error");
                });
            },
            modal_common(msg) {
                this.modal2 = true;
                this.modal_loading = true;
                this.invest_msg = msg;
            },
            del() {
                setTimeout(() => {
                    this.modal2 = false;
                }, 500);
            }
        }
    };
</script>

<style lang="less" scoped>
	@import "./../assets/css/invest";
</style>
