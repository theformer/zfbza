import React, { Component } from 'react'
import './index.scss'

let prefix = 'dialog-phone'
let timer = null
class Modal extends Component {
  constructor(props) {
    super(props)

  }


  componentWillUnmount() {
  }
  render() {
    return this.props.visible?(
        <div className="modal-mask">
          <div className="modal-wrap">
            <div className="header">
              <div className="title">短信验证</div>
            </div>
            <div className="body">
              {this.props.children}
            </div>
            <div className="footer">
              {this.props.quit?<div className="cancel" onClick={this.props.onCancel.bind(this)}>注销</div>: <div className="cancel" onClick={this.props.onCancel.bind(this)}>取消</div>}
              {this.props.quit? <div className="confirm" onClick={this.props.onConfirm.bind(this)}>取消</div>:<div className="confirm" onClick={this.props.onConfirm.bind(this)}>确定</div>}
            </div>
          </div>
        </div>
    ):(<span></span>)
  }
}



export default Modal
