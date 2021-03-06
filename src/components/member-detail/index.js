/* eslint-disable no-console */
/* eslint-disable no-debugger */
// eslint-disable-next-line no-unused-vars
import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { Toast, Tabs } from "antd-mobile";
import "./index.scss";
import { back, jump, setTitle } from "../../utlis/utlis";
import http from "../../utlis/http";
import QRCode from "qrcodejs2";

const prefix = "member-detail";
Toast.config({
  mask: false,
});

/**
 * @description 生成二维码时所用code与对应的类型关联对象
 * @property enterprise 商家
 * @property product 普通产品
 * @property service 公共服务
 * @property coupon 折扣现金券
 * @property redcoupon 红包现金券
 */
const qrcodeMap = {
  enterprise: {
    code: "001",
    type: "",
  },
  product: {
    code: "002",
    type: "",
  },
  service: {
    code: "003",
    type: "",
  },
  coupon: {
    code: "yykj_001",
    type: "0",
  },
  redCoupon: {
    code: "yykj_002",
    type: "1",
  },
};
let rootSize = parseFloat(document.documentElement.style.fontSize);
class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabs: [{ title: "温州可信身份码" }, { title: "健康码" }],
      qrcodeWidth: rootSize * 3.6,
      qrcodeHeight: rootSize * 3.6,
      QRCode1: null,
      codeType1: null,
      codeImg1: null,
      QRCode: null,
      codeType: null,
      healthyName: null,
      healthyCode: null,
      data: {},
    };
  }
  componentDidMount() {
    // 修改mobx中存储的值
    setTitle.call(this, "成员详情");

    if (this.props.params.userId) {
      this.getData(this.props.params.userId);
      this.healthCodeQuery(this.props.params.userId)
    }
  }
  getData(userId) {
    if (!userId) {
      Toast.fail("查询不到用户ID");
      return;
    }
    http
      .get({
        url: "/api/zlb/qrCode/create?userId=" + userId,
      })
      .then((res) => {
        if (res.data.code == 1) {
          console.log(res.data.data);
          this.setState({
            QRCode1: res.data.data.qrCode, //二维码
            codeType1: res.data.data.level, //健康码颜色
            data: res.data.data,
          });
          this.drawCode1();
        }
      });
  }

  drawCode1() {
    // Toast.loading()
    // if()
    const QRCode = require("qrcodejs2");
    var qrcode = new QRCode("qrcode", {
      text: this.state.QRCode1,
      width: (287 / 375) * document.documentElement.clientWidth,
      height: (287 / 375) * document.documentElement.clientWidth,
      padding: 0, // 生成二维码四周自动留边宽度，不传入默认为0
      correctLevel: QRCode.CorrectLevel.L, // 二维码可辨识度
      colorDark:
        this.state.codeType1 == "green"
          ? "#3DA93D"
          : this.state.codeType1 == "red"
          ? "#DC143C"
          : this.state.codeType1 == "yellow"
          ? "#FCC20B"
          : "#000",
      colorLight: "#ffffff",
      callback: (res) => {
        this.setState({
          codeImg1: res.path,
        });
      },
    });
  }
  //调取健康码
  healthCodeQuery(userId) {
    let data = {
      userId: userId,
      source: "ZLB",
    };
    http
      .get({
        url:
          "api/user/health/code/query?userId=" +
          data.userId +
          "&source=" +
          data.source,
      })
      .then((res) => {
        if (res.data.code == 1) {
          this.setState({
            QRCode: res.data.data.qrCode, //二维码
            codeType: res.data.data.level, //健康码颜色
            healthyName: res.data.data.name,
            healthyCode: true,
          });
          this.drawCode();
        } else {
          this.setState({
            healthyCode: false,
          });
        }
      });
  }

  drawCode() {
    const QRCode = require("qrcodejs2");
    var qrcode = new QRCode("qrcode2", {
      text: this.state.QRCode,
      width: (287 / 375) * document.documentElement.clientWidth,
      height: (287 / 375) * document.documentElement.clientWidth,
      padding: 0, // 生成二维码四周自动留边宽度，不传入默认为0
      correctLevel: QRCode.CorrectLevel.L, // 二维码可辨识度
      colorDark:
        this.state.codeType == "green"
          ? "#3DA93D"
          : this.state.codeType == "red"
          ? "#DC143C"
          : this.state.codeType == "yellow"
          ? "#FCC20B"
          : "#000",
      colorLight: "#ffffff",
      callback: (res) => {
        // Toast.hide()
        this.setState({
          codeImg: res.path,
        });
      },
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
  changeCheckIn() {}
  //访客登记
  changeRegister() {}
  render() {
    // 从mobx中拿所需属性
    const { data } = this.state;
    return (
      <div className={`${prefix}`}>
        {/*头部*/}
        <div className={`${prefix}-bg`}></div>
        <div className={`${prefix}-header`}>
          <img
            className={`${prefix}-header-photo`}
            src={require("./../../assets/imgs/homepage/house_icon_registered_d.png")}
            alt=""
          />
          <div className={`${prefix}-header-info flex flex-column`}>
            <span className={`${prefix}-header-info-name`}>
              {data ? data.userName : ""}
            </span>
            <span className={`${prefix}-header-info-idcard`}>
              {data ? data.certificateId : ""}
            </span>
          </div>
        </div>
        {/*中部*/}

        <div className={`${prefix}-main`}>
          <Tabs
            tabs={this.state.tabs}
            // swipeable={false}
            // initialPage={"t1"}
            // renderTab={tab => <span className={`${prefix}-health-title`}>{tab.title}</span>}
            // renderTab={false}
          >
            <div className={`${prefix}-health-tabs`}>
              <div className={`${prefix}-health-style`}>
                {/* <img className={`${prefix}-health-tabs-code`} src={require('./../../assets/imgs/homepage/refresh.png')} alt="" /> */}
                <div
                  className={`${prefix}-health-tabs-code`}
                  id="qrcode"
                  draggable="false"
                  ref="qrcode"
                ></div>
                {/*<div className={`${prefix}-health-tabs-text`}>*/}
                {/*  亦是<span className={`${prefix}-health-tabs-text-person`}>“个人访客码”</span>，若小区开通访客功能，可分享*/}
                {/*  此码邀请访客；若小区有设备支持，也可用此码开门*/}
                {/*</div>*/}
              </div>
              {/*<div className={`${prefix}-health-footer`}>*/}
              {/*  <Button type='primary' className={`${prefix}-health-share`} size='small'>分享</Button>*/}
              {/*  <Button type='primary' className={`${prefix}-health-unfold`} size='small'>展开</Button>*/}
              {/*</div>*/}
            </div>
            <div className={`${prefix}-health-tabs`}>
              <div
                className={`${prefix}-health-tabs-code`}
                id="qrcode2"
                draggable="false"
                ref="qrcode2"
              ></div>
              {/* <div>
                <img
                  className={`${prefix}-health-tabs-code`}
                  src={require("./../../assets/imgs/homepage/refresh.png")}
                  alt=""
                />
                <div className={`${prefix}-health-tabs-text`}>
                  亦是
                  <span className={`${prefix}-health-tabs-text-person`}>
                    “个人访客码”
                  </span>
                  ，若小区开通访客功能，可分享
                  此码邀请访客；若小区有设备支持，也可用此码开门
                </div>
              </div> */}
              {/* <div className={`${prefix}-health-footer`}>
                <Button
                  type="primary"
                  className={`${prefix}-health-share`}
                  size="small"
                >
                  分享
                </Button>
                <Button
                  type="primary"
                  className={`${prefix}-health-unfold`}
                  size="small"
                >
                  展开
                </Button>
              </div> */}
            </div>
          </Tabs>
        </div>
      </div>
    );
  }
}
// inject 将store注入到当Test组件的props中
export default inject("store")(observer(Index));
