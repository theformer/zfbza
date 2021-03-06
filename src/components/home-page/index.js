/* eslint-disable no-console */
/* eslint-disable no-debugger */
// eslint-disable-next-line no-unused-vars
import React, {Component} from 'react'
import {inject, observer} from 'mobx-react'
import {Toast, Carousel} from 'antd-mobile'
import './index.scss'
import {back, getUrlParam, jump, setTitle, getStorage, setStorage} from '../../utlis/utlis'
import http from '../../utlis/http'
import QRCode from 'qrcodejs2'


const prefix = 'home-page'
Toast.config({
    mask: false
})

/**
 * @description 生成二维码时所用code与对应的类型关联对象
 * @property enterprise 商家
 * @property product 普通产品
 * @property service 公共服务
 * @property coupon 折扣现金券
 * @property redcoupon 红包现金券
 */
let rootSize = parseFloat(document.documentElement.style.fontSize)

class Index extends Component {
    constructor(props) {
        super(props)
        this.store = this.props.store.testStore
        this.commonStore = this.props.store.commonStore
        this.state = {
            tabs: [
                {title: '健康码', sub: '0'},
                {title: '可信身份码', sub: '1'},
            ],
            codeLoading: false,
            codeType: '#000',
            codeType1: '#000',
            data: ['1', '2', '3'],
            slideIndex: 0,
            imgHeight: 176,
            coupon: null,
            urlList: [],
            messageList: [],
            userInfo: {},
            pageSize: 1,
            pageNum: 20,
            codeImg: '',
            codeImg1: '',
            healthyName: '', //传到温州健康码页面的名字
            userId: '',
            complexName: '',
            complexCode: '',
            unLoginDia: false,           //用户弹框
            agreementText: false,        //进入页面，温馨提示弹框
            agreementDia: false,         //该账户是否同意
            invite: false,               //邀请
        }
    }

    componentWillMount() {
        window.poph5 = true
        setStorage('passWayVal', '')
    }
    componentWillUnmount() {
        window.poph5 = false
    }

    async componentDidMount() {
        setTitle.call(this, '温州智安小区')
        let that = this
        //用户注册完后进入首页
        let zfbUserId, complexCode
        await getStorage('zfbUserId', res => {
            zfbUserId = res
        })
        await getStorage('complexCode', res => {
            complexCode = res
        })
        if (zfbUserId&&zfbUserId!='undefined'&&zfbUserId!=undefined&&zfbUserId!=null) {
            //查询隐私政策是否已读
            this.setState({
                zfbUserId: zfbUserId,
                complexCode: complexCode
            }, () => {
                that.getUserInfo()
            })
        }else{
            window.my.postMessage({name:"测试web-view"});
            window.my.onMessage = async function (e) {
                await setStorage('complexCode',e.complexCode)
                await setStorage('zfbUserId',e.zfbUserId)
            }
            //查看是否从小程序直接点击登记入住进入首页

            let zfbUserId,complexCode
           await getStorage('complexCode',res=>{
                complexCode = res
            })
           await getStorage('zfbUserId',res=>{
                zfbUserId = res
            })
            if(zfbUserId){        //判断是否有值
                that.setState({
                    zfbUserId: zfbUserId,
                    complexCode: complexCode
                }, () => {
                    that.getUserInfo()
                })
            }
        }

    }
    //获取轮播图
    swiper() {
        http.post({
            url: '/test/sys/news/query/lb',
        }).then( res => {
            if (res.data.code != 1) return
            this.setState({
                urlList: res.data.data || []
            })
        })
    }
    //获取用户信息
    async getUserInfo() {
        Toast.loading('正在加载中...',null,null,true)
        let userInfo
        await getStorage('userInfo', res => {
            userInfo = res
        })
        if (userInfo) {
            userInfo = JSON.parse(userInfo)
        }
        let zfbUserId
        await getStorage('zfbUserId', res => {
            zfbUserId = res
        })
        http.get({
            url: `/test/user/info/get?openId=${zfbUserId}`,
        }).then(res => {
            if (res.data.code == 1) {
                Toast.hide()
                if(res.data.data.isRead==0&&zfbUserId!='undefined'){
                    this.setState({
                        agreementDia:true
                    })
                }
                if (res.data.data.id != null) {
                    window.my.postMessage(
                        {
                            visitorName: res.data.data.userName,
                        });
                    setStorage('zjuserid', res.data.data.id)
                    setStorage('photoImg', res.data.data.imageUrl)
                    setStorage('nation', res.data.data.nation)
                    setStorage('userInfo', JSON.stringify({
                        username: res.data.data.userName,
                        mobile: res.data.data.tel,
                        sex: res.data.data.sex,
                        certificateId: res.data.data.certificateId,
                        createdate: res.data.data.createdate,
                        userid: res.data.data.id,
                        certificateType: '身份证',
                    }))
                    this.setState({
                        userInfo: res.data.data,
                        unlogin: 'true',
                    }, async () => {
                       await this.getMessageList() //获取所有消息
                       await this.swiper()
                       await this.getUserComplexList()
                       await this.findHouse()
                    })
                } else {
                    this.setState({
                        unlogin: 'false',
                    })
                }
            } else {
                Toast.hide()
            }
        }).catch(err=>{
            Toast.hide()
        })
    }


    async findHouse() {
        let complexCode,userId
        await getStorage('complexCode', res => {
            complexCode = res
        })
        await getStorage('zjuserid', res => {
            userId = res
        })
        http.get({
            url: '/test/house/findHouse?complexCode=' + complexCode + '&userId=' + userId,
        }).then(async res => {
            if (res.data.code == 1 && res.data.data.length > 0) {
                await this.setState({
                    invite: true,
                })
                window.my.postMessage({
                    houseId: res.data.data[0].id,
                    buildingCode: res.data.data[0].buildingCode,
                    unitCode: res.data.data[0].unitCode,
                    complexCode: res.data.data[0].complexCode,
                    complexName: res.data.data[0].complexName,
                });
            }
        })
    }

    async getMessageList() {
        let complexCode
        await getStorage('complexCode', res => {
            complexCode = res
        })
        http.get({
            url: '/test/news/list?complexCode=' + complexCode + '&userId=' + this.state.userInfo.id,
        }).then(res => {
            if (res.data.code == 1) {
                this.setState({
                    messageList: res.data.data.array
                })
            }
        })
    }

    async getUserComplexList() {
        let zjuserid
        await getStorage('zjuserid', res => {
            zjuserid = res
        })
        http.get({
            url: `/test/myComplex/info?userId=${zjuserid}`,
        }).then(res => {
            if (res.data.code == 1) {
                if (res.data.data.length > 0) {
                    let data = res.data.data
                    let item = data.filter((e, i) => {
                        if (e.isPresent == 1) {
                            return e
                        }
                    })
                    if (item.length > 0) {
                        this.setState({
                            complexName: item[0].complexName,
                            complexCode: item[0].complexCode
                        }, () => {
                            setStorage('complexName', this.state.complexName)
                            setStorage('complexCode', this.state.complexCode)
                        })
                    } else {
                        this.checkHousing(data[0].complexName, data[0].complexCode)
                    }
                }
            }
        })
    }

    async checkHousing(a, b) {
        let userId
        await getStorage('zjuserid', res => {
            userId = res
        })
        let data = {
            userId: userId,
            complexName: a,              //a为小区名字 b为小区code
            complexCode: b,
        }
        http.post({
            url: '/api/user/update/present/complex',
            data
        }).then(res => {
            const {code, message} = res.data
            if (code !== '1') {
                return
            }
            setStorage('complexCode', a)
            setStorage('complexName', b)
            this.setState({
                complexName: a,
                complexCode: b
            })

        }).catch(err => {
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

    //跳转至个人中心
    goPersonalInformation() {
        // this.isLogin()
        if (this.state.unlogin == 'true') {
            jump.call(this, '/personal-information')
        } else {
            this.setState({
                unLoginDia: true
            })
        }
    }

    //跳转至信息宣传页面
    goCarousel() {
        if (this.state.unlogin == 'true') {
            jump.call(this, '/conduct')
        } else {
            this.setState({
                unLoginDia: true
            })
        }
    }

    //跳转我的e家
    goEhome() {
        if (this.state.unlogin == 'true') {
            setStorage('goVisitorInfo','4')
            jump.call(this, '/e-home')
        } else {
            this.setState({
                unLoginDia: true
            })
        }
    }

    goMyhousing() {
        if (this.state.unlogin == 'true') {
            setStorage('goVisitorInfo','4')
            jump.call(this, '/myhousing')

        } else {
            this.setState({
                unLoginDia: true
            })
        }
    }

    goMyhouse() {
        if (this.state.unlogin == 'true') {
            setStorage('goVisitorInfo','4')
            jump.call(this, '/myhouse?flag=1')
        } else {
            this.setState({
                unLoginDia: true
            })
        }

    }

    goMycar() {
        if (this.state.unlogin == 'true') {
            jump.call(this, '/mycar')
        } else {
            this.setState({
                unLoginDia: true
            })
        }
    }

    //跳转到消息列表
    goMessageList() {
        if (this.state.unlogin == 'true') {
            jump.call(this, '/message-list')
        } else {
            this.setState({
                unLoginDia: true
            })
        }
    }

    //跳转至信息宣传页面
    goConduct() {
        // if (this.state.unlogin == 'true') {
        //     jump.call(this, '/conduct')
        // } else {
        //     this.setState({
        //         unLoginDia: true
        //     })
        // }
    }

     goCarouselDetail() {
         // if (this.state.unlogin == 'true') {
         //     // jump.call(this, '/message-list')
         // } else {
         //     this.setState({
         //         unLoginDia: true
         //     })
         // }
        let code = 8
        if (this.state.unlogin == 'true') {
            window.my.postMessage(
                {
                    code: code
                });
        } else {
            this.setState({
                unLoginDia: true
            })
        }
    }

    goWenzhouhealthy() {
        if (this.state.unlogin == 'true') {
            setStorage('QRCode', this.state.QRCode)
            setStorage('codeType', this.state.codeType)
            setStorage('healthyName', this.state.healthyName)
            jump.call(this, '/wenzhou-healthy')
        } else {
            this.setState({
                unLoginDia: true
            })
        }
    }

    //跳转至隐私协议
    goPrivacyClick() {
        jump.call(this, "/privacy-page");
    }

    //查看协议
    agreementClick() {
        this.setState({
            agreementDia: false,
            agreementText: true,
        });
    }

    //同意协议
    consentClick() {
        http.post({
            url: '/test/user/protocol/read',
            data: {
                wxOpenId: this.state.zfbUserId,
                isRead: '1'
            }
        }).then(res => {
            this.setState({
                agreementText: false,
                agreementDia: false
            });
        })

    }

    //不同意协议
    unConsentClick() {
        this.setState({
            agreementText: false
        })
        window.AlipayJSBridge.call('exitApp');
    }

    //未登记账号的情况下，进行二维码扫码认真
    saveClick() {
        let token
        window.ap.scan({
            success: async res => {
                if (res.code.indexOf('complexid') > -1) {
                    let complexCode = getUrlParam(res.code, 'complexid')
                    let visitor = getUrlParam(res.code, 'visitor')
                    await setStorage('complexCode', complexCode)
                    await getStorage('token',res=>{
                        token  = res
                    })
                    if (complexCode) {
                        if(visitor&&(visitor==1&&visitor!=undefined&&visitor!='undefined'&&visitor!=''&&visitor!=null)){
                            this.setState({
                                unLoginDia: false,
                            });
                            window.my.navigateTo({url: '../login/index?complexid=' + complexCode+'&visitor='+visitor+'&token='+token})
                        }else{
                            window.my.navigateTo({url: '../login/index?complexid=' + complexCode+'&token='+token})
                        }
                    } else {
                        Toast.info('请扫描正确的二维码')
                    }

                } else {
                    Toast.info('请扫描小区码')
                }
                },
            fail: err => {
                this.setState({
                    unLoginDia: false
                })
            }
        })

    }

    uuid() {
        var s = [];
        var hexDigits = "0123456789abcdef";
        for (var i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23] = "-";

        var uuid = s.join("");
        return uuid
    }
   async findVisitorStatus(){
        let complexCode
        await getStorage('complexCode', res => {
            complexCode = res
        })
        http.get({
            url:
                "/test/visitor/findVisitorStatus?complexCode=" +
                complexCode
        }).then(async (res) => {
            if(res.data.code == 1){
                let uuidCode = this.uuid()
              await  this.saveRegisterId(uuidCode)
              await  window.my.postMessage(
                    {
                        uuidCode: uuidCode
                    });
                window.my.startShare();
            }else{
                Toast.info('该小区访客功能未开启')
            }
        })
    }
    async myShare() {
        if(this.state.unlogin == 'true'){
            if(this.state.invite){
                this.findVisitorStatus()
            }else{
                return
                // jump.call(this, "/choose-building");
            }
        }else{
            this.setState({
                unLoginDia: true
            })
        }

        //调用支付宝的h5分享，修改分享过后的参数在支付宝小程序中的index/index页面
    }
    //存储邀请链接的有效时间保存
    saveRegisterId(uuidCode){
        http.get({
            url:
                "/test/visitor/saveRegisterId?registerId=" +
                uuidCode
        }).then((res) => {
            if(res.data.code == 1){

            }else{

            }
        })
    }
    //切换二维码刷新
    changeTabs(e) {
    }
    // 生活服务
    goLivePage(code) {
        window.my.postMessage(
            {
                code: code
            });
    }

    render() {
        let {userInfo, messageList, unLoginDia, agreementDia, agreementText} = this.state
        // 从mobx中拿所需属性
        return (
            <React.Fragment>
                <div className={`${prefix}`}>
                    <div className={`${prefix}-header`}>
                        <div className={`${prefix}-header-left`} onClick={this.goMyhousing.bind(this)}>
                            <img className={`${prefix}-header-left-logo`}
                                 src={require('./../../assets/imgs/logins/Home_icon_logo_100d@3x.png')}/>
                            <span className={`${prefix}-header-left-community`}>{
                                (this.state.complexName != '') ? this.state.complexName + ' ' + '(当前)' : '请登记小区'}</span>
                        </div>
                        <div className={`${prefix}-header-right`} onClick={this.goPersonalInformation.bind(this)}>
                            <img className={`${prefix}-header-right-set`}
                                 src={require('./../../assets/imgs/homepage/setting@2x.png')}/>
                        </div>
                    </div>
                    <div>
                        <div className={`${prefix}-card`}>
                            <div className={`${prefix}-card-user`}>
                                <div className={`${prefix}-card-photo`}>
                                    {
                                        userInfo.imageUrl ?<div className={`${prefix}-card-photo shuiyin`} style={{backgroundImage:`url(${userInfo.imageUrl})`}}>
                                                <img className={`${prefix}-card-jay`} src={require('./../../assets/imgs/sy.png')}  alt=""/>
                                            </div> : <img className={`${prefix}-card-jay`}
                                                 src={require('./../../assets/imgs/homepage/house_icon_registered_d.png')}
                                                 alt=""/>
                                    }
                                    <div className={`${prefix}-card-name`}>
                                        <span className={`${prefix}-card-name-text`}>{userInfo.userName || '无数据'}</span>
                                        <span
                                            className={`${prefix}-card-name-idcard`}>{userInfo.certificateId || '无数据'}</span>
                                    </div>
                                </div>
                                <div className={`${prefix}-card-right`} onClick={this.goWenzhouhealthy.bind(this)}>
                                    {/* <span className={`${prefix}-card-right-personal`}>二维码</span> */}
                                    <img src={require('../../assets/imgs/homepage/code@2x.png')}/>
                                </div>
                            </div>
                            <div className={`${prefix}-card-icon`}>
                                <div className="card-icon-item" onClick={this.goMyhouse.bind(this)}>
                                    <img src={require('../../assets/imgs/homepage/my_house@2x.png')}/>
                                    <span>我的房屋</span>
                                </div>
                                <div className="card-icon-item" onClick={this.goMycar.bind(this)}>
                                    <img src={require('../../assets/imgs/homepage/my_car@2x.png')}/>
                                    <span>我的车辆</span>
                                </div>
                                <div className="card-icon-item" onClick={this.goEhome.bind(this)}>
                                    <img src={require('../../assets/imgs/homepage/my_e_family@2x.png')}/>
                                    <span>我的e家</span>
                                </div>
                                <button open-type="share" className="card-icon-item share-btn" plain="true"
                                        onClick={this.myShare.bind(this)}>
                                    <img src={require('../../assets/imgs/homepage/visitor_invitation@2x.png')}/>
                                    <span>访客邀请</span>
                                </button>
                            </div>
                        </div>
                        {/*轮播图插件*/}
                        <div className={`${prefix}-carousel`}>
                            <img className={`${prefix}-carousel-png`}
                                 src={require('./../../assets/imgs/homepage/notice@2x.png')} alt=""/>
                            <Carousel className="my-carousel"
                                      vertical        //垂直显示
                                      dots={false}    //是否显示面板指示点
                                      autoplay        //是否自动切换
                                      infinite        //是否循环播放
                            >
                                {
                                    messageList&&messageList.length > 0 ? messageList.map(e => {
                                        return <div className="v-item word-space-one"
                                                    onClick={this.goMessageList.bind(this)}>{' · ' + e.content}</div>
                                    }) : <div className="v-item" onClick={this.goMessageList.bind(this)}>暂无数据</div>
                                }
                            </Carousel>
                        </div>
                    </div>
                    {/*  信息宣传同事已写      */}
                    <div className={`${prefix}-main`}>
                        <div className={`${prefix}-main-head`}>
                            <span className={`${prefix}-main-head-title`}>信息宣传</span>
                            <div className={`${prefix}-main-head-right flex`} onClick={this.goConduct.bind(this)}>
                                {/*<span className={`${prefix}-head-right-more`}>更多</span>*/}
                                {/*<img className={'main-more'} src={require('./../../assets/imgs/next@2x.png')} alt=""/>*/}
                            </div>
                        </div>
                        <div className={'carousel-height'} onClick={this.goCarouselDetail.bind(this)}>
                            <img src={require('./../../assets/imgs/banner_01@2x.png')} className={'banner-bg'} alt=""/>
                        </div>
                    </div>
                    {/* 生活服务 */}
                    <div className={`${prefix}-box`}>
                        <div className={`${prefix}-box-title`}>
                            生活服务
                        </div>
                        <div className={`${prefix}-box-content`}>
                            <div className={`${prefix}-box-item`} onClick={this.goLivePage.bind(this, 1)}>
                                <img className={`${prefix}-box-item-png`}
                                     src={require('./../../assets/imgs/homepage/living_expenses@2x.png')} alt=""/>
                                <span className={`${prefix}-box-item-text`}>生活缴费</span>
                            </div>
                            <div className={`${prefix}-box-item`} onClick={this.goLivePage.bind(this, 2)}>
                                <img className={`${prefix}-box-item-png`}
                                     src={require('./../../assets/imgs/homepage/mobile_recharge@2x.png')} alt=""/>
                                <span className={`${prefix}-box-item-text`}>手机充值</span>
                            </div>
                            <div className={`${prefix}-box-item`} onClick={this.goLivePage.bind(this, 3)}>
                                <img className={`${prefix}-box-item-png`}
                                     src={require('./../../assets/imgs/homepage/drug_delivery@2x.png')} alt=""/>
                                <span className={`${prefix}-box-item-text`}>送药上门</span>
                            </div>
                            <div className={`${prefix}-box-item`} onClick={this.goLivePage.bind(this, 4)}>

                                <img className={`${prefix}-box-item-png`}
                                     src={require('./../../assets/imgs/homepage/appointment_vaccination@2x.png')}
                                     alt=""/>
                                <span className={`${prefix}-box-item-text`}>预约接种</span>
                            </div>
                            <div className={`${prefix}-box-item`} onClick={this.goLivePage.bind(this, 5)}>
                                <img className={`${prefix}-box-item-png`}
                                     src={require('./../../assets/imgs/homepage/car_wash@2x.png')} alt=""/>
                                <span className={`${prefix}-box-item-text`}>洗车服务</span>
                            </div>
                            <div className={`${prefix}-box-item`} onClick={this.goLivePage.bind(this, 6)}>
                                <img className={`${prefix}-box-item-png`}
                                     src={require('./../../assets/imgs/homepage/refuelling_discount@2x.png')} alt=""/>
                                <span className={`${prefix}-box-item-text`}>加油优惠</span>
                            </div>
                            <div className={`${prefix}-box-item`} onClick={this.goLivePage.bind(this, 7)}>
                                <img className={`${prefix}-box-item-png`}
                                     src={require('./../../assets/imgs/homepage/my_express@3x.png')} alt=""/>
                                <span className={`${prefix}-box-item-text`}>我的快递</span>
                            </div>
                            <div className={`${prefix}-box-item`}></div>
                        </div>
                    </div>
                    <div className={'release-fixed'}  onClick={this.goLivePage.bind(this, 9)}>
                        <img className={'release-png'} src={require('./../../assets/imgs/homepage/huimingo@3x.png')} alt=""/>
                    </div>
                </div>
                {
                    unLoginDia ? <div className={`agreement-diam`}>
                        <div className={`dia-matter policy`}>
                            <div className={`matter-tips`}>
                                <div className={`matter-title`}>小区尚未登记</div>
                            </div>
                            <div className={`matter-content`}>
                                请扫描小区二维码进行登记
                            </div>
                            <div className={`matter-consent`} onClick={this.saveClick.bind(this)}>确定</div>
                        </div>
                    </div> : <span></span>
                }
                {
                    agreementDia ? <div className={`agreement-dia`}>
                        <div className={`dia-matter`}>
                            <div className={`dia-head`}>您需要同意本隐私政策才能
                                继续使用温州智安小区助手
                            </div>
                            <div className={`dia-content`}>若您不同意本隐私政策，很遗憾我们将无法为您提供服务。</div>
                            <div className={`dia-footer flex`}>
                                <span className={`footer-left`}
                                      onClick={this.unConsentClick.bind(this)}>仍不同意</span>
                                <span className={`footer-right`} onClick={this.agreementClick.bind(this)}>查看协议</span>
                            </div>
                        </div>

                    </div> : <span></span>
                }
                {
                    agreementText ? <div className={`agreement-dia`}>
                        <div className={`dia-matter policy`}>
                            <div className={`matter-tips`}>
                                <div>温馨提示</div>
                            </div>
                            <div className={`matter-title`}>
                                感谢您信任并使用温州智安小区助手！
                                我们非常重视您的个人信息和隐私保护。为了更好地保障您的个人权益，在使用我们的产品前，请务必审慎阅读
                                <span className={`matter-policy`} onClick={this.goPrivacyClick.bind(this)}>《隐私政策》</span>内的所有条款，我们将严格按照您同意的条款使用您的个人信息，以便为您提供更好的服务。
                            </div>
                            <div
                                className={`matter-agree`}>您点击“同意”的行为即表示您已阅读完毕并同意以上协议的全部内容。如您同意以上协议内容，请点击“同意”，开始使用我们的产品和服务。
                            </div>
                            <div className={`matter-footer flex flex-column`}>
                                <div className={`matter-consent`} onClick={this.consentClick.bind(this)}>同意</div>
                                <div className={`matter-unconsent`} onClick={e=>this.setState({agreementDia:false})}>不同意</div>
                            </div>
                        </div>
                    </div> : <span></span>
                }

            </React.Fragment>
        )
    }
}

// inject 将store注入到当Test组件的props中
export default inject('store')(
    observer(Index)
)
