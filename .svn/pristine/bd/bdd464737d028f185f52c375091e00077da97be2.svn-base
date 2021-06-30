// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react'
import { compose } from 'recompose'
import { observer, inject } from 'mobx-react'
import './index.scss'
import http from '../../utlis/http'
import { jump } from '../../utlis/utlis'


let prefix = 'page-404'
class Page404 extends Component {
  constructor(props) {
    super(props)
    this.state = {

    }
  }
  componentDidMount() {
    document.title = '页面未找到'
  }

  toTest = () => {
    jump.call(this, '/test')
  }

  render() {
    return (
      <div className={`${prefix}-box`}>
        <img style={imgStyle} src={require('../../assets/imgs/wrong.png')}></img>
        <span>哦哦，页面找不到了~~</span>
      </div>
    )
  }
}

let imgStyle = {
  width: '100vw'
}
export default compose(
  observer,
  inject('store')
)(Page404)
