<template>
  <div class="admin-main">
    <title-view :title="title"></title-view>
    <div class="admin-main-search">
      <div class="admin-main-search-box">
        <div class="admin-main-search-box-fields">
          <span>提现金额：</span>
          <Input v-model="search.cash_num" placeholder="请输入用户账号" clearable style="width: 200px" />
        </div>
        <div class="admin-main-search-box-fields">
          <span>提现时间：</span>
          <DatePicker
            type="daterange"
            show-week-numbers
            placement="bottom-end"
            placeholder="Select date"
            @on-change="changeDate"
            style="width: 200px"
          ></DatePicker>
        </div>
        <div class="admin-main-search-box-fields">
          <div class="admin-main-search-box-btns">
            <Button type="primary" @click="getCashList">搜索</Button>
            <Button type="primary">导出excel</Button>
          </div>
        </div>
      </div>
    </div>
    <div class="admin-main-flow">
      <div class="admin-main-flow-table">
        <div class="admin-main-flow-table-box">
          <Table stripe :columns="columns" :data="cashList"></Table>
          <div class="admin-main-flow-page">
            <Page
              :total="principal_pageInfo.total"
              :current="principal_pageInfo.currentPage"
              :page-size="principal_pageInfo.currentPageSize"
              @on-change="changePage"
            />
          </div>
        </div>
        <div class="admin-main-flow-table-box">
          <Table stripe :columns="columns_bonus" :data="cashBonusLis"></Table>
          <div class="admin-main-flow-page">
            <Page
              :total="bonus_pageInfo.total"
              :current="bonus_pageInfo.currentPage"
              :page-size="bonus_pageInfo.currentPageSize"
              @on-change="changePageBonus"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import pageTitle from "./../../components/title";

export default {
  name: "withdraw_summary",
  data() {
    return {
      title: "提现汇总",
      search: {
        cash_num: "",
        start_time: "",
        end_time: ""
      },
      principal_pageInfo: {
        total: 10,
        currentPage: 1,
        currentPageSize: 10
      },
      bonus_pageInfo: {
        total: 10,
        currentPage: 1,
        currentPageSize: 10
      },
      columns: [
        {
          title: "提现总金额",
          key: "cash_num"
        },
        {
          title: "本金加收益",
          key: "cash_num"
        },
        {
          title: "手续费",
          key: "brokerage"
        },
        {
          title: "提现笔数",
          key: "cash_count"
        },
        {
          title: "提现时间",
          key: "create_time"
        }
      ],
      cashList: [],
      columns_bonus: [
        {
          title: "提现总金额",
          key: "cash_num"
        },
        {
          title: "奖金",
          key: "cash_num"
        },
        {
          title: "提现笔数",
          key: "cash_count"
        },
        {
          title: "提现时间",
          key: "create_time"
        }
      ],
      cashBonusLis: []
    };
  },
  components: {
    "title-view": pageTitle
  },
  mounted() {
    this.getCashList();
    this.getCashBonusList();
  },
  methods: {
    changePage(page) {
      this.principal_pageInfo.currentPage = page;
      this.getCashList();
    },
    changePageBonus(page) {
      this.bonus_pageInfo.currentPage = page;
      this.getCashBonusList();
    },
    changeDate(date) {
      this.search.start_time = date[0];
      this.search.end_time = date[1];
    },
    getCashList() {
      let data = {
        cash_num: this.search.cash_num,
        start_time: this.search.start_time,
        end_time: this.search.end_time,
        currentPage: this.principal_pageInfo.currentPage,
        pageSize: this.principal_pageInfo.currentPageSize
      };
      queryCashEveryDay(data)
        .then(response => {
          this.cashList = response.data.data.cashList;
          this.principal_pageInfo.total = response.data.data.total;
        })
        .catch(error => {
          this.$Message.error("获取提现列表失败！");
        });
    },
    getCashBonusList() {
      let data = {
        cash_num: this.search.cash_num,
        start_time: this.search.start_time,
        end_time: this.search.end_time,
        currentPage: this.bonus_pageInfo.currentPage,
        pageSize: this.bonus_pageInfo.currentPageSize
      };
      queryCashEveryDayBonus(data)
        .then(response => {
          this.cashBonusLis = response.data.data.cashList;
          this.bonus_pageInfo.total = response.data.data.total;
        })
        .catch(error => {
          this.$Message.error("获取提现列表失败！");
        });
    }
  }
};
</script>

<style lang="less" scoped>
@import "./../../assets/admin/components";
</style>
