<template>
	<div class="news-card">
		<header class="news-card-header">
			<h3>{{title}}</h3>
			<div>
				<span>更多</span>
			</div>
		</header>
		<article class="news-card-body">
			<ul>
				<template v-for="item in news">
					<li>
						<div class="news-card-body-img">
							<img :src="item.img" alt="">
						</div>
						<div class="news-card-body-cont">
							<h4>{{item.title}}</h4>
							<div class="news-card-body-cont-source">
								<p>{{item.source}}</p>
								<p>{{item.author}} {{item.time}}</p>
							</div>
						</div>
					</li>
				</template>
			</ul>
			<div class="news-card-footer">
				<button type="button">换一批</button>
			</div>
		</article>
	</div>
</template>

<script>
    export default {
        name: "news_card",
        data() {
            return {
                title: "财富专栏",
                news: [
                    {
                        img: "http://pic-bucket.nosdn.127.net/photo/0001/2018-10-30/DVD5JFN63R710001NOS.jpg",
                        title: "金庸逝世：从此江湖再无武侠",
                        source: "网易看客",
                        author: "李学麟",
                        time: "04-27"
                    },
                    {
                        img: "http://pic-bucket.nosdn.127.net/photo/0001/2018-02-03/D9N8Q3AT3R710001NOS.jpg?imageView&thumbnail=900y600",
                        title: "绿皮车上每一碗泡面都值得认真对待",
                        source: "网易看客",
                        author: "李学麟",
                        time: "04-27"
                    },
                    {
                        img: "http://pic-bucket.nosdn.127.net/photo/0001/2017-11-10/D2SHKFJT3R710001NOS.jpg",
                        title: "特朗普 - 不爱拍照",
                        source: "网易看客",
                        author: "李学麟",
                        time: "04-27"
                    },
                    {
                        img: "http://img3.cache.netease.com/photo/0001/2017-01-26/CBLVG4C83R710001.jpg",
                        title: "渗液车站 - 不夜城",
                        source: "网易看客",
                        author: "李学麟",
                        time: "04-27"
                    },
                    {
                        img: "http://img2.cache.netease.com/photo/0001/2017-02-13/CD6JG2I43R710001.jpg",
                        title: "陇南高山上，住着'神'的村庄",
                        source: "网易看客",
                        author: "李学麟",
                        time: "04-27"
                    }
                
                ]
            };
        }
    };
</script>

<style lang="less" scoped>
	@import "./../assets/css/components.less";
</style>