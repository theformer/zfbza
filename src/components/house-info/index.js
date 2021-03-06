/* eslint-disable no-console */
/* eslint-disable no-debugger */
// eslint-disable-next-line no-unused-vars
import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { Toast } from "antd-mobile";
import "./index.scss";
import { setTitle, back, jump,getStorage,setStorage } from "../../utlis/utlis";
import http from "../../utlis/http";
import QRCode from "qrcodejs2";

const prefix = "house-info";
Toast.config({
  mask: false,
});
class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
    };
  }
  async componentDidMount() {
    let complexCodeNo
    await getStorage('complexCode',res=>{
      complexCodeNo =  res
    })
    if (this.props.params.complexCode) {
      let complexCode = this.props.params.complexCode;
      this.getHouseDetail(complexCode);
    } else if (complexCodeNo) {
      let complexCode
     await getStorage("complexCode",res=>{
       complexCode =  res
      });
      this.getHouseDetail(complexCode);
    }
  }

  toIndex() {
    // 跳转
    jump.call(this, "/index");
  }
  goBack() {
    // 返回
    back.call(this);
  }
  formatPhone(val) {
    if (val) {
      const matches = /^(\d{3})(\d{4})(\d{4})$/.exec(val);
      if (matches) {
        return matches[1] + " " + matches[2] + " " + matches[3];
      }
    }
    return val;
  }
  getHouseDetail(complexCode) {
    let data = {
      complexCode,
    };
    http
      .get({
        url: "/api/complexInfo/complexCode?complexCode=" + data.complexCode,
      })
      .then((res) => {
        const { code, message, data } = res.data;
        if (code !== "1") {
          Toast.fail(message ? message : "获取小区信息失败");
          return;
        }
        data.liaisonPhone = this.formatPhone(data.liaisonPhone);
        data.operatePhone = this.formatPhone(data.operatePhone);
        data.constructionPhone = this.formatPhone(data.constructionPhone);
        this.setState({
          data: data,
        });
        setTitle.call(this, data.complexName);
        this.drawCode(complexCode);
      })
      .catch((err) => {
      });
  }
  drawCode(complexCode) {
    // Toast.loading()
    if (!complexCode) {
      return;
    }
    // const QRCode = require('qrcodejs2');
    let qrcode = new QRCode("myQrcode", {
      text: `https://h5.yiyun-smart.com/test?complexid=`+complexCode,
      width: (180 / 375) * document.documentElement.clientWidth,
      height: (180 / 375) * document.documentElement.clientWidth,
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
    });
  }
  render() {
    // 从mobx中拿所需属性
    const { data } = this.state;
    return (
      <div className={`${prefix} flex flex-column`}>
        <div className={`${prefix}-bg`}></div>
        <div className={`${prefix}-head`}>
          <span>小区二维码，扫码登记</span>
          {/* <img src={require('./../../assets/imgs/homepage/refresh.png')} alt="" /> */}
          <div
            className={`${prefix}-erCode`}
            id="myQrcode"
            ref="myQrcode"
          ></div>
        </div>
        <div className={`${prefix}-bg`}></div>
        <div className={`${prefix}-main`}>
          <div className={`${prefix}-main-col flex`}>
            <span className={`${prefix}-main-col-label`}>物业公司</span>
            <span className={`${prefix}-main-col-value`}>
              {data.companyName ? data.companyName : "暂无数据"}
            </span>
          </div>
          <div className={`${prefix}-main-col flex`}>
            <span className={`${prefix}-main-col-label`}>负责人</span>
            <span className={`${prefix}-main-col-value`}>
              {data.liaisonName ? data.liaisonName : "暂无数据"}
            </span>
          </div>
          <div className={`${prefix}-main-col flex`}>
            <span className={`${prefix}-main-col-label`}>联系电话</span>
            <span className={`${prefix}-main-col-phone`}>
              {data.liaisonPhone ? data.liaisonPhone : "暂无数据"}
            </span>
          </div>
          <div className={`${prefix}-main-col flex`}>
            <span className={`${prefix}-main-col-label`}>所属辖区</span>
            <span className={`${prefix}-main-col-value`}>
              {data.district ? data.district : "暂无数据"}
            </span>
          </div>
          <div className={`${prefix}-main-col flex`}>
            <span className={`${prefix}-main-col-label`}>详细地址</span>
            <span className={`${prefix}-main-col-value`}>
              {data.address ? data.address : "暂无数据"}
            </span>
          </div>
        </div>
        <div className={`${prefix}-bg`}></div>
        <div className={`${prefix}-main`}>
          <div className={`${prefix}-main-col flex`}>
            <span className={`${prefix}-main-col-label`}>建设时间</span>
            <span className={`${prefix}-main-col-value`}>
              {data.buildDay ? data.buildDay : "暂无数据"}
            </span>
          </div>
        </div>
        <div className={`${prefix}-bg`}></div>
        <div className={`${prefix}-main`}>
          <div className={`${prefix}-main-col flex`}>
            <span className={`${prefix}-main-col-label`}>承建商</span>
            <span className={`${prefix}-main-col-value`}>
              {data.construction ? data.construction : "暂无数据"}
            </span>
          </div>
          <div className={`${prefix}-main-col flex`}>
            <span className={`${prefix}-main-col-label`}>联系方式</span>
            <span className={`${prefix}-main-col-phone`}>
              {data.constructionPhone ? data.constructionPhone : "暂无数据"}
            </span>
          </div>
        </div>
        <div className={`${prefix}-bg`}></div>
        <div className={`${prefix}-main`}>
          <div className={`${prefix}-main-col flex`}>
            <span className={`${prefix}-main-col-label`}>运营商</span>
            <span className={`${prefix}-main-col-value`}>
              {data.operate ? data.operate : "暂无数据"}
            </span>
          </div>
          <div className={`${prefix}-main-col flex`}>
            <span className={`${prefix}-main-col-label`}>联系方式</span>
            <span className={`${prefix}-main-col-phone`}>
              {data.operatePhone ? data.operatePhone : "暂无数据"}
            </span>
          </div>
        </div>
        <div className={`${prefix}-bg`}></div>
        <div className={`${prefix}-main-footer flex`}>
          <span className={`${prefix}-main-col-label`}>访客功能</span>
          <div>
            <span
              className={`${prefix}-main-col-footer-label ${
                data.visitorSwitch !== "0" ? "green" : ""
              }`}
            >
              {data.visitorSwitch === "0" ? "未开启" : "已开启"}
            </span>
            {(() => {
              if (data.visitorSwitch === "0") {
                return (
                  <div className={`${prefix}-main-col-footer-main flex`}>
                    <img
                      className={`${prefix}-main-col-label-warning`}
                      src={require("./../../assets/imgs/common/icon_attention@2x.png")}
                      alt=""
                    />
                    <span className={`${prefix}-main-col-label-text`}>
                      该小区访客功能未开启或不支持，请联系物业
                    </span>
                  </div>
                );
              }
            })()}
          </div>
        </div>
      </div>
    );
  }
}
// inject 将store注入到当Test组件的props中
export default inject("store")(observer(Index));
