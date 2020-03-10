/**
 *
 * 银行数据处理
 *
 */

const allBank = {
    icbc: {
        icon: "icon-gongshangyinhang",
        color: "#f54966",
        name: "中国工商银行"
    },
    cmb: {
        icon: "icon-yinhanglogo-3",
        color: "#f54966",
        name: "招商银行"
    },
    ccb: {
        icon: "icon-yinhanglogo-",
        color: "#3679ff",
        name: "中国建设银行"
    },

    boc: {
        icon: "icon-yinhanglogo-5",
        color: "#f54966",
        name: "中国银行"
    },
    abc: {
        icon: "icon-yinhanglogo-2",
        color: "#63a35c",
        name: "中国农业银行"
    },
    citic: {
        icon: "icon-yinhanglogo-4",
        color: "#f54966",
        name: "中信银行"
    },
    psbc: {
        icon: "icon-youzhengyinhang",
        color: "#63a35c",
        name: "中国邮政储蓄银行"
    },
    comm: {
        icon: "icon-yinhanglogo-1",
        color: "#3679ff",
        name: "交通银行"
    },
    dc: {
        icon: "icon-gongshangyinhang",
        color: "#f54966",
        name: "深发/平安银行"
    },
    jxrcu: {
        icon: "icon-gongshangyinhang",
        color: "#63a35c",
        name: "江西省农村信用"
    },
    spdb: {
        icon: "icon-gongshangyinhang",
        color: "#3679ff",
        name: "浦东发展银行"
    },
    ncb: {
        icon: "icon-gongshangyinhang",
        color: "#3679ff",
        name: "南昌银行"
    },
    zjnx: {
        icon: "icon-gongshangyinhang",
        color: "#3679ff",
        name: "富民银行"
    },
    spabank: {
        icon: "icon-gongshangyinhang",
        color: "#f54966",
        name: "深发/平安银行"
    }
};

export function checkBackInfo(bank) {
    let code = bank.bank_code.toLocaleLowerCase();
    let info = allBank[code];
    return info;
}
