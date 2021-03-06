/* eslint-disable no-console */
/* eslint-disable no-debugger */
// eslint-disable-next-line no-unused-vars
import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import {
  Toast,
  List,
  Tabs,
  PullToRefresh,
  ListView,
  Button,
} from "antd-mobile";
import {
  Activate,
  Deactivate,
  Release,
  Finish,
} from "common/yy-refresh-indiccator";
import "./index.scss";
import {setTitle, back, pxTovw, jump, getStorage, setStorage} from "../../utlis/utlis";
import http from "../../utlis/http";
import { EmptyPage } from "../../common/empty-page/index";

const Item = List.Item;
// const Brief = Item.Brief;

const prefix = "e-home";
Toast.config({
  mask: false,
});
class Index extends Component {
  constructor(props) {
    super(props);
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2, // rowHasChanged(prevRowData, nextRowData); 用其进行数据变更的比较
    });
    this.state = {
      dataSource,
      tabs: [{ title: "访客管理" }, { title: "我的家人" }],
      visitorsList: [],
      personList: [],
      showBtn: true,
      dataList: [],
      pageCount: 1,
      pageSize: 10,
      hasMore: true,
      refreshing: true,
      isLoading: false,
      hasNextPage: true,
      recordTitle: true,
      status: 0,
    };
  }

  componentDidMount() {
    setTitle.call(this, "我的e家");
    this.getHomePerson();
    this.getVisitorsList()
  }

  toIndex() {
    // 跳转
    jump.call(this, "/index");
  }
  goBack() {
    // 返回
    back.call(this);
  }
  //访客管理数据来源
  async getVisitorsList(ref = false) {
    let userId
    await getStorage("zjuserid",res=>{
      userId = res
    })

    let data = {
      // userId: localStorage.getItem("zjuserid"),
      userId: userId,
      status: this.state.status,
      pageCount: this.state.pageCount,
      pageSize: this.state.pageSize,
    };
    http
      .get({
        url:
          "/api/alipay/findMyVisitorList?userId=" +
          data.userId +
            // '7d277c778b1f4fe3bcbd5a9990d9396e'+
          "&status=1" +
          "&pageCount=" +
          data.pageCount +
          "&pageSize=" +
          data.pageSize,
      })
      .then((res) => {
        const { code, message, data } = res.data;
        const dataList = data;
        const len = dataList.length ? dataList.length : 0;

        if (len <= 0 || code !== "1") {
          // 判断是否已经没有数据了
          this.setState({
            refreshing: false,
            isLoading: false,
            hasMore: false,
          });

          return false;
        }

        if (ref) {
          //这里表示刷新使用
          // 下拉刷新的情况，重新添加数据即可(这里等于只直接用了第一页的数据)
          this.setState({
            pageCount: this.state.pageCount,
            hasMore: true, // 下拉刷新后，重新允许开下拉加载
            refreshing: false, // 是否在刷新数据
            isLoading: false, // 是否在加载中
            visitorsList: dataList, // 保存数据进state，在下拉加载时需要使用已有数据
          });
        } else {
          // 这里表示上拉加载更多
          // 合并state中已有的数据和新增的数据
          const visitorsList = this.state.dataList.concat(dataList); //关键代码
          this.setState({
            pageCount: this.state.pageCount,
            refreshing: false,
            isLoading: false,
            visitorsList: visitorsList, // 保存新数据进state
          });
        }
      })
      .catch((err) => {
        // Toast.fail(err.ret[0]);
      });
  }
  // 下拉刷新
  onRefresh = () => {
    this.setState(
      {
        refreshing: true,
        isLoading: true,
        pageCount: 1, // 刷新嘛，一般加载第一页，或者按你自己的逻辑（比如每次刷新，换一个随机页码）
      },
      () => {
        this.getVisitorsList(true);
      }
    );
  };

  // 滑动到底部时加载更多
  onEndReached = (event) => {
    // 加载中或没有数据了都不再加载
    if (this.state.isLoading || !this.state.hasMore) {
      return;
    }
    this.setState(
      {
        isLoading: true,
        pageCount: this.state.pageCount + 1, // 加载下一页
      },
      () => {
        this.getVisitorsList(false);
      }
    );
  };
  //我的家人数据来源
  async getHomePerson() {
    // let complexCode = localStorage.getItem("complexCode");
    let complexCode,userId
    await getStorage('complexCode',res=>{
      complexCode = res
    })
    await getStorage('zjuserid',res=>{
      userId = res
    })
    let data = {
      complexCode: complexCode,
      userId: userId,
    };
    http
      .get({
        url:
          "/api/user/myFamily/users?complexCode=" +
          data.complexCode +
          //   '3303020002'+
          "&userId=" +
          data.userId,
            // '7d277c778b1f4fe3bcbd5a9990d9396e',
        data,
      })
      .then((res) => {
        const { code, message, data } = res.data;
        console.log(data,'我是返回的data')
        if (code !== "1") {
          Toast.fail(message ? message : "获取到的e家数据失败");
          return;
        }
        console.log(data.isHouseholder)
        if (data) {
          this.setState({
            personList: data,
          });
        }
      })
      .catch((err) => {
        Toast.fail("服务器连接失败");
      });
  }
  changeTab(tab, index) {
    if (index === 0) {
      this.onRefresh();
    } else {
      this.getHomePerson();
    }
  }
  toRecordDetail(row) {
    jump.call(this, "/visitor-detail?id=" + row.id);
  }
  // 跳转到新增成员
  toAddPoep() {
    jump.call(this, "/myhouse?showBtn=no");
  }
  // // 跳转到用户详情
  // toMenberDetail(i) {
  //
  //   jump.call(this, "/member-detail/" + i.userId);
  // }
  async toMenberDetail(e) {
    let obj = {
      userName: e.userName,
      isHouseholder: e.isHouseholder,
      housingType: e.housingType,
      checkStatus: e.checkStatus,
      tel: e.tel,
      complexCode: e.complexCode,
      passage: e.passage,
    };
    await setStorage('regDetail', JSON.stringify(obj))
    // window.sessionStorage.setItem("regDetail", JSON.stringify(obj));
    jump.call(this, "/register-detail");
  }
  render() {
    // 从mobx中拿所需属性
    const {
      tabs,
      isLoading,
      visitorsList,
      refreshing,
      dataSource,
      hasNextPage,
      showBtn,
    } = this.state;
    const row = (item) => {
      return (
        <React.Fragment>
          <div className={`${prefix}-record-box`}>
            <div className={`${prefix}-record-box-time`}>{item.createTime}</div>
            {
              item.dataArray && item.dataArray.map((rowData, index) => (
                <div
              className={`${prefix}-record-item`}
              onClick={() => {
                this.toRecordDetail(rowData);
              }}
            >
              <div className={`${prefix}-record-itemlist`}>
                <div
                  className={`${prefix}-record-item-list`}
                  style={{ alignItems: "flex-start" }}
                >
                  <div className={`${prefix}-record-list-left`}>
                    {/*{*/}
                    {/*  <div className={`${prefix}-list-left-photo`}>{rowData.registerSource&&(rowData.registerSource==0||rowData.registerSource==2)?<div className={'visitor'}>访客</div>:<div className={'invite'}>受邀</div>}</div>*/}
                    {/*}*/}
                    {/*<img className={`${prefix}-record-list-left-img`} style={{width: '100%', height: '100%'}} src={rowData.imageUrl} />*/}
                    <img className={`${prefix}-record-list-left-img`} src={require('../../assets/imgs/common/head_default@2x.png')} alt=""/>
                  </div>
                  <div className={`${prefix}-record-list-right`}>
                    <div className={`${prefix}-record-list-right-left`}>
                      <div className={`${prefix}-record-list-right-left-top`}>
                        <span>
                          {rowData.userName ? rowData.userName : "暂无数据"}
                        </span>
                        <span
                          className={
                            rowData.checkStatus === "5"?'havePast':'guoqile'
                          }
                        >
                          {rowData.checkStatus === "5"?'行程中':'已结束'}
                        </span>
                      </div>
                      <div className={`${prefix}-record-list-right-left-btm`}>
                        <span>
                          {rowData.visitorBeginTime
                            ? rowData.visitorBeginTime + ' 至 ' +rowData.visitorEndTime
                            : "暂无数据"}
                        </span>
                      </div>
                    </div>
                    <div className={`${prefix}-record-list-right-right`}>
                      <img
                        className={`${prefix}-record-img`}
                        src={require("../../assets/imgs/house/next@xhdpi.png")}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
              ))
            }
          </div>
        </React.Fragment>
      );
    };
    return (
      <div className={`${prefix} flex flex-column`}>
        {/*<div className={`${prefix}-bg`}></div>*/}
        <div className={`${prefix}-width flex1`}>
          <Tabs
            tabs={tabs}
            initialPage={1}
            onChange={(tab, index) => {
              this.changeTab(tab, index);
            }}
          >
            <div style={{ height: `100%`, position: "relative" }}>
              <div>
                {(() => {
                  if (this.state.visitorsList.length < 1) {
                    return (
                      <EmptyPage
                        content={"快来添加您的访客吧~"}
                        imgUrl={require("../../assets/imgs/car-empty.png")}
                      ></EmptyPage>
                    );
                  }
                })()}
              </div>
              <div style={{height: `100%`}}>
                <ListView
                  ref={(el) => (this.lv = el)}
                  dataSource={dataSource.cloneWithRows(visitorsList)}
                  renderFooter={() => (
                    <div
                      style={{
                        textAlign: "center",
                        paddingBottom: pxTovw(100),
                      }}
                    >
                      {isLoading
                        ? "加载中..."
                        : visitorsList &&
                          visitorsList.length > 0 &&
                          !hasNextPage
                        ? "没有更多了~"
                        : ""}
                    </div>
                  )}
                  renderRow={row}
                  className="am-list"
                  pageSize={this.state.pageSize}
                  scrollRenderAheadDistance={500}
                  onEndReached={this.onEndReached}
                  onEndReachedThreshold={10}
                  style={{
                    height: "100%",
                    backgroundColor: "#f2f5f8",
                    paddingTop: pxTovw(8),
                  }}
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
            </div>

            <div style={{ height: `100%`, position: "relative", overflow: 'scroll' }}>
              <div>
                {(() => {
                  if (this.state.personList.length < 1) {
                    return (
                      <EmptyPage
                        content={"快来添加您的家人吧~"}
                        imgUrl={require("../../assets/imgs/car-empty.png")}
                      ></EmptyPage>
                    );
                  }
                })()}
              </div>
              <div className={`${prefix}-margin-bottom`}>
                {this.state.personList.map((item, index) => {
                  if (item.userArray.length > 0) {
                    return item.userArray.map((i, n) => {
                      return (
                        <div className={`flex flex-column`} key={n}>
                          <div>
                            {(() => {
                              if (n >= 1) {
                                return null;
                              }
                              return (
                                <div className={`${prefix}-home flex`}>
                                  <img
                                    className={`${prefix}-home-img`}
                                    src={require("./../../assets/imgs/common/Home_icon_community_d@2x.png")}
                                    alt=""
                                  />
                                  <div className={`${prefix}-home-house`}>
                                    {item.complexName} {item.buildingName}
                                    {item.unitName}
                                    {item.houseName}
                                  </div>
                                </div>
                              );
                            })()}
                          </div>
                          <div>
                            {(() => {
                              if (n >= 1) {
                                return <div className={`${prefix}-bg`}></div>;
                              }
                              return null;
                            })()}
                          </div>
                          <div
                            className={`${prefix}-main`}
                            onClick={this.toMenberDetail.bind(this, i)}
                          >
                            <div className={`${prefix}-main `}>
                              <img
                                className={`${prefix}-list-title-home`}
                                src={require("./../../assets/imgs/homepage/house_icon_registered_d.png")}
                                alt=""
                              />
                            </div>
                            <div
                              className={`${prefix}-right flex1 ${
                                i.passage.length > 0 ? `border-btm` : ``
                              }`}
                            >
                              <div
                                className={`${prefix}-list-right flex flex-column`}
                              >
                                <div className={`${prefix}-list-right-head`}>
                                  <span
                                    className={`${prefix}-list-right-head-name`}
                                  >
                                    {i.userName}
                                  </span>
                                  {(() => {
                                    if (i.checkStatus === "WY200") {
                                      return (
                                        <div
                                          className={`${prefix}-list-right-head-state pass-audit`}
                                        >
                                          <span>已审核</span>
                                        </div>
                                      );
                                    } else if (i.checkStatus === "CS200") {
                                      return (
                                        <div
                                          className={`${prefix}-list-right-head-state wait-audit`}
                                        >
                                          <span>待审核</span>
                                        </div>
                                      );
                                    } else if (i.checkStatus === "WY500") {
                                      return (
                                        <div
                                          className={`${prefix}-list-right-head-state nopass-audit`}
                                        >
                                          <span>未通过</span>
                                        </div>
                                      );
                                    } else {
                                      return (
                                        <div
                                          className={`${prefix}-list-right-head-state nopass-audit`}
                                        >
                                          <span>审核异常</span>
                                        </div>
                                      );
                                    }
                                  })()}
                                  {/* <span className={`${prefix}-list-right-head-state`}>{item.state}</span> */}
                                </div>
                                <span className={`${prefix}-list-right-time`}>
                                  {i.tel}
                                </span>
                              </div>
                              <img
                                className={`${prefix}-img`}
                                src={require("./../../assets/imgs/common/next@2x.png")}
                                alt=""
                              />
                            </div>
                          </div>

                          {/* <div className={`${prefix}-line`}></div> */}

                          <div className={`${prefix}-footer-all`}>
                            {(() => {
                              if (i.passage.length > 0) {
                                return i.passage.map((p, pindex) => {
                                  return (
                                    <div
                                      className={`${prefix}-footer`}
                                      key={pindex}
                                    >
                                      <span
                                        className={`${prefix}-footer-text ${
                                          new Date().getTime() >
                                          new Date(
                                            p.endTime.replace(/-/g, "/")
                                          ).getTime()
                                            ? `hasPast`
                                            : `noPast`
                                        }`}
                                      >
                                        {p.passageName}
                                      </span>
                                      <span
                                        className={`${prefix}-footer-text ${
                                          new Date().getTime() >
                                          new Date(
                                            p.endTime.replace(/-/g, "/")
                                          ).getTime()
                                            ? `hasPast`
                                            : `noPast`
                                        }`}
                                      >
                                        有效期至：{p.endTime}
                                      </span>
                                    </div>
                                  );
                                });
                              }
                            })()}
                          </div>
                        </div>
                      );
                    });
                  }
                })}
              </div>
              {(() => {
                if (this.state.personList&&this.state.personList.length>0&&showBtn) {
                  return (
                      <div className={`${prefix}-background flex1`}>
                        <div className={`${prefix}-btn`}>
                          <Button
                              className={`${prefix}-add-person`}
                              type="primary"
                              onClick={this.toAddPoep.bind(this)}
                              icon={
                                <img
                                    src={require("./../../assets/imgs/e_home_btn.png")}
                                    alt=""
                                />
                              }
                          >
                            新增成员
                          </Button>
                        </div>
                      </div>
                  );
                }
                return null;
              })()}
            </div>
          </Tabs>
        </div>

      </div>
    );
  }
}
// inject 将store注入到当Test组件的props中
export default inject("store")(observer(Index));
