/* eslint-disable no-console */
/* eslint-disable no-debugger */
// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Toast,Button,WhiteSpace } from 'antd-mobile'
import './index.scss'
import {back, jump, setTitle} from '../../utlis/utlis'
import http from '../../utlis/http'

const prefix = 'common-problem'
Toast.config({
  mask: false
})
class CommonProblem extends Component {
  constructor(props) {
    super(props)
  }
  state={
      problemList:[]
  }
  componentDidMount() {
    // 修改mobx中存储的值
      setTitle.call(this, '常见问题')
      this.getProblemList()
  }
  getProblemList(){
      http.get({
          url: "/api/notice/query",
      }).then( (res) => {
          let data = res&&res.data&&res.data.data
          console.log(data,'我是返回的data')
              this.setState({
                  problemList:data
              })
      })
  }
  toIndex() {
    // 跳转
    jump.call(this, '/index')
  }


  render() {
    // 从mobx中拿所需属性
      const {problemList} = this.state
    return (
      <div className={`${prefix} flex flex-column`}>
          {
              problemList&&problemList.map((e,i)=>{
                  return <div className={`${prefix}-main`}>
                        <div className={`${prefix}-main-issue`}>{i +'.'+ e.title}</div>
                        <div className={`main-answer`}>{e.content}</div>
                  </div>
              })
          }
        <div className={`${prefix}-footer flex1`}></div>
      </div>
    );
  }
}
// inject 将store注入到当Test组件的props中
export default inject('store')(
  observer(CommonProblem)
)
