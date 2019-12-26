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
  mounted() {}
};
</script>

<style lang="less" scoped>
@import url("./../assets/css/components");
</style>