import React, { Component } from 'react'
import './index.scss'
import YYImage from '../yy-image'
import { Toast, Carousel } from 'antd-mobile'
import axios from 'axios'
import { dataURLtoBlob } from '../../utlis/utlis'
import ActionSheet from '../../common/action-sheet'
import PropTypes from 'prop-types'
import { getOrientation, base64ToArrayBuffer } from '../../utlis/utlis'

const prefix = 'yy-img-choose'
/**
 * 图片选择组件
 * @property column?:Number 显示的列数，填写以控制每张图片的间距，默认4
 * @property imgCount?:Number 最多选择的图片数量，默认6
 * @property value?:Array 需要显示的图片数组
 * @property editable?:Boolean 是否可编辑，默认true
 * @property width?:String 图片的宽度，默认1.52rem
 * @property height?:String  图片的高度，默认1.52rem
 * @property preview?:Boolean 是否支持预览，默认true
 * @property field?:String 上传图片时的字段名，默认file
 * @property deleteIcon?:typeof require('*.png') 删除操作的图标 require('./Common_icon_delete_d16.png')
 * @property uploadIcon?:typeof require('*.png') 上传操作的图标 require('./Console_icon_camera_d.png')
 * @property boxClass?:String 组件最外层元素的自定义类名，默认''
 * @property imgClass?:String 图片自定义类名，默认''
 * @function upload 图片上传函数，传入图片上传地址url，需使用async等待全部图片上传成功
 * @example
 * <ImgChoose ref='imgChoose' />
 * await this.refs.imgChoose.upload(url)
 * @function getValue 获取当前组件的图片列表
 * @example
 * <ImgChoose ref='imgChoose' />
 * this.refs.imgChoose.getValue()
 */
export default class YYImgChoose extends Component {
    static defaultProps = {
        column: 4,
        imgCount: 6,
        value: [],
        editable: true,
        width: '1.52rem',
        height: '1.52rem',
        preview: true,
        field: 'file',
        deleteIcon: require('./Common_icon_delete_d16.png'),
        uploadIcon: require('./Console_icon_camera_d.png'),
        boxClass: '',
        imgClass: '',
        delteIconClass: '',
        onChange: () => {}
    }
    static propTypes = {
        column: PropTypes.number,
        imgCount: PropTypes.number,
        value: PropTypes.array,
        width: PropTypes.string,
        height: PropTypes.string,
        preview: PropTypes.bool,
        field: PropTypes.string,
        boxClass: PropTypes.string,
        imgClass: PropTypes.string,
        delteIconClass: PropTypes.string,
        onChange: PropTypes.func
    }
    constructor(props) {
        super(props)
        this.previewComponent = React.createRef()
        this.state = {
            value: props.value,
            isAndroid: navigator.userAgent.indexOf('Android') > -1 || navigator.userAgent.indexOf('Linux') > -1, // android
            isIOS: !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), // ios终端
            isWZCitizen: navigator.userAgent.match(/citizencard/),
            isWX: navigator.userAgent.match(/MicroMessenger/i),
            isMini: window.__wxjs_environment === 'miniprogram',
            imgHeight: 176,
            currentIndex: 0
        }
    }
    showActionSheet = () => {
        let config = {
            customHeader: true,
            customBody: true,
            ActionBody: () => {
                return (
                    <div style={{ width: "6.7rem", height: "1.76rem", padding: "0 .2rem", boxSizing: "border-box" }}>
                        <label className={`${prefix}-action-item`}>
                            <div className={`${prefix}-action-item-name after-border-all`}>拍摄</div>
                            <input type="file" accept="image/*" name="" capture="user" id="file" multiple onChange={this.onfileChange.bind(this)} style={{ display: 'none' }} />
                        </label>
                        <label className={`${prefix}-action-item`}>
                            <div className={`${prefix}-action-item-name`}>相册</div>
                            <input type="file" accept="image/*" name="" id="file" multiple onChange={this.onfileChange.bind(this)} style={{ display: 'none' }} />
                        </label>
                    </div>
                )
            },
            itemStyle: {
                borderRadius: ".2rem"
            },
            defaultConfirm: false
        }
        ActionSheet.show(config)
    }
    onfileChange(e) {
        let that = this
        e.persist()
        if (e.target.files && e.target.files[0]) {
            let length = e.target.files.length
            for (let i = 0; i < length; i++) {
                let file = e.target.files[i]
                let fileReader = new FileReader()
                fileReader.readAsDataURL(file)
                fileReader.onload = function () {
                    let value = that.state.value
                    let result = fileReader.result
                    if (that.state.isAndroid) {
                        that.getUpwardImage(result, (base64) => {
                            if (value.length < that.props.imgCount) {
                                value.push(base64)
                            } else {
                                Toast.show(`最多选择${that.props.imgCount}张图片`, 3, null, false)
                            }
                            that.setState({
                                value
                            }, () => {
                                that.props.onChange(value)
                            })
                        })
                        return
                    }

                    if (value.length < that.props.imgCount) {
                        value.push(result)
                    } else {
                        Toast.show(`最多选择${that.props.imgCount}张图片`, 3, null, false)
                    }
                    that.setState({
                        value
                    }, () => {
                        that.props.onChange(value)
                    })
                }
            }
            Toast.hide()
            e.target.value = null
        } else {
            return
        }
    }
    /**
     * 校正图片方向
     * @param base64 校正前图片base64
     * @param cb 回调函数，带有校正后的图片base64参数
     */
    getUpwardImage(base64, cb) {
        let orientation = getOrientation(base64ToArrayBuffer(base64))
        let canvas = document.getElementById('imgCanvas')
        let ctx = canvas.getContext('2d')
        let img = new Image()
        img.src = base64
        img.onload = function () {
            let width = img.width, height = img.height;
            let compressionRatio = 0.3;//图片压缩率 0~1 0最大压缩率 1不压缩
            if (orientation === 3) {
                canvas.width = width;
                canvas.height = height;
                ctx.rotate(Math.PI);//预览修正值
                ctx.drawImage(img, -width, -height, width, height)
            } else if (orientation === 6) {
                //注意：此处canvas的宽高互换
                canvas.width = height;
                canvas.height = width;
                ctx.rotate(Math.PI / 2);//预览修正值
                ctx.drawImage(img, 0, -height, width, height)
            } else if (orientation === 8) {
                //注意：此处canvas的宽高互换
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

    remove = (index) => {
        let value = this.state.value
        value.splice(index, 1)
        this.setState({
            value
        })
    }

    /**
     * 组件内图片上传
     * 需使用 async 等待所有图片上传成功
     * @param {String} url 图片上传路径
     * @example
     * <ImgChoose ref='imgChoose' />
     * await this.refs.imgChoose.upload(url)
     */
    async upload(url) {
        let that = this
        let value = this.state.value
        if (value && value.length <= 0) {
            Toast.info('请选择图片', 3, null, false)
            return
        }
        Toast.loading()
        await Promise.all(value && value.map((item, index) => {
            return new Promise((resolve) => {
                if (item.indexOf('http://') > -1 || item.indexOf('https://') > -1) {
                    resolve()
                } else {
                    let formData = new FormData()
                    let blobFile = dataURLtoBlob(item)
                    formData.append(that.props.field, blobFile, 'file.jpg')
                    axios.post(url, formData, {
                        'Content-Type': 'multipart/form-data'
                    }).then(res => {
                        let data = res && res.data
                        if (data) {
                            data = typeof data === 'string' ? JSON.parse(data) : data
                            if (data.state && data.result) {
                                resolve()
                                value[index] = data.result[0]
                                that.setState({
                                    value
                                }, () => {
                                    that.props.onChange(value)
                                })
                            } else {
                                Toast.info(data && data.result || '图片上传失败', 3, null, false)
                            }
                        }
                    })
                }
            })
        })).then(() => {
            Toast.hide()
        })
    }
    /**
     * 返回当前组件的图片数组
     */
    getValue() {
        return this.state.value
    }

    preview(index) {
        this.previewComponent.current.style.height = '100vh'
        this.setState({
            currentIndex: index
        })
    }

    closePreview() {
        this.previewComponent.current.style.height = '0'
    }

    render() {
        const { value } = this.state
        const { column, imgCount, width, height, preview, boxClass, imgClass, delteIconClass } = this.props
        return (
            <React.Fragment>
                <div className={`${prefix}-preview`} ref={this.previewComponent} onClick={this.closePreview.bind(this)}>
                    <div style={{width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                        <Carousel
                            autoplay={false}
                            style={{ display: 'inline-block', width: '100%', height: this.state.imgHeight }}
                            selectedIndex={this.state.currentIndex}
                            dotStyle={{display: 'none'}}
                            dotActiveStyle={{display: 'none'}}
                        >
                            {value.map((val, index) => (
                                <img
                                    key={index}
                                    src={val}
                                    alt=""
                                    style={{width: '100vw'}}
                                    onLoad={() => {
                                        // fire window resize event to change height
                                        window.dispatchEvent(new Event('resize'));
                                        this.setState({ imgHeight: 'auto' });
                                    }}
                                />
                            ))}
                        </Carousel>
                    </div>
                </div>
                <div className={`${prefix}-box ${boxClass}`}>
                    <div style={{ width: 0, height: 0, overflow: 'hidden' }}>
                        <canvas id="imgCanvas"></canvas>
                    </div>
                    {
                        value && value.map((item, index) => {
                            let isRowLast = (index + 1) % column === 0
                            return (
                                <div
                                    className={`${prefix}-item`}
                                    key={index}
                                    style={{
                                        marginRight: `calc((100% - ${!isRowLast ? width : '50%'} * ${!isRowLast ? column : 2}) / (${column - 1}))`,
                                        marginTop: `${(index + 1) > column ? '.2rem' : ''}`
                                    }}>
                                    {
                                        this.props.editable ? (
                                            <img className={`${prefix}-item-delete ${delteIconClass}`} src={this.props.deleteIcon} onClick={() => { this.remove(index) }} />
                                        ) : null
                                    }
                                    {
                                        preview ? (
                                            <YYImage className={imgClass} src={item} width={width} height={height} bindClick={this.preview.bind(this, index)} />
                                        ) : (
                                            <YYImage className={imgClass} src={item} width={width} height={height} />
                                        )
                                    }
                                </div>
                            )
                        })
                    }
                    {
                        (value.length < imgCount) && this.props.editable ? (
                            <div
                                className={`${prefix}-item`}
                                style={{ marginTop: value.length >= column ? '.2rem' : '' }}
                            >
                                <label className={`${prefix}-file-input`}>
                                    <img src={this.props.uploadIcon} style={{ width, height }} />
                                    {
                                        this.state.isMini && this.state.isAndroid ? (
                                            <input type="file" accept="image/*" name="" id="file" capture='environment' multiple onChange={this.onfileChange.bind(this)} style={{ display: 'none' }} />
                                        ) : (
                                                <input type="file" accept="image/*" name="" id="file" multiple onChange={this.onfileChange.bind(this)} style={{ display: 'none' }} />
                                            )
                                    }
                                </label>
                            </div>
                        ) : null
                    }
                </div>
            </React.Fragment>
        )
    }
}