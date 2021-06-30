/* eslint-disable no-console */
/* eslint-disable no-debugger */
// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Toast,Button,WhiteSpace,DatePicker,List } from 'antd-mobile'
import './index.scss'
import { back, jump } from '../../utlis/utlis'
import http from '../../utlis/http'

const prefix = 'report-repair'


const nowTimeStamp = Date.now();
const now = new Date(nowTimeStamp);

Toast.config({
  mask: false
})
class Index extends Component {
  constructor(props) {
    super(props)
  }
  // type   1居家报修 2 小区报修  3 失物招领 4 物品丢失 5其他
  // state  1待处理   2 已完结

  state={
    list:[
      {time:'2021-11-20',children:
      [
       {type:'居家保修',state:2,title:'居家报修',huifu:'马上查实情况，安排处理',content:'家里的卫生间下水ssssssssssssssssssssssssssssssssssssssssssssssssssssssss道堵住了，挤了好多水。请尽快安排维修！！！'},
       {type:'小区报修',state:1,title:'居家报修',huifu:'马上查实情况，安排处理',content:'家里的卫生间下水道堵住了，挤了好多水。请尽快安排维修！！！'}
      ]
      },
      {time:'2021-11-20',children:
            [{type:'失物招领',state:1,title:'居家报修',huifu:'马上查实情况，安排处理',content:'家里的卫生间下水道堵住了，挤了好多水。请尽快安排维修！！！'},
              ]
      }
    ]
    // date: now,
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
  //获取报修事务信息
  getHomePerson(){
    return this.state.list
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
      <div className={`${prefix}`}>
        <div className={`${prefix}-header`}>
          <DatePicker
              mode="date"
              title="请选择查询日期"
              extra="选择查询日期"
              value={this.state.date}
              onChange={date => this.setState({ date: now})}
          >
            <List.Item>
              <img className={`${prefix}-header-photo`} src={require('./../../assets/imgs/common/calendar@2x.png')} alt=""/>
            </List.Item>
          </DatePicker>
        </div>
        <div className={`${prefix}-main`}>
          {this.getHomePerson()&&this.getHomePerson().map((item,index)=>{
            if(item.children&&item.children.length>0){
              return item.children.map((i,n)=>{
                return (
                    <div className={`flex flex-column`} key={n}>
                      <div>
                          {
                            (() => {
                              if (n>=1) {
                                return  null
                              }
                              return(
                                  <div className={`${prefix}-time`}>
                                    {item.time}
                                  </div>)
                            })()
                          }
                      </div>
                      <div className={`${prefix}-main-body`}>
                        <div className={`${prefix}-main-body-head flex flex-between align-center`}>
                          <div className={`${prefix}-main-body-head-some flex flex-start`}>
                            <span className={`${prefix}-type`}>{i.type}</span>
                            {
                              (() => {
                                if (i.state===1) {
                                  return  <div className={`report-dispose`}>
                                    <span className={`wait-dispose`}>待处理</span>
                                  </div>
                                }
                                return(
                                    <div className={`report-finish`}>
                                      <span className={`finish`}>已完结</span>
                                    </div>
                                )
                              })()
                            }
                          </div>
                          <img className={`main-photo`} src={require('./../../assets/imgs/common/next@2x.png')} alt=""/>
                        </div>
                        <div className={`${prefix}-content word-space-two`}>
                          {i.content}
                        </div>
                        <div className={`${prefix}-line`}></div>
                        <div className={`${prefix}-reply`}>
                          <span className={`${prefix}-reply-text`}>物业回复：<span>{i.huifu}</span></span>
                        </div>
                      </div>


                    </div>

                )
              })
            }
          }   )}
        </div>
      </div>
    )
  }
}
// inject 将store注入到当Test组件的props中
export default inject('store')(
  observer(Index)
)
