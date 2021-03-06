/* eslint-disable no-console */
/* eslint-disable no-debugger */
// eslint-disable-next-line no-unused-vars
import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { Toast, Button, WhiteSpace, Tabs } from "antd-mobile";
import "./index.scss";
import {
  back,
  getUrlValue,
  jump,
  setTitle,
  getStorage,
  setStorage,
} from "../../utlis/utlis";
import http from "../../utlis/http";
import NowTime from "../../common/now-time";
import QRCode from "qrcodejs2";
import { Control } from "react-keeper";

const prefix = "believe-code";
let dateTime = new Date();
Toast.config({
  mask: false,
});

class BelieveCode extends Component {
  constructor(props) {
    super(props);
    this.store = this.props.store.testStore;
  }
  state = {
    qrcode: "",
    // healthyName: '',
    codeType: "#000",
    dateTime: dateTime.toLocaleDateString().replace(/\//gi, "-"),
    tabs: [{ title: "我的拜访" }, { title: "拜访记录" }],
  };

  async componentDidMount() {
    console.log(91111111);
    // 修改mobx中存储的值
    setTitle.call(this, "温州健康码");
    this.store.name = "name";
    // let QRCode  = getStorage()
   await getStorage("codeType", async (codeType) => {
     await getStorage("QRCode", (QRCode) => {
        this.setState(
          {
            QRCode: QRCode,
            codeType: codeType,
            // healthyName: localStorage.getItem('healthyName')
          },
          () => {
            this.drawCode();
          }
        );
      });
    });
  }
  drawCode() {
    Toast.loading();
    const QRCode = require("qrcodejs2");
    var qrcode = new QRCode("myQrcode", {
      text: this.state.QRCode,
      width: (221 / 375) * document.documentElement.clientWidth,
      height: (221 / 375) * document.documentElement.clientWidth,
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
        Toast.hide();
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
  render() {
    // 从mobx中拿所需属性

    return (
      <div className={`${prefix}`}>
        <Tabs
          tabs={this.state.tabs}
          initialPage={0}
          style={{
            position: "absolute",
            top: "0",
          }}
          onChange={(tab, index) => {
          }}
          onTabClick={(tab, index) => {
          }}
        >
          <div className={`${prefix}-main`}>
            <div className={`${prefix}-main-head`}>
              <NowTime></NowTime>
            </div>
            <div className={`${prefix}-main-code`}>
              <div
                className={`${prefix}-main-code-healthy`}
                id="myQrcode"
                ref="myQrcode"
              ></div>
            </div>
          </div>
          {/*<div className={`${prefix}-phone`}>*/}
          {/*    <div className={`${prefix}-phone-info`}>*/}
          {/*        <img className={`${prefix}-phone-png`} src={require('./../../assets/imgs/healthy/phone@2x.png')} alt="" />*/}
          {/*        <span className={`${prefix}-phone-text`}>服务热线: 0577-12345</span>*/}
          {/*    </div>*/}
          {/*    <span className={`${prefix}-phone-eg`}>*/}
          {/*        - 本服务由当地人民政府提供 -*/}
          {/*    </span>*/}
          {/*</div>*/}
        </Tabs>
      </div>
    );
  }
}
// inject 将store注入到当Test组件的props中
export default inject("store")(observer(BelieveCode));
