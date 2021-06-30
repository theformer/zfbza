/* eslint-disable no-console */
/* eslint-disable no-debugger */
// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Toast,Button,WhiteSpace } from 'antd-mobile'
import './index.scss'
import { back, jump } from '../../utlis/utlis'
import http from '../../utlis/http'

const prefix = 'report-detail'
Toast.config({
  mask: false
})

class Index extends Component {
  constructor(props) {
    super(props)
  }
  state={
    name:'李李李',
    where:'1栋1单元101',
    content:'家里的卫生间下水道堵住了，积了好多水。请尽快安排维修啊！！！',
    time:'2020-09-27  18:26:35',
  }
  componentDidMount() {
    // 修改mobx中存储的值
  }
  toIndex() {
    // 跳转
    jump.call(this, '/index')
  }
  goBack() {
    // 返回
    back.call(this)
  }
  //登记入住
  changeCheckIn(){

  }
  //访客登记
  changeRegister(){

  }

  render() {
    // 从mobx中拿所需属性
    return (
      <div className={`${prefix} flex flex-column`}>
        <div className={`${prefix}-header`}>
          <div className={`${prefix}-header-top flex`}>
            <img className={'header-photo'} src={require('./../../assets/imgs/common/calendar@2x.png')}  alt=""/>
            <div className={'header-right flex flex-column'}>
              <span className={'header-name'}>{this.state.name}</span>
              <span className={'header-where'}>{this.state.where}</span>
            </div>
          </div>
          <div className={'header-footer flex flex-column'}>
            <div className={'footer-content word-space-two'}>{this.state.content}</div>
            <span className={'footer-time'}>{this.state.time}</span>
            <div className={'footer-line'}></div>
          </div>
        </div>
        <div>
        </div>
        {/* 中部 回复内容和完结按钮*/}
        {/*<div className={`${prefix}-main`}>*/}
        {/*  */}
        {/*</div>*/}
      </div>
    )
  }
}
// inject 将store注入到当Test组件的props中
export default inject('store')(
  observer(Index)
)
