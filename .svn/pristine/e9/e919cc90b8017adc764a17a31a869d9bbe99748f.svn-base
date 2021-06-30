import React from 'react'
import ReactDOM from 'react-dom'

import './index.scss'

let prefix = 'yykj-loading'
let LoadingConfig = {
  title: '',
  id: `${prefix}-${new Date().getTime()}`
}
function hideLoading(id) {
  let loadingWrap = document.getElementById(id ? id : LoadingConfig.id)
  if(loadingWrap) {
    ReactDOM.unmountComponentAtNode(loadingWrap)
    loadingWrap.parentNode && loadingWrap.parentNode.removeChild && loadingWrap.parentNode.removeChild(loadingWrap)
  }
}
function showLoading(config) {
  const {
    title,
    id
  } = config
  hideLoading(id)
  let loadingWrap = document.createElement('div')
  loadingWrap.classList.add(`${prefix}-wrap`)
  loadingWrap.id = id
  loadingWrap.ontouchmove = function(e) {
    e.stopPropagation()
    return false
  }
  document.body.appendChild(loadingWrap)
  function close() {
    ReactDOM.unmountComponentAtNode(loadingWrap)
    loadingWrap.parentNode && loadingWrap.parentNode.removeChild && loadingWrap.parentNode.removeChild(loadingWrap)
  }
  ReactDOM.render(
    <div className={`${prefix}-box`}>
      <div className={`${prefix}-icon-box`} style={{height: title ? '1.2rem' : '1.8rem'}}>
        {/* <span className={`${prefix}-icon`}></span> */}
        {/* <img src={require("../../assets/imgs/loading/Load_animation1@2x.png")} className={`${prefix}-icon`} /> */}
      </div>
      {
        title
          ? (
            <div className={`${prefix}-title`}>
              {title}
            </div>
          )
          : null
      }
    </div>,
    loadingWrap
  )
}
export default {
  showLoading: function(config) {
    config = {
      ...LoadingConfig,
      ...config
    }
    showLoading(config)
  },
  hideLoading: function(id) {
    hideLoading(id)
  }
}
