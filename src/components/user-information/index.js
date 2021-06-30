/* eslint-disable no-console */
/* eslint-disable no-debugger */
// eslint-disable-next-line no-unused-vars
import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import {Toast, Button, DatePicker, List} from "antd-mobile";
import "./index.scss";
import {back, jump, pxTovw, formatDate, setTitle, setStorage, getStorage} from "../../utlis/utlis";
import http from "../../utlis/http";

const prefix = "userInformation";
Toast.config({
    mask: false,
});

class Index extends Component {
    constructor(props) {
        super(props);
        this.store = this.props.store.testStore;
    }

    state = {
        type: true,
        // showHouseHolder: false,
        value: "0",
        complexName: "",
        addressAddMember: "",
        typeOptions: [
            {
                name: "业主",
                value: 0,
            },
            {
                name: "租户",
                value: 1,
            },
        ],
        familyOptions: [
            {
                name: "户主",
                value: 0,
            },
            {
                name: "成员",
                value: 1,
            },
        ],
        houseName: "",
        unitName: "",
        buildingName: "",
        checked_yezhu: false,
        checked_huzhu: false,
        startDate: "",
        endDate: "",
        householderType: "", //0非户主1户主
    };

    async componentDidMount() {
        setTitle.call(this, "住户信息");
        let addUser
        await getStorage('addUser', res => {
            addUser = res
        });
        if (addUser) {
            addUser = JSON.parse(addUser);
        }
        // 修改mobx中存储的值
        let houseName, unitName, buildingName, complexName
        await getStorage('houseName', res => {
            houseName = res
        })
        await getStorage('unitName', res => {
            unitName = res
        })
        await getStorage('buildingName', res => {
            buildingName = res
        })
        await getStorage('complexName', res => {
            complexName = res
        })
        this.setState({
            houseName: houseName,
            unitName: unitName,
            buildingName: buildingName,
            addressAddMember: addUser ? addUser.addressAddMember : "",
            complexName: addUser
                ? addUser.complexAddMemberName
                : complexName,
        });
        this.checkHouseholder();
    }

    //查询当前操作人是否是户主
    queryHousehloderType() {
        let data = {
            userId: this.state.userId,
            myHouseId: this.state.myHouseId,
        };
        http.get({
                url:
                    "/test/zlb/householder/type?userId=" +
                    data.userId +
                    "&myHouseId=" +
                    data.myHouseId,
            })
            .then((res) => {
                if (res.data.code == 1) {
                    this.setState({
                        householderType: res.data.data.householderType,
                        checked_huzhu: true,
                    });
                }
            });
    }

    //查询房屋是否已有户主
    async checkHouseholder() {
        let houseId
        await getStorage('houseId', res => {
            houseId = res
        })
        let data = {
            houseId: houseId,
        };
        http.get({
                url: "/test/house/isHouseholder?houseId=" + data.houseId,
            })
            .then((res) => {
                console.log("是否有业主", res);

                if (res.data.code == 1 && res.data.data.length > 0) {
                    this.setState(
                        {
                            myHouseId: res.data.data[0].id,
                            userId: res.data.data[0].userId,
                        },
                        () => {
                            this.queryHousehloderType();
                        }
                    );
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

    //提交用户信息
    async saveBtn() {
        let addUser, houseId
        await getStorage("addUser", res => {
            addUser = res
        });
        await getStorage("houseId", res => {
            houseId = res
        });

        if (addUser) {
            addUser = JSON.parse(addUser);
        }
        console.log(addUser,'我是adduser')
        let housingType, isHouseholder; //housingType
        houseId = addUser
            ? addUser.houseAddMemberId
            : houseId;
        console.log(this.state.value, "我是打印出来的value0是户主，1不是户主");
        if (this.state.type == true) {
            housingType = "1";
            if (this.state.value == "0") {
                isHouseholder = "1";
            } else {
                isHouseholder = "0";
            }
            if (this.state.householderType == 1) {
                isHouseholder = "0";
            }
        } else {
            housingType = "2";
            isHouseholder = "0";
        }
        let userInfo, nation, zfbUserId, photoImg, userName, certificateId, tel
        await getStorage("userInfo", res => {
            userInfo = res
        });
        if (userInfo) {
            userInfo = JSON.parse(userInfo);
        }
        await getStorage("nation", res => {
            nation = res
        });
        await getStorage("zfbUserId", res => {
            zfbUserId = res
        })
        await getStorage("photoImg", res => {
            photoImg = res
        })
        await getStorage("userName", res => {
            userName = res
        })
        await getStorage("certificateId", res => {
            certificateId = res
        })
        await getStorage("tel", res => {
            tel = res
        })
        Toast.loading();

        console.log(userInfo, "userInfo用户信息");
        let data = {
            housingType,
            isHouseholder,
            houseId,
            zlbUserId: addUser ? "" : zfbUserId,
            registerType: addUser ? "REGISTER_HELP" : "REGISTER_OWN",
            source: "ALI_PAY",
            imageUrl: addUser ? addUser.imageUrl : photoImg,
            nation: addUser ? addUser.nation : nation,
            userName: addUser ? addUser.userName : userName,
            certificateType: "身份证",
            certificateId: addUser ? addUser.certificateId : certificateId,
            tel: addUser ? addUser.tel : tel,
            rentStartDate:
                this.state.startDate !== "" ? formatDate(this.state.startDate) : "",
            rentEndDate:
                this.state.endDate !== "" ? formatDate(this.state.endDate) : "",
        };
        if (
            data.housingType != "1" &&
            (data.rentStartDate === "" || data.rentEndDate === "")
        ) {
            Toast.fail("请选择租户居住时间");
            return;
        }
        let dataId, complexName
        await getStorage("zjuserid", res => {
            dataId = res
        })
        await getStorage("complexName", res => {
            complexName = res
        })
        http.post({
            url: "/test/zlb/user/house/add",
            data,
        })
            .then(async (res) => {
                Toast.hide();
                if (res.data.code == 1) {
                    console.log("我走进来了吗");
                    let userid
                    await getStorage("dataId", res => {
                        userid = res
                    });
                    //查询小区列表
                    http.get({
                        url:
                            "/test/myComplex/info?userId=" + userid,
                    }).then((res) => {
                        console.log("我TM块哭了");
                        if (!complexName) {
                            let data = res && res.data && res.data.data;
                            if (data && data.length > 0) {
                                let item = data.filter((e) => {
                                    return e.isPresent == 1;
                                });
                                console.log(item, "我是当前item");
                                if (item.length > 0) {
                                    setStorage("complexName", item[0].complexName);
                                    setStorage("complexCode", item[0].complexCode);
                                } else {
                                    setStorage("complexName", data[0].complexName);
                                    setStorage("complexCode", data[0].complexCode);
                                }
                            }
                        }
                    });
                    window.my.removeStorage({
                        key: 'addUser',
                    });
                    jump.call(this, "/register-success");
                } else {
                    Toast.fail(res.data.message);
                }
            })
            .catch((err) => {
                console.log(err, "我是返回的报错信息");
            });
    }

    //改变label的值
    changeBtnYeZhu(item) {
        console.log(this.state.checked_yezhu, "我是业主值");
        this.setState({
            checked_yezhu: !this.state.checked_yezhu,
        });
        if (this.state.checked_yezhu) {
            this.setState({
                type: true,
                value: item.value,
            });
        } else {
            this.setState({
                type: false,
                value: item.value,
            });
        }
    }

    changeBtnHuZhu(item) {
        console.log(
            this.state.householderType,
            "我没点到吗",
            this.state.checked_huzhu
        );
        if (this.state.householderType == 1) {
            return;
        } else {
            this.setState({
                checked_huzhu: !this.state.checked_huzhu,
            });
        }

        console.log(item, "我是item");
        this.setState({
            value: item.value,
        });
    }

    checkDate(date) {
        let startDateTemp = this.state.startDate;
        if (!startDateTemp) {
            Toast.fail("请选择开始时间");
            return;
        }
        let startTime = new Date(startDateTemp).getTime();
        let endTime = new Date(date).getTime();
        if (startTime > endTime) {
            Toast.fail("租住开始时间不得大于结束时间");
            return;
        }
        this.setState({endDate: date});
    }

    checkStartDate(date) {
        this.setState({
            startDate: date,
        });
        if (this.state.endDate !== "") {
            this.setState({
                endDate: "",
            });
        }
    }

    render() {
        // 从mobx中拿所需属性
        const {
            complexName,
            buildingName,
            unitName,
            houseName,
            householderType,
            addressAddMember,
        } = this.state;
        return (
            <div className={`${prefix} flex flex-column`}>
                <div>
                    {/*<div className={`${prefix}-header`} onClick={this.goBack.bind(this)}>*/}
                    {/*    <img className={`${prefix}-header-left`} src={require('./../../assets/imgs/common/back@3x.png')} alt=""/>*/}
                    {/*</div>*/}
                    <div className={`${prefix}-main`}>
                        <div className={`${prefix}-main-head`}>住户信息</div>
                        <div className={`${prefix}-main-name`}>
                            {complexName}
                            {addressAddMember
                                ? addressAddMember
                                : buildingName + unitName + houseName}
                        </div>
                    </div>
                </div>
                <div className={`${prefix}-container`}>
                    <div className={`${prefix}-container-title`}>住户类型</div>
                    <div>
                        {this.state.typeOptions.map((item, index) => {
                            return (
                                <div className={`${prefix}-container-inpiut flex align-center`}>
                                    {this.state.checked_yezhu == index ? (
                                        <img
                                            className={`${prefix}-container-img`}
                                            onClick={this.changeBtnYeZhu.bind(this, item)}
                                            id={item.id}
                                            src={require("./../../assets/imgs/common/radio_checked.png")}
                                            alt=""
                                        />
                                    ) : (
                                        <img
                                            className={`${prefix}-container-img`}
                                            onClick={this.changeBtnYeZhu.bind(this, item)}
                                            id={item.id}
                                            src={require("./../../assets/imgs/common/radio_button.png")}
                                            alt=""
                                        />
                                    )}
                                    <span className={`${prefix}-container-text`}>
                    {item.name}
                  </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
                {(() => {
                    if (this.state.type) {
                        return (
                            <div className={`${prefix}-container`}>
                                <div className={`${prefix}-container-title`}>家庭成员</div>
                                {this.state.familyOptions.map((item, index) => {
                                    return (
                                        <div
                                            className={`${prefix}-container-inpiut flex align-center`}
                                        >
                                            {(() => {
                                                if (index == 0 && householderType == 1) {
                                                    return (
                                                        <img
                                                            className={`${prefix}-container-img`}
                                                            src={require("./../../assets/imgs/no-select.png")}
                                                            alt=""
                                                        />
                                                    );
                                                } else {
                                                    if (this.state.checked_huzhu == index) {
                                                        return (
                                                            <img
                                                                className={`${prefix}-container-img`}
                                                                onClick={this.changeBtnHuZhu.bind(this, item)}
                                                                id={item.id}
                                                                src={require("./../../assets/imgs/common/radio_checked.png")}
                                                                alt=""
                                                            />
                                                        );
                                                    }
                                                    return (
                                                        <img
                                                            className={`${prefix}-container-img`}
                                                            onClick={this.changeBtnHuZhu.bind(this, item)}
                                                            id={item.id}
                                                            src={require("./../../assets/imgs/common/radio_button.png")}
                                                            alt=""
                                                        />
                                                    );
                                                }
                                            })()}
                                            <span className={`${prefix}-container-text`}>
                        {item.name}
                      </span>
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    } else {
                        return (
                            <div className={`${prefix}-container`}>
                                <div className={`${prefix}-container-title`}>居住时间</div>
                                <DatePicker
                                    mode="date"
                                    title="开始时间"
                                    extra="请选择开始时间"
                                    value={this.state.startDate}
                                    format
                                    onChange={(date) => this.checkStartDate(date)}
                                >
                                    <List.Item arrow="horizontal">租住开始时间</List.Item>
                                </DatePicker>
                                <DatePicker
                                    mode="date"
                                    title="结束时间"
                                    extra="请选择结束时间"
                                    value={this.state.endDate}
                                    onChange={(date) => this.checkDate(date)}
                                >
                                    <List.Item arrow="horizontal">租住结束时间</List.Item>
                                </DatePicker>
                            </div>
                        );
                    }
                })()}
                <div className={`${prefix}-footer flex1 flex align-center`}>
                    <Button
                        className={"save-btn"}
                        onClick={this.saveBtn.bind(this)}
                        type="primary"
                    >
                        下一步
                    </Button>
                </div>
            </div>
        );
    }
}

// inject 将store注入到当Test组件的props中
export default inject("store")(observer(Index));
