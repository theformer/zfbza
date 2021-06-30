/* eslint-disable no-console */
/* eslint-disable no-debugger */
// eslint-disable-next-line no-unused-vars
import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { Toast, Button, Picker, List } from "antd-mobile";

import "./index.scss";
import {
  setTitle,
  back,
  jump,
  validPhone,
  validIdCard,
  getHashUrlValue,
  setStorage,
  getStorage
} from "../../utlis/utlis";
import http from "../../utlis/http";

const prefix = "add-member";
Toast.config({
  mask: false,
});
class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: "",
      certificateId: "",
      nation: ["汉族"],
      nationList: [
        { label: "汉族", value: "汉族" },
        { label: "阿昌族", value: "阿昌族" },
        { label: "白族", value: "白族" },
        { label: "保安族", value: "保安族" },
        { label: "布朗族", value: "布朗族" },
        { label: "布依族", value: "布依族" },
        { label: "朝鲜族", value: "朝鲜族" },
        { label: "傣族", value: "傣族" },
        { label: "达斡尔族", value: "达斡尔族" },
        { label: "德昂族", value: "德昂族" },
        { label: "东乡族", value: "东乡族" },
        { label: "侗族", value: "侗族" },
        { label: "独龙族", value: "独龙族" },
        { label: "鄂温克族", value: "鄂温克族" },
        { label: "鄂伦春族", value: "鄂伦春族" },
        { label: "俄罗斯族", value: "俄罗斯族" },
        { label: "高山族 ", value: "高山族 " },
        { label: "哈萨克族", value: "哈萨克族" },
        { label: "哈尼族", value: "哈尼族" },
        { label: "赫哲族", value: "赫哲族" },
        { label: "回族", value: "回族" },
        { label: "基诺族", value: "基诺族" },
        { label: "景颇族", value: "景颇族" },
        { label: "京族 ", value: "京族 " },
        { label: "柯尔克孜族", value: "柯尔克孜族" },
        { label: "仡佬族", value: "仡佬族" },
        { label: "拉祜族", value: "拉祜族" },
        { label: "黎族", value: "黎族" },
        { label: "僳僳族", value: "僳僳族" },
        { label: "珞巴族", value: "珞巴族" },
        { label: "满族", value: "满族" },
        { label: "毛南族", value: "毛南族" },
        { label: "门巴族", value: "门巴族" },
        { label: "蒙古族", value: "蒙古族" },
        { label: "苗族", value: "苗族" },
        { label: "仫佬族", value: "仫佬族" },
        { label: "纳西族", value: "纳西族" },
        { label: "怒", value: "怒" },
        { label: "族", value: "族" },
        { label: "普米族", value: "普米族" },
        { label: "羌族 ", value: "羌族 " },
        { label: "撒拉族", value: "撒拉族" },
        { label: "畲族", value: "畲族" },
        { label: "水族", value: "水族" },
        { label: "塔塔尔族", value: "塔塔尔族" },
        { label: "塔吉克族", value: "塔吉克族" },
        { label: "土族", value: "土族" },
        { label: "土家族", value: "土家族" },
        { label: "佤族", value: "佤族" },
        { label: "维吾尔族", value: "维吾尔族" },
        { label: "乌孜别克族", value: "乌孜别克族" },
        { label: "锡伯族", value: "锡伯族" },
        { label: "瑶族", value: "瑶族" },
        { label: "彝族", value: "彝族" },
        { label: "裕固族", value: "裕固族" },
        { label: "藏族", value: "藏族" },
        { label: "壮族", value: "壮族" },
      ],
      nationVisible: false,
      tel: "",
      code: "",
      count: 60,
      liked: true,
      complexAddMemberName: "",
      addressAddMember: "",
      houseAddMemberId: "",
    };
  }
  componentDidMount() {
    setTitle.call(this, "新增成员");
    let complexAddMemberName = getHashUrlValue("complexAddMemberName");
    if (complexAddMemberName) {
      this.setState({
        complexAddMemberName,
      });
    }
    let addressAddMember = getHashUrlValue("addressAddMember");
    if (addressAddMember) {
      this.setState({
        addressAddMember,
      });
    }
    let houseAddMemberId = getHashUrlValue("houseAddMemberId");
    if (houseAddMemberId) {
      this.setState({
        houseAddMemberId,
      });
    }
  }
  //获取短信验证码的值
  onChangeCode(e) {
    e.persist();
    this.setState({
      code: e.target.value,
    });
  }
  //点击倒计时
  async handleClick() {
    if (!validPhone(this.state.tel)) {
      Toast.fail("手机号验证失败");
      return;
    }
    console.log("开始倒计时");

    let userInfo
   await getStorage("userInfo",res=>{
      userInfo = res
    });
    if (!userInfo) {
      return;
    }
    userInfo = JSON.parse(userInfo);
    let data = {
      tel: this.state.tel,
    };
    http
      .post({
        url: "/api/message/send",
        data,
      })
      .then((res) => {
        console.log(res, "获取验证码");
        const { code, message } = res.data;
        if (code !== "1") {
          Toast.fail(message ? message : "验证码获取失败");
          return;
        }
        Toast.success("验证码发送成功");
      })
      .catch((err) => {
        Toast.fail("服务器连接失败");
      });
    const { liked } = this.state;
    if (!liked) {
      return;
    }
    this.countDown();
  }
  countDown() {
    const { count } = this.state;
    if (count === 1) {
      this.setState({
        count: 60,
        liked: true,
      });
    } else {
      this.setState({
        count: count - 1,
        liked: false,
      });
      setTimeout(this.countDown.bind(this), 1000);
    }
  }
  //获取姓名
  onChangeName(e) {
    e.persist();
    this.setState({
      userName: e.target.value,
    });
  }
  //获取身份证号
  onChangeIdCard = (e) => {
    e.persist();
    this.setState({
      certificateId: e.target.value,
    });
  };
  // 获取手机号
  onChangePhone = (e) => {
    e.persist();
    this.setState({
      tel: e.target.value,
    });
  };

  //身份证验证
  blurIdCard() {
    if (!validIdCard(this.state.certificateId)) {
      Toast.fail("身份证号验证失败");
      return;
    }
  }
  blurPhone() {
    if (!validPhone(this.state.tel)) {
      Toast.fail("手机号验证失败");
      return;
    }
  }
  // 校验身份证
  async chenckSFZ() {
    if (!validIdCard(this.state.certificateId)) {
      Toast.fail("身份证号验证失败");
      return;
    }

    if (!validPhone(this.state.tel)) {
      Toast.fail("手机号验证失败");
      return;
    }

    let data = {
      name: this.state.userName,
      idcardNo: this.state.certificateId,
    };
    await http
      .post({
        url: "/api/user/credible/idcardNo",
        data,
      })
      .then((res) => {
        console.log(res, "校验身份返回数据");
        const { code, message } = res.data;
        if (code !== "1") {
          Toast.fail(message ? message : "身份校验失败");
          return;
        }
        this.toPassWay();
        // this.chenckCode();
      })
      .catch((err) => {
        Toast.fail("服务器连接失败");
      });
  }
  // async chenckCode() {
  //   let data = {
  //     tel: this.state.tel,
  //     code: this.state.code,
  //   };
  //   await http
  //     .post({
  //       url: "/api/message/valid",
  //       data,
  //     })
  //     .then((res) => {
  //       console.log(res, "校验验证码返回数据");
  //       const { code, message } = res.data;
  //       if (code !== "1") {
  //         Toast.fail(message ? message : "验证码校验失败");
  //         return;
  //       }
  //       this.toPassWay();
  //     })
  //     .catch((err) => {
  //       Toast.fail("服务器连接失败");
  //     });
  // }
  // 跳转到下一步
  async toPassWay() {
    let addUser = {
      userName: this.state.userName,
      tel: this.state.tel,
      certificateType: "身份证",
      certificateId: this.state.certificateId,
      nation: this.state.nation.toString(),
      complexAddMemberName: this.state.complexAddMemberName,
      addressAddMember: this.state.addressAddMember,
      houseAddMemberId: this.state.houseAddMemberId,
    };
    await setStorage("addUser", JSON.stringify(addUser));
    await setStorage("passWayVal", 2);
    jump.call(this, "/pass-way");
  }
  toPrivacyPolicy() {
    jump.call(this, "/coordinate-info");
  }
  goBack() {
    // 返回
    back.call(this);
  }
  render() {
    // 从mobx中拿所需属性
    return (
      <div className={`${prefix}`}>
        <div className={`${prefix}-main`}>
          <div className={`${prefix}-main-form`}>
            <div className={`${prefix}-form-name login-cards`}>
              <div className={"login-idCard margin-bottom14"}>住户姓名</div>
              <input
                type="text"
                placeholder="请输入证件上的姓名"
                value={this.state.userName}
                onChange={this.onChangeName.bind(this)}
                className={`${prefix}-form-name-ipt ipt-none name-card`}
              />
            </div>
            <div className={`${prefix}-line`}></div>
            <div className={`${prefix}-form-idCard login-cards`}>
              <div className={"login-idCard margin-bottom14"}>身份证号</div>
              <input
                type="text"
                onBlur={this.blurIdCard.bind(this)}
                placeholder="请输入身份证号码，其他证件去物业处登记"
                value={this.state.certificateId}
                onChange={this.onChangeIdCard.bind(this)}
                className={`${prefix}-form-name-ipt ipt-none name-card`}
              />
            </div>
            <div className={`${prefix}-line`}></div>

            <div className={`${prefix}-form-nation login-idCard`}>
              <div className={"login-idCard"}>民族</div>
              <Picker
                data={this.state.nationList}
                cols={1}
                value={this.state.nation}
                visible={this.state.nationVisible}
                onOk={(val) =>
                  this.setState({ nation: val, nationVisible: false })
                }
                onDismiss={(val) => this.setState({ nationVisible: false })}
              >
                <List.Item
                  arrow="horizontal"
                  onClick={() => this.setState({ nationVisible: true })}
                >
                  {this.state.nation}
                </List.Item>
              </Picker>
            </div>
            <div className={`${prefix}-line`}></div>

            <div className={`${prefix}-form-phone login-cards`}>
              <div className={"login-idCard margin-bottom14"}>联系电话</div>
              <div className={"flex flex align-center "}>
                <span className={"phone86"}>+86</span>
                <input
                  type="number"
                  onBlur={this.blurPhone.bind(this)}
                  placeholder="请填写手机号码"
                  value={this.state.tel}
                  className={`${prefix}-form-name-ipt ipt-none name-card padding-left32`}
                  onChange={this.onChangePhone.bind(this)}
                />
              </div>
            </div>
            <div className={`${prefix}-line`}></div>

            <div className={`${prefix}-form-code login-cards`}>
              <div className={"login-idCard margin-bottom14"}>短信验证码</div>
              <div className={`${prefix}-form-footer`}>
                <input
                  type="text"
                  value={this.state.code}
                  onChange={this.onChangeCode.bind(this)}
                  placeholder="请填写短信验证码"
                  className={`${prefix}-form-name-ipt ipt-none code-input name-card`}
                />

                {(() => {
                  if (this.state.liked) {
                    return (
                      <Button
                        className={`${prefix}-form-name-ipt ipt-none auth-code`}
                        onClick={this.handleClick.bind(this)}
                        disabled={!this.state.liked}
                      >
                        获取验证码
                      </Button>
                    );
                  }
                  return (
                    <Button
                      className={`${prefix}-form-name-ipt ipt-none auth-code retry`}
                      onChange={this.handleClick.bind(this)}
                      onClick={this.handleClick.bind(this)}
                      disabled={!this.state.liked}
                    >{`${this.state.count} 秒后重发`}</Button>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>

        <div className={`${prefix}-footer`}>
          <div>
            {(() => {
              if (
                this.state.userName &&
                this.state.certificateId &&
                this.state.nation.length > 0 &&
                this.state.tel &&
                this.state.code
              ) {
                return (
                  <Button
                    type="primary"
                    className={`${prefix}-footer-saveBtn`}
                    onClick={this.chenckSFZ.bind(this)}
                  >
                    下一步
                  </Button>
                );
              }
              return (
                <Button
                  type="primary"
                  disabled
                  className={`${prefix}-footer-saveBtn`}
                >
                  下一步
                </Button>
              );
            })()}
          </div>
          <div className={`${prefix}-footer-text`}>
            {/* <span className={`${prefix}-footer-privacy size28 `} onClick={() => this.toPrivacyPolicy.bind(this)}>隐私政策</span> */}
            <span
              className={`${prefix}-footer-user size28 `}
              onClick={this.toPrivacyPolicy.bind(this)}
            >
              用户政策
            </span>
          </div>
        </div>
      </div>
    );
  }
}
// inject 将store注入到当Test组件的props中
export default inject("store")(observer(Index));
