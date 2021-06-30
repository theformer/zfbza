import React, { Component } from 'react'
import './index.scss'
const prefix = 'yy-refresh-indicator'

export function Activate() {
  return (
    <div className={`${prefix}-activate`}>
      <img className={`${prefix}-activate-img`} src={require('./arrows_down.png')} />
      <div className={`${prefix}-activate-tip`}>松开立即刷新</div>
    </div>
  )
}

export function Deactivate() {
  return (
    <div className={`${prefix}-deactivate`}>
      <img className={`${prefix}-deactivate-img`} src={require('./arrows_down.png')} />
    </div>
  )
}

export function Release() {
  return (
    <div className={`${prefix}-release`}>
      <img className={`${prefix}-release-img`} src={require('./loading.png')} />
      <div className={`${prefix}-activate-tip`}>加载中...</div>
    </div>
  )
}

export function Finish() {
  return (
    <div className={`${prefix}-release`}>
      {/* <img className={`${prefix}-finish-img`} src={require('./loading.png')} /> */}
      <div className={`${prefix}-activate-tip`}>刷新完成</div>
    </div>
  )
}