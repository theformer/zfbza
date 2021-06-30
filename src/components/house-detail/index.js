import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import {
  jump,
  setTitle,
  pxTovw,
  getHashUrlValue,
  ftTovw,
  formatPhone,
  back,
  getStorage,
  setStorage
} from "../../utlis/utlis";
import http from "../../utlis/http";
import {
  Toast,
  PullToRefresh,
  ListView,
  SwipeAction,
  Button,
  Modal,
} from "antd-mobile";
import {
  Activate,
  Deactivate,
  Release,
  Finish,
} from "common/yy-refresh-indiccator";

import "./index.scss";
import { Control } from "react-keeper";

const prefix = "house-detail";
Toast.config({
  mask: false,
});

class HouseDetail extends Component {
  constructor(props) {
    super(props);
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2, // rowHasChanged(prevRowData, nextRowData); 用其进行数据变更的比较
    });
    this.state = {
      dataSource,
      datas: [],
      pageNo: 1,
      pageSize: 10,
      hasMore: true,
      refreshing: true,
      isLoading: true,
      houseList: [],
      hasNextPage: true,
      community: "",
      address: "",
      message: "",
      alert: Modal.alert,
      showBtn: false,
    };
  }
  componentWillMount() {}
  async componentDidMount() {
    setTitle.call(this, "房屋详情");
    let id = getHashUrlValue("id");
    let houseId = getHashUrlValue("houseId");
    let zjuserid
    await getStorage('zjuserid',res=>{
      zjuserid = res
    })
    this.setState({
      zjuserid
    })
    console.log(id, "上一个页面返回过来的id");
    console.log(houseId, "上一个页面返回过来的houseid");
    setStorage('houseId',houseId)
    if (id) {
      this.isHouseholder(id);
    }
    if (houseId) {
      this.getHouseDetail(true, houseId);
      this.setState({
        houseId: houseId,
      });
    }
  }

  getHouseDetail(ref = false, houseId) {
    let data = {
      houseId: houseId,
      // pageCount: this.state.pageNo,
      // pageSize: this.state.pageSize
    };
    http
      .get({
        url: "/api/houseDetails/info?houseId=" + data.houseId,
      })
      .then((res) => {
        // console.log(res, '获取房屋详情返回的参数')
        const { code, message, data } = res.data;

        if (code !== "1") {
          Toast.fail(message);
        }

        data.forEach((el) => {
          if (el.houseId === houseId) {
            // if (el.isHouseholder === '') {
            //     this.setState({
            //         showBtn: true
            //     })
            // }
            el.ownerName1 = el.ownerName1 ? el.ownerName1 : "户主未登记";
            el.ownerPhone1 = el.ownerPhone1 ? el.ownerPhone1 : "户主未登记";
            this.setState({
              community: el.complexName,
              address: el.buildingName + el.unitName + el.houseName,
              message: "户主：" + el.ownerName1 + "/" + el.ownerPhone1,
            });
          }
        });

        const dataList = data;
        const len = dataList.length;

        if (len <= 0 || code !== "1") {
          // 判断是否已经没有数据了
          this.setState({
            refreshing: false,
            isLoading: false,
            hasMore: false,
          });

          Toast.info("没有数据了~", 1);
          return false;
        }

        if (ref) {
          //这里表示刷新使用
          // 下拉刷新的情况，重新添加数据即可(这里等于只直接用了第一页的数据)
          this.setState({
            pageNo: this.state.pageNo,
            hasMore: true, // 下拉刷新后，重新允许开下拉加载
            refreshing: false, // 是否在刷新数据
            isLoading: false, // 是否在加载中
            houseList: dataList, // 保存数据进state，在下拉加载时需要使用已有数据
          });
        } else {
          // 这里表示上拉加载更多
          // 合并state中已有的数据和新增的数据
          var houseList = this.state.houseList.concat(dataList); //关键代码
          this.setState({
            pageNo: this.state.pageNo,
            refreshing: false,
            isLoading: false,
            houseList: houseList, // 保存新数据进state
          });
        }
        this.setLoaded();
        // console.log(this.state.houseList, 'houseList')
      })
      .catch((err) => {
        Toast.fail("服务器连接失败");
      });
  }

  async isHouseholder(id) {
    let zjuserid
    await getStorage('zjuserid',res=>{
      zjuserid =  res
    })
    let data = {
      myHouseId: id,
      userId:zjuserid,
    };
    http
      .get({
        url:
          "/api/zlb/householder/type?myHouseId=" +
          data.myHouseId +
          "&userId=" +
          data.userId,
      })
      .then((res) => {
        const { data, code, message } = res.data;
        if (code !== "1") {
          Toast.fail(message);
        }
        this.setState({
          showBtn: data.householderType == "1" ? true : false,
        });
      });
  }

  toRegDetail(e) {
    let obj = {
      userName: e.userName,
      isHouseholder: e.isHouseholder,
      housingType: e.housingType,
      checkStatus: e.checkStatus,
      tel: e.tel,
      complexCode: e.complexCode,
      passage: e.passage,
    };
    window.sessionStorage.setItem("regDetail", JSON.stringify(obj));
    console.log(obj, "现在是房屋详情，准备跳往登记详情");
    jump.call(this, "/register-detail");
  }

  setLoaded() {
    this.setState({
      request: true,
      isLoading: false,
      refreshing: false,
    });
  }

  onRefresh = () => {
    this.setState(
      {
        refreshing: true,
        pageNo: 1,
        houseList: [],
        request: true,
        hasNextPage: true,
      },
      () => {
        this.getHouseDetail(true, this.state.houseId);
      }
    );
  };
  onEndReached = () => {
    if (!this.state.isLoading) {
      this.setState(
        {
          isLoading: true,
        },
        () => {
          this.getHouseDetail();
        }
      );
      let timer = setTimeout(() => {
        this.setState({
          loading: false,
        });
        clearTimeout(timer);
      }, 1000);
    }
  };

  addPeop() {
    // console.log('跳转到添加成员')
    jump.call(
      this,
      "/add-member?complexAddMemberName=" +
        this.state.community +
        "&addressAddMember=" +
        this.state.address +
        "&houseAddMemberId=" +
        this.state.houseId
    );
  }
  showMoveOut(e) {
    this.state.alert("搬离", "确定此用户已搬离？", [
      { text: "取消", onPress: () => console.log("cancel") },
      { text: "确定", onPress: () => this.moveOut.call(this, e) },
    ]);
  }
  moveOut(e) {
    console.log(e, '用户搬离信息的参数')
    let data = e;
    http
      .post({
        url: "/api/my/house/remove",
        data,
      })
      .then((res) => {
        console.log(res, "用户搬离返回的参数");
        const { code, message } = res.data;
        if (code !== "1") {
          Toast.fail(message ? message : "用户搬离失败");
          return;
        }
        Toast.success("用户搬离成功");
        localStorage.removeItem("complexName");
        localStorage.removeItem("complexCode");
        // this.setState({
        //     pageNo: 1
        // })
        // this.getHouseDetail(true, this.state.houseId)
        Control.replace("/home-page");
      })
      .catch((err) => {
        console.log(err, "用户搬离错误信息");
        Toast.fail("服务器连接失败");
      });
  }

  render() {
    const {
      dataSource,
      houseList,
      isLoading,
      refreshing,
      hasNextPage,
      community,
      address,
      message,
      showBtn,
      zjuserid
    } = this.state;
    const row = (rowData) => {
      return (
        <React.Fragment>
          {houseList && houseList.length > 0 ? (
            <div className={`${prefix}-item bg-fff`}>
              <SwipeAction
                style={{ backgroundColor: "none" }}
                autoClose
                right={[
                  {
                    text: "搬离",
                    onPress: () =>
                      this.showMoveOut.call(this, {
                        id: rowData.id,
                        userId: zjuserid,
                        houseId: rowData.houseId,
                      }),
                    style: {
                      backgroundColor: "#E63633",
                      color: "white",
                      fontSize: ftTovw(34),
                      margin: "2px",
                      width: "96px",
                    },
                  },
                ]}
              >
                <div className={`${prefix}-item-content`} key={rowData.id}>
                  <div
                    className={`${prefix}-item-info flex align-center`}
                    onClick={this.toRegDetail.bind(this, rowData)}
                  >
                    <img
                      src={require("assets/imgs/homepage/house_icon_registered_d.png")}
                      className={`${prefix}-item-img`}
                    />
                    <div
                      className={`${
                        rowData.passage.length > 0
                          ? `${prefix}-item-detail-after`
                          : `${prefix}-item-detail`
                      } flex1 flex align-center`}
                    >
                      <div className={`${prefix}-item-info flex1`}>
                        <div
                          className={`${prefix}-item-person flex align-center`}
                        >
                          <div className={`${prefix}-item-name`}>
                            {rowData.userName}
                          </div>
                          {(() => {
                            let color = "#F86E21";
                            let name = "租户";
                            // if (rowData.isHouseholder === '1') {
                            //     color = '#ff0000'
                            //     name = '户主'
                            // }else
                            if (rowData.housingType === "1") {
                              color = "#255BDA";
                              name = "业主";
                            } else {
                              color = "#F86E21";
                              name = "租户";
                            }
                            return (
                              <div
                                className={`${prefix}-item-type`}
                                style={{ background: color }}
                              >
                                {name}
                              </div>
                            );
                          })()}
                          {(() => {
                            let color = "#F86E21";
                            let name = "待审核";
                            if (rowData.checkStatus === "WY200") {
                              color = "#00B578";
                              name = "已审核";
                            } else if (rowData.checkStatus === "CS200") {
                              color = "#F86E21";
                              name = "待审核";
                            } else if (rowData.checkStatus === "WY500") {
                              color = "#E63633";
                              name = "未通过";
                            } else {
                              color = "#E63633";
                              name = "审核异常";
                            }
                            return (
                              <div
                                className={`${prefix}-item-type`}
                                style={{ background: color }}
                              >
                                {name}
                              </div>
                            );
                          })()}
                        </div>
                        <div className={`${prefix}-item-phone`}>
                          {formatPhone(rowData.tel)}
                        </div>
                      </div>
                      <img
                        className={`${prefix}-item-arrow`}
                        src={require("assets/imgs/house/next@xhdpi.png")}
                      />
                    </div>
                  </div>
                  <div>
                    {(() => {
                      if (rowData.passage.length > 0) {
                        return rowData.passage.map((item) => {
                          return (
                            <div
                              className={`${prefix}-item-permit-list ${prefix}-passage`}
                            >
                              <div
                                className={`${prefix}-item-permit ${
                                  new Date().getTime() >
                                  new Date(
                                    item.endTime.replace(/-/g, "/")
                                  ).getTime()
                                    ? `hasPast`
                                    : `noPast`
                                }`}
                              >
                                {item.passageName}
                              </div>
                              <div
                                className={`${prefix}-item-permit ${
                                  new Date().getTime() >
                                  new Date(
                                    item.endTime.replace(/-/g, "/")
                                  ).getTime()
                                    ? `hasPast`
                                    : `noPast`
                                }`}
                              >
                                有效期至：{item.endTime}
                              </div>
                            </div>
                          );
                        });
                      }
                    })()}
                    {(() => {
                      if (rowData.checkStatus === "WY500") {
                        return (
                          <div className={`${prefix}-item-permit-list`}>
                            <div className={`${prefix}-item-permit hasPast`}>
                              审核未通过：请联系物业（请重新拍照）
                            </div>
                          </div>
                        );
                      }
                    })()}
                  </div>
                </div>
              </SwipeAction>
            </div>
          ) : null}
          {!houseList || houseList.length <= 0 ? (
            <div
              className={`flex flex-center align-center flex-column color-999`}
              style={{
                fontSize: ftTovw(28),
                height: "100%",
                paddingBottom: pxTovw(100),
                paddingTop: pxTovw(100),
              }}
            >
              <img
                src={require("assets/imgs/common/blank.png")}
                style={{ width: "50", height: pxTovw(170) }}
                alt="暂无数据"
              />
              <div className="size28">暂无数据</div>
            </div>
          ) : null}
        </React.Fragment>
      );
    };
    return (
      <div className={`${prefix}-box flex flex-column`}>
        <div className={`${prefix}-house-info`}>
          <div className={`${prefix}-complex flex align-center`}>
            <img
              src={require("assets/imgs/house/community@xhdpi.png")}
              className={`${prefix}-complex-icon`}
            />
            <div className={`${prefix}-complex-name flex1`}>{community}</div>
          </div>
          <div className={`${prefix}-house`}>
            <div className={`${prefix}-house-name`}>{address}</div>
            <div className={`${prefix}-house-detail`}>
              <span>{message}</span>
            </div>
          </div>
        </div>
        <div className={`${prefix}-bg`}></div>
        <div className={`flex1`}>
          <ListView
            ref={(el) => (this.lv = el)}
            dataSource={dataSource.cloneWithRows(houseList)}
            renderFooter={() => (
              <div style={{ textAlign: "center", paddingBottom: pxTovw(100) }}>
                {!isLoading ? "" : ""}
              </div>
            )}
            renderRow={row}
            className="am-list"
            pageSize={this.state.pageSize}
            scrollRenderAheadDistance={500}
            // onEndReached={this.onEndReached}
            onEndReachedThreshold={10}
            style={{
              height: "100%",
            }}
            // renderHeader={() => <div style={{ width: '100%', height: pxTovw(20), background: '#f8f8f8' }}></div>}
            pullToRefresh={
              <PullToRefresh
                damping={pxTovw(120)}
                ref={(el) => (this.ptr = el)}
                refreshing={refreshing}
                onRefresh={this.onRefresh}
                distanceToRefresh={parseFloat(
                  document.documentElement.style.fontSize
                )}
                indicator={{
                  activate: <Activate />,
                  deactivate: <Deactivate />,
                  release: <Release />,
                  finish: <Finish />,
                }}
              ></PullToRefresh>
            }
          />
        </div>
        {/* <div className={`${prefix}-footer-button`}>
                    <Button type="primary" className={`${prefix}-button`} onClick={this.addPeop.bind(this)}>
                        <img src={require('./../../assets/imgs/house/community@2x.png')} className={`${prefix}-list-img`} />
                    新增住户</Button>

                </div> */}
        {/* {
                    (() => {
                        if (showBtn) {
                            return (
                                <div className={`${prefix}-footer`}></div>
                            )
                        }
                    })()
                } */}
        {(() => {
          if (showBtn) {
            return (
              <div className={`${prefix}-footer-button`}>
                <Button
                  type="primary"
                  className={`${prefix}-button`}
                  onClick={this.addPeop.bind(this)}
                >
                  <img
                    src={require("./../../assets/imgs/e_home_btn.png")}
                    className={`${prefix}-list-img`}
                  />
                  新增住户
                </Button>
              </div>
            );
          }
        })()}
      </div>
    );
  }
}
export default inject("store")(observer(HouseDetail));
