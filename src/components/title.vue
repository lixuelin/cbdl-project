<template>
	<div class="admin-title">
		<h2>{{title}}</h2>
	</div>
</template>

<script>
    export default {
        name: "admin-title",
        props: ["title"]
    };
</script>

<style lang="less" scoped>
	@import "./../assets/admin/components";
</style>
