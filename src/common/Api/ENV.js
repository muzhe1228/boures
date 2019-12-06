import { lStore } from "../utli";
const market = lStore.get("market") || "PC";
export default {
  // 测试地址
  testENV: {
    name: "test",
    httpApi: "http://web.asiabitmex.com",
    TVsocket: "ws://3.0.67.19:8195/ws",
    market: market
    // TVsocket: "ws://192.168.0.104:8085/"
  },
  //生产地址
  // 18.139.211.91:8183
  proENV: {
    name: "prod",
    httpApi: "http://3.0.67.19:8183",
    TVsocket: "ws://3.0.67.19:8085",
    chartSocket: "ws://18.139.211.91:8017",
    market: market
  },
  aliENV: {
    name: "test",
    httpApi: "http://testweb.asiabitmex.com",
    TVsocket: "ws://114.55.211.149:8085",
    chartSocket: "ws://114.55.211.149:8017",
    market: market
  },
  getENV: function() {
    return this.aliENV;
  }
};
