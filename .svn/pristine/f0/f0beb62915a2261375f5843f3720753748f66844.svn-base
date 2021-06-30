import React, { Component } from 'react'
import Toast from '../toast'

import Keybord from './keybord'
import './index.scss'
import keybord from './keybord'

let prefix = 'yykj-car-number-input'
let timer = null
class CarNumberInput extends Component {
  constructor(props) {
    super(props)
    this.state={
      valueArr: this.props.value ? this.props.value.split('') : [],
      cursorLeft: 0,
      cursorRight: 0,
      cursorShow: false,
      align: this.props.align ? this.props.align : 'left',
      customStyle: this.props.customStyle ? this.props.customStyle : {},
      id: '',
      cursorIndex: 0,
      placeholder: this.props.placeholder || '请输入车牌号',
      fontSize: '.28rem',
      color: '#8e8e93'
    }
  }
  componentDidMount() {
    if(!this.props.bindChange) {
      throw '车牌输入未绑定\'bindChange\''
    }
    if(this.props.align && this.props.align !== 'left' && this.props.align !== 'right') {
      throw 'alin属性只支持\'left\'与\'right\''
    }
    let id = this.props.id
    let that = this
    if(!id) {
      id = `${prefix}-${new Date().getTime()}`
    }else {
      id = `${prefix}-${id}`
    }
    this.setState({
      id
    }, () => {
      document.body.addEventListener('click', (e) => {
        // console.log(e.target)
        if(e.target.dataset.id === that.state.id) {
          return
        }
        Keybord.hide(that.state.id)
      })
    })
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      valueArr: nextProps.value ? nextProps.value.split('') : []
    })
  }
  showKeyboard(e) {
    let that = this
    let id = this.state.id
    if(!keybord.getState(id) || !Keybord.getState(id).show) {
      Keybord.show({
        id,
        bindClick: this.bindClick.bind(this),
        bindDelete: this.bindDelete.bind(this),
        bindHide: this.bindHide.bind(this)
      })
    }
    let cursorIndex = 0
    let children = null
    if(e.target.className === `${prefix}-car-number-list`) {
      cursorIndex = that.state.valueArr.length
      children = e.target.children
    }else if(e.target.className === `${prefix}-car-number-item`) {
      cursorIndex = parseInt(e.target.dataset.index) + 1
      children = e.target.parentNode.children
    }
    that.setState({
      cursorIndex
    }, () => {
      // console.log(children)
      let currentCursorIndex = that.state.cursorIndex
      if(this.state.align === 'left') {
        let cursorLeft = 0
        for(let i = 0; i < currentCursorIndex; i++) {
          cursorLeft += children[i].offsetWidth
          // console.log(children[i].offsetWidth)
        }
        // console.log(cursorLeft)
        that.setState({
          cursorLeft
        })
      }else {
        let cursorRight = 0
        let length = 0
        if(children && children.length) {
          for(let i = children.length - 2; i >= currentCursorIndex; i--) {
            cursorRight += children[i].offsetWidth
            // console.log(children[i].offsetWidth)
          }

        }
                
        // console.log(cursorLeft)
        that.setState({
          cursorRight
        })
      }

      // console.log(currentCursorIndex);
    })
    clearInterval(timer)
    timer = setInterval(() => {
      that.setState({
        cursorShow: !this.state.cursorShow
      })
    }, 600)
    return false
  }
  bindClick(value) {
    let valueArr = this.state.valueArr
    let length = valueArr.length
    let currentCursorIndex = this.state.cursorIndex
    let that = this
    if(length === 0) {
      if(/^[A-Z]|[0-9]$/.test(value)) {
        Toast.showToast({
          title: '第一个字符应为汉字',
          icon: 'none'
        })
        return
      }
    }
    if(length >= 1) {
      if(currentCursorIndex === 0) {
        if(/^[A-Z]|[0-9]$/.test(value)) {
          Toast.showToast({
            title: '第一个字符应为汉字',
            icon: 'none'
          })
          return
        }
      }else if(currentCursorIndex != 6) {
        if(!(/^[A-Z]|[0-9]$/.test(value))) {
          Toast.showToast({
            title: '第二个字符开始应为字母或数字',
            icon: 'none'
          })
          return
        }
      }
    }
    if(length >= 8) {
      Toast.showToast({
        title: '最多8个字符',
        icon: 'none'
      })
      return
    }
    // valueArr.push(value);
    valueArr.splice(currentCursorIndex, 0, value)
    let children = this.refs[this.state.id].children

    this.setState({
      valueArr,
      cursorIndex: currentCursorIndex + 1
    }, () => {
      currentCursorIndex = this.state.cursorIndex
      if(this.state.align === 'left') {
        let cursorLeft = 0
        for(let i = 0; i < currentCursorIndex; i++) {
          cursorLeft += children[i].offsetWidth
          // console.log(children[i].offsetWidth)
        }
        // console.log(cursorLeft)
        that.setState({
          cursorLeft
        })
      }else {
        let cursorRight = 0
        for(let i = children.length - 2; i >= currentCursorIndex; i--) {
          cursorRight += children[i].offsetWidth
          // console.log(children[i].offsetWidth)
        }
        // console.log(cursorLeft)
        that.setState({
          cursorRight
        })
      }
      this.props.bindChange(valueArr.join(''))

    })
  }
  bindDelete() {
    let valueArr = this.state.valueArr
    let length = valueArr.length
    let currentCursorIndex = this.state.cursorIndex
    let that = this
    if(length > 0) {
      if(currentCursorIndex > 0) {
        valueArr.splice(currentCursorIndex - 1, 1)
      }
      let nextIndex = currentCursorIndex - 1
      this.props.bindChange(valueArr.join(''))
      this.setState({
        valueArr,
        cursorIndex: nextIndex < 0 ? 0 : nextIndex
      }, () => {
        let children = this.refs[this.state.id].children
        currentCursorIndex = this.state.cursorIndex
        if(this.state.align === 'left') {
          let cursorLeft = 0
          for(let i = 0; i < currentCursorIndex; i++) {
            cursorLeft += children[i].offsetWidth
            // console.log(children[i].offsetWidth)
          }
          // console.log(cursorLeft)
          that.setState({
            cursorLeft
          })
        }else {
          let cursorRight = 0
          for(let i = children.length - 2; i >= currentCursorIndex; i--) {
            cursorRight += children[i].offsetWidth
            // console.log(children[i].offsetWidth)
          }
          // console.log(cursorLeft)
          that.setState({
            cursorRight
          })
        }
      })
    }
  }
  bindHide() {
    clearInterval(timer)
    this.setState({
      cursorShow: false
    })
  }
  componentWillUnmount() {
    Keybord.hide(this.state.id)
  }
  render() {
    return (
      <div className={`${prefix}-wrap`} onClick={this.showKeyboard.bind(this)} data-id={this.state.id} style={this.state.customStyle}>
        {/* <span className={`${prefix}-car-number-key`}>车牌号</span> */}
        <div className={`${prefix}-car-number-list`} ref={this.state.id} data-id={this.state.id} style={{justifyContent: this.state.align === 'left' ? 'flex-start' : 'flex-end'}}>
          {
            this.state.valueArr.map((item, index) => {
              return (
                <div className={`${prefix}-car-number-item`} style={{fontSize: this.props.fontSize, color: this.props.color}} data-index= {index} data-id={this.state.id} key={index}>{item}</div>
              )
            })
          }
          {
            this.state.align === 'left' ? (
              <div className={`${prefix}-cursor`} data-id={this.state.id} style={{left: this.state.cursorLeft, display: this.state.cursorShow ? 'block' : 'none', height: '.32rem'}}></div>
            ): (
              <div className={`${prefix}-cursor`} data-id={this.state.id} style={{right: this.state.cursorRight, display: this.state.cursorShow ? 'block' : 'none', height: '.32rem', transform: 'translate(0, -50%)'}}></div>
            )
          }
          {
            !this.state.valueArr || this.state.valueArr.length <= 0 ? (
              <div className={`${prefix}-car-number-placeholder`} style={{fontSize: this.props.fontSize, color: '#8e8e93'}}>{this.state.placeholder}</div>
            ) : null
          }
        </div>
      </div>
    )
  }
}




export default CarNumberInput
