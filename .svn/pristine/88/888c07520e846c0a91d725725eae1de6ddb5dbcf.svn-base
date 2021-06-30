import React, { Component } from "react";
import { inject, observer } from 'mobx-react';
import { jump, setTitle, pxTovw, getUrlValue, ftTovw, formatPhone } from '../../utlis/utlis'
import http from '../../utlis/http'
import { Toast, DatePicker, List, PullToRefresh, ListView, Button } from 'antd-mobile'
import { Activate, Deactivate, Release, Finish } from 'common/yy-refresh-indiccator'
import YYImage from 'common/yy-image'
import "./index.scss"


const Item = List.Item;
const Brief = Item.Brief;
const nowTimeStamp = Date.now();
const now = new Date(nowTimeStamp);

const prefix = 'advice-charge'
Toast.config({
  mask: false
})

class AdviceCharge extends Component {
  constructor(props) {
    super(props);
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    })
    this.state = {
      dataSource,
      adviceList: [2, 3],
      pageNum: 1,
      pageSize: 20,
      refreshing: false,
      isLoading: false,
    }
  }
  componentWillMount() {
    setTitle.call(this, '缴费通知')
  }
  componentDidMount() {
  }
  getAdviceList = () => {
    this.setLoaded()
  }
  setLoaded() {
    this.setState({
        request: true,
        isLoading: false,
        refreshing: false
    })
  }
  onRefresh = () => {
    this.setState({
        refreshing: true,
        pageNum: 1,
        adviceList: [1, 2],
        request: true,
        hasNextPage: true
    }, () => {
        this.getAdviceList()
    })
}
  render() {
    const { dataSource, isLoading, adviceList, refreshing, hasNextPage } = this.state
    const item = (item) => {
      return (
        <React.Fragment>
          <div className={`${prefix}-log`}>
            <div className={`${prefix}-log-boxs`}>
              <div className={`${prefix}-log-search`}>
                <div className={`${prefix}-log-time`}>
                  2021年4月14日
                </div>
              </div>
              <div className={`${prefix}-log-list`}>
                <div className={`${prefix}-log-listitem`}>
                  <div className={`${prefix}-log-item flex`}>
                    <div className={`${prefix}-log-word flex1`}>
                    【某某物业】您的物业费缴费时间，还剩7天，请尽快前往物业处缴纳 ，2020年11月4日。
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </React.Fragment>
      );
    };
    return (
      <div className={`${prefix}-box flex flex-column hiden-box`} style={{ height: '100vh' }}>
        <div className={`${prefix}-log-select`}>
          <DatePicker
            mode="date"
            title="选择日期"
            extra="请选择查询日期"
            value={this.state.date}
            onChange={date => this.setState({ date })}
          >
            <List.Item>
              <img src={require('assets/imgs/house/calendar@2x.png')} className={`${prefix}-complex-icon`} />
            </List.Item>
          </DatePicker>
        </div>
        <div className={`flex1 hiden-box`}>
          <ListView
            ref={el => this.lv = el}
            dataSource={dataSource.cloneWithRows(adviceList && adviceList.length <= 0 ? ['暂无数据'] : adviceList)}
            renderFooter={() => (<div style={{ textAlign: 'center', paddingBottom: pxTovw(80) }}>
              {isLoading ? '加载中...' : (adviceList && adviceList.length > 0 && !hasNextPage ? '没有更多了~' : '')}
            </div>)}
            renderRow={item}
            className="am-list"
            pageSize={this.state.pageSize}
            scrollRenderAheadDistance={500}
            onEndReached={this.onEndReached}
            onEndReachedThreshold={10}
            style={{
              height: '100%'
            }}
            pullToRefresh={
              <PullToRefresh
                damping={pxTovw(120)}
                ref={el => this.ptr = el}
                refreshing={refreshing}
                onRefresh={this.onRefresh}
                distanceToRefresh={parseFloat(document.documentElement.style.fontSize)}
                indicator={{ activate: <Activate />, deactivate: <Deactivate />, release: <Release />, finish: <Finish /> }}
              >
              </PullToRefresh>
            }
          />
        </div>
      </div>
    )
  }
}

export default inject('store')(
  observer(AdviceCharge)
)