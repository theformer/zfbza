import React, { Component } from 'react'
import './index.scss'

export default class YYImage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isErr: false
    }
  }
  imgError() {
    this.setState({
      isErr: true
    })
  }
  render() {
    const { src, className, style, errImg, defaultImg, width, height } = this.props
    const { isErr } = this.state
    return (
      <React.Fragment>
        <img className={className} src={isErr ? (errImg || require('./default.png')) : (src || (defaultImg || require('./default.png')))} style={Object.assign({ width: width, height: height, display: 'flex' }, style)} onError={this.imgError.bind(this)} />
      </React.Fragment>
    )
  }
}