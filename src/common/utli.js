//判断数据类型的方法（对typeof的增强，7种常用类型的判断，返回小写字符串）

// 判断变量的类型
function dataType(obj) {
  var str = Object.prototype.toString.call(obj);
  var map = {
    "[object Boolean]": "boolean",
    "[object Number]": "number",
    "[object String]": "string",
    "[object Function]": "function",
    "[object Array]": "array",
    "[object Date]": "date",
    "[object RegExp]": "regExp",
    "[object Undefined]": "undefined",
    "[object Null]": "null",
    "[object Object]": "object"
  };
  if (obj !== obj) {
    return "nan";
  }
  if (obj instanceof Element) {
    //判断是否是dom元素，如div等
    return "element";
  }
  return map[str];
}

// function dataType(obj) {
//     if (obj === null) {
//         return "null";
//     }
//     if (obj !== obj) {
//         return "nan";
//     }
//     if (typeof Array.isArray === "function") {
//         if (Array.isArray(obj)) {
//             //浏览器支持则使用isArray()方法
//             return "array";
//         }
//     } else {
//         //否则使用toString方法
//         if (Object.prototype.toString.call(obj) === "[object Array]") {
//             return "array";
//         }
//     }
//     return (typeof obj).toLowerCase();
// }

//深拷贝函数
function deepCopy(p) {
  var obj;
  var str = dataType(p);
  if (str == "array") {
    obj = [];
    for (var i = 0; i < p.length; i++) {
      obj.push(arguments.callee(p[i])); //回调自己
    }
  } else if (str == "object") {
    obj = {};
    for (var i in p) {
      obj[i] = arguments.callee(p[i]);
    }
  } else {
    return p;
  }
  return obj;
}

function addEvent(element, type, handler) {
  if (element.addEventListener) {
    //非IE浏览器采用dom2级事件处理，type为事件类型如：click，handler为事件处理函数，false代表事件采用冒泡处理模型，如果是true代表 采用捕获型处理模型
    //除了netbeans采用捕获型处理模型，其他都采用冒泡型处理模型
    //如果是非IE浏览器添加事件为：addEventListener
    element.addEventListener(type, handler, false);
  } else if (element.attachEvent) {
    //如果为IE浏览器，添加事件采用 attachEvent
    element.attachEvent("on" + type, handler);
  } else {
    element["on" + type] = handler;
  }
}

function removeEvent(element, type, handler) {
  if (element.removeEventListener) {
    //非IE浏览器采用dom2级事件处理，type为事件类型如：click，handler为事件处理函数，false代表事件采用冒泡处理模型，如果是true代表 采用捕获型处理模型
    //除了netbeans采用捕获型处理模型，其他都采用冒泡型处理模型
    //如果是非IE浏览器添加事件为：removeEventListener
    element.removeEventListener(type, handler, false);
  } else if (element.detachEvent) {
    //如果为IE浏览器，添加事件采用 detachEvent
    element.detachEvent("on" + type, handler);
  } else {
    //dom0级事件处理，如果删除事件采用赋值null
    element["on" + type] = null;
  }
}

function stopEvent(event) {
  //停止事件冒泡
  if (event.stopProPagation) {
    event.stopProPagation();
  } else {
    event.cancelBubble = true;
  }
}
//事件监听
function EventListener(obj) {
  let Register = {};
  obj.on = function(name, method) {
    if (!Register.hasOwnProperty(name)) {
      Register[name] = [];
    }
    let handlerList = Register[name];
    let newArr = handlerList.filter(item => {
      if (item == method) {
        return;
      } else {
        return item;
      }
    });
    newArr.push(method);
    Register[name] = newArr;
  };
  obj.fire = function(name) {
    if (Register.hasOwnProperty(name)) {
      let handlerList = Register[name];
      for (let i = 0; i < handlerList.length; i++) {
        let handler = handlerList[i];
        let args = [];
        for (let j = 1; j < arguments.length; j++) {
          args.push(arguments[j]);
        }

        handler.apply(this, args);
        // console.log("args = " + JSON.stringify(args));
      }
    }
  };
  obj.off = function(name, method) {
    if (Register.hasOwnProperty(name)) {
      let handlerList = Register[name];
      if (method === "all") {
        handlerList.splice(0, handlerList.length);
      } else {
        for (let i = 0; i < handlerList.length; i++) {
          if (handlerList[i] === method) {
            handlerList.splice(i, 1);
          }
        }
      }
    }
  };
  obj.has = function(name) {
    let bol = Register.hasOwnProperty(name);
    return bol;
  };
  obj.destroy = function() {
    Register = {};
  };
  return obj;
}

/**
 * 节制函数
 * @param {Function} method 需要节制的函数
 * @param {Number} delay  间隔时间
 * @param {Number} duration 超出时间
 * @param {Boolean} controlType 1防抖 0节流 默认0
 * @return Function
 */
function control(method, delay = 300, controlType) {
  let timer = null;
  let start = new Date().getTime();
  return function() {
    let context = this;
    let args = arguments;
    if (controlType) {
      if (timer) clearTimeout(timer);
      timer = setTimeout(function() {
        let end = new Date().getTime();
        if (end - start >= delay) {
          method.apply(context, args);
          start = end;
        }
      }, delay);
    } else {
      let end = new Date().getTime();
      if (timer) clearTimeout(timer);
      if (end - start >= delay) {
        method.apply(context, args);
        start = end;
      } else {
        timer = setTimeout(function() {
          method.apply(context, args);
          start = new Date().getTime();
        }, delay);
      }
    }
  };
}

//sessionStorage  localStorage
var Store = function() {
  this.name = "Store";
};
Store.prototype = {
  init: function(options) {
    this.store = function() {
      return options.type;
    };
    return this;
  },
  set: function(key, value) {
    var type = dataType(value);
    switch (type) {
      case "object":
      case "array":
        this.store().setItem(key, JSON.stringify(value));
        break;
      // case 'array':
      //             this.store().setItem(key,'['+value+']');
      //             break;
      case "function": //如果是函数先用eval()计算执行js代码
        this.store().setItem(key, value);
        break;
      default:
        this.store().setItem(key, value);
    }
  },
  get: function(key) {
    var value = this.store().getItem(key);

    try {
      value = JSON.parse(value);
    } catch (e) {}
    return value;
  },
  getAll: function() {
    var json = {};
    var value = "";

    for (var attr in this.store()) {
      try {
        value = JSON.parse(this.store()[attr]);
      } catch (e) {}
      json[attr] = value;
    }
    return json;
  },
  remove: function(key) {
    this.store().removeItem(key);
  },
  clear: function() {
    this.store().clear();
  }
};
const lStore = new Store().init({
  type: window.localStorage
});
const sStore = new Store().init({
  type: window.sessionStorage
});

//正常化日期
function normalDate(oDate) {
  var CurrentDate = oDate;
  var reg = /\-+/g;

  if (dataType(oDate) == "string") {
    if (oDate.indexOf("+") == -1) {
      oDate = oDate.split(".")[0]; //解决ie浏览器对yyyy-MM-dd HH:mm:ss.S格式的不兼容
      oDate = oDate.replace(reg, "/"); //解决苹果浏览器对yyyy-MM-dd格式的不兼容性
    }
  }

  CurrentDate = new Date(oDate);

  return CurrentDate;
}

//获取时间戳
function numTime(val) {
  let time = normalDate(val);
  return time.getTime();
}

//秒转分秒
function formatSeconds(value) {
  var secondTime = parseInt(value / 1000); // 秒
  var minuteTime = 0; // 分
  var hourTime = 0; // 小时
  if (secondTime > 60) {
    //如果秒数大于60，将秒数转换成整数
    //获取分钟，除以60取整数，得到整数分钟
    minuteTime = parseInt(secondTime / 60);
    //获取秒数，秒数取佘，得到整数秒数
    secondTime = parseInt(secondTime % 60);
    // //如果分钟大于60，将分钟转换成小时
    // if(minuteTime > 60) {
    //     //获取小时，获取分钟除以60，得到整数小时
    //     hourTime = parseInt(minuteTime / 60);
    //     //获取小时后取佘的分，获取分钟除以60取佘的分
    //     minuteTime = parseInt(minuteTime % 60);
    // }
  }
  var result = NumRes(parseInt(secondTime));

  if (minuteTime > 0) {
    result = NumRes(parseInt(minuteTime)) + ":" + result;
  }
  // if(hourTime > 0) {
  //   result = "" + parseInt(hourTime) + "小时" + result;
  // }
  return result;
}

function weekDay(time) {
  let num = normalDate(time).getDay(),
    weekday = [
      "星期日",
      "星期一",
      "星期二",
      "星期三",
      "星期四",
      "星期五",
      "星期六"
    ];
  return weekday[num];
}

//日期格式化函数
//oDate（时间戳或字符串日期都支持）
//fmt（格式匹配）
//月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
//年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
//例子：
//dateFormat0(new Date(),'yyyy-MM-dd hh:mm:ss.S') ==> 2006-07-02 08:09:04.423
//dateFormat0(new Date(),'yyyy-M-d h:m:s.S')      ==> 2006-7-2 8:9:4.18
function dateFormat(mydate, ft) {
  if (!mydate) {
    return "--";
  }
  var fmt = ft || "yyyy-MM-dd hh:mm:ss",
    reg = /^\d+$/g,
    weekday = [
      "星期日",
      "星期一",
      "星期二",
      "星期三",
      "星期四",
      "星期五",
      "星期六"
    ];
  if (reg.test(mydate)) {
    mydate = mydate - 0;
  }

  var oDate = normalDate(mydate);
  var date = {
    "M+": oDate.getMonth() + 1, //月份
    "d+": oDate.getDate(), //日
    "h+": oDate.getHours(), //小时
    "m+": oDate.getMinutes(), //分
    "s+": oDate.getSeconds(), //秒
    "q+": Math.floor((oDate.getMonth() + 3) / 3), //季度，+3为了好取整,
    "w+": weekday[oDate.getDay()],
    S: oDate.getMilliseconds() //毫秒
  };

  if (/(y+)/.test(fmt)) {
    //RegExp.$1(正则表达式的第一个匹配，一共有99个匹配)
    fmt = fmt.replace(
      RegExp.$1,
      (oDate.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  }

  for (var attr in date) {
    if (new RegExp("(" + attr + ")").test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1
          ? date[attr]
          : ("00" + date[attr]).substring((date[attr] + "").length)
      );
    }
  }
  return fmt;
}
function dateFormatUTC(mydate, ft) {
  if (!mydate) {
    return "--";
  }
  var fmt = ft || "yyyy-MM-dd hh:mm:ss",
    reg = /^\d+$/g;
  if (reg.test(mydate)) {
    mydate = mydate - 0;
  }

  var oDate = normalDate(mydate);
  var date = {
    "M+": oDate.getUTCMonth() + 1, //月份
    "d+": oDate.getUTCDate(), //日
    "h+": oDate.getUTCHours(), //小时
    "m+": oDate.getUTCMinutes(), //分
    "s+": oDate.getUTCSeconds() //秒
  };

  if (/(y+)/.test(fmt)) {
    //RegExp.$1(正则表达式的第一个匹配，一共有99个匹配)
    fmt = fmt.replace(
      RegExp.$1,
      (oDate.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  }

  for (var attr in date) {
    if (new RegExp("(" + attr + ")").test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1
          ? date[attr]
          : ("00" + date[attr]).substring((date[attr] + "").length)
      );
    }
  }
  return fmt;
}

function NumRes(num) {
  if (Number(num) < 10) {
    return "0" + num;
  } else {
    return num + "";
  }
}
//科学技术法转化
function scientificToNumber(num) {
  if (!num) return num;
  let numStr = num.toString().toLocaleLowerCase();
  if (!/(e)|(E)/g.test(numStr)) {
    return num;
  }
  return Number(num)
    .toFixed(18)
    .replace(/\.0+$/, "")
    .replace(/(\.\d+[1-9])0+$/, "$1");
}
//科学计数法
function toFixeds(nums, len = 2) {
  if (nums || nums === 0) {
    let re = `/([0-9]+\.?[0-9]{${len}})[0-9]*/`,
      regexp = /(?:\.0*|(\.\d+?)0+)$/;
    nums = scientificToNumber(nums).toString();
    nums =
      nums == 0 ? nums : nums.replace(eval(re), "$1").replace(regexp, "$1");
    return Number(Number(nums).toFixed(len));
  } else {
    return "--";
  }
}
//科学计数法
function toRate(rate, len = 2) {
  let prefix = "";
  if (rate > 0) {
    prefix = "+";
  } else if (rate == 0 || rate < 0) {
    prefix = "";
  } else {
    return "--";
  }
  return prefix + Number(rate).toFixed(len);
}

//千分符
function toThousands(num) {
  var re = /\d{1,3}(?=(\d{3})+$)/g;
  var n1 = num.toString().replace(/^(\d+)((\.\d+)?)$/, function(s, s1, s2) {
    return s1.replace(re, "$&,") + s2;
  });
  return n1;
}
//浮点数转换成小数
function priceFormat(nums, extent = 2) {
  if (nums || nums === 0) {
    let re = `/([0-9]+\.?[0-9]{${extent}})[0-9]*/`,
      regexp = /(?:\.0*|(\.\d+?)0+)$/;
    nums = scientificToNumber(nums).toString();
    nums =
      nums == 0 ? nums : nums.replace(eval(re), "$1").replace(regexp, "$1");
    return Number(nums).toFixed(extent);
  } else {
    return "--";
  }
}
////浮点数转换成小数
function coinPrice(nums, extent = "BTC") {
  extent = lStore.get("coinPrecision")[extent];
  if (nums || nums === 0) {
    let re = `/([0-9]+\.?[0-9]{${extent}})[0-9]*/`,
      regexp = /(?:\.0*|(\.\d+?)0+)$/;
    nums = scientificToNumber(nums).toString();
    nums =
      nums == 0 ? nums : nums.replace(eval(re), "$1").replace(regexp, "$1");
    return toThousands(Number(nums).toFixed(extent));
  } else {
    return "--";
  }
}
function nFormatter(num, digits) {
  const si = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "K" },
    { value: 1e6, symbol: "M" },
    { value: 1e9, symbol: "G" },
    { value: 1e12, symbol: "T" },
    { value: 1e15, symbol: "P" },
    { value: 1e18, symbol: "E" }
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/,
    re = `/([0-9]+\.[0-9]{${digits}})[0-9]*/`;
  let i;
  for (i = si.length - 1; i > 0; i--) {
    if (num >= si[i].value) {
      break;
    }
  }
  return (
    (num / si[i].value)
      .toString()
      .replace(eval(re), "$1")
      .replace(rx, "$1") + si[i].symbol
  );
}
//数组去重
function distinct(a, b = []) {
  let arr = a.concat(b);
  let result = [];
  let obj = {};

  for (let i of arr) {
    if (!obj[i]) {
      result.push(i);
      obj[i] = 1;
    }
  }

  return result;
}

function isAction(str, err) {
  //账号
  var reg = /[a-zA-Z0-9_]{4,16}/;
  let isTrue = reg.test(str);
  if (!isTrue) {
    return err ? err : "账号为4-14位数字，字母，下划线";
  }
  return false;
}
// if (str.trim()) {
// } else {
//     return "密码不能为空";
// }
// return false;
function isEmail(str, err) {
  //email
  if (str.trim()) {
    var reg = /^([a-zA-Z]|[0-9])(\w|[^%&',;=?$\x22]+)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
    let isTrue = reg.test(str);
    if (!isTrue) {
      return err ? err : "邮箱格式有误！";
    }
    return false;
  } else {
    return "邮箱不能为空";
  }
}
function isAccount(str) {
  if (str.trim()) {
    if (isEmail(str) && isNum(str)) {
      return "账号为手机号或邮箱！";
    }
    return false;
  } else {
    return "账号不能为空";
  }
}

function isPwd(str, err) {
  if (str.trim()) {
    //密码
    var reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z_]{6,20}$/;
    let isTrue = reg.test(str);
    if (!isTrue) {
      return err ? err : "密码为 6 - 20 位数字，字母，下划线组合";
    }
    return false;
  } else {
    return "密码不能为空";
  }
}
function isCode(str, err) {
  if (str.trim()) {
    //验证码
    var reg = /^\d{6}$/;
    let isTrue = reg.test(str);
    if (!isTrue) {
      return err ? err : "验证码为6位数字";
    }
    return false;
  } else {
    return "验证码不能为空";
  }
}
function isUuid(str, err) {
  if (str.trim()) {
    //验证码
    var reg = /^\d{10}$/;
    let isTrue = reg.test(str);
    if (!isTrue) {
      return err ? err : "uuid为10位数字";
    }
    return false;
  } else {
    return "uuid不能为空";
  }
}

function isNumPrice(str, err) {
  if (str.trim()) {
    //验证码
    var reg = /^(\d|([1-9]\d+))(\.\d+)?$/;
    let isTrue = reg.test(str);
    if (!isTrue) {
      return err ? err : "请输入数字";
    }
    return false;
  } else {
    return "不能为空";
  }
}
function isBankCode(str, err) {
  if (str.trim()) {
    //银行卡
    var reg = /^([1-9]{1})(\d{14,18})$/;
    let isTrue = reg.test(str);
    if (!isTrue) {
      return err ? err : "银行卡号为15-19位数字";
    }
    return false;
  } else {
    return "银行卡号不能为空";
  }
}
function isShenfenCard(str, err) {
  if (str.trim()) {
    //身份证
    var reg = /(^\d{15,18}$)|(^\d{17}(\d|X|x)$)/;
    let isTrue = reg.test(str);
    if (!isTrue) {
      return err ? err : "身份证号为15-18位数字";
    }
    return false;
  } else {
    return "身份证号不能为空";
  }
}
function isPhone(str, err) {
  if (str.trim()) {
    //手机号
    var reg = /^1[23456789]\d{9}$/;
    let isTrue = reg.test(str);
    if (!isTrue) {
      return err ? err : "手机号码有误，请重填";
    }
    return false;
  } else {
    return "手机号不能为空";
  }
}
function isNum(str, err) {
  if (str.trim()) {
    //全数字
    var reg = /^\d{1,}$/;
    let isTrue = reg.test(str);
    if (!isTrue) {
      return err ? err : "手机号码有误";
    }
    return false;
  } else {
    return "手机号不能为空";
  }
}

function isAddress(str, err) {
  if (str.trim()) {
    //提币地址
    var reg = /^(?!\d+$)[\da-zA-Z]{6,}$/;
    let isTrue = reg.test(str);
    if (!isTrue) {
      return err ? err : "提币地址格式有误";
    }
    return false;
  } else {
    return "提币地址不能为空";
  }
}
function random(lower, upper) {
  return Math.floor(Math.random() * (upper - lower + 1)) + lower;
}

function isIos() {
  let u = navigator.userAgent,
    app = navigator.appVersion;
  let isAndroid = u.indexOf("Android") > -1 || u.indexOf("Linux") > -1; //g
  let isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
  if (isAndroid) {
    return false;
  } else if (isIOS) {
    return true;
  }
}

function IsPC() {
  var userAgentInfo = navigator.userAgent;
  var Agents = [
    "Android",
    "iPhone",
    "midp",
    "ucweb",
    "rv:1.2.3.4",
    "SymbianOS",
    "Windows Phone",
    "windows ce",
    "windows mobile",
    "iPad",
    "iPod"
  ];
  var flag = true;
  for (var v = 0; v < Agents.length; v++) {
    if (userAgentInfo.indexOf(Agents[v]) > 0) {
      flag = false;
      break;
    }
  }
  return flag;
}

function sendIosAnd() {
  if (IsPC()) {
    return;
  } else {
    if (isIos()) {
      window.webkit.messageHandlers.jsToOc.postMessage({});
    } else {
      lStore.set("market", window.android.getChannel());
    }
  }
}

export {
  dataType,
  deepCopy,
  addEvent,
  removeEvent,
  stopEvent,
  EventListener,
  control, //节制函数
  lStore,
  sStore,
  normalDate,
  numTime,
  formatSeconds,
  weekDay,
  dateFormat,
  dateFormatUTC,
  toFixeds,
  toRate,
  toThousands,
  priceFormat,
  coinPrice,
  distinct,
  //验证
  isAction,
  isEmail,
  isAccount,
  isPwd,
  isCode,
  isBankCode,
  isShenfenCard,
  isPhone,
  isNum,
  isNumPrice,
  isUuid,
  isAddress,
  random,
  isIos,
  sendIosAnd
};
