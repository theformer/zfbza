import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import {Toast, PullToRefresh, ListView, Tabs, Picker, List} from "antd-mobile";
import {
    Activate,
    Deactivate,
    Release,
    Finish,
} from "common/yy-refresh-indiccator";
import "./index.scss";
import {back, pxTovw, jump, setTitle, getStorage, setStorage, ftTovw} from "../../utlis/utlis";
import http from "../../utlis/http";
import NowTime from "../../common/now-time";
import QRCode from "qrcodejs2";
import {Control} from "react-keeper";
import {EmptyPage} from "../../common/empty-page/index";

const prefix = "wenzhou-healthy";
let dateTime = new Date();
Toast.config({
    mask: false,
});

class WenZhouHealthy extends Component {
    constructor(props) {
        super(props);
        this.store = this.props.store.testStore;
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2, // rowHasChanged(prevRowData, nextRowData); 用其进行数据变更的比较
        });
        const dataSource1 = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2, // rowHasChanged(prevRowData, nextRowData); 用其进行数据变更的比较
        });
        this.state = {
            dateTime: dateTime.toLocaleDateString().replace(/\//gi, "-"),
            tabs: [{title: "访客码"}, {title: "健康码"}],
            dataSource,
            dataSource1,
            recordList: [],
            pageCount: 1,
            pageSize: 10,
            hasMore: true,
            refreshing: true,
            isLoading: false,
            hasNextPage: true,
            recordTitle: false,
            status:1,
            presentListState: 0,
            presentList: {},
            QRCode: "",
            codeType: "",
            healthyName: "",
            healthyCode: false,
            QRCode1: "",
            codeType1: "",
            pickerDia: false,
            colorValue: ['#00FF00'],
            checked:0,
            swichBtn:false
        };
    }
    componentWillMount() {
        window.goHomePage = true
    }
    componentWillUnmount() {
        window.goHomePage = false
    }
    async componentDidMount() {
        // 修改mobx中存储的值
        setTitle.call(this, "我的码");
        this.store.name = "name";
        await getStorage('zjuserid', res => {
            this.setState({
                userId: res
            })
        })
        if (this.state.userId) {
            this.getRecordList(true);
            this.getPresentList()
            this.healthCodeQuery();
            this.believeCodeQuery();
            this.getNowList()
        } else {
            this.getUserInfo()
        }
    }

    //获取当前行程
    async getPresentList() {
        let userId
        await getStorage('zjuserid', res => {
            userId = res
        })
        let data = {
            userId
            // userId: 'f5100ccc52bc429887012792a08f6522',

        }
        http.post({
            url: `/test/alipay/visitor/query/route`,
            data
        }).then(res => {

            if (res.data.code == 1 && (res.data.data != null && res.data.data != 'null')) {
                this.setState({
                    presentListState: 1,
                    presentList: res.data.data
                })
                console.log(res)
            }
        })
    }

    async getUserInfo() {
        let zfbUserId
        await getStorage('zfbUserId', res => {
            zfbUserId = res
        })
        http.get({
            url: `/test/user/info/get?openId=${zfbUserId}`,
        }).then(async res => {
            if (res.data.code == 1) {
                await setStorage('zjuserid', res.data.data.id)
                await setStorage('photoImg', res.data.data.imageUrl)
                await setStorage('nation', res.data.data.nation)
                await setStorage('userInfo', JSON.stringify({
                    username: res.data.data.userName,
                    mobile: res.data.data.tel,
                    sex: res.data.data.sex,
                    certificateId: res.data.data.certificateId,
                    createdate: res.data.data.createdate,
                    userid: res.data.data.id,
                    certificateType: '身份证',
                }))
                this.setState({
                    userId: res.data.data.id
                }, () => {
                    this.getRecordList(true);
                    this.healthCodeQuery();
                    this.believeCodeQuery();
                    this.getPresentList()
                    this.getNowList()
                })

            }
        })
    }

    changeRecord(status) {
        if (status === 0) {
            this.setState(
                {
                    recordTitle: true,
                    recordList: [],
                    status,
                },
                () => {
                    this.onRefresh();
                }
            );
        } else {
            this.setState(
                {
                    recordTitle: false,
                    recordList: [],
                    status,
                },
                () => {
                    this.onRefresh();
                }
            );
        }
    }
    //查询当前行程是否需要显示切换
    getNowList(){
        let data = {
            userId: this.state.userId,
            status: '0',
            // userId: '7476f7d816d74c0e99a1d273890cc7f8',
            // pageCount: this.state.pageCount,
            // pageSize: this.state.pageSize,
        };
        http
            .get({
                url:
                    "api/alipay/visitor/list?userId=" +
                    data.userId +
                    "&status=" +
                    data.status
                    // "&pageCount=" +
                    // data.pageCount +
                    // "&pageSize=" +
                    // data.pageSize,
            })
            .then((res) => {
                if(res.data.code ==1){
                    if(res.data.data&&res.data.data.length>1){
                        this.setState({
                            swichBtn:true
                        })
                    }

                }
            })
    }
    getRecordList(ref = false) {

        let data = {
            userId: this.state.userId,
            status: this.state.pickerDia?'0':'1',
            // userId: '7476f7d816d74c0e99a1d273890cc7f8',
            // pageCount: this.state.pageCount,
            // pageSize: this.state.pageSize,
        };
        http
            .get({
                url:
                    "api/alipay/visitor/list?userId=" +
                    data.userId +
                    "&status=" +
                    data.status
                    // "&pageCount=" +
                    // data.pageCount +
                    // "&pageSize=" +
                    // data.pageSize,
            })
            .then((res) => {
               console.log(res.data)
                const {code, message, data} = res.data;
                var dataList = data;
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
                        // pageCount: this.state.pageCount,
                        hasMore: true, // 下拉刷新后，重新允许开下拉加载
                        refreshing: false, // 是否在刷新数据
                        isLoading: false, // 是否在加载中
                        recordList: dataList, // 保存数据进state，在下拉加载时需要使用已有数据
                    });
                } else {
                    // 这里表示上拉加载更多
                    // 合并state中已有的数据和新增的数据
                    var recordList = this.state.recordList.concat(dataList); //关键代码
                    this.setState({
                        // pageCount: this.state.pageCount,
                        refreshing: false,
                        isLoading: false,
                        recordList: recordList, // 保存新数据进state
                    });
                }
                // this.setLoaded();

            })
            .catch((err) => {
                // Toast.fail(err.ret[0]);
                console.log(err);
            });
    }

    // 下拉刷新
    onRefresh = () => {
        this.setState(
            {
                refreshing: true,
                isLoading: true,
                // pageCount: 1, // 刷新嘛，一般加载第一页，或者按你自己的逻辑（比如每次刷新，换一个随机页码）
            },
            () => {
                this.getRecordList(true);
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
                // pageCount: this.state.pageCount + 1, // 加载下一页
            },
            () => {
                this.getRecordList(false);
            }
        );
    };

    //调取可信身份证
    believeCodeQuery() {
        let userId
        getStorage('zjuserid', res => {
            userId = res
        })
        let data = {
            userId: userId,
            // userId: 'f5100ccc52bc429887012792a08f6522',

        };

        http
            .get({
                url: "/test/zlb/qrCode/create?userId=" + this.state.userId,
            })
            .then((res) => {
                if (res.data.code == 1) {
                    this.setState({
                        QRCode1: res.data.data.qrCode, //二维码
                        codeType1: res.data.data.level, //健康码颜色
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
            callback: (res) => {
                this.setState({
                    codeImg1: res.path,
                });
            },
        });
    }
    cancelDiaClick(){
        this.setState({
            pickerDia:false,
            status:1,
            recordList:[]
        },()=>{
            this.getRecordList(true)
        })
    }
    changeChecked(index){
        this.setState({
            checked:index
        })
    }
    async  saveHouseClick(){
        let {checked,recordList} = this.state
        console.log(checked,recordList)
        let userId,id
        id = this.state.recordList[this.state.checked].id
         await getStorage('zjuserid',res=>{
            userId = res
        })
        let data = {
            userId,
            id
        }
        http
            .post({
                url: "/test/alipay/visitor/save/route" ,
                data
            })
            .then((res) => {
                if(res.data.code == 1){
                    this.setState({
                        pickerDia:false,
                        status:1,
                        recordList:[]
                    },()=>{
                        this.getPresentList()
                        this.getRecordList(true);
                    })

                }else{
                    Toast.info(res.data.message)
                }
            })
    }
    //调取健康码
    healthCodeQuery() {

        let data = {
            userId: this.state.userId,
            source: "ZLB",
            // userId: 'f5100ccc52bc429887012792a08f6522',

        };
        http
            .get({
                url: "/test/user/health/code/query?userId=" +
                    data.userId +
                    "&source=" +
                    data.source,
            })
            .then((res) => {
                if (res.data.code == 1) {
                    this.setState(
                        {
                            QRCode: res.data.data.qrCode, //二维码
                            codeType: res.data.data.level, //健康码颜色
                            healthyName: res.data.data.name,
                            healthyCode: true,
                        },
                        () => {
                            this.drawCode();
                        }
                    );
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
            width: (180 / 375) * document.documentElement.clientWidth,
            height: (180 / 375) * document.documentElement.clientWidth,
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

    //切换当前行程
    swichClick() {
        this.setState({
            pickerDia: true,
            status: 0
        }, () => {
            this.getRecordList(true);
        })

    }

    toRecordDetail(row) {
        console.log(row, "跳转到拜访详情");
        // jump.call(this, "/visitor-detail?id=" + row.id + '&time=1');
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
        const {
            tabs,
            isLoading,
            recordList,
            refreshing,
            dataSource,
            dataSource1,
            hasNextPage,
            recordTitle,
            status,
            healthyCode,
            presentListState,
            presentList,
            pickerDia,
            checked,
            swichBtn
        } = this.state;
        const rowList = (el,id,i,e) => {
            return (
                <div className={`${prefix}-dia`}>
                    <div>
                        <div className={`${prefix}-head-main-top`}>
                            <img className={`${prefix}-head-main-top-png`}
                                 src={require('./../../assets/imgs/house/community@2x.png')} alt=""/>
                            <span className={`${prefix}-head-main-top-text`}>{el.complexName}</span>
                        </div>
                        <div className={`${prefix}-head-main-main`}>
                            <span className={`${prefix}-head-main-main-left`}>{el.visitorName}</span>
                            <span
                                className={`${prefix}-head-main-main-right`}>{el.houseName}</span>
                        </div>
                    </div>
                    <div>
                        {
                            checked==i?<img
                                className={`${prefix}-container-img`}
                                src={require("./../../assets/imgs/common/radio_checked.png")}
                                alt=""
                            />:<img
                                className={`${prefix}-container-img`}
                                onClick={this.changeChecked.bind(this, i)}
                                id={el.id}
                                src={require("./../../assets/imgs/common/radio_button.png")}
                                alt=""
                            />
                        }

                    </div>
                </div>
            )
        }

        const item = (rowData) => {
            console.log(rowData,'我是当前')
            return (
                <React.Fragment>
                    {(() => {
                        return (
                            <div className={`${prefix}-record-item`}>
                                <div className={`${prefix}-record-item-time`}>
                                    {rowData.createTime}
                                </div>
                                <div className={`${prefix}-record-itemlist`}>
                                    {rowData.dataArray &&
                                    rowData.dataArray.map((el, index) => {
                                        return (
                                            <div className={`${prefix}-head-main-map`}>
                                                <div className={`${prefix}-head-main-top-map`}>
                                                    <img className={`${prefix}-head-main-top-png`}
                                                         src={require('./../../assets/imgs/house/community@2x.png')}
                                                         alt=""/>
                                                    <span
                                                        className={`${prefix}-head-main-top-text`}>{el.complexName}</span>
                                                            <span
                                                                className={
                                                                     el.checkStatus === "5"?'hasPast':'guoqi'
                                                                }>
                                                      {el.checkStatus === "5"?'行程中':'已结束'
                                                         }
                                                    </span>
                                                </div>
                                                <div className={`${prefix}-head-main-main`}>
                                                <span
                                                    className={`${prefix}-head-main-main-left`}>{el.visitorName}</span>
                                                    <span
                                                        className={`${prefix}-head-main-main-right`}>{el.houseName}</span>
                                                </div>
                                                <div className={`${prefix}-head-main-footer-map`}>
                                                <span
                                                    className={`${prefix}-head-main-footer-left`}>{el.visitorBeginTime} 至 {el.visitorEndTime}</span>

                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                        // }
                    })()}
                </React.Fragment>
            );
        };
        return (
            <React.Fragment>
                <Tabs
                    tabs={tabs}
                    tabBarActiveTextColor="#255BDA"
                    tabBarUnderlineStyle={{border: "1px #255BDA solid"}}
                    tabBarTextStyle={{
                        fontFamily: "PingFangSC - Medium",
                        fontSize: "15px",
                        letterSpacing: "-0.24px",
                        textAlign: "center",
                        lineHeight: "20px",
                    }}
                >

                    <div className={`${prefix}`}>
                        <div className={`${prefix}-main`}>
                            <div className={`${prefix}-main-head`}>
                                {
                                    presentListState ? <div className={`${prefix}-head`}>
                                        <div className={`${prefix}-head-top`}>
                                            <div className={`${prefix}-head-top-left`}>行程中</div>
                                            {
                                                swichBtn? <div className={`${prefix}-head-top-right`}
                                                               onClick={this.swichClick.bind(this)}>
                                                    <span className={`${prefix}-head-top-right-text`}>切换</span>
                                                    <img className={`${prefix}-head-top-right-png`}
                                                         src={require("./../../assets/imgs/homepage/switch@2x.png")}
                                                         alt=""/>
                                                </div>:null
                                            }

                                        </div>
                                        <div className={`${prefix}-head-main`}>
                                            <div className={`${prefix}-head-main-top`}>
                                                <img className={`${prefix}-head-main-top-png`}
                                                     src={require('./../../assets/imgs/house/community@2x.png')}
                                                     alt=""/>
                                                <span
                                                    className={`${prefix}-head-main-top-text`}>{presentList.complexName}</span>
                                            </div>
                                            <div className={`${prefix}-head-main-main`}>
                                                <span
                                                    className={`${prefix}-head-main-main-left`}>{presentList.visitorName}</span>
                                                <span
                                                    className={`${prefix}-head-main-main-right`}>{presentList.houseName}</span>
                                            </div>
                                            <div className={`${prefix}-head-main-footer`}>
                                                <span
                                                    className={`${prefix}-head-main-footer-left`}>{presentList.visitorBeginTime} 至 {presentList.visitorEndTime}</span>
                                            </div>
                                        </div>
                                    </div> : <NowTime></NowTime>
                                }

                            </div>

                            <div className={`${prefix}-main-code`}>
                                <div
                                    className={`${prefix}-main-code-healthy`}
                                    id="qrcode"
                                    ref="qrcode"
                                ></div>
                                <div className={`${prefix}-name`}>
                                    <span className={`${prefix}-name-block`}>
                                     （亦是可信身份码）
                                    </span>
                                                    </div>
                                                </div>
                                                <div className={`${prefix}-footer`}>
                                                    <img
                                                        className={`${prefix}-footer-png`}
                                                        src={require("./../../assets/imgs/healthy/prompt@2x.png")}
                                                        alt=""
                                                    />
                                                    <span className={`${prefix}-footer-text`}>
                                    若小区的设备支持，可用此码开门。
                                  </span>
                                                </div>
                                            </div>
                                            <div className={`${prefix}-record`}>
                                                <div className={`${prefix}-record-title`}>
                                                    {/*<span*/}
                                                    {/*  onClick={this.changeRecord.bind(this, 0)}*/}
                                                    {/*  className={recordTitle ? "blue" : ""}*/}
                                                    {/*>*/}
                                                    {/*  我的行程*/}
                                                    {/*</span>*/}
                                                    <span
                                                        // onClick={this.changeRecord.bind(this, 1)}
                                                    >
                                    拜访记录
                                  </span>
                            </div>
                            <div className={`${prefix}-recordlist`}>
                                <ListView
                                    ref={(el) => (this.lv = el)}
                                    dataSource={dataSource.cloneWithRows(recordList)}
                                    renderFooter={() => (
                                        <div
                                            style={{
                                                textAlign: "center",
                                                paddingBottom: pxTovw(0),
                                            }}
                                        >
                                            {isLoading
                                                ? "加载中..."
                                                : recordList && recordList.length > 0 && !hasNextPage
                                                    ? "没有更多了~"
                                                    : ""}
                                        </div>
                                    )}
                                    renderRow={item}
                                    className="am-list"
                                    pageSize={this.state.pageSize}
                                    scrollRenderAheadDistance={500}
                                    onEndReached={this.onEndReached}
                                    onEndReachedThreshold={10}
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
                                                activate: <Activate/>,
                                                deactivate: <Deactivate/>,
                                                release: <Release/>,
                                                finish: <Finish/>,
                                            }}
                                        ></PullToRefresh>
                                    }
                                />
                            </div>

                            {
                                (!recordList || recordList.length <= 0) ? (
                                    <div className={`flex flex-center align-center flex-column color-999`} style={{
                                        fontSize: ftTovw(28),
                                        height: '100%',
                                        paddingBottom: pxTovw(100),
                                        paddingTop: pxTovw(100)
                                    }}>
                                        <img src={require('assets/imgs/common/blank.png')}
                                             style={{width: '50', height: pxTovw(170)}} alt="暂无数据"/>
                                        <div className="size28">暂无数据</div>
                                    </div>
                                ) : null
                            }
                        </div>
                    </div>

                    <div className={`${prefix}`}>
                        <div className={`${prefix}-main`}>
                            <div className={`${prefix}-main-head`}>
                                <NowTime></NowTime>
                            </div>
                            <div className={`${prefix}-main-code`}>
                                {(() => {
                                    if (healthyCode) {
                                        return (
                                            <div
                                                className={`${prefix}-main-code-healthy`}
                                                id="qrcode2"
                                                ref="qrcode2"
                                            ></div>
                                        );
                                    } else {
                                        return (
                                            <img
                                                className={`${prefix}-main-code-healthy`}
                                                src={require("../../assets/imgs/common/erweima_code.png")}
                                            ></img>
                                        );
                                    }
                                })()}
                                <div className={`${prefix}-name`}>
                <span className={`${prefix}-name-block`}>
                  {this.state.healthyName}
                </span>
                                </div>
                            </div>
                            <div className={`${prefix}-footer`}>
                                <img
                                    className={`${prefix}-footer-png`}
                                    src={require("./../../assets/imgs/healthy/prompt@2x.png")}
                                    alt=""
                                />
                                <span className={`${prefix}-footer-text`}>
                绿码：凭此码可在浙江省范围内，请主动出示，配合检查；并做好自身防护工作，码颜色将根据您的申报由当地政府按照相关政策动态更新，出行前请仔细检查您的健康码
              </span>
                            </div>
                        </div>
                        <div className={`${prefix}-phone`}>
                            <div className={`${prefix}-phone-info`}>
                                <img
                                    className={`${prefix}-phone-png`}
                                    src={require("./../../assets/imgs/healthy/phone@2x.png")}
                                    alt=""
                                />
                                <span className={`${prefix}-phone-text`}>
                                    服务热线: 0577-12345
                                  </span>
                                                </div>
                                                <span className={`${prefix}-phone-eg`}>
                                  - 本服务由当地人民政府提供 -
                                </span>
                        </div>
                    </div>
                </Tabs>
                {
                    pickerDia ? <div className={`dia-style`}>
                        <div className={`dia-body`}>
                            <div className={``}>
                                <div className={`dia-header`}>
                                    <div className={`dia-head-left`} onClick={this.cancelDiaClick.bind(this)}>取消</div>
                                    <div className={`dia-head-right`} onClick={this.saveHouseClick.bind(this)}>确定</div>
                                </div>
                                <div className={`list-view`}>
                                    <ListView
                                        ref={(el) => (this.lv1 = el)}
                                        dataSource={dataSource1.cloneWithRows(recordList)}
                                        renderFooter={() => (
                                            <div
                                                style={{
                                                    textAlign: "center",
                                                    paddingBottom: pxTovw(0),
                                                }}
                                            >
                                                {isLoading
                                                    ? "加载中..."
                                                    : recordList && recordList.length > 0 && !hasNextPage
                                                        ? "没有更多了~"
                                                        : ""}
                                            </div>
                                        )}
                                        renderRow={rowList}
                                        className="am-list"
                                        pageSize={this.state.pageSize}
                                        scrollRenderAheadDistance={500}
                                        // onEndReached={this.onEndReached}
                                        onEndReachedThreshold={10}
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
                                                    activate: <Activate/>,
                                                    deactivate: <Deactivate/>,
                                                    release: <Release/>,
                                                    finish: <Finish/>,
                                                }}
                                            ></PullToRefresh>
                                        }
                                    />
                                </div>
                            </div>

                        </div>

                    </div> : null
                }
            </React.Fragment>
        );

    }
}

// inject 将store注入到当Test组件的props中
export default inject("store")(observer(WenZhouHealthy));
