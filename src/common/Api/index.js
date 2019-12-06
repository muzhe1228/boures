import axios from "axios";
import { lStore } from "../utli";
import router from "../../router";
import Store from "../../Store";
import ENV from "./ENV";
import { Toast } from "vant";
const baseApi = ENV.getENV().httpApi;
const market = ENV.getENV().market;

// // 添加请求拦截器
// axios.interceptors.request.use(function (config) {
//     // 在发送请求之前做些什么
//     return config;
//   }, function (error) {
//     // 对请求错误做些什么
//     return Promise.reject(error);
//   });

// 添加响应拦截器
axios.interceptors.response.use(
  function(response) {
    // 对响应数据做点什么
    notLogin(response);
    return response;
  },
  function(error) {
    // 对响应错误做点什么
    notLogin(error.response);
    return Promise.reject(error);
  }
);
//公共函数
const comFunc = function(options) {
  let params = options.data ? options.data : "",
    headers = {
      market: lStore.get("market") || "PC",
      "Content-Type": "application/json",
      Authorization: "Bearer " + (lStore.get("token") || "")
    },
    axiosData = {
      headers: headers,
      url: options.url,
      method: options.method,
      baseURL: baseApi,
      timeout: 5000
    };
  if (options.notToken) {
    headers.Authorization = "";
  }
  if (options.method == "get") {
    axiosData.params = params;
  } else {
    axiosData.data = params;
  }
  return axiosData;
};
//登录失效处理
const notLogin = function(res) {
  if (res.status == 401 || res.status == 403) {
    Toast("登录失效，请重新登录");
    Store.commit("SET_USERINFO", "");
    lStore.remove("token");
    router.push("/login");
  } else if (res.status == 500) {
    console.log(res);
    Toast(res.data.message);
  }
};

const http = function(options) {
  return new Promise((resolve, reject) => {
    axios(comFunc(options))
      .then(response => {
        if (response.status === 200) {
          let res = response.data;
          console.log(res, options.url);
          resolve(res);
        } else {
          reject(response);
        }
      })
      .catch(err => {
        let errData = err.response;
        // Toast(errData.message);
        console.log("ERROR:", errData, options.url);
        reject(errData);
      });
  });
};

export default http;
