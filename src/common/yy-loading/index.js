import React, { Component } from 'react'
import './index.scss'
const prefix = 'yy-loading'
export default class YYLoading extends Component {
  constructor(props) {
    super(props)
    this.state = {

    }
  }
  render() {
    return (
      <div className={`${prefix}-box`} >
        <img className={`${prefix}-img`} src={require('./loading.png')} style={{ width: '40%', maxWidth: '.6rem', maxHeight: '.6rem' }} />
        <div className={`${prefix}-title`}>加载中...</div>
      </div>
    )
  }
}