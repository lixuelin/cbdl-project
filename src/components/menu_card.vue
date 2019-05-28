<template>
    <div class="menu-card">
        <ul>
            <template v-if="!isLogin">
                <template v-for="item in menu">
                    <li @click="tipLogin">
                        <span :class="item.type"></span>
                        <span>
                            {{item.name}}
                        </span>
                    </li>
                </template>
            </template>
            <template v-else>
                <template v-for="item in menu">
                    <li>
                        <router-link :to="item.route">
                            <span :class="item.type"></span>
                            <span>
                                {{item.name}}
                            </span>
                        </router-link>
                    </li>
                </template>
            </template>
        </ul>
    </div>
</template>

<script>
	export default {
		name: "menu_card",
        props: ["menu", "isLogin"],
        data () {
			return {
				
            }
        },
        methods: {
	        tipLogin () {
	        	this.$Message.warning("请先登录后再操作界面")
		        window.location = "/login"
            }
        }
	}
</script>

<style lang="less" scoped>
    @import "./../assets/css/components.less";
</style>