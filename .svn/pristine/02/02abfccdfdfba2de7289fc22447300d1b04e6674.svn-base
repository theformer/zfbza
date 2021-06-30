/* eslint-disable no-console */
/* eslint-disable no-debugger */
// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Toast,Button,WhiteSpace,List, InputItem } from 'antd-mobile'
import './index.scss'
import { back, jump,setStorage,getStorage } from '../../utlis/utlis'
import http from '../../utlis/http'

const prefix = 'contact-number'

Toast.config({
    mask: false
})
class Index extends Component {
    constructor(props) {
        super(props)
    }
    state={
        code:'',
        count:60,
        liked:true,
        flag:false,
        phone:''
    }
    componentDidMount() {
        // 修改mobx中存储的值
    }
    //点击倒计时
    handleClick(){
        const {liked} = this.state
        if(!liked){
            return
        }
        this.messageSend()
    }
    async messageSend(){
        let photo = this.state.phone
        photo = this.state.phone.replace(' ','')
        if(photo.indexOf(' ')>0){
            photo = photo.replace(' ','')
        }

        if (!(/^1[34578]\d{9}$/.test(photo))) {
            Toast.info('请输入正确的手机号')
            return null
        }
        this.countDown()
        let userInfo
       await getStorage('userInfo',res=>{
            userInfo =  res
        })
        if(userInfo){
            userInfo = JSON.parse(userInfo)
        }
        http.post({
            url: '/api/zlb/message/send',
            data: {
                zlbUserId:userInfo.userid
            }
        }).then(res=>{
            if(res.data.code==1){
                Toast.info('短信已发送')
            }
        })
    }
    countDown(){
        const {count} = this.state
        if(count ===1){
            this.setState({
                count:60,
                liked:true
            })
        }else{
            this.setState({
                count:count-1,
                liked:false
            })
            setTimeout(this.countDown.bind(this), 1000);

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
    //验证码脱焦验证
    async blurCodeClick(){
        let userInfo
       await getStorage('userInfo',res=>{
           userInfo = res
        })
        if(userInfo){
            userInfo = JSON.parse(userInfo)
        }
        Toast.loading()
        http.post({
            url: '/api/zlb/message/valid',
            data: {
                zlbUserId:userInfo.userid,
                code:this.state.code
            }
        }).then(res=>{
            Toast.hide()
            if(res.data.code ==1){
                this.setState({
                    flag:true
                })
            }else{
                this.setState({
                    flag:false
                })
                // Toast.info(res.data.message)
            }
        })
    }

    //保存修改的手机号
   async saveClickBtn(){
        Toast.loading()
        let id
       await getStorage('zjuserid',res=>{
           id =  res
        })
        http.post({
            url: '/api/zlb/message/valid',
            data: {
                id:id,
                tel:this.state.phone
            }
        }).then(res=>{
            Toast.hide()
            if(res.data.code==1){
                jump.call(this, '/personal-information')
            }
        })


    }
    changePhone(val){
        console.log(val)
        this.setState({
            phone:val
        })
    }
    //获取短信验证码的值
    onChangeCode(e){
        e.persist()
        this.setState({
            code:e.target.value
        })
    }
    render() {
        // 从mobx中拿所需属性
        return (
            <div className={`${prefix} flex flex-column`}>
                <div className={`${prefix}-bg`}></div>
                <div className={`${prefix}-form`}>
                    <List>
                        <InputItem
                            className={`${prefix}-form-phone`}
                            clear
                            placeholder="186 1234 1234"
                            type="phone"
                            value={this.state.phone}
                            onChange={this.changePhone.bind(this)}
                            ref={el => this.autoFocusInst = el}
                        ></InputItem>
                        <List.Item>
                            <div
                                style={{ width: '100%', color: '#108ee9', textAlign: 'center' }}
                            >
                            </div>
                        </List.Item>
                        <div className={`${prefix}-form-line`}></div>
                        <div className={`${prefix}-form-code login-cards`}>
                            <div className={`${prefix}-form-footer`}>
                                <input type="text"
                                       value={this.state.code}
                                       onBlur={this.blurCodeClick.bind(this)}         //脱焦
                                       onChange={this.onChangeCode.bind(this)}
                                       placeholder='请填写短信验证码'
                                       className={`${prefix}-form-name-ipt ipt-none code-input`}/>
                                {
                                    (() => {

                                        if (this.state.liked) {
                                            return  <Button
                                                className={`${prefix}-form-name-ipt ipt-none auth-code`}
                                                onClick={this.handleClick.bind(this)}
                                            >获取验证码</Button>
                                        }
                                        return  <Button
                                            disabled
                                            className={`${prefix}-form-name-ipt ipt-none auth-code retry`}
                                        >{ `${this.state.count} 秒后重发`}</Button>
                                    })()
                                }
                            </div>
                        </div>
                    </List>
                </div>
                <div className={`${prefix}-main flex1`}></div>
                <div className={`${prefix}-footer`}>
                    {
                        (() => {
                            if (this.state.flag) {
                                return     <Button type="primary" onClick={this.saveClickBtn.bind(this)} className={`${prefix}-footer-btn`}>保存</Button>
                            }
                            return     <Button type="primary" disabled className={`${prefix}-footer-btn`}>保存</Button>
                        })()
                    }
                </div>
            </div>
        )
    }
}
// inject 将store注入到当Test组件的props中
export default inject('store')(
    observer(Index)
)
