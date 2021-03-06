import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import {
  Toast,
  ListView,
  Button,
  PullToRefresh,
  SwipeAction,
  Modal,
} from "antd-mobile";
import {
  Activate,
  Deactivate,
  Release,
  Finish,
} from "../../common/yy-refresh-indiccator";
import "./index.scss";
import { setTitle, ftTovw, jump, pxTovw,getStorage,setStorage } from "../../utlis/utlis";
import http from "../../utlis/http";
import { EmptyPage } from "../../common/empty-page/index";

const prefix = "mycar";
Toast.config({
  mask: false,
});

class Mycar extends Component {
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
      carList: [],
      modalVisible: false,
      alert: Modal.alert,
    };
  }
  componentDidMount() {
    setTitle.call(this, "我的车辆");
    this.getCarList(true);
  }
  showAlert(e) {
    console.log(e, "showAlert下面的id");
    this.state.alert("解绑", "确定解绑车辆？", [
      { text: "取消", onPress: (e) => console.log("cancel"), style: "default" },
      { text: "确定", onPress: this.delPassage.bind(this, e) },
    ]);
  }
  async getCarList(ref = false) {
    let userid
    await getStorage('zjuserid',res=>{
      userid =  res
    })
    let data = {
      userId: userid,
      // userId: '613569671e334413a7b523ad789341e2',
      // pageCount: this.state.pageNum,
      // pageSize: this.state.pageSize
    };
    http
      .get({
        url: "/api/car/list?userId=" + data.userId,
      })
      .then((res) => {
        console.log(res, "车辆列表返回的参数");
        const { code, message, data } = res.data;
        const dataList = data;
        const len = dataList.length;

        if (code !== "1") {
          // 判断是否已经没有数据了
          this.setState({
            refreshing: false,
            isLoading: false,
            hasMore: false,
          });

          Toast.fail(message);
          return;
        }

        if (ref) {
          //这里表示刷新使用
          // 下拉刷新的情况，重新添加数据即可(这里等于只直接用了第一页的数据)
          console.log(dataList, "获取车辆列表新数据");
          this.setState({
            pageNo: this.state.pageNo,
            hasMore: true, // 下拉刷新后，重新允许开下拉加载
            refreshing: false, // 是否在刷新数据
            isLoading: false, // 是否在加载中
            carList: dataList, // 保存数据进state，在下拉加载时需要使用已有数据
          });
        } else {
          // 这里表示上拉加载更多
          // 合并state中已有的数据和新增的数据
          var carList = this.state.carList.concat(dataList); //关键代码
          this.setState({
            pageNo: this.state.pageNo,
            refreshing: false,
            isLoading: false,
            carList: carList, // 保存新数据进state
          });
        }
      })
      .catch((err) => {
        Toast.fail("服务器连接失败");
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
        this.getCarList(true);
      }
    );
  };

  // 滑动到底部时加载更多
  onEndReached = (event) => {
    // 加载中或没有数据了都不再加载
    // if (this.state.isLoading || !this.state.hasMore) {
    //   return
    // }
    // this.setState({
    //   isLoading: true,
    //   pageNo: this.state.pageNo + 1, // 加载下一页
    // }, () => {
    //   this.getCarList(false)
    // })
  };
  // 解绑车辆
  delPassage(e) {
    console.log(e, "delPassage下面的id");
    let data = {
      carId: e,
    };
    http
      .post({
        url: "/test/car/logoff?carId="+e,
      })
      .then((res) => {
        console.log(res, "解绑车辆返回的参数");
        const { code, message } = res.data;
        if (code !== "1") {
          Toast.fail(message ? message : "解绑车辆失败");
          return;
        }
        Toast.success("解绑车辆成功");
        this.setState({
          pageNo: 1,
        });
        this.getCarList(true);
      })
      .catch((err) => {
        // console.error(err, '解绑车辆返回的报错参数')
        Toast.fail("服务器连接失败");
      });
  }

  addCar() {
    jump.call(this, "/addcar");
  }
  toCarDetail(row) {
    if (row.complex.length > 0) {
      setStorage("carComplex", row.complex);
    }
    console.log(row, "跳转到详情");
    jump.call(this, "/cardetails/" + row.id);
  }

  render() {
    const { dataSource, refreshing, carList } = this.state;
    const row = (rowData) => {
      return (
        <SwipeAction
          style={{ backgroundColor: "none" }}
          autoClose
          right={[
            {
              text: "解绑",
              onPress: this.showAlert.bind(this, rowData.id),
              style: {
                backgroundColor: "#F4333C",
                color: "white",
                width: "80px",
                margin: "5px 0",
              },
            },
          ]}
          onOpen={() => console.log("global open")}
          onClose={() => console.log("global close")}
        >
          <div key={rowData.id} className={`${prefix}-my-car`}>
            <div
              className={`${prefix}-my-list`}
              onClick={this.toCarDetail.bind(this, rowData)}
            >
              <div className={`${prefix}-license-content`}>
                <span className={`${prefix}-license`}>{rowData.carNumber}</span>
                <div className={`${prefix}-tags`}>
                  <span className={`${prefix}-one-tags`}>{rowData.brand}</span>
                  <span className={`${prefix}-one-tags`}>{rowData.colour}</span>
                  <span className={`${prefix}-one-tags`}>{rowData.model}</span>
                </div>
              </div>
              {/* 箭头图标 */}
              <div className={`${prefix}-next`}>
                <img
                  src={require("./../../assets/imgs/mycar/next@2x.png")}
                  className={`${prefix}-next-img`}
                />
              </div>
            </div>
          </div>
        </SwipeAction>
      );
    };
    return (
      <div
        className="flex flex-column"
        style={{ height: "100vh", background: "#f2f5f8" }}
      >
        <div className="flex1">
          {(() => {
            if (carList.length < 1) {
              return (
                <EmptyPage
                  content={"快来添加您的爱车吧~"}
                  imgUrl={require("../../assets/imgs/car-empty.png")}
                ></EmptyPage>
              );
            }
          })()}
          <ListView
            ref={(el) => (this.lv = el)}
            dataSource={dataSource.cloneWithRows(carList)}
            renderFooter={() => (
              <div
                style={{
                  textAlign: "center",
                  fontSize: ftTovw(28),
                  paddingBottom: pxTovw(80),
                }}
              >
                {this.state.isLoading ? "没有更多了~" : ""}
              </div>
            )}
            renderRow={row}
            style={{
              height: "100%",
            }}
            pageSize={4}
            scrollRenderAheadDistance={500}
            // onEndReached={this.onEndReached}
            onEndReachedThreshold={10}
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
        <div className={`${prefix}-footer-button`}>
          <Button
            type="primary"
            className={`${prefix}-button flex flex-center align-center`}
            onClick={this.addCar.bind(this)}
          >
            <img
              src={require("./../../assets/imgs/mycar/car_add@2x.png")}
              className={`${prefix}-list-img`}
            />
            新增车辆
          </Button>
        </div>
      </div>
    );
  }
}
export default inject("store")(observer(Mycar));
