import E from "wangeditor"

import React, { Component } from 'react'
import http from "../../utlis/http"
import axios from "axios"
import { dataURLtoBlob, pxTovw } from "../../utlis/utlis"
import PropTypes from 'prop-types'
import {Toast} from "antd-mobile"

import './index.scss'
const prefix = "editor"
Toast.config({
    mask:false
})
export default class Editor extends Component {
    // static defaultProps={
    //     placeholder:'请输入报修内容+图片组合（150字）'
    // }
    static propTypes = {
        placeholder: PropTypes.string,
        html: PropTypes.string,
    }
    constructor(props) {
        super(props);
        this.state = {
            editorContent: '',
            images: [],
            matterContents: [],
            isMini: window.__wxjs_environment === 'miniprogram',
            isAndroid: navigator.userAgent.indexOf('Android') > -1 || navigator.userAgent.indexOf('Linux') > -1
        };
    }
    componentDidMount() {
        const elemMenu = this.refs.editorElemMenu;
        const elemBody = this.refs.editorElemBody;
        const editor = new E(elemMenu, elemBody)
        // 使用 onchange 函数监听内容的变化，并实时更新到 state 中
        editor.config.onchange = html => {
            // let content = editor.txt.html()
            // content = content.replace(/<[^<>]+>/g,'')
            // if (content.length>150) {
            //     Toast.info('最多输入150字，超出部分将不会上传')
            //     // editor.disable()
            //     return
            // }
            this.setState({
                editorContent: editor.txt.html()
            }, () => {

            })

        }

        editor.config.placeholder = this.props.placeholder
        // editor.config.fontsize = '20px'
        editor.config.zIndex = 500
        editor.config.showMenuTooltips = false
        editor.config.uploadImgMaxSize = 20 * 1024 * 1024
        // editor.config.uploadImgHooks = res => {

        // }
        editor.config.showLinkImg = false
        editor.config.menus = [
            'image',  // 插入图片 
        ]
        editor.config.customUploadImg = (resultFiles, insertImgFn) => {
            Toast.loading()
            const url = 'https://api-fcsp.zgyiyun.com:1200/FileUpLoad/v1/SmallFileUpload/UploadECPicsByType?type=5'
            const pArr = []
            for (const item of resultFiles) {
                const upLoadImg = new Promise((resolve, reject) => {
                    const reader = new FileReader()
                    reader.readAsDataURL(item)
                    reader.onload = (e) => {
                        const base64 = e.target.result;
                        const formData = new FormData();
                        formData.append('file', dataURLtoBlob(base64), 'file.jpg')
                        axios.post(url, formData, {
                            'Content-Type': 'multipart/form-data'
                        }).then(res => {
                            if (res.data.state) {
                                insertImgFn(res.data.result[0])
                                Toast.hide();
                                // console.log(editor.$textElem)
                                // this.setState({
                                //     editorContent:this.state.editorContent+`<img src=${res.data.result[0]} style="width:100%"></img>`
                                // },()=>{
                                //     editor.txt.html(this.state.editorContent)
                                //     editor.selection.moveCursor(editor.selection.getSelectionEndElem().elems[0],0)
                                // })

                                resolve(res.data.result[0])
                            } else {
                                reject('error')
                            }
                        })
                    }

                })
                pArr.push(upLoadImg)

            }
            Promise.all(pArr).then(res => {
                const images = this.state.images
                images.push(res)
                this.setState({
                    images
                }, () => {
                    console.log(this.state.images)
                })
            })
        }
        editor.create()
        // console.log(this.props)
        this.props.html && editor.txt.html(this.props.html)
        if (this.state.isMini && this.state.isAndroid) {
            document.querySelector('input[type=file]').setAttribute('capture', 'environment')
            document.querySelector('input[type=file]').removeAttribute('accept')
            document.querySelector('input[type=file]').setAttribute('accept', 'image/*')
        }
        const img = document.getElementsByClassName('w-e-icon-image')[0]
        img.remove()
        const BtnImage = document.createElement('img')
        BtnImage.src = require('./Add_photos@3x.png')
        // BtnImage.style.width = pxTovw(192)
        // BtnImage.style.height = pxTovw(180)
        const Btn = document.getElementsByClassName('w-e-up-btn')[0].appendChild(BtnImage)
        document.querySelector('.w-e-toolbar .w-e-menu').style.width = 'auto'
        document.querySelector('.w-e-toolbar .w-e-menu').style.height = 'auto'
    }
    render() {
        return (
            <div className="editor">
                <div className="text-area" >
                    <div
                        style={{
                            padding: "0 10px",
                            overflowY: "scroll",
                        }}
                        ref={'editorElemBody'} className="editorElem-body"
                    // dangerouslySetInnerHTML={{__html:this.props.html}}
                    >
                        {/* {this.props.html} */}
                    </div>
                    <div ref={'editorElemMenu'}
                        className="editorElem-menu">
                    </div>
                </div>
            </div>
        )
    }
}
