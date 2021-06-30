import React from 'react'
import ReactDOM from 'react-dom'
import './index.scss'
const ActionConfig = {
  customHeader: false,
  customBody: false,
  customFooter: false,
  ActionFooter: null,
  ActionBody: null,
  ActionHeader: null,
  title: '标题',
  confirmIcon: 'icon-Garage_icon_check-mark_d',
  cancelIcon: 'icon-Garage_icon_cancel_d',
  confirmText: '确定',
  cancelText: '取消',
  useIcon: true,
  headerHandel: true,
  defaultConfirm: true,
  defaultCancel: true,
  itemStyle: {},
  onConfirm: () => {},
  onCancel: () => {}
}
let queue = {}
function createActionSheet(config) {
  let actionWrap = document.createElement('div')
  actionWrap.className = 'action-wrap'
  actionWrap.addEventListener('touchmove', function(e) {
    // close();
    e.preventDefault()
    return false
  },{ passive: false })
  actionWrap.addEventListener('click', function(e) {
    // close();
    // e.preventDefault();
    return false
  },{ passive: false })
  document.body.appendChild(actionWrap)
  let actionBox = document.createElement('div')
  actionBox.className = 'action-box'
  actionBox.addEventListener('touchmove', function(e) {
    // e.stopPropagation();
    return false
  })
  actionWrap.appendChild(actionBox)
  document.body.appendChild(actionWrap)
  function close() {
    actionWrap.className = 'action-wrap-hide'
    actionBox.className = 'action-box-hide'
    let timer = setTimeout(function() {
      ReactDOM.unmountComponentAtNode(actionWrap)
      if(actionWrap) {
        actionWrap.parentNode && actionWrap.parentNode.removeChild && actionWrap.parentNode.removeChild(actionWrap)
      }
      clearTimeout(timer)
    }, 200)
        
  }
  function cancelEvent() {
    if(config.defaultCancel)
      close()
    config.onCancel()
  }
  function confirmEvent() {
    if(config.defaultConfirm)
      close()
    config.onConfirm()
  }
  queue['close'] = close
  let children = (
    <div>
      <div className="action-item" style={config.itemStyle}>
        {config.customHeader ? (config.ActionHeader ? <config.ActionHeader />  : null ) : (
          <div className="action-header">
            {config.headerHandel && config.useIcon ? <span className={config.cancelIcon} onClick={() => cancelEvent()}></span> : null}
            {config.headerHandel && !config.useIcon ? <span onClick={() => cancelEvent()}>{config.cancelText}</span> : null}
            <span>{config.title}</span>
            {config.headerHandel && config.useIcon ? <span className={config.confirmIcon} onClick={() => confirmEvent()}></span> : null}
            {config.headerHandel && !config.useIcon ? <span onClick={() => confirmEvent()}>{config.confirmText}</span> : null}
          </div>
        )}
                
        {config.customBody ? (config.ActionBody ? <config.ActionBody /> : null) : (
          <div className="action-body">
          </div>
        )}
                
      </div>
      {config.customFooter ?(config.ActionFooter ? <config.ActionFooter /> : null) : (
        <div className="action-footer" onClick={() => cancelEvent()}>
                    取消
        </div>
      )}
            
    </div>
  )
  ReactDOM.render(
    <div>
      {children}
    </div>,
    actionBox
  )
  return {
    close
  }
}
export default {
  show(config) {
    config = {
      ...ActionConfig,
      ...config
    }
    createActionSheet(config)
  },
  hide() {
    queue.close && queue.close()
  },
}