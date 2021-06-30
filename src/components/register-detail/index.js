/* eslint-disable no-console */
/* eslint-disable no-debugger */
// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Toast } from 'antd-mobile'
import './index.scss'
import { setTitle, back, jump, getUrlValue } from '../../utlis/utlis'
import http from '../../utlis/http'

const prefix = 'register-detail'
Toast.config({
  mask: false
})
class RegisterDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      type: 1,
      state: 1,
      data: {}
    }
  }
  componentDidMount() {
    setTitle.call(this, '登记详情')
    let obj = window.sessionStorage.getItem('regDetail')
    // 获取上一个页面传递过来的值
    if (obj) {
      this.setState({
        data: JSON.parse(obj)
      })
    }
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
    const { data } = this.state
    // 从mobx中拿所需属性
    return (
      <div className={`${prefix} flex flex-column`}>
        <div className={`${prefix}-bg`}></div>
        <div className={`${prefix}-header flex`}>
          <img className={`${prefix}-header-photo`} src={require('./../../assets/imgs/homepage/house_icon_registered_d.png')} alt="" />
          <div className={`${prefix}-header-main flex flex-column`}>
            <div className={`${prefix}-header-main-box flex align-center`}>
              <span className={`${prefix}-name`}>{data.userName} </span>
              {/*  归属人 */}
              {
                (() => {

                  // if (data.isHouseholder === '1') {
                  //   //户主
                  //   return <div className={`${prefix}-owner houseowner-color`}>
                  //     <span className={`${prefix}-owner-ft`}>户主</span>
                  //   </div>
                  // }
                  // else
                  if (data.housingType === '1') {
                    //业主
                    return <div className={`${prefix}-owner owner-color`}>
                      <span className={`${prefix}-owner-ft`}>业主</span>
                    </div>
                  } else {
                    //租户
                    return <div className={`${prefix}-owner lessee-color`}>
                      <span className={`${prefix}-owner-ft`}>租户</span>
                    </div>
                  }


                })()
              }
              {
                (() => {
                  if (data.checkStatus === 'WY200') {
                    //已审核
                    return <div className={`${prefix}-checked checked`}>
                      <span className={`${prefix}-checked-ft`}>已审核</span>
                    </div>
                  } else if (data.checkStatus === 'CS200') {
                    //待审核
                    return <div className={`${prefix}-checked unchecked`}>
                      <span className={`${prefix}-checked-ft`}>待审核</span>
                    </div>
                  } else if (data.checkStatus === 'WY500') {
                    //未通过
                    return <div className={`${prefix}-checked no-pass`}>
                      <span className={`${prefix}-checked-ft`}>未通过</span>
                    </div>
                  } else {
                    //异常
                    return <div className={`${prefix}-checked no-pass`}>
                      <span className={`${prefix}-checked-ft`}>审核异常</span>
                    </div>
                  }
                })()
              }
            </div>
            <div>
              <span className={`${prefix}-phone`}>{data.tel}</span>
            </div>
          </div>
        </div>
        <div className={`${prefix}-bg`}></div>
        <div className={`${prefix}-main`}>
          <div className={`${prefix}-main-content`}>

            {/*实名认证*/}

            {
              (() => {
                if (data.userName) {
                  //业主
                  return <div className={`${prefix}-main-content-name flex`}>
                    <img className={'png-tips'} src={require('./../../assets/imgs/common/success_b@2x.png')} alt="" />
                    <span className={`${prefix}-checked-name`}>实名认证完成</span>
                  </div>
                } else {
                  //无身份
                  return <div className={`${prefix}-main-content-name flex`}>
                    <img className={'png-tips'} src={require('./../../assets/imgs/common/review_pending@2x.png')} alt="" />
                    <span className={`${prefix}-checked-name`}>实名认证未完成</span>
                  </div>
                }
              })()
            }

            {/*人脸识别*/}
            <div className={`${prefix}-line`}></div>

            <div>
              {
                (() => {
                  if (data.complexCode) {
                    //业主
                    return <div className={`${prefix}-main-content-name flex`}>
                      <img className={'png-tips'} src={require('./../../assets/imgs/common/success_b@2x.png')} alt="" />
                      <span className={`${prefix}-checked-name`}>人脸采集完成</span>
                    </div>
                  } else {
                    //无身份
                    return <div className={`${prefix}-main-content-name flex`}>
                      <img className={'png-tips'} src={require('./../../assets/imgs/common/review_pending@2x.png')} alt="" />
                      <span className={`${prefix}-checked-name`}>人脸采集未完成</span>
                    </div>
                  }
                })()
              }
            </div>
            <div className={`${prefix}-line`}></div>

            <div>
              {
                (() => {
                  if (data.complexCode) {
                    //业主
                    return <div className={`${prefix}-main-content-name flex`}>
                      <img className={'png-tips'} src={require('./../../assets/imgs/common/success_b@2x.png')} alt="" />
                      <span className={`${prefix}-checked-name`}>住户信息登记成功</span>
                    </div>
                  } else {
                    //无身份
                    return <div className={`${prefix}-main-content-name flex`}>
                      <img className={'png-tips'} src={require('./../../assets/imgs/common/review_pending@2x.png')} alt="" />
                      <span className={`${prefix}-checked-name`}>住户信息登记失败</span>
                    </div>
                  }
                })()
              }
            </div>
            <div className={`${prefix}-line`}></div>
            {
              (() => {
                if (data.checkStatus === 'WY200') {
                  return (
                    <div className={`${prefix}-main-content-name flex`}>
                      <img className={'png-tips'} src={require('./../../assets/imgs/common/success_b@2x.png')} alt="" />
                      <span className={`${prefix}-checked-name`}>已审核</span>
                    </div>

                  )
                } else if (data.checkStatus === 'CS200') {
                  return (
                    <div className={`${prefix}-main-content-name flex`}>
                      <img className={'png-tips'} src={require('./../../assets/imgs/common/review_pending@2x.png')} alt="" />
                      <span className={`${prefix}-checked-name`}>待审核</span>
                    </div>

                  )
                } else if (data.checkStatus === 'WY500') {
                  return (
                    <div className={`${prefix}-main-content-name flex`}>
                      <img className={'png-tips'} src={require('./../../assets/imgs/common/review_abnormal@2x.png')} alt="" />
                      <span className={`${prefix}-checked-name`}>未通过</span>
                    </div>

                  )
                } else {
                  return (
                    <div className={`${prefix}-main-content-name flex`}>
                      <img className={'png-tips'} src={require('./../../assets/imgs/common/review_abnormal@2x.png')} alt="" />
                      <span className={`${prefix}-checked-name`}>审核异常</span>
                    </div>

                  )
                }
              })()
            }
            <div className={`${prefix}-line`}></div>
            {/* {
                (() => {
                  if (data.checkStatus === 'WY200') {
                    return data.passage.map((i, index) => {
                      return (
                        <div className={`${prefix}-list flex`} key={index}>
                          <div className={`${prefix}-list-title`}>{i.passageName}</div>
                          <div className={`${prefix}-list-title`}>{i.endTime}</div>
                        </div>

                      )
                    })
                  }
                })()
              } */}
          </div>
        </div>
      </div>
    )
  }
}
// inject 将store注入到当Test组件的props中
export default inject('store')(
  observer(RegisterDetail)
)
