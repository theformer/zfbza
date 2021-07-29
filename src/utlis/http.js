/* eslint-disable no-debugger */
import axios from "axios";
import qs from "qs";
import { Toast } from "antd-mobile";
import {setStorage,getStorage} from './utlis'
// import { fromPairs } from "_@types_lodash@4.14.170@@types/lodash";
Toast.config({
  mask: false,
});

// 环境的切换
// if (process.env.NODE_ENV == "development") {
//   axios.defaults.baseURL = "http://192.168.5.248:10000";
// } else if (process.env.NODE_ENV == "debug") {
//   axios.defaults.baseURL = "";
// } else if (process.env.NODE_ENV == "production") {
//   axios.defaults.baseURL = "https://wzza.zgyiyun.com";
// }

axios.defaults.timeout = 1000 * 12;



axios.defaults.headers.post["Content-Type"] = "application/json;charset=UTF-8";
axios.defaults.headers.post["X-Requested-With"] = "XMLHttpRequest";
const appKey = "glihlr69+2001601131+urbqwj"; // 智安小区

// 响应拦截器
axios.interceptors.response.use(
 async (response) => {
    // 如果返回的状态码为200，说明接口请求成功，可以正常拿到数据
    // 否则的话抛出错误
    if (response.status === 200) {
      if(response.data.code==401){
            //跳转到重新登记页面
            console.log('我是401')
            let data = {
              secretKey:btoa('ZAXQ/Yiyun@2020')
            }
            post({url:'/test/user/token',data}).then(async res=>{
              console.log(res,res.data.code,res.data.data)
              if(res.data.code ==1){
                await setStorage('token',res.data.data)
                window.my.postMessage({
                  token:res.data.data
                })
                window.location.reload();
              }
            }).catch(err=>{
            })
      }
      return Promise.resolve(response);
    } else {
      return Promise.reject(response);
    }
  }

);

let host = "https://wzza.zgyiyun.com";
// eslint-disable-next-line no-undef
// if (process.env.NODE_ENV === "development") {
//   // host = 'http://192.168.100.222:7081'
//   // host = 'http://121.196.45.25:7082'
//   // host = '/apis/'
// }


/**
 * post方法，对应post请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */

export function  post({ url, data }) {
  let  token
  return new Promise(async (resolve, reject) => {
    await getStorage('token',res=> {
      token = res
    })
    axios({
      url, // 必填 请求API。
      timeout: 10000,
      method: "post",
      data,
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        "Content-Type": "application/json;charset=UTF-8",
        TwiAuth: token || "",
        Authorization: token || "",
        Twi_Client: "web",
      },
    }).then((res) => {
          resolve(res);
        }).catch((err) => {
          reject(err);
        });

  });
}

// 默認請求方式
export default {
  post({ url, data }) {
    let token
    return new Promise(async (resolve, reject) => {
      await   getStorage('token',res=> {
        token = res
      })
      axios({
        url, // 必填 请求API。
        timeout: 10000,
        method: "post",
        data,
        headers: {
          "X-Requested-With": "XMLHttpRequest",
          "Content-Type": "application/json;charset=UTF-8",
          TwiAuth: token || "",
          Authorization: token || "",
          Twi_Client: "web",
        },
      })
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  get({ url, data }) {
    let token
    return new Promise( async (resolve, reject) => {
      await   getStorage('token',res=> {
        token = res
      })
      axios({
        url, // 必填 请求API。
        timeout: 10000,
        method: "get",
        data,
        headers: {
          "X-Requested-With": "XMLHttpRequest",
          "Content-Type": "application/json;charset=UTF-8",
          TwiAuth: token || "",
          Authorization: token || "",
          Twi_Client: "web",
        },
      })
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
};
