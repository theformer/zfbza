import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import {jump, setTitle, pxTovw, ftTovw, getUrlParam, getStorage, setStorage} from "../../utlis/utlis";
import http from "../../utlis/http";
import Modal from "../../common/dialog-phone"; //弹框组件title为短信验证，footer为取消和确定俩个按钮
import { Toast, PullToRefresh, ListView, Switch, Button } from "antd-mobile";
import {
  Activate,
  Deactivate,
  Release,
  Finish,
} from "common/yy-refresh-indiccator";
import { EmptyPage } from "../../common/empty-page/index";
import "./index.scss";

const prefix = "my-housing";
Toast.config({
  mask: false,
});

class Myhousing extends Component {
  constructor(props) {
    super(props);
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2, // rowHasChanged(prevRowData, nextRowData); 用其进行数据变更的比较
    });
    this.state = {
      dataSource,
      pageNo: 1,
      pageSize: 10,
      hasMore: true,
      refreshing: true,
      isLoading: true,
      houseList: [],
      hasNextPage: true,
      count: 60,
      code: "",
      checked: true,
      modalVisible: false,
      liked: true,
      mobile: "",
      isChecked: true,
    };
  }
  componentWillMount() {
    // setTitle.call(this, '我的小区')
  }
  async componentDidMount() {
    setTitle.call(this, "我的小区");
    let userInfo
    await getStorage("userInfo",res=>{
      userInfo = res
    })
    if (userInfo) {
      userInfo = JSON.parse(userInfo);
      this.setState({
        mobile: userInfo.mobile,
      });
    }
    // this.onRefresh()
    this.gethouseList(true);
  }
  async gethouseList(ref = false) {
    let userId
    await getStorage('zjuserid',res=>{
      userId = res
    })
    http
      .get({
        url: "/api/myComplex/info?userId=" + userId,
      })
      .then((res) => {
        const { code, message, data } = res.data;
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
          this.setState(
            {
              pageNo: this.state.pageNo,
              hasMore: true, // 下拉刷新后，重新允许开下拉加载
              refreshing: false, // 是否在刷新数据
              isLoading: false, // 是否在加载中
              houseList: dataList, // 保存数据进state，在下拉加载时需要使用已有数据
            },
            () => {
            }
          );
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

      })
      .catch((err) => {
        Toast.fail("连接服务器失败");
      });
  }
  // 下拉刷新
  onRefresh = () => {
    this.setState(
      {
        refreshing: true,
        isLoading: true,
        pageNo: 1, // 刷新嘛，一般加载第一页，或者按你自己的逻辑（比如每次刷新，换一个随机页码）
      },
      () => {
        this.gethouseList(true);
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
        pageNo: this.state.pageNo + 1, // 加载下一页
      },
      () => {
        this.gethouseList(false);
      }
    );
  };

  toHouseDetail(e) {
    jump.call(this, "/house-info/" + e);
  }

  setLoaded() {
    this.setState({
      request: true,
      isLoading: false,
      refreshing: false,
    });
  }
  onClickAdd() {
    this.setState({
      modalVisible: true,
    });
    // 这里跳过验证码直接去添加小区
    // this.erCode();
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
    let userInfo
    await getStorage("userInfo",res=>{
      userInfo = res
    })
    if (userInfo) {
      userInfo = JSON.parse(userInfo);
      this.setState({
        mobile: userInfo.mobile,
      });
    }
    let data = {
      tel: userInfo.mobile,
    };
    http
      .post({
        url: "/api/message/send",
        data,
      })
      .then((res) => {
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
  async chenckCode() {
    // this.erCode();
    let userInfo
    await getStorage("userInfo",res=>{
      userInfo = res
    })
    if (userInfo) {
      userInfo = JSON.parse(userInfo);
    }
    let data = {
      tel: userInfo.mobile,
      code: this.state.code,
    };
    await http
      .post({
        url: "/api/message/valid",
        data,
      })
      .then((res) => {
        const { code, message } = res.data;
        if (code == "1") {
          // 去调用摄像头
          this.erCode();
        }else{
          Toast.fail(message ? message : "验证码校验失败");
        }
      })
      .catch((err) => {
        Toast.fail("服务器连接失败");
      });
  }

  async erCode() {
  //向web-view发送一个flag为1的数据，接收如果当
    let that = this
    await window.my.postMessage({
      flag: '1'
    });
    window.my.onMessage = async function (e) {
      if(e.webViewFlag==1){
        let complexCode = e.complexCode
        await setStorage("complexCode",complexCode)
        that.toChooseBuilding();
      }
    }

  }
  toChooseBuilding() {
    jump.call(this, "/choose-building");
  }
  async checkHousing(rowData) {
    let userId
    await getStorage('zjuserid',res=>{
      userId = res
    })
    let data = {
      userId: userId,
      complexCode: rowData.complexCode,
      complexName: rowData.complexName,
    };
    http
      .post({
        url: "/api/user/update/present/complex",
        data,
      })
      .then((res) => {
        const { code, message } = res.data;
        if (code !== "1") {
          Toast.fail(message ? message : "小区切换失败");
          return;
        }
        Toast.success("小区切换成功");
        setStorage('complexCode',rowData.complexCode)
        setStorage('complexName',rowData.complexName)
        this.setState(
          {
            isLoading: true,
            pageNo: 1, // 刷新嘛，一般加载第一页，或者按你自己的逻辑（比如每次刷新，换一个随机页码）
          },
          () => {
            this.gethouseList(true);
          }
        );
      })
      .catch((err) => {
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
      mobile,
    } = this.state;
    const row = (rowData) => {
      return (
        <React.Fragment>
          {" "}
          {houseList && houseList.length > 0 ? (
            <div className={`${prefix}-item bg-fff`}>
              <div
                className={`${prefix}-complex flex align-center flex-between`}
              >
                <div className={`flex align-center`}>
                  <img
                    src={require("assets/imgs/house/community@xhdpi.png")}
                    className={`${prefix}-complex-icon`}
                  />{" "}
                  <div className={`${prefix}-complex-name flex1`}>
                    {" "}
                    {rowData.complexName}{" "}
                  </div>{" "}
                </div>
                <div className={`${prefix}-switch-div`}>
                  <div
                    className={`${prefix}-switch flex align-center`}
                    onClick={this.checkHousing.bind(this, rowData)}
                  >
                    {/* <input
                                                    type="checkbox"
                                                    checked={rowData.isPresent === '1' ? true : false}
                                                    onChange={this.checkHousing.bind(this, rowData)}
                                                    disabled={rowData.isPresent === '1' ? true : false}
                                                    className={`${prefix}-switch-checkbox`}
                                                  /> */}{" "}
                    <div
                      className={
                        rowData.isPresent === "1"
                          ? `${prefix}-switch-container1 ${prefix}-switch-container-checked`
                          : `${prefix}-switch-container`
                      }
                    ></div>{" "}
                  </div>{" "}
                </div>{" "}
                {/* <div className={`${prefix}-`}></div> */}{" "}
              </div>{" "}
              <div
                className={`${prefix} flex1 flex align-center flex-between`}
                onClick={this.toHouseDetail.bind(this, rowData.complexCode)}
              >
                <div className={`${prefix}-house`}>
                  <div className={`${prefix}-house-name`}>
                    物业： {rowData.liaisonName}/ {rowData.liaisonPhone}{" "}
                  </div>{" "}
                  <div className={`${prefix}-house-detail`}>
                    <span>
                      {" "}
                      {rowData.district} {rowData.address}{" "}
                    </span>{" "}
                  </div>{" "}
                </div>{" "}
                <img
                  className={`${prefix}-item-arrow`}
                  src={require("assets/imgs/house/next@xhdpi.png")}
                />{" "}
              </div>{" "}
            </div>
          ) : null}{" "}
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
              <div className="size28"> 暂无数据 </div>{" "}
            </div>
          ) : null}{" "}
        </React.Fragment>
      );
    };
    return (
      <div className={`${prefix}-box flex flex-column hiden-box`}>
        <div className={`flex1 hiden-box`}>
          {" "}
          {(() => {
            if (houseList.length < 1) {
              return (
                <EmptyPage
                  content={"快来添加您的小区吧~"}
                  imgUrl={require("../../assets/imgs/car-empty.png")}
                ></EmptyPage>
              );
            } else {
              return (
                <ListView
                  ref={(el) => (this.lv = el)}
                  dataSource={dataSource.cloneWithRows(houseList)}
                  renderFooter={() => (
                    <div
                      style={{ textAlign: "center", paddingBottom: pxTovw(80) }}
                    >
                      {isLoading
                        ? "加载中..."
                        : houseList && houseList.length > 0 && !hasNextPage
                        ? "没有更多了~"
                        : ""}{" "}
                    </div>
                  )}
                  renderRow={row}
                  className="am-list"
                  pageSize={this.state.pageSize}
                  scrollRenderAheadDistance={500}
                  // onEndReached={this.onEndReached}
                  // onEndReachedThreshold={10}
                  style={{
                    height: "100%",
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
              );
            }
          })()}{" "}
        </div>{" "}
        <div className={`${prefix}-footer`}> </div>{" "}
        <div className={`${prefix}-footer-button`}>
          <Button
            type="primary"
            onClick={this.onClickAdd.bind(this)}
            className={`${prefix}-button`}
          >
            <img
              src={require("./../../assets/imgs/house/house_add@2x.png")}
              className={`${prefix}-list-img`}
            />
            新增小区{" "}
          </Button>{" "}
        </div>{" "}
        <Modal
          visible={this.state.modalVisible}
          onCancel={() => {
            this.setState({ modalVisible: false });
          }}
          onConfirm={this.chenckCode.bind(this)}
          className={`${prefix}-modal`}
        >
          <div>
            <div className={"verification-code"}>
              需验证已绑定手机号 <span> {mobile} </span>,请获取验证码{" "}
            </div>{" "}
            {/* <div className={'housing-line'}></div> */}{" "}
            <div
              className={`${prefix}-form-code flex flex-between align-center`}
            >
              <input
                type="text"
                value={this.state.code}
                onChange={this.onChangeCode.bind(this)}
                placeholder="请输入验证码"
                className={`${prefix}-form-name-ipt ipt-none code-input`}
              />{" "}
              {(() => {
                if (this.state.liked) {
                  return (
                    <Button
                      className={`${prefix} ipt-none auth-code`}
                      onClick={this.handleClick.bind(this)}
                    >
                      获取验证码{" "}
                    </Button>
                  );
                }
                return (
                  <Button
                    className={`${prefix}-form-name-ipt ipt-none auth-code retry`}
                    onChange={this.handleClick.bind(this)}
                  >
                    {`${this.state.count} 秒后重发`}{" "}
                  </Button>
                );
              })()}{" "}
            </div>{" "}
          </div>{" "}
        </Modal>{" "}
      </div>
    );
  }
}

export default inject("store")(observer(Myhousing));
