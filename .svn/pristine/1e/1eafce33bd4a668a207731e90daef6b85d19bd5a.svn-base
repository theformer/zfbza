import React from 'react'
import ReactDOM from 'react-dom'

import './index.scss'

let prefix = 'yykj-modal'
let ModalConfig = {
  title: '',
  titleColor: '#373737',
  headerBg: 'white',
  headerStyle: {},
  showHeaderLine: true,
  content: '内容',
  contentColor: '#373737',
  contentStyle: {},
  showContentLine: true,
  customHeader: false,
  customBody: false,
  customFooter: false,
  defaultBgHide: true,
  defaultConfirm: true,
  defaultCancel: true,
  confirmText: '确定',
  confirmColor: '#373737',
  confirmSize: '',
  cancelText: '取消',
  cancelColor: '#8e8e93',
  cancelSize: '',
  showCancel: true,
  ModalHeader: null,
  ModalBody: null,
  ModalFooter: null,
  onConfirm: () => {},
  onCancel: () => {},
  id: `${prefix}-${new Date().getTime()}`,
  renderComplete: () => {}
}
function hideModal(id) {
  let modalWrap = document.getElementById(id ? id : ModalConfig.id)
  if(modalWrap){
    ReactDOM.unmountComponentAtNode(modalWrap)
    modalWrap.parentNode && modalWrap.parentNode.removeChild && modalWrap.parentNode.removeChild(modalWrap)
  }
}
function showModal(config) {
  const {
    title, 
    titleColor,
    headerBg,
    content,
    contentColor,
    customHeader, 
    customBody, 
    customFooter, 
    defaultBgHide, 
    defaultConfirm, 
    defaultCancel, 
    confirmText, 
    confirmColor, 
    cancelText, 
    cancelColor, 
    showCancel,
    ModalHeader,
    ModalBody,
    ModalFooter,
    onConfirm,
    onCancel,
    id,
    renderComplete,
    headerStyle,
    contentStyle,
    showHeaderLine,
    showContentLine,
    confirmSize,
    cancelSize
  } = config
  let modalWrap = document.createElement('div')
  modalWrap.classList.add(`${prefix}-wrap`)
  modalWrap.id = id
  // modalWrap.onclick = function(e) {
  //     if(defaultBgHide) {
  //         close();
  //     }
  // }
  modalWrap.ontouchmove = function(e) {
    e.stopPropagation()
    return false
  }
  let modalBox = document.createElement('div')
  modalBox.classList.add(`${prefix}-box`)
  // modalBox.onclick = function(e) {
  //     e.stopPropagation();
  // }
  if(document.body.appendChild(modalWrap) && modalWrap.appendChild(modalBox)) {
    clearTimeout(showTimer)
    let showTimer = setTimeout(function() {
      modalWrap.classList.add(`${prefix}-wrap-show`)
      modalBox.classList.add(`${prefix}-box-show`)
      clearTimeout(showTimer)
    }, 0)
  }
  function close() {
    // modalWrap.classList.remove(`${prefix}-wrap-show`);
    // modalWrap.classList.add(`${prefix}-wrap-hide`);
    // modalBox.classList.remove(`${prefix}-box-show`);
    // modalBox.classList.add(`${prefix}-box-hide`);
    ReactDOM.unmountComponentAtNode(modalWrap)
    modalWrap.parentNode && modalWrap.parentNode.removeChild && modalWrap.parentNode.removeChild(modalWrap)
    // if(modalWrap) {
    //     clearTimeout(timer);
    //     let timer = setTimeout(function() {
    //         modalWrap.parentNode && modalWrap.parentNode.removeChild && modalWrap.parentNode.removeChild(modalWrap);
    //         clearTimeout(timer);
    //     }, 300)
    // }
  }
  function confirmEvent() {
    if(defaultConfirm) {
      close()
    }
    onConfirm()
  }
  function cancelEvent() {
    if(defaultCancel) {
      close()
    }
    onCancel()
  }
  ReactDOM.render(
    <div>
      <div className={`${prefix}-header ${showHeaderLine ? 'after-border-all' : ''}`}>
        {
          customHeader
            ? (
              ModalHeader
                ? <ModalHeader></ModalHeader>
                : null
            )
            : (
              title != ''
                ? (
                  <div className={`${prefix}-default-header`} style={Object.assign({background: headerBg}, headerStyle)}>
                    <span style={{color: titleColor}}>{title}</span>
                  </div>
                )
                : null
            )
        }
      </div>
      <div className={`${prefix}-body`}>
        {
          customBody
            ? (
              ModalBody
                ? <ModalBody></ModalBody>
                : null
            )
            : (
              <div className={`${prefix}-default-body ${showContentLine ? 'after-border-all' : ''}`} style={Object.assign({color: contentColor}, contentStyle)}>
                {content}
              </div>
            )
        }
      </div>
      <div className={`${prefix}-footer`}>
        {
          customFooter
            ? (
              ModalFooter
                ? <ModalFooter></ModalFooter>
                : null
            )
            : (
              <div className={`${prefix}-default-footer`}>
                {
                  <div className={`${prefix}-default-button-group`}>
                    {
                      showCancel
                        ? (
                          <span onClick={() => cancelEvent()} className={`${prefix}-default-cancel-button after-right-border`} style={{color: cancelColor, fontSize: cancelSize}}>{cancelText}</span>
                        )
                        : null
                    }
                    <span onClick={() => confirmEvent()} className={`${prefix}-default-confirm-button`} style={{color: confirmColor, width: showCancel ? '50%' : '100%', fontSize: confirmSize}}>{confirmText}</span>
                  </div>
                }
              </div>
            )
        }
      </div>
    </div>,
    modalBox,
    renderComplete
  )
}

export default {
  showModal: function(config) {
    config = {
      ...ModalConfig,
      ...config
    }
    showModal(config)
  },
  hideModal: function(id) {
    hideModal(id)
  }
}