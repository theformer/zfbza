/* eslint-disable no-console */
/* eslint-disable no-debugger */
// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Toast, ImagePicker } from 'antd-mobile'
import './index.scss'
import { back, getUrlValue, jump, upload } from '../../utlis/utlis'
import http from '../../utlis/http'

const prefix = 'index-demo'
Toast.config({
  mask: false
})
class Index extends Component {
  constructor(props) {
    super(props)
    this.store = this.props.store.testStore
    this.state = {
      files: [
        {
          url: "https://zos.alipayobjects.com/rmsportal/hqQWgTXdrlmVVYi.jpeg",
          id: '2122',
        }
      ]
    }
  }
  componentDidMount() {
    // 修改mobx中存储的值
    this.store.name = 'name'
    let href = window.location.href
    if (href.indexOf('ticket') < 0) {
      // window.location.href = `https://puser.zjzwfw.gov.cn/sso/mobile.do?action=oauth&scope=1&servicecode=zaxqzs&goto=${encodeURIComponent('https://mapi.zjzwfw.gov.cn/web/mgop/gov-open/zj/2001601131/0.0.4/index.html?debug=true')}`
      // http.get({
      //   url: "mgop.yykj.community.ssoLogin"
      // })
    } else {
      // let ticket = getUrlValue('ticket')
      // errmsg: "成功"
      let ticket = '8a11885578bc3f540178e95018356791-ticket'
      // loginname: "zjzw69153593"
      // orgcoding: "001006"
      // result: "0"
      // token: "8a118a47787458560178d941bff27cd6-commonToken"
      // userid: "8afac0cc5d653495015d7e351f4720a0"
      // username: "王帅"
      http.post({
        url: '/api/zlb/app/ticketValidation',
        data: {
          ticket
        }
      }).then(res => {
        let data = res && res.data && res.data.data
        if (data && data.userid) {
          // localStorage.setItem('userid', data.userid)
          // localStorage.setItem('userId', data.userid)
          // localStorage.setItem('username', data.username)
          // localStorage.setItem('userName', data.username)
          http.post({
            url: '/api/zlb/app/getUserInfoByToken',
            data: {
              token: data.token
            }
          }).then(res => {
            // aliuserid: "2088112082330813"
            // authlevel: "3"
            // birthday: ""
            // city: ""
            // companyalias: ""
            // companydesc: ""
            // companyname: ""
            // companypro: ""
            // companysize: ""
            // companytype: ""
            // country: ""
            // createdate: "2017-07-26 17:23:16"
            // driverlicense: ""
            // email: ""
            // errmsg: "成功"
            // firmname: ""
            // headPicture: ""
            // headpicture: ""
            // homeaddress: ""
            // homephone: ""
            // idnum: "331003199411090539" // 身份证号
            // idtype: "1"
            // isFace: "0"
            // loginaddr: ""
            // loginname: "zjzw69153593"
            // mobile: "15957134465" // 手机号
            // mobile2: ""
            // nation: ""
            // officeaddress: ""
            // officefax: ""
            // officenum: ""
            // official: ""
            // officialtype: ""
            // orderby: "9365478"
            // orgcoding: "001006"
            // permitlicense: ""
            // postcode: ""
            // province: ""
            // result: "0"
            // servicecontent: ""
            // sex: "1"
            // telephone: ""
            // telephone2: ""
            // useable: "1"
            // userid: "8afac0cc5d653495015d7e351f4720a0"
            // username: "王帅" // 姓名
            // virtualnum: ""
            // workaddr: ""
            let data = res && res.data && res.data.data
            // localStorage.setItem('userInfo', JSON.stringify({
            //   username: data.username,
            //   mobile: data.mobile,
            //   sex: data.sex,
            //   nation: data.nation,
            //   idnum: data.idnum
            // }))
          })
        }

      })
    }
    // window.aplus_queue.push({
    //   'action': 'aplus.sendPV',
    //   'arguments': [{
    //     is_auto: false
    //   },
    //   {
    //     //自定义PV参数key-value键值对（只能是这种平铺的json，不能做多层嵌套），如：
    //     userType: 1
    //   }]
    // })
    // console.log(window.location.href)
  }

  toIndex() {
    // 跳转
    jump.call(this, '/index')
  }
  goBack() {
    // 返回
    back.call(this)
  }
  changeName() {
    // 修改mobx中存储的值
    this.store.name = 'changename' + Math.random()
    // http.get({
    //   url: "mgop.yykj.community.urlTest",
    //   data: {
    //     appName: 'app'
    //   }
    // }).catch(err => {
    //   // eslint-disable-next-line no-console
    //   console.error(err)
    // })
    window.ZWJSBridge.onReady(() => {
      window.ZWJSBridge.setTitle({ title: '邮箱正文' }).then((result) => { console.log(result) }).catch((error) => { console.log(error) })
      window.ZWJSBridge.zmAuthentication({}).then((data) => {
        console.log(data)
      }).catch((error) => {
        console.log(error)
      })
    })

  }
  onChange = async (files, type, index) => {
    Toast.loading()
    upload({
      files: files,
      props: 'url'
    }).then(res => {
      Toast.hide()
      this.setState({
        files,
        imgList: res
      });
    }).catch(err => {
      Toast.info('上传图片出错')
    })

  }
  render() {
    // 从mobx中拿所需属性
    const { files } = this.state
    return (
      <div className={`${prefix}`}>
        {/* { name} */}
        <ImagePicker
          files={files}
          onChange={this.onChange}
          onImageClick={(index, fs) => console.log(index, fs)}
          selectable={files.length < 5}
          accept="image/gif,image/jpeg,image/jpg,image/png"
          multiple={true}
        />
      </div>
    )
  }
}
// inject 将store注入到当Test组件的props中
export default inject('store')(
  observer(Index)
)
