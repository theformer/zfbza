/* eslint-disable no-console */
/* eslint-disable no-debugger */
// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Toast, Button } from 'antd-mobile'
import './index.scss'
import {setTitle, back, jump, getStorage, setStorage} from '../../utlis/utlis'
import http from '../../utlis/http'
import { result } from 'lodash'

const prefix = 'register-success'
Toast.config({
    mask: false
})

class Index extends Component {
    constructor(props) {
        super(props)
        this.store = this.props.store.testStore
    }
    state={
        visitorStatus:''
    }

    componentWillMount () {
        window.goHomePage= true
    }
    componentWillUnmount() {
        setStorage('visitorStatus','')
        window.goHomePage = false

    }

    async componentDidMount() {
        // 修改mobx中存储的值
        this.store.name = 'name'
        let visitorStatus
        await getStorage('visitorStatus',res=>{
            visitorStatus = res
        })
        this.setState({
            visitorStatus
        })
        setTitle.call(this, '登记成功')
    }
    async goHomePage() {
        if(this.state.visitorStatus&&this.state.visitorStatus==1){
            jump.call(this, '/wenzhou-healthy')
        }else{
            jump.call(this,'/home-page')
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
    //登记入住
    changeCheckIn() {

    }
    //访客登记
    changeRegister() {

    }

    render() {
        const {visitorStatus} =this.state
        // 从mobx中拿所需属性
        return (
            <div className={`${prefix} flex flex-column flex-between`}>
                <div className={`${prefix}-main`}>
                    <img src={require('./../../assets/imgs/logins/review_success@xxhdpi.png')} className={`${prefix}-main-success`} alt="" />
                    <div className={`${prefix}-maim-information`}>
                        <span className={`${prefix}-maim-information-success`}>登记成功</span>
                        <div className={`${prefix}-maim-information-state`}>
                            <span>
                                请等待下发（如需修改，请联系物业）
                            </span>
                        </div>
                    </div>
                </div>
                <div>
                    <div className={`${prefix}-footer flex1`}>
                        <Button type='primary' onClick={this.goHomePage.bind(this)} className={`${prefix}-footer-btn`}>确定</Button>
                    </div>
                    {/*<div className={`${prefix}-footer`} >*/}
                    {/*    <img src={require('../../assets/imgs/banner_huimingo@3x.png')} className={`${prefix}-footer-png`} alt=""/>*/}
                    {/*</div>*/}
                </div>
                {/*{*/}
                {/*    visitorStatus&&visitorStatus ==1?*/}
                {/*        <div>*/}
                {/*            <div className={`${prefix}-footer flex1`}>*/}
                {/*                <Button type='primary' onClick={this.goHomePage.bind(this)} className={`${prefix}-footer-btn`}>确定</Button>*/}
                {/*            </div>*/}
                {/*            <div className={`${prefix}-footer`} >*/}
                {/*                <img src={require('../../assets/imgs/banner_huimingo@3x.png')} className={`${prefix}-footer-png`} alt=""/>*/}
                {/*            </div>*/}
                {/*        </div>:<div className={`${prefix}-footer`} >*/}
                {/*            <img src={require('../../assets/imgs/banner_huimingo@3x.png')} className={`${prefix}-footer-png`} alt=""/>*/}
                {/*        </div>*/}
                {/*}*/}
                {/*<div className={`${prefix}-footer flex1`}>*/}
                {/*    <Button type='primary' onClick={this.goHomePage.bind(this)} className={`${prefix}-footer-btn`}>确定</Button>*/}
                {/*</div>*/}
                {/*<div className={`${prefix}-footer`} >*/}
                {/*    <img src={require('../../assets/imgs/banner_huimingo@3x.png')} className={`${prefix}-footer-png`} alt=""/>*/}
                {/*</div>*/}


            </div>
        )
    }
}
// inject 将store注入到当Test组件的props中
export default inject('store')(
    observer(Index)
)
