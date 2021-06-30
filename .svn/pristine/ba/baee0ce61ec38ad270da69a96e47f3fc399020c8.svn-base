import React, { Component } from 'react'
import './index.scss'

const prefix = 'EmptyPage'
export class EmptyPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            content: this.props.content ? this.props.content : '暂无内容~',
            imgUrl: this.props.imgUrl ? this.props.imgUrl : '../../assets/imgs/myEmail-empty.png',
            width: this.props.width ? this.props.width : '212px',
            height: this.props.height ? this.props.height : '162px',
            bgcolor: this.props.bgcolor ? this.props.bgcolor : '#fff'
        }
    }
    render() {
        const { content, imgUrl, width, height, bgcolor } = this.state
        return (
            <div className={`${prefix}`} style={{ backgroundColor: `${bgcolor}` }}>
                <img src={imgUrl} className={`${prefix}-empty`} width={`${width}`} height={`${height}`} ></img>
                <p>{content}</p>
            </div>
        )
    }
}
