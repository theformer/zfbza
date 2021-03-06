/* eslint-disable no-console */
/* eslint-disable no-debugger */
// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Toast, Button, WhiteSpace, List, WingBlank, } from 'antd-mobile'
import Modal from "../../common/dialog-phone";    //弹框组件title为短信验证，footer为取消和确定俩个按钮
import './index.scss'
import { back, jump, setTitle, backTo,getStorage,setStorage } from '../../utlis/utlis'
import http from '../../utlis/http'
import { Control } from "react-keeper";
import { pxTovw } from '../../utlis/utlis'

const prefix = 'personal-information'
Toast.config({
    mask: false
})
// window.addEventListener('popstate', function (event) {
//     console.log('我走进来了吗，不会吧不会吧')
//     // 跳转
//     jump.call(this, '/home-page')
// }, false);
class Index extends Component {
    constructor(props) {
        super(props)
        this.store = this.props.store.testStore
    }
    state = {
        modalVisible: false,
        quit: true,
        userInfo: {
            imageUrl: ""
        }
    }
    componentWillMount () {
        window.goHomePage= true
    }
    componentWillUnmount() {
        window.goHomePage = false
    }
    componentDidMount() {
        // 修mobx中存储的值
        setTitle.call(this, '个人信息')
        this.getUserInfo()
    }
    //用我们自己的id查询
    async getUserInfo() {
        let zjuserid
        await  getStorage('zjuserid',res=>{
            zjuserid =  res
        })
        http.get({
            url: `/test/zlb/user/id?userId=${zjuserid}`,

        }).then(res => {
            if (res.data.code == 1) {
                this.setState({
                    userInfo: res.data.data
                })
            }
        })
    }
    toIndex() {
        // 跳转
        jump.call(this, '/index')
    }
    goBack() {
        // 返回
        back.call(this)
    }
    loginOut() {
        this.setState({
            modalVisible: true
        })
    }
    goLogout() {
        jump.call(this, '/logout')
    }
   async saveLogin() {
        let userid
       await getStorage('zjuserid',res=>{
           userid =  res
        })

        Toast.loading()
        http.post({
            url: '/api/user/logout',
            data: {
                userId: userid
            }
        }).then(res => {
            Toast.hide()
            if (res.data.code == 1) {
                Toast.info(res.data.message)
                window.my.clearStorage();
                setStorage('passWayVal', '')
                window.my.removeStorage({
                    key: 'zfbUserId',
                    success: function(){
                        window.my.navigateTo({url:'../index/index/'})    //跳转到重新登记页面
                    }
                });//清空内嵌H5所有缓存数据

            }else{

            }
        })
    }
    //跳转到通行方式
   async goPassWayClick() {
        await setStorage('passWayVal', 1)
       // window.my.navigateTo({url: '../face-login/face-login?zfbUserId='+zfbUserId+'&passWayVal=1'})

       jump.call(this, '/pass-way')
    }
    //跳转到更改手机号
    goContactNumber() {
        jump.call(this, '/contact-number')
    }
    // 跳转常见问题
    goCommonProblem() {
        jump.call(this, '/common-problem')
    }
    // 跳转隐私协议
    goCoordinateInfo() {
        jump.call(this, '/coordinate-info')
    }

    render() {
        // 从mobx中拿所需属性
        const { name } = this.store
        const { userInfo } = this.state
        return (
            <div className={`${prefix}`}>
                <div className={`${prefix}-bg`}>
                    <div className={`${prefix}-header`}>
                        <div className={`img-box hiden-box shuiyin`} style={{backgroundImage:`url(${userInfo.imageUrl})`}}>
                            <img className={`${prefix}-card-jay`} src={require('./../../assets/imgs/sy.png')}  alt=""/>
                                {/*<div className={`${prefix}-header-photo shuiyin`} style={{backgroundImage:`url(${userInfo.imageUrl})`}}>*/}
                                {/*  */}
                                {/*</div>*/}

                        </div>
                        <div className={`${prefix}-card-name`}>
                            <span className={`${prefix}-card-name-text`}>{userInfo.userName}</span>
                            <span className={`${prefix}-card-name-idcard`}>{userInfo.certificateId}</span>
                        </div>
                    </div>
                    <div className={`${prefix}-card`}>
                        <span className={`${prefix}-card-left`}>联系电话</span>
                        <div className={`${prefix}-card-right`}>
                            <span className={`${prefix}-card-text`}>{userInfo.tel}</span>
                            {/*<img className={`${prefix}-card-img`} src={require('./../../assets/imgs/common/next@2x.png')} alt="" />*/}
                        </div>
                    </div>
                    <div className={`${prefix}-line`}></div>
                    <div className={`${prefix}-card`} onClick={this.goPassWayClick.bind(this)}>
                        <span className={`${prefix}-card-left`}>通行方式</span>
                        <div className={`${prefix}-card-right`}>
                            <span className={`${prefix}-card-amend`}>修改</span>
                            <img className={`${prefix}-card-img`} src={require('./../../assets/imgs/common/next@2x.png')} alt="" />
                        </div>
                    </div>
                    <div className={`${prefix}-card`} onClick={this.goCommonProblem.bind(this)} style={{ marginTop: pxTovw(8) }}>
                        <span className={`${prefix}-card-left`}>常见问题</span>
                        <div className={`${prefix}-card-right`}>
                            <img className={`${prefix}-card-img`} src={require('./../../assets/imgs/common/next@2x.png')} alt="" />
                        </div>
                    </div>
                    <div className={`${prefix}-card`} onClick={this.goCoordinateInfo.bind(this)} style={{ marginTop: pxTovw(8) }}>
                        <span className={`${prefix}-card-left`}>隐私政策</span>
                        <div className={`${prefix}-card-right`}>
                            <img className={`${prefix}-card-img`} src={require('./../../assets/imgs/common/next@2x.png')} alt="" />
                        </div>
                    </div>


                </div>
                {/*<div  className={`${prefix}-bg-color`}></div>*/}
                {/*<div className={`${prefix}-card`} onClick={this.goPrivacyPageClick.bind(this)}>*/}
                {/*    <span className={`${prefix}-card-left`}>隐私政策</span>*/}
                {/*    <div className={`${prefix}-card-right`}>*/}
                {/*        <img className={`${prefix}-card-img`} src={require('./../../assets/imgs/common/next@2x.png')} alt=""/>*/}
                {/*    </div>*/}
                {/*</div>*/}
                <div className={`${prefix}-bg-color`}></div>

                <div className={`${prefix}-footer flex1`}>
                    {/*<Button  className={`${prefix}-btn`} onClick={this.loginOut.bind(this)}>注销</Button>*/}
                    <input type="button" className={`${prefix}-btn`} onClick={this.loginOut.bind(this)} value="注销" />
                    <span className={`${prefix}-info`}>申请注销即代表已阅读并同意
                        <span className={`${prefix}-info-user`} onClick={this.goLogout.bind(this)}>《账号注销协议》</span>
                    </span>
                </div>
                <Modal
                    visible={this.state.modalVisible} quit={this.state.quit} onCancel={this.saveLogin.bind(this)}
                    onConfirm={() => { this.setState({ modalVisible: false }) }}
                >
                    <div className={'children'}>
                        <div className={'children-title'}>账户注销</div>
                        <div className={'children-text'}>您发起注销流程，且已阅读同意
                        <span className={'children-quit'} onClick={this.goLogout.bind(this)}>《账号注销协议》</span>，是否确认注销？</div>
                    </div>

                </Modal>
            </div>
        )
    }
}
// inject 将store注入到当Test组件的props中
export default inject('store')(
    observer(Index)
)
