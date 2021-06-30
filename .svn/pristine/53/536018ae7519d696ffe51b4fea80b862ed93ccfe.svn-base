/* eslint-disable no-console */
/* eslint-disable no-debugger */
// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Toast, Button } from 'antd-mobile'
import './index.scss'
import {
  jump,
  setTitle,
  getHashUrlValue,
  back,
  getStorage,
} from '../../utlis/utlis'
import http from '../../utlis/http'

const prefix = 'visitor-detail'
Toast.config({
  mask: false,
})
class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      type: 3,
      data: null,
      flag:false
    }
  }
  componentWillUnmount (){
    window.my.removeStorage({
      key: 'addUser',
    });
  }
  componentDidMount() {
    // 修改mobx中存储的值
    let id = getHashUrlValue('id')
    let time = getHashUrlValue('time')
    if(time==1){
      setTitle.call(this, '拜访详情')
    }else{
      setTitle.call(this, '访客详情')
    }
    this.setState({
      time,
    })
    console.log(id, '访客id')
    if (id) {
      this.setState({
        id
      })
      this.getDetail(id)
    }
  }
  getDetail(id) {
    let data = {
      id,
    }
    http
      .get({
        url: '/api/alipay/visitor/detail?id=' + data.id,
      })
      .then((res) => {
        console.log(res, '获取访客详情')
        const { data, code, message } = res.data
        if (code !== '1') {
          Toast.fail(message)
        }
        this.setState({
          data,
        })
      })
  }
  //审核访客状态
  // checkStatusClick(status){
  //   const id = this.state.data.id
  //   let data ={
  //     status:status
  //   }
  //   http.get({
  //         url: '/api/visitor/checkStatus?id=' + id+'&checkStatus='+data.status,
  //       }).then((res) => {
  //           if(res.data.code ==1){
  //             this.getDetail(this.state.id)
  //             this.setState({
  //               flag:true
  //             })
  //           }
  //       })
  // }
  //再次拜访
  async againCome(){
    // let uuidCode = this.uuid()
    const data = this.state.data
    let zfbUserId
    await getStorage('zfbUserId',res=>{
      zfbUserId = res
    })
    window.my.navigateTo({url: '../visitor-info/visitor-info?complexCode=' + data.complexCode+'&uuidCode='+data.registerId+'&carNumber=' +
          ''+data.carNumber+'&complexName='+data.complexName+'&userId='+data.userId+'&houseId=' +
          data.housesId+'&buildingCode='+data.buildingCode+'&unitCode='+data.unitCode+'&visitorName=' +
          ''+data.visitorName+'&parentId='+data.parentId+'&goVisitorInfo=3'+'&zfbUserId='+zfbUserId+'&userName='+data.userName})
  }
  toIndex() {
    // 跳转
    jump.call(this, '/index')
  }
  goBack() {
    // 返回
    back.call(this)
  }
  render() {
    // 从mobx中拿所需属性
    const { data,flag,visitorBeginTime,visitorEndTime } = this.state
    return (
      <div className={`${prefix} flex flex-column`}>
        <div className={`${prefix}-box`}>
          <div className={`${prefix}-box-head flex align-center`}>
            <img
              className={`${prefix}-box-head-photo`}
              src={require('./../../assets/imgs/common/head_default@2x.png')}
              alt=""
            />
            <div className={`${prefix}-box-head-detail flex flex-column`}>
              <div className={`${prefix}-detail detail-name flex`}>
                <span className={`${prefix}-detail-left`}>姓 名</span>
                <span className={`${prefix}-detail-right`}>
                  {data ? data.userName : '暂无数据'}
                </span>
              </div>
              <div className={`${prefix}-detail flex`}>
                <span className={`${prefix}-detail-left`}>手机号</span>
                <span className={`${prefix}-detail-right`}>
                  {data ? data.tel : '暂无数据'}
                </span>
              </div>
            </div>
          </div>
          <div className={`${prefix}-main`}>
            {/*<div className={`${prefix}-main-col housing flex`}>*/}
            {/*  <span className={`${prefix}-main-col-left`}>小区</span>*/}
            {/*  <span className={`${prefix}-main-col-right`}>*/}
            {/*    {data ? data.complexName : '暂无数据'}*/}
            {/*  </span>*/}
            {/*</div>*/}
            {/*<div className={`${prefix}-main-col flex`}>*/}
            {/*  <span className={`${prefix}-main-col-left`}>房屋</span>*/}
            {/*  <span className={`${prefix}-main-col-right`}>*/}
            {/*    {data ? data.houseName : '暂无数据'}*/}
            {/*  </span>*/}
            {/*</div>*/}
            <div className={`${prefix}-main-col flex`}>
              <span className={`${prefix}-main-col-left`}>车牌号</span>
              <span className={`${prefix}-main-col-right`}>
                {data ? data.carNumber : '暂无数据'}
              </span>
            </div>
            <div className={`${prefix}-main-col flex`}>
              <span className={`${prefix}-main-col-left`}>拜访地址</span>
              <span className={`${prefix}-main-col-right`}>
                {data ? data.houseName : '暂无数据'}
              </span>
            </div>
            <div className={`${prefix}-main-col flex`}>
              <span className={`${prefix}-main-col-left`}>到访时间</span>
              <span className={`${prefix}-main-col-right`}>
                {data ? data.visitorBeginTime+' 至 '+data.visitorEndTime : '暂无数据'}
              </span>
            </div>
            <div className={`${prefix}-main-col housing-bottom flex`}>
              <span className={`${prefix}-main-col-left`}>状态</span>
              {(() => {
                if (data && data.checkStatus === '5') {
                  return <span className={`${prefix}-waitpass`}>行程中</span>
                } else if (data && data.checkStatus === '6') {
                  return <span className={`${prefix}-guoqi`}>已结束</span>
                }
              })()}
            </div>
          </div>
        </div>
        <div>
          {/*{(() => {*/}
          {/*  if (this.state.time != 1 && data && data.checkStatus == '0' &&!flag) {*/}
          {/*    return (*/}
          {/*      <div className={`${prefix}-footer flex`}>*/}
          {/*        <Button type="primary" className={`${prefix}-footer-left`} onClick={this.checkStatusClick.bind(this,2)}>*/}
          {/*          不通过*/}
          {/*        </Button>*/}
          {/*        <Button type="primary" className={`${prefix}-footer-right`} onClick={this.checkStatusClick.bind(this,1)}>*/}
          {/*          通过*/}
          {/*        </Button>*/}
          {/*      </div>*/}
          {/*    )*/}
          {/*  } else if (this.state.time == 1) {*/}
          {/*    return (*/}
          {/*      <div className={`${prefix}-footer flex`}>*/}
          {/*        <Button*/}
          {/*          type="primary"*/}
          {/*          className={`${prefix}-footer-right again-btn`}*/}
          {/*          onClick={this.againCome.bind(this)}*/}
          {/*        >*/}
          {/*          再次拜访*/}
          {/*        </Button>*/}
          {/*      </div>*/}
          {/*    )*/}
          {/*  }*/}
          {/*})()}*/}
        </div>
      </div>
    )
  }
}
// inject 将store注入到当Test组件的props中
export default inject('store')(observer(Index))
