<template>
  <div class="note">
    <ul>
      <template v-for="item in noteData">
        <li :key="item">
          <div>
            <p class="note-type">{{item.type}}</p>
            <p class="note-time">{{item.time}}</p>
          </div>
          <div>
            <p class="note-num">¥ {{item.num}}</p>
            <p class="note-tip">{{item.status}}</p>
          </div>
        </li>
      </template>
    </ul>
  </div>
</template>

<script>
export default {
  name: "note",
  props: ["noteData"],
  created() {
    this.noteData.forEach(item => {
      if (item.balance_type === 10 && item.pay_type == 2) {
        item.type = `向加油站用户：${item.account}购买`;
      }
      if (item.balance_type === 10 && item.pay_type == 1) {
        item.type = `向用户：${item.account}转账`;
      }
      if (item.balance_type === 9 && item.pay_type == 2) {
        item.type = `用户${item.account}汽车加油支付`;
      }
      if (item.balance_type === 9 && item.pay_type == 1) {
        item.type = `用户${item.account}转入`;
      }
    });
  },
  mounted() {},
  methods: {}
};
</script>

<style lang="less" scoped>
@import url("./../assets/css/components");
</style>