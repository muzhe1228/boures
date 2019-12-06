import Vue from "vue";
import { numberFormat } from "./TollClass/func";
import { toRate, dateFormat, priceFormat, coinPrice } from "./utli";
import avatar from "Images/avatar.jpg";
function avatarFun(Img) {
  if (Img) {
    return Img;
  } else {
    return avatar;
  }
}
function statusType(status) {
  status = status + "";
  switch (status) {
    case "1":
      return "申请中";
    case "2":
      return "付款审核中";
    case "3":
      return "审核通过";
    case "4":
      return "审核不通过";
    case "9":
      return "已失效";
  }
}

function orderStatus(status, type) {
  if (type == 1) {
    switch (status) {
      case "1":
        return "提现审核中";
      case "3":
        return "平台审核通过";
      case "4":
        return "平台审核不通过";
      case "9":
        return "已撤销";
    }
  } else {
    switch (status) {
      case "1":
        return "申请中";
      case "2":
        return "付款审核中";
      case "3":
        return "审核通过";
      case "4":
        return "审核不通过";
      case "9":
        return "已失效";
    }
  }
}

function isMock(tradeType) {
  if (tradeType) {
    return "cutReal";
  } else {
    return "cutFake";
  }
}

Vue.filter("numberFormat", numberFormat); //数字格式化
Vue.filter("toRate", toRate); //保留小数
Vue.filter("dateFormat", dateFormat);
Vue.filter("priceFormat", priceFormat);
Vue.filter("coinPrice", coinPrice);
Vue.filter("avatarFun", avatarFun);
Vue.filter("statusType", statusType);
Vue.filter("orderStatus", orderStatus); //订单列表 订单状态
Vue.filter("isMock", isMock);
