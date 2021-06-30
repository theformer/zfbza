/* eslint-disable no-console */
/* eslint-disable no-debugger */
// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Toast,Button,WhiteSpace } from 'antd-mobile'
import './index.scss'
import { back, jump } from '../../utlis/utlis'
import http from '../../utlis/http'
const prefix = 'privacy-page'
Toast.config({
    mask: false
})
class Index extends Component {
    constructor(props) {
        super(props)
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
            <div className={`${prefix}`}>
                <div className={`${prefix}-main`}>
                    <div className={`${prefix}-title`}>亲爱的用户，您好：</div>
                    <div className={`${prefix}-text`}>欢迎您使用智安小区助手。易云尊重并保护所有使用智安小区助手用户的个人隐私权，
                        您注册的个人资料易云尊重并保护所有使用智安小区助手用户的个人隐私权。
                    </div>
                    <div className={`${prefix}-p`}>一、我们会保护您的个人数据</div>
                    <div  className={`${prefix}-text`}>易云尊重并保护所有使用智安小区助手用户的个人隐私权，您注册的个人资料易云尊重并保护所有使用智安小区助手用户的个人隐私权，
                        您注册的个人资料易云尊重并保护所有使用智安小区助手用户的个人隐私权，
                        您注册的个人资料易云尊重并保护所有使用智安小区助手用户的个人隐私权，
                        您注册的个人资料易云尊重并保护所有使用智安小区助手用户的个人隐私权，
                        您注册的个人资料易云尊重并保护所有使用智安小区助手用户的个人隐私权，
                        您注册的个人资料易云尊重并保护所有使用智安小区助手用户的个人隐私权。
                    </div>
                    <div className={`${prefix}-p`}>二、第三方服务</div>
                    <div  className={`${prefix}-text`}>易云尊重并保护所有使用智安小区助手用户的个人隐私权，
                        您注册的个人资料易云尊重并保护所有使用智安小区助手用户的个人隐私权，
                        您注册的个人资料易云尊重并保护所有使用智安小区助手用户的个人隐私权，
                        您注册的个人资料易云尊重并保护所有使用智安小区助手用户的个人隐私权，
                        您注册的个人资料易云尊重并保护所有使用智安小区助手用户的个人隐私权，您注册的个人</div>
                </div>

            </div>
        )
    }
}
// inject 将store注入到当Test组件的props中
export default inject('store')(
    observer(Index)
)
