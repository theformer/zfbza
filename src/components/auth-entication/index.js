import React, {Component} from 'react'
import {inject, observer} from 'mobx-react'
import {Toast, Picker, List, Button,} from 'antd-mobile'
import './index.scss'
import {
    back,
    getUrlValue,
    jump,
    pxTovw,
    setTitle,
    validIdCard,
    setStorage,
    getStorage,
    validPhone
} from '../../utlis/utlis'
import area from '../../assets/data/area3'
import http from '../../utlis/http'

const prefix = 'auth-entication'
Toast.config({
    mask: false
})
const nationList = area

class Index extends Component {
    constructor(props) {
        super(props)
        this.store = this.props.store.testStore
    }

    state = {
        flag: false,     //用来判断按钮是否置灰
        name: '',
        idCard: '',
        phone: '',
        code: '',
        count: 60,
        liked: true,
        values: ['汉族'],
        inputStatus: true
    }
    componentWillMount(){

    }
   async componentDidMount() {
        // 修改mobx中存储的值
        // this.store.name = 'name'
        setTitle.call(this, '身份认证')
        let that = this
        window.my.postMessage({'sendToMiniProgram': '0'});
        window.my.onMessage = async function (e) {
            await setStorage('complexCode', e.complexCode)
            await setStorage('zfbUserId', e.zfbUserId)
            await setStorage('goVisitorInfo', e.goVisitorInfo)
            if (e.isCertified=='T') {
                await that.setState({
                    phone: e.tel,
                    name: e.username,
                    idCard: e.certNo,
                    inputStatus:true
                })
            }
            if (e.houseId) {
                await setStorage('houseId', e.houseId)
                await setStorage('buildingCode', e.buildingCode)
                await setStorage('complexName', e.complexName)
                await setStorage('unitCode', e.unitCode)
                await setStorage('uuidCode', e.uuidCode)
                await setStorage('visitorName', e.visitorName)

            }
            if (e.visitorStatus) {
                await setStorage('visitorStatus', e.visitorStatus)
            }
        }
        //支付宝userid
    }

    //点击倒计时
    handleClick() {
        const {liked,phone} = this.state
        if(!phone){
            Toast('请输入手机号')
        }
        if (!liked) {
            return
        }
        this.countDown()
        this.messageSend()
    }

    async messageSend() {

        let zfbUserId
        await getStorage('zfbUserId', res => {
            zfbUserId = res
        })
        if(this.state.phone.indexOf('*')==-1){
            let data={
                tel: this.state.phone,
            }
             http.post({
                    url: "/api/message/send",
                    data,
                }).then((res) => {
                   if(res.data.code ==1){
                       Toast.info('短信发送成功')
                   }else{
                       Toast.info(res.data.message)
                   }
                })
        }else{
            http.post({
                url: '/test/zlb/message/send',
                data: {
                    zlbUserId: zfbUserId
                }
            }).then(res => {
                if (res.data.code == 1) {
                    Toast.info('短信发送成功')
                }else{
                    Toast.info(res.data.message)
                }
            })
        }

    }

    countDown() {
        const {count} = this.state
        if (count == 1) {
            this.setState({
                count: 60,
                liked: true
            })
        } else {
            this.setState({
                count: count - 1,
                liked: false
            })
            setTimeout(this.countDown.bind(this), 1000);

        }
    }

    //身份证验证
    blurIdCard() {
        if (!validIdCard(this.state.idCard)) {
            Toast.fail("身份证号验证失败");
            return;
        }

    }

    //获取姓名
    onChangeName(e) {
        e.persist()
        this.setState({
            name: e.target.value
        })
    }

    //获取身份证号
    onChangeIdCard = (e) => {
        e.persist()
        this.setState({
            idCard: e.target.value
        })
    }
    deteltPhone = (e) =>{
        e.persist()
        if(window.event.keyCode==8){
            this.setState({
                phone: ''
            })
        }
    }
    onChangePhone = (e) => {
        e.persist()
        this.setState({
            phone: e.target.value
        })
    }

    onClickThis(val) {
    }

    toIndex() {
        // 跳转
        jump.call(this, '/index')
    }

    goBack() {
        // 返回
        back.call(this)
    }

    //确定进入选择拍照人脸
    async saveClickBtn() {
        let passWayVal
        await getStorage('passWayVal',res=>{
            passWayVal = res
        })
        if (this.state.name && this.state.idCard) {
            let zfbUserId
            await getStorage('zfbUserId', res => {
                zfbUserId = res
            })
            let data = {
                tel: this.state.phone,
                code: this.state.code,
            };

            if(this.state.phone.indexOf('*')==-1){
                 http
                    .post({
                        url: "/api/message/valid",
                        data,
                    })
                    .then(async (res) => {
                        if(res.data.code ==1){
                            await setStorage('nation', this.state.values[0])
                            await setStorage('userName', this.state.name)
                            await setStorage('tel', this.state.phone)
                            await setStorage('certificateType', '身份证')
                            await setStorage('certificateId', this.state.idCard)
                            await jump.call(this, '/pass-way')
                        }else{
                            Toast.info(res.data.message)
                        }
                    })
            }else{
                http.post({
                    url: '/test/zlb/message/valid',
                    data: {
                        zlbUserId:zfbUserId,
                        code: this.state.code
                    }
                }).then(res => {
                    if (res.data.code == 1) {
                        setStorage('nation', this.state.values[0])
                        setStorage('userName', this.state.name)
                        setStorage('tel', this.state.phone)
                        setStorage('certificateType', '身份证')
                        setStorage('certificateId', this.state.idCard)
                        // if(passWayVal!=2){
                        //     window.my.navigateTo({url: '../face-login/face-login?zfbUserId='+zfbUserId+'&passWayVal='+passWayVal})
                        // }else{
                            jump.call(this, '/pass-way')
                        // }
                    }else{
                        Toast.info(res.data.message)
                    }
                })
            }
        }
    }

    onPickerChange = (v) => {
        this.setState({
            values: v
        })
    }

    goPrivacy() {
        window.location.href = 'https://h5.yiyun-smart.com/privacy/zazs_privacy.html'
    }

    goUserInfo() {
        jump.call(this, '/coordinate-info')
    }

    //获取短信验证码的值
    onChangeCode(e) {
        e.persist()
        this.setState({
            code: e.target.value
        })
    }

    //验证码脱焦验证
    blurCodeClick() {
        // if (!validPhone(this.state.phone)) {
        //     Toast.fail("手机号验证失败");
        //     return;
        // }
    }


    render() {
        const {inputStatus} = this.state
        return (
            <div className={`${prefix} flex flex-column`}>
                <div className={`${prefix}-main`}>
                    <div className={`${prefix}-main-head`}>
                        身份认证
                    </div>
                    <div className={`${prefix}-main-form`}>
                        <div className={`${prefix}-form-name login-card`}>
                            <div className={'login-idCard margin-bottom14'}>住户姓名</div>
                            <input type="text"
                                   placeholder='请输入证件上的姓名'
                                   value={this.state.name}
                                   readOnly="readonly"
                                   onChange={this.onChangeName.bind(this)}
                                   className={`${prefix}-form-name-ipt ipt-none name-card`}
                            />


                        </div>
                        <div className={`${prefix}-form-idCard login-card`}>
                            <div className={'login-idCard margin-bottom14'}>身份证号码</div>

                                 <input type="text"
                                                    placeholder='请输入身份证号码，其他证件前往物业处登记'
                                                    value={this.state.idCard}
                                                    readonly="readonly"
                                                    onChange={this.onChangeIdCard.bind(this)}
                                                    className={`${prefix}-form-name-ipt ipt-none name-card`}
                                />


                        </div>
                        <div className={`${prefix}-form-nation login-idCard`}>
                            <div className={'login-idCard'}>民族</div>
                            <Picker
                                cols={1}
                                data={nationList}
                                value={this.state.values}
                                onOk={(v) => {
                                    this.onPickerChange(v)
                                }}>
                                <List.Item arrow="horizontal"
                                           onClick={this.onClickThis.bind(this)}>{this.state.values[0] || '请选择民族'}</List.Item>
                            </Picker>
                        </div>
                        <div className={`${prefix}-form-phone login-card`}>
                            <div className={'login-idCard margin-bottom14'}>联系电话</div>
                            <div className={'flex align-center flex-center'}>
                                <label className={'phone86'}>+86</label>
                                 <input
                                        placeholder='请填写手机号'
                                        value={this.state.phone}
                                        className={`${prefix}-form-name-ipt ipt-none name-card padding-left32`}
                                        onKeyUp={this.deteltPhone.bind(this)}
                                        onChange={this.onChangePhone.bind(this)}/>
                            </div>
                        </div>
                        <div className={`${prefix}-form-code login-card`}>
                            <div className={'login-idCard margin-bottom14'}>短信验证码</div>
                            <div className={`${prefix}-form-footer`}>
                                <input type="tel"
                                       maxLength="4"
                                       minLength="0"
                                       value={this.state.code}
                                       onChange={this.onChangeCode.bind(this)}
                                       onBlur={this.blurCodeClick.bind(this)}         //脱焦
                                       placeholder='请填写短信验证码'
                                       className={`${prefix}-form-name-ipt ipt-none code-input btn-code`}/>

                                {
                                    (() => {

                                        if (this.state.liked) {
                                            return <Button
                                                className={`${prefix}-form-name-ipt ipt-none auth-code give-code`}
                                                onClick={this.handleClick.bind(this)}
                                            >获取验证码</Button>
                                        }
                                        return <Button
                                            disabled
                                            className={`${prefix}-form-name-ipt ipt-none auth-code retry`}
                                        >{`${this.state.count} 秒后重发`}</Button>
                                    })()
                                }
                            </div>
                        </div>
                    </div>
                </div>

                <div className={`${prefix}-footer flex1`}>
                    <div>
                        <Button type="primary" onClick={this.saveClickBtn.bind(this)}
                                className={`${prefix}-footer-saveBtn`}>确认</Button>
                    </div>
                    <div className={`${prefix}-footer-text`}>
                        {/*<div className={`${prefix}-footer-privacy size28`} onClick={this.goPrivacy.bind(this)}>隐私政策</div>*/}
                        <div className={`${prefix}-footer-user size28`} onClick={this.goUserInfo.bind(this)}>用户政策</div>
                    </div>
                </div>
            </div>
        )
    }
}

// inject 将store注入到当Test组件的props中
export default inject('store')(
    observer(Index)
)
