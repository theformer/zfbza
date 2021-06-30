import React, { useState } from 'react'
import ReactDOM from 'react-dom'

import './keybord.scss'

let prefix = 'yykj-keybord'
const provinceList = {
  line1: ['京', '津', '渝', '沪', '冀', '晋', '辽', '吉', '黑', '苏'],
  line2: ['浙', '皖', '闽', '赣', '鲁', '豫', '鄂', '湘', '粤', '琼'],
  line3: ['川', '贵', '云', '陕', '甘', '青', '蒙', '桂', '宁', '新'],
  line4: ['藏', '使', '领', '警', '学', '港', '澳']
}
const letterNumberList = {
  line1: [1, 2, 3, 4, 5, 6, 7, 8, 9, 0],
  line2: ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  line3: ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  line4: ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
}
let KeybordConfig = {
  id: `${prefix}-${new Date().getTime()}`
}
let State = {}
let finalConfig = {}
function PanelList(props) {
  const [province, setPronvince] = useState(true)
  const [value, setValue] = useState('')
  const [list, setList] = useState(provinceList)
  return (
    <div className={`${prefix}-list`}>
      {
        Object.keys(list).map(provinceItem => {

          return (
            <div className={[`${prefix}-item-list`].join(' ')} key={provinceItem}>
              {
                provinceItem != 'line4' ? (
                  <div style={{width: !province && provinceItem === 'line3' ? 'calc(100% - .76rem)' : '100%', display: 'flex', justifyContent: 'space-between', margin: '0 auto'}}>
                    {
                      list[provinceItem].map((item, index) => {
                        return item === 'I' || item === 'O' ? (
                          <div
                            className={[`${prefix}-item`, `${prefix}-item-active`].join(' ')}
                            key={index}
                            style={{color: '#373737'}}
                          >{item}</div>
                        ):(
                          <div
                            className={[`${prefix}-item`, value === item ? `${prefix}-item-active` : ''].join(' ')}
                            key={index}
                            onTouchStart={() => {
                              setValue(item)
                            }}
                            onTouchEnd={() => {
                              if(province) {
                                setPronvince(false)
                                setList(letterNumberList)
                              }
                              setValue('')
                              props.bindClick(item)
                            }}
                          >{item}</div>
                        )
                      })
                    }
                  </div>
                ) : (
                  <div className={[`${prefix}-item-list`].join(' ')}>
                    <div
                      className={[`${prefix}-item-switch`].join(' ')}
                      // onClick={() => {
                      //     setPronvince(!province);
                      //     setList(province ? letterNumberList : provinceList);
                      // }}
                      onTouchEnd={() => {
                        setPronvince(!province)
                        setList(province ? letterNumberList : provinceList)
                      }}
                      style={{ fontSize: '.32rem', marginRight: '.3rem'}}
                    >{province ? 'ABC' : '省'}</div>
                    <div style={{width: 'calc(100% - 2.2rem)', display: 'flex', justifyContent: 'space-between'}}>
                      {
                        list.line4.map((item, index) => {
                          return <div
                            className={[`${prefix}-item`, value === item ? `${prefix}-item-active` : ''].join(' ')}
                            key={index}
                            onTouchStart={() => {
                              setValue(item)
                            }}
                            onTouchEnd={() => {
                              if(province) {
                                setPronvince(false)
                                setList(letterNumberList)
                              }
                              setValue('')
                              props.bindClick(item)
                            }}
                          >{item}</div>
                        })
                      }
                    </div>
                    <div
                      className={[`${prefix}-item-delete`, value === 'delete' ? `${prefix}-item-delete-active` : ''].join(' ')}
                      onTouchStart={() => {
                        setValue('delete')
                      }}
                      onTouchEnd={() => {
                        setValue('')
                        props.bindDelete()
                      }}
                      style={{marginLeft: '.3rem'}}
                    >
                      <img className={`${prefix}-item-delete-img`} src={require('../../assets/imgs/keybord/Garage_icon_Delete_d@2x.png')} />
                    </div>
                  </div>
                )
              }
            </div>
          )
        })
      }
    </div>
  )
}
function hide(id) {
  let keybordWrap = document.getElementById(id ? id : KeybordConfig.id)
  if (keybordWrap) {
    finalConfig.bindHide()
    keybordWrap.classList.add(`${prefix}-wrap-hide`)
    clearTimeout(timeout)
    let timeout = setTimeout(() => {
      ReactDOM.unmountComponentAtNode(keybordWrap)
      keybordWrap.parentNode && keybordWrap.parentNode.removeChild && keybordWrap.parentNode.removeChild(keybordWrap)
      State[id] = {}
      State[id]['show'] = false
      clearTimeout(timeout)
    }, 300)
  }
}
function show(config) {
  const {
    id
  } = config
  let LastKeybordWrapList = document.getElementsByClassName(`${prefix}-wrap`)
  if (LastKeybordWrapList.length > 0) {
    let LastKeybordWrap = LastKeybordWrapList[0]
    if (LastKeybordWrap.id != id) {
      State[LastKeybordWrap.id] = {}
      State[LastKeybordWrap.id]['show'] = false
      hide(LastKeybordWrap.id)
    }
  }
  hide(id)
  let keybordWrap = document.createElement('div')
  keybordWrap.classList.add(`${prefix}-wrap`)
  keybordWrap.id = id || KeybordConfig.id
  keybordWrap.ontouchmove = function (e) {
    e.stopPropagation()
    e.preventDefault()
    return false
  }
  keybordWrap.onclick = function(e) {
    e.stopImmediatePropagation()
    e.stopPropagation()
  }
  document.body.appendChild(keybordWrap)
  State[id] = {}
  State[id]['show'] = true
  ReactDOM.render(
    <div className={`${prefix}-box`}>
      <div className={`${prefix}-navbar`}>
        <div className={`${prefix}-complete-button`} onTouchEnd={(e) => {
          hide(id)
        }}>完成</div>
      </div>
      <div className={`${prefix}-panel`}>
        <PanelList bindClick={config.bindClick} bindDelete={config.bindDelete}></PanelList>
      </div>
    </div>,
    keybordWrap
  )
}
export default {
  show: function (config) {
    config = {
      ...KeybordConfig,
      ...config
    }
    finalConfig = config
    show(config)
  },
  hide: function (id) {
    hide(id)
  },
  getState(id) {
    return State[id]
  }
}
