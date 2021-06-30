import React from 'react'
import ReactDOM from 'react-dom'

import './index.scss'

let prefix = 'yykj-simple-loading'
let LoadingConfig = {
  title: '',
  id: `${prefix}-${new Date().getTime()}`
}
function hideLoading(id) {
  let loadingWrap = document.getElementById(id ? id : LoadingConfig.id)
  if (loadingWrap) {
    ReactDOM.unmountComponentAtNode(loadingWrap)
    loadingWrap.parentNode && loadingWrap.parentNode.removeChild && loadingWrap.parentNode.removeChild(loadingWrap)
  }
}
function showLoading(config) {
  const {
    id
  } = config
  hideLoading(id)
  let loadingWrap = document.createElement('div')
  loadingWrap.classList.add(`${prefix}-wrap`)
  loadingWrap.id = id
  loadingWrap.ontouchmove = function (e) {
    e.stopPropagation()
    return false
  }
  document.body.appendChild(loadingWrap)
  function close() {
    ReactDOM.unmountComponentAtNode(loadingWrap)
    loadingWrap.parentNode && loadingWrap.parentNode.removeChild && loadingWrap.parentNode.removeChild(loadingWrap)
  }
  ReactDOM.render(
    <div className={`${prefix}-box-wrap`}>
      <div className={`${prefix}-box-out`}>
        <div className={`${prefix}-box`}>
          <div className={`${prefix}-line1`}></div>
          <div className={`${prefix}-line2`}></div>
          <div className={`${prefix}-line3`}></div>
          <div className={`${prefix}-line4`}></div>
          <div className={`${prefix}-line5`}></div>
          <div className={`${prefix}-line6`}></div>
          <div className={`${prefix}-line7`}></div>
          <div className={`${prefix}-line8`}></div>
          <div className={`${prefix}-line9`}></div>
          <div className={`${prefix}-line10`}></div>
          <div className={`${prefix}-line11`}></div>
          <div className={`${prefix}-line12`}></div>
        </div>
      </div>
    </div>,
    loadingWrap
  )
}
export default {
  show: function (config) {
    config = {
      ...LoadingConfig,
      ...config
    }
    showLoading(config)
  },
  hide: function (id) {
    hideLoading(id)
  }
}
