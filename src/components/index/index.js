/* eslint-disable no-console */
/* eslint-disable no-debugger */
// eslint-disable-next-line no-unused-vars
import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { Toast, Button, WhiteSpace } from "antd-mobile";
import "./index.scss";
import {
  back,
  jump,
  getUrlValue,
  getUrlParam,
  setTitle,
} from "../../utlis/utlis";
import http from "../../utlis/http";

const prefix = "login";
Toast.config({
  mask: false,
});

class Index extends Component {
  constructor(props) {
    super(props);
    // this.store = this.props.store.commonStore
  }
  state = {
    flash: false,
    agreementDia: false,
    agreementText: false,
  };
  componentWillMount() {
    localStorage.clear();
    window.poph5 = true;
    console.log(777777);
  }
  componentWillUnmount() {
    window.poph5 = false;
  }
  async componentDidMount() {
    // let ticket = getUrlValue('ticket')
    // http.get({
    //   url: '/api/zlb/app/ticketValidation',
    //   data: {
    //     ticket
    //   }
    // }).then(res => {
    //   let data = res && res.data && res.data.data
    //   if(res.data.code ==-1){
    //     console.log(data,'我是注销后返回的data')
    //     this.setState({
    //       flash:true
    //     })
    //     Toast.info('登录令牌失效，请重新扫码进入')
    //     return
    //   }
    //   localStorage.setItem('token',data.token)
    //   if (data && data.userid) {
    //     http.get({
    //       url: '/api/zlb/app/getUserInfoByToken',
    //       data: {
    //         token: data.token
    //       }
    //     }).then( async res => {
    //       let data = res && res.data && res.data.data
    //       localStorage.setItem('userInfo', JSON.stringify({
    //         username: data.username,
    //         mobile: data.mobile,
    //         sex: data.sex,
    //         nation: data.nation,
    //         certificateId: data.idnum,
    //         source:'ZLB',
    //         createdate:data.createdate,
    //         userid:data.userid,
    //         certificateType:'身份证',
    //       }))
    //       window.aplus_queue.push({
    //         'action': 'aplus.sendPV',
    //         'arguments': [{
    //           _user_id: data.userid,
    //           _user_nick:data.username
    //         },
    //           {
    //             //自定义PV参数key-value键值对（只能是这种平铺的json，不能做多层嵌套），如：
    //             userType: res.userType
    //           }]
    //       })
    //       await this.getUserInfo(data.userid)
    //         let complexCode = getUrlValue('complexid')
    //         console.log(complexCode,'我看看的我的值')
    //         if(complexCode !=null && complexCode !='null'){
    //           if(complexCode.indexOf('/')>-1){
    //             complexCode = complexCode.replace('/','')
    //           }
    //           localStorage.setItem('complexCode',complexCode)
    //         }
    //
    //         let dataId = localStorage.getItem('dataId')
    //       //如果url上有code而且数据库里又存在用户信息，查询是否有小区列表
    //         if(complexCode&&dataId !='null'&&dataId!=null){
    //           console.log('我不会又走这个吧,有编码有id')
    //           //判断是否有小区列表
    //           http.get({
    //             url: '/api/myComplex/info',
    //             data: {
    //               userId:dataId
    //             }
    //           }).then(res => {
    //             let data = res && res.data && res.data.data
    //             let i = data.findIndex(e=>{
    //               return  e.complexCode == complexCode
    //             })
    //             //返回的小区列表有值而且url上的xcode值和小区信息上的一样
    //             if(data&&data.length>0&&i>-1){
    //               //根据小区列表判断此条小区是否为当前小区如果isPresent为1则存储该条数据
    //               let item = data.filter(e=>{
    //                  if(e.isPresent==1){
    //                     return e
    //                 }else{
    //                    return data[0]
    //                  }
    //               })
    //               console.log(item,'我是返回的item')
    //               if(item&&item.length>0){
    //                 console.log(item.complexName,'我是这个')
    //                 localStorage.setItem('complexName',item[0].complexName)
    //                 localStorage.setItem('complexCode',item[0].complexCode)
    //                 this.setState({
    //                   complexName:item[0].complexName
    //                 })
    //               }else{
    //                 console.log(data,data[0].complexName)
    //                 localStorage.setItem('complexName',data[0].complexName)
    //                 localStorage.setItem('complexCode',data[0].complexCode)
    //                 this.setState({
    //                   complexName:data[0].complexName
    //                 })
    //               }
    //               //如果有小区列表且小区列表是从网页上拿到
    //               console.log(data,'我走了有小区编码')
    //               window.ZWJSBridge.zmAuthentication().then(res => {
    //                 if(res.pass){
    //                   jump.call(this, '/home-page')
    //                 }
    //                 console.log(res)
    //               }).catch(err => {
    //                 console.log(err)
    //               })
    //                 //xcode不在小区列表上而且用户已登记过，直接进入选择楼栋页面
    //             }else if(data&&data.length>0){
    //               console.log('我打死也不会走这个啊')
    //               //根据小区列表判断此条小区是否为当前小区如果isPresent为1则存储该条数据
    //               let item = data.filter(e=>{
    //                 if(e.isPresent==1){
    //                   return e
    //                 }else{
    //                   return data[0]
    //                 }
    //               })
    //               if(item&&item.length>0){
    //                 localStorage.setItem('complexName',item[0].complexName)
    //                 localStorage.setItem('complexCode',item[0].complexCode)
    //                 this.setState({
    //                   complexName:item[0].complexName
    //                 })
    //               }else{
    //                 localStorage.setItem('complexName',data[0].complexName)
    //                 localStorage.setItem('complexCode',data[0].complexCode)
    //                 this.setState({
    //                   complexName:data[0].complexName
    //                 })
    //               }
    //               window.ZWJSBridge.zmAuthentication().then(res => {
    //                 if(res.pass){
    //                   jump.call(this, '/home-page')
    //                 }
    //                 console.log(res)
    //               }).catch(err => {
    //                 console.log(err)
    //               })
    //             }else{
    //               console.log('我走的是直接进入首页')
    //               window.ZWJSBridge.zmAuthentication().then(res => {
    //                 if(res.pass){
    //                   jump.call(this, '/home-page')
    //                 }
    //                 console.log(res)
    //               }).catch(err => {
    //                 console.log(err)
    //               })
    //             }
    //           }).catch(err=>{
    //           })
    //             //小区编码有值用户信息没值要进行身份认证
    //         }else if(complexCode&&(dataId =='null'||dataId==null)){
    //           console.log('我走了这个吗,有编码没用户id')
    //           window.ZWJSBridge.zmAuthentication().then(res => {
    //             if(res.pass){
    //               jump.call(this, '/auth-entication')
    //             }
    //           }).catch(err => {
    //             console.log(err)
    //           })
    //
    //           //小区编码没值用户信息有值
    //         }else if(!complexCode && dataId !='null'&&dataId!=null){
    //           console.log('我不会走的是这个吧，没编码有id',dataId,'我为什么会走这个啊')
    //           http.get({
    //             url: '/api/myComplex/info',
    //             data: {
    //               userId:localStorage.getItem('dataId')
    //             }
    //           }).then(res => {
    //             //判断url上是否有小区编码
    //             let data = res && res.data && res.data.data
    //             if(data&&data.length>0){
    //               // data.forEach(e=>{
    //                 let item = data.filter(e=>{
    //                   return e.isPresent==1
    //                 })
    //               console.log(item,'我是当前item')
    //                 if(item.length>0){
    //                   localStorage.setItem('complexName',item[0].complexName)
    //                   localStorage.setItem('complexCode',item[0].complexCode)
    //                   this.setState({
    //                     complexName:item[0].complexName
    //                   })
    //                 }else{
    //                   localStorage.setItem('complexName',data[0].complexName)
    //                   localStorage.setItem('complexCode',data[0].complexCode)
    //                   this.setState({
    //                     complexName:data[0].complexName
    //                   })
    //
    //                 }
    //               // })
    //               console.log(data,'我走了没有小区编码')
    //               window.ZWJSBridge.zmAuthentication().then(res => {
    //                 if(res.pass){
    //                   jump.call(this, '/home-page')
    //                 }
    //                 console.log(res)
    //               }).catch(err => {
    //                 console.log(err)
    //               })
    //             }else if(data.length==0){
    //               window.ZWJSBridge.zmAuthentication().then(res => {
    //                 if(res.pass){
    //                   jump.call(this, '/home-page')
    //                 }
    //                 console.log(res)
    //               }).catch(err => {
    //                 console.log(err)
    //               })
    //             }
    //           })
    //             //用户信息没值小区编码没值
    //         } else{
    //           console.log('我走的是这个吗,没编码没id')
    //               window.ZWJSBridge.zmAuthentication().then(res => {
    //                 if(res.pass){
    //                   window.AlipayJSBridge.scan({
    //                     type: "qrCode"
    //                   }).then((data) => {
    //                     console.log(data,'我是返回的data')
    //                     if(data.text.indexOf('complexid')>-1){
    //                       let complexCode = getUrlParam(data.text,'complexid')
    //                       localStorage.setItem('complexCode',complexCode)
    //                       console.log(data,'我是扫码返回过来的信息')
    //                       jump.call(this, '/auth-entication')
    //                     }else{
    //                       Toast.info('请扫描小区码')
    //                     }
    //
    //                   }).catch((error) => {
    //                   });
    //                 }
    //               }).catch(err => {
    //                 console.log(err)
    //               })
    //         }
    //     })
    //   }
    // })
    // }
    // }
  }
  //获取
  async getUserInfo(id) {
    await http
      .get({
        url: "/zlb/user/idCard",
        data: {
          zlbUserId: id,
        },
      })
      .then((res) => {
        let data = res && res.data && res.data.data;
        if (data) {
          console.log(data, "我看看我是啥");
          if (data.id != undefined) {
            localStorage.setItem("dataId", data.id);
          } else {
            // localStorage.setItem('dataId','')
          }
        }
      });
  }
  toIndex() {
    // 跳转
    jump.call(this, "/index");
  }
  goBack() {
    // 返回
    back.call(this);
  }
  //登记入住
  changeCheckIn() {
    let href = window.location.href;
    //判断用户是否登录
    let complexCode = localStorage.getItem("complexCode");
    if (href.indexOf("ticket") < 0) {
      if (this.store.bIsDtDreamApp) {
        window.location.href = `https://puser.zjzwfw.gov.cn/sso/mobile.do?action=oauth&scope=1&servicecode=zaxqzs&goto=${encodeURIComponent(
          "https://mapi.zjzwfw.gov.cn/web/mgop/gov-open/zj/2001601131/1.0.0/index.html?debug=true&complexid=" +
            (complexCode || "")
        )}`;
      } else if (this.store.bIsAlipayMini) {
        window.location.href = `https://puser.zjzwfw.gov.cn/sso/alipay.do?action=ssoLogin&servicecode=zaxqzs&goto=${encodeURIComponent(
          "https://mapi.zjzwfw.gov.cn/web/mgop/gov-open/zj/2001601131/1.0.0/index.html?debug=true&complexid=" +
            (complexCode || "")
        )}`;
      }
    } else {
      if (this.state.flash) {
        Toast.info("登录令牌已过期，请重新扫码登录");
      } else {
        let id = localStorage.getItem("dataId");
        let complexCode = localStorage.getItem("complexCode");
        console.log(
          localStorage.getItem("dataId"),
          localStorage.getItem("complexCode"),
          "我是此时的值"
        );
        console.log(id, "我是id", complexCode, "我是小区编码");
        if (
          localStorage.getItem("complexCode") &&
          localStorage.getItem("dataId")
        ) {
          window.ZWJSBridge.zmAuthentication()
            .then((res) => {
              if (res.pass) {
                jump.call(this, "/home-page");
              }
              console.log(res);
            })
            .catch((err) => {
              console.log(err);
            });
        } else if (
          !localStorage.getItem("complexCode") &&
          localStorage.getItem("dataId")
        ) {
          window.AlipayJSBridge.scan({
            type: "qrCode",
          })
            .then((data) => {
              console.log(
                "我为什么会走这个呢",
                data.text,
                data.text.indexOf("complexid")
              );
              if (data.text.indexOf("complexid") > -1) {
                let complexCode = getUrlParam(data.text, "complexid");
                localStorage.setItem("complexCode", complexCode);
                jump.call(this, "/home-page");
              } else {
                Toast.info("请扫描小区码");
              }
            })
            .catch((error) => {});
        } else if (
          !localStorage.getItem("dataId") &&
          localStorage.getItem("complexCode")
        ) {
          window.ZWJSBridge.zmAuthentication()
            .then((res) => {
              if (res.pass) {
                jump.call(this, "/auth-entication");
              }
              console.log(res);
            })
            .catch((err) => {
              console.log(err);
            });
        } else if (
          !localStorage.getItem("complexCode") &&
          !localStorage.getItem("dataId")
        ) {
          window.AlipayJSBridge.scan({
            type: "qrCode",
          })
            .then((data) => {
              console.log(
                "我为什么会走这个呢",
                data.text,
                data.text.indexOf("complexid")
              );
              if (data.text.indexOf("complexid") > -1) {
                let complexCode = getUrlParam(data.text, "complexid");
                localStorage.setItem("complexCode", complexCode);
                jump.call(this, "/auth-entication");
              } else {
                Toast.info("请扫描小区码");
              }
            })
            .catch((error) => {});
        }
      }
    }
  }
  //跳转至隐私协议
  goPrivacyClick() {
    jump.call(this, "/privacy-page");
  }
  //查看协议
  agreementClick() {
    this.setState({
      agreementDia: false,
      agreementText: true,
    });
  }
  //同意协议
  consentClick() {
    this.setState({
      agreementText: false,
    });
  }
  //不同意协议
  unConsentClick() {
    window.ZWJSBridge.close()
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  //访客登记
  changeRegister() {
    // Toast.info('暂未开放')
    console.log("我是访客登记", this.state.agreementDia);
    this.setState({
      agreementDia: true,
    });
  }
  cancelCropper() {
    this.setState({
      showCropper: false,
    });
  }

  render() {
    // 从mobx中拿所需属性
    const { complexName, agreementDia, agreementText } = this.state;
    return (
      <React.Fragment>
        <div className={`${prefix} flex flex-column`}>
          <div className={`${prefix}-main`}>
            <div className={`${prefix}-main-logo`}>
              <img
                className={`${prefix}-main-logo-style`}
                src={require("./../../assets/imgs/logins/Home_icon_logo_100d@3x.png")}
              />
            </div>
            <div className={`${prefix}-main-logoText`}>
              {complexName ? complexName : <span></span>}
            </div>
            <div className={`${prefix}-main-footer text-center`}>
              <Button
                onClick={this.changeCheckIn.bind(this)}
                icon={
                  <img
                    src={require("./../../assets/imgs/logins/Home_icon_register_w@2x.png")}
                    className={`btn-top-png`}
                    alt=""
                  />
                }
                className={`${prefix}-main-footer-checkIn`}
                type="primary"
              >
                登记入住
              </Button>
              <WhiteSpace />
              <Button
                onClick={this.changeRegister.bind(this)}
                icon={
                  <img
                    src={require("./../../assets/imgs/logins/Home_icon_visitor@2x.png")}
                    alt=""
                    className={`btn-bottom-png`}
                  />
                }
                className={`${prefix}-main-footer-checkOut`}
              >
                访客登记
              </Button>
              <WhiteSpace />
            </div>
          </div>
          <div className={`${prefix}-footer flex1`}>
            <img
              src={require("./../../assets/imgs/logins/Home_bg@3x.png")}
              className={`${prefix}-main-footer-btmPng`}
            />
          </div>
          {agreementDia ? (
            <div className={`agreement-dia`}>
              <div className={`dia-matter`}>
                <div className={`dia-head`}>
                  您需要同意本隐私政策才能 继续使用温州智安小区助手
                </div>
                <div className={`dia-content`}>
                  若您不同意本隐私政策，很遗憾我们将无法为您提供服务。
                </div>
                <div className={`dia-footer flex`}>
                  <span
                    className={`footer-left`}
                    onClick={(e) => this.setState({ agreementDia: false })}
                  >
                    仍不同意
                  </span>
                  <span
                    className={`footer-right`}
                    onClick={this.agreementClick.bind(this)}
                  >
                    查看协议
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <span></span>
          )}
          {agreementText ? (
            <div className={`agreement-dia`}>
              <div className={`dia-matter policy`}>
                <div className={`matter-tips`}>
                  <div>温馨提示</div>
                </div>
                <div className={`matter-title`}>
                  感谢您信任并使用温州智安小区助手！
                  我们非常重视您的个人信息和隐私保护。为了更好地保障您的个人权益，在使用我们的产品前，请务必审慎阅读
                  <span
                    className={`matter-policy`}
                    onClick={this.goPrivacyClick.bind(this)}
                  >
                    《隐私政策》
                  </span>
                  内的所有条款，我们将严格按照您同意的条款使用您的个人信息，以便为您提供更好的服务。
                </div>
                <div className={`matter-agree`}>
                  您点击“同意”的行为即表示您已阅读完毕并同意以上协议的全部内容。如您同意以上协议内容，请点击“同意”，开始使用我们的产品和服务。
                </div>
                <div className={`matter-footer flex flex-column`}>
                  <div
                    className={`matter-consent`}
                    onClick={this.consentClick.bind(this)}
                  >
                    同意
                  </div>
                  <div
                    className={`matter-unconsent`}
                    onClick={this.unConsentClick.bind(this)}
                  >
                    不同意
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <span></span>
          )}
        </div>
      </React.Fragment>
    );
  }
}
// inject 将store注入到当Test组件的props中
export default inject("store")(observer(Index));
