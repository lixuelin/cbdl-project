<template>
  <div class="admin-main">
    <title-view :title="title"></title-view>
    <div class="admin-main-search">
      <div class="admin-main-search-box">
        <div class="admin-main-search-box-fields">
          <span>提现人账号：</span>
          <Input v-model="search.username" placeholder="请输入用户账号" clearable style="width: 200px" />
        </div>
        <div class="admin-main-search-box-fields">
          <span>提现人户主：</span>
          <Input v-model="search.household" placeholder="请输入银行卡号" clearable style="width: 200px" />
        </div>
        <div class="admin-main-search-box-fields">
          <span>提现金额：</span>
          <Input v-model="search.cash_num" placeholder="请输入户主名称" clearable style="width: 200px" />
        </div>
      </div>
      <div class="admin-main-search-box">
        <div class="admin-main-search-box-fields">
          <span>提现状态：</span>
          <Select v-model="search.cash_type" placeholder="全部" style="width:200px">
            <Option value="all">全部</Option>
            <Option value="0">未提现</Option>
            <Option value="1">提现成功</Option>
          </Select>
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
          <span>到账时间：</span>
          <DatePicker
            type="daterange"
            show-week-numbers
            placement="bottom-end"
            placeholder="Select date"
            style="width: 200px"
          ></DatePicker>
        </div>
      </div>
      <div class="admin-main-search-box">
        <div class="admin-main-search-box-fields">
          <div class="admin-main-search-box-btns">
            <Button type="primary" @click="getCashList">搜索</Button>
            <Button type="primary">导出excel</Button>
          </div>
        </div>
        <div class="admin-main-search-box-fields"></div>
      </div>
    </div>
    <div class="admin-main-flow">
      <Table stripe :columns="columns" :data="cashList"></Table>
      <div class="admin-main-flow-page">
        <Page
          :total="pageInfo.total"
          :current="pageInfo.currentPage"
          :page-size="pageInfo.currentPageSize"
          @on-change="changePage"
        />
      </div>
    </div>
    <Modal v-model="change_cash" width="460">
      <p slot="header" style="text-align:left">
        <span>确认提现</span>
      </p>
      <div class="admin-main-verify">
        <div class="admin-main-verify-line">
          <label>实际提现金额:</label>
          <span>{{cash_num}}</span>
        </div>
      </div>
      <div slot="footer">
        <Button type="primary" size="large" long :loading="modal_loading" @click="verifyCash">确认已转账</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import pageTitle from "./../../components/title";

export default {
  name: "withdraw_flow",
  data() {
    return {
      title: "提现日流水",
      search: {
        username: "",
        household: "",
        cash_num: "",
        cash_type: "",
        cash_pay: "",
        start_time: "",
        end_time: ""
      },
      user_info: {
        user_id: null,
        invest_id: null,
        cash_type: null
      },
      cash_id: null,
      cash_num: 0,
      change_cash: false,
      pageInfo: {
        total: 10,
        currentPage: 1,
        currentPageSize: 15
      },
      columns: [
        {
          title: "提现人账号",
          key: "username"
        },
        {
          title: "提现人姓名",
          key: "household"
        },
        {
          title: "本金+收益",
          key: "total"
        },
        {
          title: "手续费",
          key: "brokerage"
        },
        {
          title: "实际提现金额",
          key: "cash_num"
        },
        {
          title: "提现类型",
          key: "cash_type"
        },
        {
          title: "投资时间",
          key: "invest_time"
        },
        {
          title: "操作",
          key: "action",
          width: 100,
          align: "center",
          render: (h, params) => {
            if (params.row.is_cash === 0) {
              return h("div", [
                h(
                  "Button",
                  {
                    props: {
                      type: "primary",
                      size: "small"
                    },
                    style: {
                      marginRight: "5px"
                    },
                    on: {
                      click: () => {
                        this.change_cash = true;
                        this.cash_num = params.row.cash_num;
                        this.cash_id = params.row.id;
                        this.user_info.user_id = params.row.user_id;
                        this.user_info.invest_id = params.row.invest_id;
                        this.user_info.cash_type = params.row.cash_type;
                      }
                    }
                  },
                  "确认提现"
                )
              ]);
            } else {
              return h("div", [
                h(
                  "span",
                  {
                    props: {
                      type: "primary",
                      size: "small"
                    },
                    style: {
                      marginRight: "5px"
                    },
                    on: {}
                  },
                  "提现成功"
                )
              ]);
            }
          }
        },
        {
          title: "银行卡号",
          key: "card"
        },
        {
          title: "所属银行",
          key: "bank_name"
        },
        {
          title: "提现时间",
          key: "create_time"
        },
        {
          title: "到账时间",
          key: "verify_time"
        }
      ],
      cashList: []
    };
  },
  components: {
    "title-view": pageTitle
  },
  mounted() {
    this.getCashList();
  },
  methods: {
    changePage(page) {
      this.pageInfo.currentPage = page;
      this.getCashList();
    },
    changeDate(date) {
      this.search.start_time = date[0];
      this.search.end_time = date[1];
    },
    getCashList() {
      let data = {
        username: this.search.username,
        household: this.search.household,
        cash_num: this.search.cash_num,
        cash_type: this.search.cash_type,
        cash_pay: this.search.cash_pay,
        start_time: this.search.start_time,
        end_time: this.search.end_time,
        currentPage: this.pageInfo.currentPage,
        pageSize: this.pageInfo.currentPageSize
      };
      queryCashList(data)
        .then(response => {
          this.cashList = response.data.data.cashList;
          this.pageInfo.total = response.data.data.total;
        })
        .catch(error => {
          this.$Message.error("获取提现列表失败！");
        });
    },
    verifyCash() {
      let data = {
        id: this.cash_id,
        user_id: this.user_info.user_id,
        invest_id: this.user_info.invest_id,
        cash_type: this.user_info.cash_type
      };
      verify_cash(data)
        .then(response => {
          this.$Message.success("修改成功");
          this.change_cash = false;
          this.getCashList();
        })
        .catch(err => {});
    }
  }
};
</script>

<style lang="less" scoped>
@import "./../../assets/admin/components";
</style>
