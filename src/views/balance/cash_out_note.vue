<template>
    <div class="note">
        <div class="note-nothing" v-if="note_list.length === 0">
            <p>暂无充值或回收记录</p>
        </div>
        <div v-else>
            <node-card :noteData="note_list"></node-card>
        </div>
    </div>
</template>

<script>
import noteCard from "./../../components/note_card";
export default {
    name: "note",
    data() {
        return {
            note_list: []
        };
    },
    components: {
        "node-card": noteCard
    },
    created() {
        this.getBalanceNote();
    },
    methods: {
        async getBalanceNote() {
            let data = {
                user_id: localStorage.getItem("user_id"),
                balance_type: 2
            };

            if (
                localStorage.getItem("user_id") === "" ||
                localStorage.getItem("user_id") === null
            ) {
                this.$Message.warning("请先登录后操作！");
                return;
            }
            let res = null;
            try {
                res = await this.$Http.queryBalance(data);
                this.note_list = res.data;
            } catch (error) {
                if (res.msg) {
                    return this.$Message.error(`请求失败:${res.msg}`);
                }
                this.$Message.error(`请求失败:${error}`);
            }
        }
    }
};
</script>

<style lang="less" scoped>
@import url("./../../assets/css/note");
</style>
