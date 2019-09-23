<template>
	<div class="home">
		<header class="home-header">
			<div class="home-header-cont">
				<h1 class="home-header-cont-title">{{this.$menu.name}}</h1>
			</div>
		</header>
		<router-view v-if="isRouterAlive"></router-view>
		<div class="home-foot">
			<ul>
				<li v-for="(item, index) in menu" :key="item.name" @click="checkedPage(index)">
					<router-link :to="item.route">
						<div :class="{'home-foot-menu': true, 'home-foot-active': menu_active === index}">
							<div>
								<span :class="item.type"></span>
							</div>
							<span>{{item.name}}</span>
						</div>
					</router-link>
				</li>
			</ul>
		</div>
	</div>
</template>

<script>
    export default {
        name: "home",
        provide() {
            return {
                reload: this.reload
            };
        },
        data() {
            return {
                title: "首页",
                menu_active: 0,
                menu: [
                    {
                        "name": "首页",
                        "type": "iconfont icon-home",
                        "route": "/home"
                    },
                    {
                        "name": "理财",
                        "type": "iconfont icon-funds-line",
                        "route": "/financial"
                    },
                    {
                        "name": "奖金",
                        "type": "iconfont icon-Dollar",
                        "route": "/bonus"
                    },
                    {
                        "name": "余额",
                        "type": "iconfont icon-Dollar",
                        "route": "/balance"
                    }
                ],
                isRouterAlive: true
            };
        },
        mounted() {
            this.title = this.$menu.name;
        },
        methods: {
            reload() {
                this.isRouterAlive = false;
                this.$nextTick(function() {
                    this.isRouterAlive = true;
                });
            },
            checkedPage(index) {
                this.menu_active = index;
                this.title = this.menu[index].name;
                this.$menu.index = index;
                this.$menu.name = this.menu[index].name;
            }
        }
    };
</script>

<style lang="less" scoped>
	@import "./../assets/css/home";
</style>
<style lang="css" scoped>
	@import "./../assets/fonts/iconfont.css";
</style>
