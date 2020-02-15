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
    <div class="foot-version">
      <a href="http://www.beian.miit.gov.cn/" target="_blank">
        <span>{{record}}</span>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: "foot",
  data() {
    return {
      name: "创博动力",
      note: "为人生更自由",
      version: "V1.0.0",
      record: "创博动力版权所有 粤ICP备19055476号-1"
    };
  }
};
</script>

<style lang="less" scoped>
@import "./../assets/css/components.less";
</style>