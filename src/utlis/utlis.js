/* eslint-disable no-console */
/* eslint-disable no-undef */
/* eslint-disable no-useless-escape */
import crypto from 'crypto'
import axios from 'axios'
import {
  pubkey,
  privkey
} from './key'

import {
  Control
} from 'react-keeper'
import {
  Toast
} from 'antd-mobile'
import {
  mgop
} from '@aligov/jssdk-mgop'
// 手机号码---身份证号码处理
export function Phonenumber(tel) {
  tel = '' + tel
  if (tel.length === 11) {
    var reg = /(\d{3})\d{4}(\d{4})/
    var tel1 = tel.replace(reg, '$1****$2')
  } else {
    tel1 = tel.replace(/^(.{3})(?:\d+)(.{3})$/, '$1************$2')
  }
  return tel1
}
/**
 * 格式化日期
 * @param {Date} date 日期对象
 * @param {String} fmt 格式化字符串
 */
export function formatTime(date, fmt) {

  var o = {
    'Y+': date.getFullYear(), // 年
    'M+': date.getMonth() + 1, //月份
    'd+': date.getDate(), //日
    'h+': date.getHours(), //小时
    'm+': date.getMinutes(), //分
    's+': date.getSeconds(), //秒
    'q+': Math.floor((date.getMonth() + 3) / 3), //季度
    'S': date.getMilliseconds() //毫秒
  }

  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }

  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
  }

  return fmt
}

/**
 * @description 获取格式化后的日期字符串
 * @param {String | Date} date 日期对象或日期字符串
 * @param {String} fmt 默认YYYY-MM-DD 日期格式 YYYY全年 yy年份后两位 MM月 DD日 hh时 mm分 ss秒 dd星期 d&d星期（周日返回周天）QQ季度（汉字）qq季度(数字)
 */
export function formatDate(date, fmt) {
  if (!fmt) fmt = 'YYYY-MM-DD'
  if (typeof date === 'string') {
    try {
      let dateObj = new Date(date.replace(/-/g, '/'))
      return formatDateInner(dateObj, fmt)
    } catch (err) {
      throw '日期解析失败'
    }
  } else if (date instanceof Date) {
    return formatDateInner(date, fmt)
  } else {
    throw '错误的日期格式'
  }
}

function formatDateInner(date, fmt) {
  let fmtDate = fmt
  let o = {
    'YYYY': date.getFullYear(), // 全年
    'yy': (date.getFullYear() + '').substring(2), // 只显示后两位年份
    'MM': addZero(date.getMonth() + 1), // 月
    'DD': addZero(date.getDate()), // 日
    'hh': addZero(date.getHours()), // 时
    'mm': addZero(date.getMinutes()), // 分
    'ss': addZero(date.getSeconds()), // 秒
    'dd': getDay(date.getDay()), // '一', '二' .... '日'
    'd&d': getDay(date.getDay(), true), // '一', '二' .... '天'
    'QQ': getQuarter(date.getMonth() + 1), // 季度 '一'
    'qq': getQuarter(date.getMonth() + 1, true) // 季度 1 2 3 4
  }
  Object.keys(o).map(key => {
    let reg = new RegExp(key, 'g')
    fmtDate = fmtDate.replace(reg, o[key])
  })
  return fmtDate
}

export function addZero(value) {
  return value >= 10 ? value : '0' + value
}

export function getQuarter(value, isNum) {
  if (value >= 1 && 1 <= 3) return isNum ? 1 : '一'
  if (value >= 4 && 4 <= 6) return isNum ? 2 : '二'
  if (value >= 7 && 7 <= 9) return isNum ? 3 : '三'
  if (value >= 10 && 10 <= 12) return isNum ? 4 : '四'
}

export function getDay(value, isDay) {
  let day = ''
  switch (value) {
    case 0:
      day = isDay ? '天' : '日';
      break
    case 1:
      day = '一';
      break
    case 2:
      day = '二';
      break
    case 3:
      day = '三';
      break
    case 4:
      day = '四';
      break
    case 5:
      day = '五';
      break
    case 6:
      day = '六';
      break
  }
  return day
}

/**
 * 获取当前定位
 * 注：微信里面如果通过本地ip访问没有请求成功是正常现象，请先换成正式域名或者穿透域名访问
 * @param {Object | Function} success 如果是函数则是成功后的回调，带有参数省市区对象及定位数据({province: province,city: city,region: region}, locationData)，如果是对象，则回调函数success放在对象里面
 * @param {Function} fail 失败后的回调
 */
export function location(success, fail) {
  Toast.loading('', 0, null)
  let AMap = window.AMap
  AMap.plugin('AMap.Geolocation', function () {
    var geolocation = new AMap.Geolocation({
      enableHighAccuracy: true, //是否使用高精度定位，默认:true
      timeout: 2000, //超过2秒后停止定位，默认：5s
      // buttonPosition: 'RB',    //定位按钮的停靠位置
      // buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
      // zoomToAccuracy: true,   //定位成功后是否自动调整地图视野到定位点

    })
    // map.addControl(geolocation);
    geolocation.getCurrentPosition(function (status, result) {
      Toast.loading('', 0, null)
      if (status === 'complete') {
        onComplete(result)
      } else {
        onError(result)
      }
    })
  })
  //解析定位结果
  function onComplete(data) {
    Toast.hide()
    let geocoder = new AMap.Geocoder()
    if (data && data.position && data.position.lng) {
      geocoder.getAddress([data.position.lng, data.position.lat], function (status, result) {
        if (status === 'complete' && result.regeocode && result.regeocode.addressComponent) {
          let province = result.regeocode.addressComponent.province
          let city = result.regeocode.addressComponent.city
          let district = result.regeocode.addressComponent.district
          if (province && city && district) {
            let area = {
              province: province,
              city: city,
              region: district
            }
            if (typeof success === 'function') {
              success(area, data)
            } else if (typeof success === 'object') {
              success.success(area, data)
            }

          }
        } else {
          if (typeof fail === 'function') {
            fail()
          } else {
            success.fail()
          }
        }
      })
    }

  }
  //解析定位错误信息
  function onError(data) {
    Toast.hide()
    if (typeof fail === 'function') {
      fail(data)
    } else {
      success.fail(data)
    }
  }
}

/**
 * 从url中获取相应字段的值
 * @param {String} param url中的字段名
 */
export function getUrlValue(param) {
  let href = decodeURIComponent(window.location.href.replace(/#/, ''))
  let questionMarkIndex = href.indexOf('?')
  let mapArr = href.substring(questionMarkIndex + 1).split('&')
  let valueArr = mapArr.map(item => item.split('='))
  let value = null
  valueArr.forEach(item => {
    if (item[0] === param) {
      value = item[1]
    }
  })
  return value
}
/**
 * 从url中获取相应字段的值(url为手动传入)
 * @param { String } url
 * @param {String} param url中的字段名
 */
export function getUrlParam(url, param) {
  let href = url.replace(/#/, '')
  let questionMarkIndex = href.indexOf('?')
  let mapArr = href.substring(questionMarkIndex + 1).split('&')
  let valueArr = mapArr.map(item => item.split('='))
  let value = null
  valueArr.forEach(item => {
    if (item[0] === param) {
      value = item[1]
    }
  })
  return value
}
/**
 * 从hash路由url中获取相应字段的值(url为手动传入)
 * @param { String } url
 * @param {String} param url中的字段名
 */
export function getHashUrlValue(param) {
  let href = decodeURIComponent(window.location.href)
  href = href.substring(href.indexOf('#'))
  let questionMarkIndex = href.indexOf('?')
  let mapArr = href.substring(questionMarkIndex + 1).split('&')
  let valueArr = mapArr.map(item => item.split('='))
  let value = null
  valueArr.forEach(item => {
    if (item[0] === param) {
      value = item[1]
    }
  })
  return value
}
// 获取cookie
export function getCookie(cname) {
  var name = cname + '='
  var ca = document.cookie.split(';')
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i].trim()
    if (c.indexOf(name) === 0) return unescape(c.substring(name.length, c.length))
  }
  return ''
}
/**
 * 清除Cookie
 */
export function clearAllCookie() {
  var keys = document.cookie.match(/[^ =;]+(?=\=)/g)
  if (keys) {
    for (var i = keys.length; i--;)
      document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString()
  }
}
export function clearCookie(key) {
  var keys = document.cookie.match(/[^ =;]+(?=\=)/g)
  if (keys) {
    for (var i = keys.length; i--;)
      if (keys[i] === key)
        document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString()
  }
}
/**
 *Base64字符串转二进制
 */
export function dataURLtoBlob(dataurl) {
  var arr = dataurl.split(','),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new Blob([u8arr], {
    type: mime
  })
}


/**
 * 隐藏部分名称
 * @param {String} name
 */
export function formatName(name) {
  var newStr
  if (name.length === 2) {
    newStr = name.substr(0, 1) + '*'
  } else if (name.length > 2) {
    var char = ''
    for (let i = 0, len = name.length - 2; i < len; i++) {
      char += '*'
    }
    newStr = name.substr(0, 1) + char + name.substr(-1, 1)
  } else {
    newStr = name
  }
  return newStr
}

/**
 * 隐藏手机号中间4位
 * @param {String} phone
 */
export function formatPhone(phone) {
  return phone && phone.replace(/^(\d{3})\d+(\d{4})$/, '$1****$2')
}

/**
 * 隐藏身份证号中间8位
 * @param {String} card
 */
export function formatCard(card) {
  return card && card.replace(/^(\d{6})\d+(\d{4})$/, '$1********$2')
}

/**
 * 手机号格式验证
 * @param {String} phone
 */
export function validPhone(phone, telephone) {
  if (telephone) {
    return /(^(0\d{2})-?(\d{8})$)|(^(0\d{3})-?(\d{7})$)|(^(0\d{2})-?(\d{8})-?(\d+)$)|(^(0\d{3})-?(\d{7})-?(\d+)$)|(^\d{7}$)|(^\d{8}$)/.test(phone) || /^1(3|4|5|6|7|8|9)\d{9}$/.test(phone)
  }
  return /^1(3|4|5|6|7|8|9)\d{9}$/.test(phone)
}

/**
 * 身份证号格式验证
 * @param {String} idcard
 */
export function validIdCard(idcard) {
  return /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(idcard)
}

/**
 * 车牌号格式验证
 * @param {String} carNum
 */
export function validCarNum(carNum) {
  return (carNum.length === 7 && /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/.test(carNum)) || carNum.length === 8
}

/**
 *
 * @param {String} data 要加密的字符串
 * @param {String} key 公钥
 */
export function encrypt(data, key = pubkey) {
  return crypto.publicEncrypt(key, Buffer.from(data))
}
/**
 *
 * @param {Buffer} encrypted 已加密的Buffer
 * @param {String} key 私钥
 */
export function decrypt(encrypted, key = privkey) {
  return crypto.privateDecrypt(key, encrypted)
}

/**
 * @aes192加密模块
 * @param { String } str 要加密的字符串
 * @param { String } secret 要使用的加密密钥(要记住,不然就解不了密啦)
 * @retrun string 加密后的字符串
 * */
export function getEncAse192(str, secret = 'YyKj@') {
  var cipher = crypto.createCipher('aes192', secret) //设置加密类型 和 要使用的加密密钥
  var enc = cipher.update(str, 'utf8', 'hex') //编码方式从utf-8转为hex;
  enc += cipher.final('hex') //编码方式从转为hex;
  return enc //返回加密后的字符串
}
/**
 * @aes192解密模块
 * @param { String } str 要解密的字符串
 * @param { String } secret 要使用的解密密钥(要和密码的加密密钥对应,不然就解不了密啦)
 * @retrun string 解密后的字符串
 * */
export function getDecAse192(str, secret = 'YyKj@') {
  var decipher = crypto.createDecipher('aes192', secret)
  var dec = decipher.update(str, 'hex', 'utf8') //编码方式从hex转为utf-8;
  dec += decipher.final('utf8') //编码方式从utf-8;
  return dec
}

/**
 * base64转ArrayBuffer对象
 * @param base64
 * @return buffer
 */
export function base64ToArrayBuffer(base64) {
  base64 = base64.replace(/^data\:([^\;]+)\;base64,/gmi, '')
  var binary = atob(base64)
  var len = binary.length
  var buffer = new ArrayBuffer(len)
  var view = new Uint8Array(buffer)
  for (var i = 0; i < len; i++) {
    view[i] = binary.charCodeAt(i)
  }
  return buffer
}

/**
 * Unicode码转字符串  ArrayBuffer对象 Unicode码转字符串
 * @param
 * @return
 */
export function getStringFromCharCode(dataView, start, length) {
  var str = ''
  var i
  for (i = start, length += start; i < length; i++) {
    str += String.fromCharCode(dataView.getUint8(i))
  }
  return str
}

/**
 * 获取jpg图片的exif的角度
 * @param
 * @return
 */
export function getOrientation(arrayBuffer) {
  var dataView = new DataView(arrayBuffer)
  var length = dataView.byteLength
  var orientation
  var exifIDCode
  var tiffOffset
  var firstIFDOffset
  var littleEndian
  var endianness
  var app1Start
  var ifdStart
  var offset
  var i
  // Only handle JPEG image (start by 0xFFD8)
  if (dataView.getUint8(0) === 0xFF && dataView.getUint8(1) === 0xD8) {
    offset = 2
    while (offset < length) {
      if (dataView.getUint8(offset) === 0xFF && dataView.getUint8(offset + 1) === 0xE1) {
        app1Start = offset
        break
      }
      offset++
    }
  }
  if (app1Start) {
    exifIDCode = app1Start + 4
    tiffOffset = app1Start + 10
    if (getStringFromCharCode(dataView, exifIDCode, 4) === 'Exif') {
      endianness = dataView.getUint16(tiffOffset)
      littleEndian = endianness === 0x4949

      if (littleEndian || endianness === 0x4D4D /* bigEndian */) {
        if (dataView.getUint16(tiffOffset + 2, littleEndian) === 0x002A) {
          firstIFDOffset = dataView.getUint32(tiffOffset + 4, littleEndian)

          if (firstIFDOffset >= 0x00000008) {
            ifdStart = tiffOffset + firstIFDOffset
          }
        }
      }
    }
  }
  if (ifdStart) {
    length = dataView.getUint16(ifdStart, littleEndian)

    for (i = 0; i < length; i++) {
      offset = ifdStart + i * 12 + 2
      if (dataView.getUint16(offset, littleEndian) === 0x0112 /* Orientation */) {

        // 8 is the offset of the current tag's value
        offset += 8

        // Get the original orientation value
        orientation = dataView.getUint16(offset, littleEndian)

        // Override the orientation with its default value for Safari (#120)
        // eslint-disable-next-line no-constant-condition
        if (true) {
          dataView.setUint16(offset, 1, littleEndian)
        }
        break
      }
    }
  }
  return orientation
}

/**
 * 获取链接上的query参数
 */
export function getHrefParams() {
  let href = window.location.href
  // 微信中点击会在hash路由的#前加上?和参数，为避免两个问号的影响，先截取#后面的字符串
  href = href.substring(href.indexOf('#'))
  let questionMarkIndex = href.indexOf('?')
  if (questionMarkIndex > -1) return href.substring(questionMarkIndex + 1)
  return ''
}

/**
 * 判断在数组中是否已经存在当前path
 * @param {String} path
 * @param {Array} arr
 */

export function judgePathRepeat(path, arr) {
  return arr.filter(item => item.path === path).length
}

/**
 * 路由跳转
 * 使用时必须使用call、apply等函数指定this指向到当前组件，方便路由方式切换
 * @param { String } path 跳转的路径
 * @param { Object } param 参数对象
 */
export function jump(path, param) {
  if (!this || !this.props) {
    throw '必须使用call、apply等函数指定this指向到当前组件'
  }
  Control.go(path, param)
  // this.props.history.push(path, param)
}


/**
 * 路由返回
 * 使用时必须使用call、apply等函数指定this指向，方便路由方式切换
 * @param { Number } num 返回的页数
 * @default
 * num = -1
 */
export function back(num = -1) {
  if (!this || !this.props) {
    throw '必须使用call、apply等函数指定this指向到当前组件'
  }
  Control.go(num)
  // this.props.history.go(num)
}

/**
 * 返回指定的页面
 * 使用时必须使用call、apply等函数指定this指向，方便路由方式切换
 * @param { String } path 需返回的页面
 * @default
 * num = -1
 */
export function backTo(path) {
  if (!this || !this.props) {
    throw '必须使用call、apply等函数指定this指向到当前组件'
  }

  let routes = sessionStorage.getItem('YYRoutes')
  if (routes) {
    routes = JSON.parse(routes)
  }
  let has = false
  for (let i = 0; i < routes.length; i++) {
    if (routes[i].path === path) {
      has = true
      Control.go(-(routes.length - i - 1))
      break
    }
  }
  if (!has) {
    Control.go(-(routes.length - 1))
  }
}

/**
 * 设置页面标题(包括app端显示的标题)
 * 使用时必须使用call、apply等函数指定this指向
 * @param {String} title 页面标题
 */
export function setTitle(title) {
  document.title = title
  window.ZWJSBridge.onReady(() => {
    window.ZWJSBridge.setTitle({
      title
    })
  })
}

/**
 * 退出h5
 */
export function popWeb() {
  window.setupWebViewJavascriptBridge(function (bridge) {
    bridge.callHandler('popWeb')
  })
  if (window.__wxjs_environment === 'miniprogram') {
    window.wx.miniProgram.navigateBack({
      delta: 1
    })
  }
}

/**
 * 使用浙里办jsBridge选择照片
 * @param { Boolean } upload 是否上传到浙里办服务器
 * @returns { Object } 返回数据
 * {
 *  picSrc: [], Base64编码格式的图片数据数组
 *  picPath: [] upload取值为true时，picPath为图片的网络地址数组，支持下载。
 * }
 *
 */
export function chooseImg(upload = false) {
  return new Promise((resolve, reject) => {
    window.ZWJSBridge.chooseImage({ upload: upload }).then((result) => {
      console.log(result)
      resolve(result)
    }).catch((error) => {
      console.log(error)
      reject(error)
    })
  })
}


/**
 * 将设计图尺寸为750下的px值转换为vw(使用尺寸)
 * @param {Number} value
 */
export function pxTovw(value) {
  return value / 750 * 100 + 'vh'
}

/**
 * 将设计图尺寸为750下的px值转换为vw(适用字体)
 * @param {Number} value
 */
export function ftTovw(value) {
  if (window.innerHeight > window.innerWidth) {
    return value / 750 * 100 + 'vw'
  }
  return value / 750 * 100 + 'vh'
}

export function callPhone(phone) {
  return phone
}

/**
 * 上传图片
 * @param {Object} options
 * @description 配置说明
 * @field api 请求接口(可选) 默认 mgop.yykj.community.fileUpload
 * @field host 请求域名(可选) 默认 https://mapi.zjzwfw.gov.cn
 * @field files 传入的图片数组(必填)
 * @field props 如果数组中的元素是对象，请指定图片对应字段
 * @field name 传到服务器需要的字段名 默认 file
 * @returns { Promise } promise回调
 */

export function upload({
  api,
  host,
  files,
  props,
  name,

}) {

  if (files && files.length <= 0) {
    Toast.info('请选择图片', 3, null, false)
    return []
  }
  let orientation =files [0].orientation
  let rotateAngle
  if (orientation === 3) {
    //旋转180°
    rotateAngle = 180
  } else if (orientation === 6) {
    //注意：此处canvas的宽高互换 //旋转90°
    rotateAngle = 90

  } else if (orientation === 8) {
    //注意：此处canvas的宽高互换，旋转270°
    rotateAngle = 270
  } else {
    rotateAngle = 0
    //不旋转原图

  }
  return Promise.all(files && files.map((item) => {

    return new Promise(async (resolve, reject) => {
      if (props) {
        item = item[props]
      }
      if (item.indexOf('http://') > -1 || item.indexOf('https://') > -1) {
        resolve(item)
        return
      }
      await axios({
        // url:'http://192.168.5.248:10000/file/fastdfs/uploadByBase64',
        url:'https://wzza.wzzasmart.com/file/fastdfs/uploadByBase64', // 必填 请求API。
        // host: host || 'https://mapi.zjzwfw.gov.cn', // 必填 API网关地址。
        method: 'POST',
        timeout: 10000,
        data: {
          [name || 'imgStr']: item,
          rotateAngle:rotateAngle
        },
        // onSuccess: res => {
        //   let data = res && res.data && res.data.data
        //   if (data) {
        //     resolve(data)
        //     return
        //   }
        //   reject(data)
        // },
        // onFail: err => {
        //   console.log(err, '我是返回的err')
        //   reject(err)
        // }
      }).then(res=>{
        let data = res && res.data && res.data.data
          if (data) {
            resolve(data)
            return
          }
          reject(data)
      }).catch(err=>{
        reject(err)
      })
    })
  }))
}

/**
   *
   * @param {*} key 参数名
   * @param {*} value 值
   */
 export  function setStorage(key, value) {
  if (window.my && typeof window.my.setStorage === 'function') {
     window.my.setStorage({
      key,
      data: value
    })
  } else {
    localStorage.setItem(key, value)
  }

}
/**
 *
 * @param {*} key 参数名称
 * @param {*} cb 成功的回调
 * @param {*} fcb 失败的回调
 * @returns Promise
 */
export function getStorage(key, cb, fcb) {
  return new Promise((resolve, reject) => {
    if (window.my && typeof window.my.getStorage === 'function') {
      window.my.getStorage({
        key,
        success: res => {
          typeof cb === 'function' && cb(res.data)
          resolve(res.data)
        },
        fail: err => {
          typeof cb === 'function' && fcb(err)
          reject(err)
        }
      })
    } else {
      typeof cb === 'function' && cb(localStorage.getItem(key))
      resolve(localStorage.getItem(key))
    }

  })
}
