/* eslint-disable no-console */
/* eslint-disable no-debugger */
// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Toast, Button, WhiteSpace, ImagePicker } from 'antd-mobile'
import './index.scss'
import {
  back,
  jump,
  chooseImg,
  upload,
  getUrlValue,
  getOrientation,
  base64ToArrayBuffer,
  setTitle,
  getStorage,
  setStorage
} from '../../utlis/utlis'
import EXIF from 'exif-js'
import http, {get} from '../../utlis/http'
import Cropper from 'react-cropper'
import 'cropperjs/dist/cropper.css' // 引入Cropper对应的css
const prefix = 'pass-way'
Toast.config({
  mask: false
})
class PassWay extends Component {
  constructor(props) {
    super(props)

  }
  state = {
    way: '',
    files: [],
    // spinFiles:[]
    // orientation
    // tempPath:'',    //存储文件
    // showCropper:false
  }
  componentWillUnmount() {

  }
   async componentDidMount() {
     setTitle.call(this, '通行方式')
     let that = this
     let complexCode ,passWayVal,visitorName,zfbUserId
     //进入页面调用该方法查看手机型号
     await getStorage('passWayVal',res=>{
       passWayVal = res
     })
     that.setState({
       passwayval: passWayVal
     })
     await getStorage('zfbUserId',res=>{
       zfbUserId = res
     })
    let userName,certificateId
     await getStorage('userName',res=>{
       userName = res
     })
     await getStorage('certificateId',res=>{
       certificateId = res
     })
     if(passWayVal!=2){
       //判断用户信息有没有脱敏，若没脱敏则从缓存中获取存下来的信息
       if(userName&&userName.indexOf('*')>-1){
         window.my.postMessage({apFilePaths:1,passWayVal:passWayVal,zfbUserId:zfbUserId,facing:1})
       }else{
         window.my.postMessage({apFilePaths:1,passWayVal:passWayVal,zfbUserId:zfbUserId,facing:1,certificateId:certificateId,userName:userName})
       }
     }else{
       window.my.postMessage({apFilePaths:1,passWayVal:passWayVal,zfbUserId:zfbUserId})
     }
     window.my.onMessage = async function (e) {
       if(e.platform&&e.platform!=undefined){
         //Android，iOS / iPhone OS 。
         that.setState({
           platform:e.platform
         })
       }
       if(e.imageUrl&&e.imageUrl!=undefined){
         if(passWayVal!=2){
           if(that.state.platform&&that.state.platform.indexOf('Android')>-1){
             that.state.files[0] = e.imageUrl
             that.setState({
               files:that.state.files
             },async ()=>{
               that.passvalFun(e.imageUrl)
             })
           }else{
             let obj = {url:e.imageUrl}
             that.state.files[0]  = obj
             that.setState({
               files:that.state.files
             },()=>{
               that.passvalFun(e.imageUrl)
             })
           }

         }
       }

     }
    // 修改mobx中存储的值
       await getStorage('complexCode',res=>{
        complexCode= res
    })
     await getStorage('visitorName',res=>{
       visitorName= res
     })
    let href = window.location.href
     await getStorage('passWayVal',res=>{
       passWayVal=  res
    })
     this.setState({
      way: passWayVal,
       visitorName
    })
  }
  //只存储passWayVal为1和underfind
 async passvalFun(imageUrl){
    let passWayVal
   await getStorage('passWayVal',res=>{
     passWayVal = res
   })
    if(passWayVal==1){
      let id
      await getStorage('zjuserid',res=>{
        id = res
      })
      http.post({
        url: '/api/user/image/update',
        data: {
          id: id,
          imageUrl: imageUrl
        }
      }).then(res => {
        if (res.data.code == 1) {
          Toast.info(res.data.message)
        } else {
          Toast.info(res.data.message)
        }
      })
    }else{
     await setStorage('photoImg',imageUrl)
      let userName,tel,certificateId,zfbUserId,nation
      await  getStorage('userName',res=>{
        userName = res
      })
      await  getStorage('tel',res=>{
        tel = res
      })
      await  getStorage('certificateId',res=>{
        certificateId = res
      })
      await  getStorage('zfbUserId',res=>{
        zfbUserId = res
      })
      await getStorage('nation',res=>{
        nation = res
      })
      http.post({
        url: '/test/alipay/userInfo/save',
        data: {
          userName: userName,
          tel: tel,
          certificateType: '身份证',
          certificateId: certificateId,
          nation: nation,
          imageUrl: imageUrl,
          source: 'ALI_PAY',
          zlbUserId:zfbUserId
        }
      }).then(async res => {
        if (res.data.code == 1) {

          let zfbUserId
          await getStorage('zfbUserId',res=>{
            zfbUserId = res
          })
          http.get({
            url: `/test/user/info/get?openId=${zfbUserId}`,
          }).then( async res => {
            let data = res && res.data && res.data.data
            if (data) {
              if (data.id != undefined) {
                await setStorage('dataId',data.id)
              }
            }
          })
        } else {
          Toast.info(res.data.message)
        }
      })
    }
  }
  async saveBtn() {
    var visitorStatus, complexCode,zfbUserId,houseId,buildingCode,complexName,unitCode,uuidCode
    await getStorage('complexCode',res=>{
      complexCode=res
    })
    await getStorage('zfbUserId',res=>{
      zfbUserId=res
    })
    await getStorage('visitorStatus',res=>{
      visitorStatus=res
    })
    await getStorage('houseId',res=>{
      houseId=res
    })
    await getStorage('buildingCode',res=>{
      buildingCode=res
    })
    await getStorage('complexName',res=>{
      complexName=res
    })
    await getStorage('unitCode',res=>{
      unitCode=res
    })
    await getStorage('uuidCode',res=>{
      uuidCode=res
    })
    if (this.state.files && this.state.files.length > 0) {
      if (!this.state.way) {
        if(visitorStatus==1){
          if(this.state.visitorName&&this.state.visitorName!=undefined&&this.state.visitorName!='undefined'&&this.state.visitorName!=null){
            window.my.navigateTo({
              url: '../visitor-info/visitor-info?zfbUserId=' + zfbUserId + '&complexCode=' + complexCode + '&goVisitorInfo=2'+ '&visitorName=' + this.state.visitorName+'&complexName=' + complexName + '&houseId=' + houseId + '&buildingCode=' + buildingCode + '&unitCode=' + unitCode + '&uuidCode=' + unitCode
            })
          }else{
            window.my.navigateTo({
              url: '../visitor-info/visitor-info?zfbUserId=' + zfbUserId + '&complexCode=' + complexCode
            })
          }

        }else {
          jump.call(this, '/choose-building')
        }
      } else if (this.state.way == '2') {
        jump.call(this, '/user-information')
      } else if (this.state.way == 1) {
        back.call(this)
      }
    } else {
      Toast.info('请上传通行方式')
    }
  }
  deleteImgClick(e){
    e.persist()
    e.stopPropagation()
    this.setState({
      files:[]
    })
  }
  async addImageClick(){
    let passWayVal,zfbUserId,userName,certificateId
    await getStorage('passWayVal',res=>{
      passWayVal = res
    })
    await getStorage('zfbUserId',res=>{
      zfbUserId = res
    })
    await getStorage('userName',res=>{
      userName = res
    })
    await getStorage('certificateId',res=>{
      certificateId = res
    })
    if(userName&&userName.indexOf('*')>-1){
      window.my.postMessage({apFilePaths:1,passWayVal:passWayVal,zfbUserId:zfbUserId,facing:1})
    }else{
      window.my.postMessage({apFilePaths:1,passWayVal:passWayVal,zfbUserId:zfbUserId,facing:1,certificateId:certificateId,userName:userName})
    }
  }
  //上传头像
  async  addImage(e) {
    e.persist()
    let that =this
    let passWayVal,zfbUserId
    await getStorage('passWayVal',res=>{
        passWayVal = res
      })
    await getStorage('zfbUserId',res=>{
        zfbUserId = res
      })
      let file = e.target.files[0];
      let Orientation
      let reader = new FileReader()
      reader.readAsDataURL(file);
      //监听读取文件过程方法异步过程
      //成功读取
      reader.onload=async function (e){
        let image = new Image()
        let  imageWidth,imageHeight
        image.src  = this.result
        image.onload=function (){
          imageHeight = image.height
          imageWidth = image.width
          EXIF.getData(image,function (n){
            EXIF.getAllTags(this)
            Orientation = EXIF.getTag(this, 'Orientation')
          })
          that.setState({
            imageHeight,
            imageWidth,
            operationType:Orientation
          },()=>{
            const {files} = that.state
            that.getUpwardImage(image.src,(base64)=>{
              let obj = {
                url:image.src,
                orientation:Orientation       //设置旋转角度，因为自己这边设置过旋转角度所以不用在旋转
              }
              files[0] = obj
              that.setState({
                files
              },()=>{
                Toast.loading('正在上传',null,null,true)
                upload({
                  files: files,
                  props: 'url'
                }).then( async res => {
                  files[0].url = res[0]
                  Toast.hide()
                  that.setState({
                    files
                  },async ()=>{
                    if (!that.state.way) {
                      setStorage('photoImg',res[0])
                      let userName,tel,certificateId,zfbUserId,nation
                      await  getStorage('userName',res=>{
                        userName = res
                      })
                      await  getStorage('tel',res=>{
                        tel = res
                      })
                      await  getStorage('certificateId',res=>{
                        certificateId = res
                      })
                      await  getStorage('zfbUserId',res=>{
                        zfbUserId = res
                      })
                      await getStorage('nation',res=>{
                        nation = res
                      })
                      http.post({
                        url: '/test/alipay/userInfo/save',
                        data: {
                          userName: userName,
                          tel: tel,
                          certificateType: '身份证',
                          certificateId: certificateId,
                          nation: nation,
                          imageUrl: res[0],
                          source: 'ALI_PAY',
                          zlbUserId:zfbUserId
                        }
                      }).then(async res => {
                        if (res.data.code == 1) {

                          let zfbUserId
                          await getStorage('zfbUserId',res=>{
                            zfbUserId = res
                          })
                          http.get({
                            url: `/test/user/info/get?openId=${zfbUserId}`,
                          }).then( async res => {
                            let data = res && res.data && res.data.data
                            if (data) {
                              if (data.id != undefined) {
                                await setStorage('dataId',data.id)
                              }
                            }
                          })
                        } else {
                          Toast.info(res.data.message)
                        }
                      })
                    } else if (that.state.way == '2') {
                      let addUser
                      await getStorage('addUser',res=>{
                        addUser =  res
                      })
                      if (addUser) {
                        addUser = JSON.parse(addUser)
                        addUser.imageUrl = res[0]
                        await setStorage('addUser', JSON.stringify(addUser))
                      }
                    } else {
                      let id
                      await getStorage('zjuserid',res=>{
                        id = res
                      })
                      http.post({
                        url: '/api/user/image/update',
                        data: {
                          id: id,
                          imageUrl: res[0]
                        }
                      }).then(res => {
                        if (res.data.code == 1) {
                          Toast.info(res.data.message)
                        } else {
                          Toast.info(res.data.message)
                        }
                      })
                    }
                  })
                })
              })
            })
          })
        }
      }
  }
  async chooseImage(){
    let userInfo,nation,passWayVal,zfbUserId
    await getStorage('userInfo',res=>{
      userInfo= res
    })
    await getStorage('zfbUserId',res=>{
      zfbUserId= res
    })
    await getStorage('passWayVal',res=>{
      passWayVal = res
    })
    if (userInfo) {
      userInfo = JSON.parse(userInfo)
    }
    await getStorage('nation',res=>{
      nation = res
    })
    if(this.state.files.length>0){
      return false
    }
    if(!passWayVal||passWayVal!=2){
      let userName,certificateId
      await getStorage('userName',res=>{
        userName = res
      })
      await getStorage('certificateId',res=>{
        certificateId = res
      })
      if(userName&&userName.indexOf('*')>-1){
        window.my.postMessage({apFilePaths:1,passWayVal:passWayVal,zfbUserId:zfbUserId,facing:1})
      }else{
        window.my.postMessage({apFilePaths:1,passWayVal:passWayVal,zfbUserId:zfbUserId,facing:1,certificateId:certificateId,userName:userName})
      }
    }else{
      window.my.chooseImage({
        sourceType: ['camera'],
        sizeType:['original'],
        count: 1,
        success:async (res) => {
          await window.my.postMessage({apFilePaths:res.apFilePaths[0],transfer:1});
          let _self = this
          window.my.onMessage = async function (e) {
            if(e.imageLink&&e.imageLink!=undefined){
              await _self.setState({
                files:[e.imageLink]
              },async ()=>{
                const files  = _self.state.files
                if (files && files.length > 0) {
                  let image = new Image()
                  let  initFileSize,imageWidth,imageHeight
                  image.src = files[0]
                  image.onload= function (){
                    imageHeight = image.height
                    imageWidth = image.width
                    _self.setState({
                      imageHeight,
                      imageWidth
                    })
                  }
                  Toast.loading()
                  if (!_self.state.way) {
                    setStorage('photoImg', files[0])
                    let userName,tel,certificateId,zfbUserId
                    await getStorage('userName',res=>{
                      userName = res
                    })
                    await getStorage('tel',res=>{
                      tel = res
                    })
                    await getStorage('certificateId',res=>{
                      certificateId =  res
                    })
                    await getStorage('zfbUserId',res=>{
                      zfbUserId =  res
                    })
                    await getStorage('nation',res=>{
                      nation =  res
                    })
                    http.post({
                      url: '/test/alipay/userInfo/save',
                      data: {
                        userName: userName,
                        tel: tel,
                        certificateType: '身份证',
                        certificateId: certificateId,
                        nation: nation,
                        imageUrl: files[0],
                        source: 'ALI_PAY',
                        zlbUserId: zfbUserId
                      }
                    }).then(async res => {
                      if (res.data.code == 1) {
                        let zfbUserId
                        await getStorage('zfbUserId',res=>{
                          zfbUserId = res
                        })
                        http.get({
                          url: `/test/user/info/get?openId=${zfbUserId}`,
                        }).then(res => {
                          let data = res && res.data && res.data.data
                          if (data) {
                            if (data.id != undefined) {
                              setStorage('dataId', data.id)
                            }
                          }
                        })
                      } else {
                        Toast.info(res.data.message)
                      }
                    })
                  }
                  else if (_self.state.way == '2') {
                    let addUser
                    await getStorage('addUser',res=>{
                      addUser =  res
                    })
                    if (addUser) {
                      addUser = JSON.parse(addUser)
                      addUser.imageUrl = files[0]
                      await setStorage('addUser', JSON.stringify(addUser))
                    }
                  }
                  else {
                    let id
                    await getStorage('zjuserid',res=>{
                      id =  res
                    })
                    http.post({
                      url: '/api/user/image/update',
                      data: {
                        id: id,
                        imageUrl: files[0]
                      }
                    }).then(res => {
                      if (res.data.code == 1) {
                        Toast.info(res.data.message)
                      } else {
                        Toast.info(res.data.message)
                      }
                    })
                  }
                  Toast.hide()
                }
              })
            }
          }
        },
        fail:()=>{
        }
      })
    }

  }
  /**
   * 校正图片方向
   * @param base64 校正前图片base64
   * @param cb 回调函数，带有校正后的图片base64参数
   */
  getUpwardImage(base64, cb) {
    let orientation = this.state.operationType
    let canvas = document.getElementById('imgCanvas')
    let ctx = canvas.getContext('2d')
    let img = new Image()
    img.src = base64
    img.onload = function () {
      let width = img.width, height = img.height;
      let compressionRatio = 0.3;//图片压缩率 0~1 0最大压缩率 1不压缩
      if (orientation === 3) {
        //旋转180°
        canvas.width = width;
        canvas.height = height;
        ctx.rotate(Math.PI);//预览修正值
        ctx.drawImage(img, -width, -height, width, height)
      } else if (orientation === 8) {
        //注意：此处canvas的宽高互换 //旋转90°
        canvas.width = height;
        canvas.height = width;
        ctx.rotate(Math.PI / 2);//预览修正值
        ctx.drawImage(img, 0, -height, width, height)
      } else if (orientation === 6) {
        //注意：此处canvas的宽高互换，旋转270°
        canvas.width = height;
        canvas.height = width;
        ctx.rotate(-Math.PI / 2);//预览修正值
        ctx.drawImage(img, -width, 0, width, height)
      } else {
        //不旋转原图
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
      }

      if (typeof cb === 'function') cb(canvas.toDataURL('image/jpeg', compressionRatio))
    };
  }
  toIndex() {
    // 跳转
    jump.call(this, '/index')
  }
  goBack() {
    // 返回
    back.call(this)
  }

  onChange = (files, type, index) => {
    this.setState({
      files,
    })
  }
  render() {
    // 从mobx中拿所需属性
    const { files, way,imageHeight,imageWidth,platform,passwayval} = this.state
    return (
      <React.Fragment>
        <div className={`${prefix} flex flex-column`}>
          <div className={`${prefix}-main`}>

            <div className={`${prefix}-main-head`}>
              通行方式
              </div>
            <div className={`${prefix}-main-text`}>请选择照片，由物业下发通行证</div>
            <canvas id="imgCanvas" className={`${prefix}-imagePick canvas-img`}></canvas>
            {
                platform&&platform.indexOf('Android')>-1? <div className={`${prefix}-main-content flex flex-column`} onClick={this.chooseImage.bind(this)}>
                  {
                    files&&files.length>0?
                        <div className={'content-photo'}>
                          <img src={`${files[0]}`} className={`${prefix}-imagePick`} alt=""/>
                          <img onClick={this.deleteImgClick.bind(this)} className={'remove-photo'} src={require('./../../assets/imgs/common/delete.png')} alt=""/>
                        </div>:null
                  }
                  {
                    files && files.length > 0 ? null : <div className={`${prefix}-sty`}>
                      <img className={`${prefix}-main-content-photo`} src={require('./../../assets/imgs/common/camera@2x.png')} alt="" />
                      <span className={`${prefix}-main-content-text`}>选择照片</span>
                    </div>
                  }
                </div>: <div className={`${prefix}-main-content flex flex-column`}>
                  {
                    (!passwayval||passwayval==1)?<div className={`${prefix}-imagePick ${files&&files.length>0?'canvas-img':''}`} onClick={this.addImageClick.bind(this)}></div>:<input ref="ios_file" onChange={ this.addImage.bind(this)} type="file" id="file_input"  className={`${prefix}-imagePick ${files&&files.length>0?'canvas-img':''}`} capture="user" />
                  }
                  {
                    files&&files.length>0?
                        <div className={'content-photo'}>
                          <img src={`${files[0].url}`} className={`${prefix}-imagePick`} alt=""/>
                          <img onClick={this.deleteImgClick.bind(this)} className={'remove-photo'} src={require('./../../assets/imgs/common/delete.png')} alt=""/>
                        </div>:null
                  }
                  {
                    files && files.length > 0 ? null : <div className={`${prefix}-sty`}>
                      <img className={`${prefix}-main-content-photo`} src={require('./../../assets/imgs/common/camera@2x.png')} alt="" />
                      <span className={`${prefix}-main-content-text`}>选择照片</span>
                    </div>
                  }
                </div>
            }
          </div>
          {
            (() => {
              if (files && files.length > 0) {
                return <div className={`${prefix}-footer flex1 flex align-center`}>
                  <Button className={'save-btn files-save-btn'} onClick={this.saveBtn.bind(this)} type='primary'>下一步</Button>
                </div>
              }
              return <div className={`${prefix}-footer flex1 flex align-center`}>
                <Button className={'save-btn'} onClick={this.saveBtn.bind(this)} type='primary'>下一步</Button></div>

            })()
          }
        </div>
      </React.Fragment>

    )
  }
}
// inject 将store注入到当Test组件的props中
export default inject('store')(
  observer(PassWay)
)
