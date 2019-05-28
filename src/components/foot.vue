<template>
    <div class="foot">
        <div class="foot-cont">
            <div class="foot-cont-right">
                <p>{{name}}</p>
            </div>
            <div class="foot-cont-left">
                <p>{{note}}</p>
            </div>
        </div>
        <div class="foot-version">
            <span>{{version}}</span>
        </div>
    </div>
</template>

<script>
	export default {
		name: "foot",
        data () {
			return {
				name: "创博动力",
                note: "为人生更自由",
                version: "V1.0.0"
            }
        }
	}
</script>

<style lang="less" scoped>
    @import "./../assets/css/components.less";
</style>