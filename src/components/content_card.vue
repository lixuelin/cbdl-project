<template>
	<div class="content-card">
		<header class="content-card-header">
			<h3>{{content.title}}</h3>
			<div class="content-card-header-more">
                <span>
                    <Icon type="ios-plus-empty"></Icon>
                </span>
			</div>
		</header>
		<article class="content-card-body">
			<ul>
				<template v-for="item in content.invest">
					<li>
						<div class="content-card-body-rate">
							<div class="content-card-body-rate-num">
								<span>{{item.rate}}</span>
							</div>
							<p>{{item.tip}}</p>
						</div>
						<div class="content-card-body-cont">
							<h4>{{item.title}}</h4>
							<p>{{item.cont}}</p>
						</div>
					</li>
				</template>
			</ul>
		</article>
	</div>
</template>

<script>
    export default {
        name: "content-card",
        data() {
            return {
                name: "lss"
            };
        },
        props: ["content"]
    };
</script>

<style lang="less" scoped>
	@import "./../assets/css/components.less";
</style>