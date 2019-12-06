import Vue from "vue";
import http from "./Api";
import router from "../router";
import {
  addEvent,
  removeEvent,
  EventListener,
  control,
  lStore,
  sStore
} from "./utli";
import md5 from "md5";
function ScrollTop(anim = true) {
  if (anim) {
    let scrollToptimer = setInterval(function() {
      let top = document.body.scrollTop || document.documentElement.scrollTop;
      let speed = top / 4;
      if (document.body.scrollTop !== 0) {
        document.body.scrollTop -= speed;
      } else {
        document.documentElement.scrollTop -= speed;
      }
      if (top === 0) {
        clearInterval(scrollToptimer);
      }
    }, 30);
  } else {
    document.documentElement.scrollTop = 0;
  }
}
function timerHandle(self) {
  self.isSend = true;
  let num = 60;
  self.timer = setInterval(() => {
    num--;
    if (num <= 0) {
      clearInterval(self.timer);
      self.isSend = false;
      self.sendBtnText = "获取验证码";
    } else {
      self.sendBtnText = num + "S后重新获取";
    }
    console.log("获取验证码");
  }, 1000);
  self.sendBtnText = num + "S后重新获取";
}

function Refresh() {
  router.replace({
    path: "/refresh",
    query: {
      t: Date.now()
    }
  });
}

// amount(num){
//     if(num<1000){

//     }
// }
Vue.prototype.$ScrollTop = ScrollTop;
Vue.prototype.$lStore = lStore;
Vue.prototype.$sStore = sStore;
Vue.prototype.$control = control;
Vue.prototype.$http = http;
Vue.prototype.$EventListener = EventListener({});
Vue.prototype.$addEvent = addEvent;
Vue.prototype.$removeEvent = removeEvent;
Vue.prototype.$md5 = md5;
Vue.prototype.$Refresh = Refresh;
Vue.prototype.$timeSet = timerHandle;
Vue.prototype.STATUS = 200;
Vue.directive("debounce", {
  bind(el, { value }) {
    const time = value.time || 300,
      method = value.method || "click",
      debounced = control(value.fn, time, 1);
    addEvent(el, method, debounced);
    el._debounced = debounced;
  },
  unbind(el, { value }) {
    const method = value.method || "click";
    removeEvent(el, method, el._debounced);
  }
});
