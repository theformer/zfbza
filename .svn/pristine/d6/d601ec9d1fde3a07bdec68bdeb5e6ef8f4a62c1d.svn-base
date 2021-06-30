import React, {Component} from 'react'
import './index.scss'
let prefix = 'slide-delete'

export default class SlideDelete extends Component {
  constructor (props) {
    super(props)
    this.state = {
      lastX: 0,
      lastY: 0,
      currentX: 0,
      currentY: 0,
      down: false,
      trans: 0,
      maxTrans: this.props.maxTrans ? this.props.maxTrans : -100,
      reset: this.props.reset
    }
  }
  componentDidMount () {
    if (!this.props.bindDelete) {
      console.warn(`未在组件slide-delete绑定bindDelete事件${this.props.id !== undefined ? `,组件id: ${this.props.id}` : ''}`)
    }
  }
  componentWillReceiveProps (nexProps) {
    if(nexProps.reset != this.state.reset) {
      this.setState({
        trans: 0,
        reset: nexProps.reset
      })
    }
  }
  onTouchStart (e) {
    e.persist()
    this.setState({
      lastX: e.touches[0].clientX,
      lastY: e.touches[0].clientY,
      down: true
    })
  }
  onTouchMove (e) {
    e.persist()
    if (this.state.down) {
      let disX = e.touches[0].clientX - this.state.lastX
      let disY = e.touches[0].clientY - this.state.lastY
      let absDisX = Math.abs(disX)
      let absDisY = Math.abs(disY)
      let length = Math.sqrt(absDisX * absDisX + absDisY * absDisY)
      let cosValue = absDisX / length
      let angle = Math.acos(cosValue)
      if (angle < Math.PI / 8) {
        let currentTrans = this.state.trans + disX
        if(currentTrans >= 0) {
          currentTrans = 0
        } else if (currentTrans <= this.state.maxTrans) {
          currentTrans = this.state.maxTrans
        }
        this.setState({
          trans: currentTrans,
        }, () => {
          this.setState({
            lastX: e.touches[0].clientX,
            lastY: e.touches[0].clientY,
            imgWidth: -this.state.trans
          })
        })
      } 

    }
  }
  onTouchEnd (e) {
    e.persist()
    this.setState({
      down: false
    }, () => {
      let trans = this.state.trans
      if (trans > -50) {
        trans = 0
      } else {
        trans = this.state.maxTrans
      }
      this.setState({
        trans,
        imgWidth: -trans
      })
    })
  }
  bindDelete () {
    this.props.bindDelete && this.props.bindDelete()
  }
  render () {
    return (
      <div className={`${prefix}-box`} onTouchStart={this.onTouchStart.bind(this)} onTouchMove={this.onTouchMove.bind(this)} onTouchEnd={this.onTouchEnd.bind(this)}>
        <img onClick={this.bindDelete.bind(this)} className={`${prefix}-delete-img`} src={require('../../assets/imgs/delete.png')} style={{width: `${this.state.imgWidth / 100}rem`, height: `${this.state.imgWidth / 100}rem`}}></img>
        <div className={`${prefix}-content`} style={{transform: `translate(${this.state.trans / 100}rem)`}}>
          { this.props.children }
        </div>
      </div>
    )
  }
}