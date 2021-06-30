import React, {Component} from 'react'
import ReactDOM from 'react-dom'

import './slider.scss'

export default class Slider extends Component {
  constructor(props) {
    super(props)
    this.sliderLine = React.createRef()
    this.sliderBlock = React.createRef()
    this.state = {
      startX: 0,
      value: 2
    }
  }
  componentDidMount() {
    let sliderLine = this.sliderLine.current
    let sliderBlock = this.sliderBlock.current
    this.setState({
      left: sliderBlock.offsetLeft + sliderLine.offsetWidth / (this.props.max - this.props.min) * this.props.step,
      sliderWidth: sliderLine.offsetWidth,
      average: sliderLine.offsetWidth / (this.props.max - this.props.min),
      averageStep: sliderLine.offsetWidth / (this.props.max - this.props.min) * this.props.step
    })
  }
  touchStart(e) {
    this.setState({
      startX: e.touches[0].clientX
    })
  }
  touchMove(e) {
    let distance = e.touches[0].clientX - this.state.startX
    if(Math.abs(distance) > this.state.averageStep * 0.8) {
      let left = 0
      if(distance > 0) {
        left = this.state.left + this.state.averageStep
      }else if(distance < 0) {
        left = this.state.left - this.state.averageStep
      }
      if(left < 0) {
        left = 0
      }else if(left > this.state.sliderWidth) {
        left = this.state.sliderWidth
      }
      for(let i = 0; i < (this.props.max - this.props.min - 1); i++) {
        let markLine = this[`markLine${i}`].current
        if(markLine.offsetLeft < left) {
          markLine.style.background = '#6EDB43'
        }else {
          markLine.style.background = '#d8d8d8'
        }
      }
      this.setState({
        startX: e.touches[0].clientX,
        left:  left,
        value: Math.round(left / this.state.average) + parseInt(this.props.min)
      })
      this.props.bindChange && this.props.bindChange(Math.round(left / this.state.average) + parseInt(this.props.min))
    }

  }
  touchEnd(e) {

  }
  render() {
    const {min, max, step, bindChange} = this.props
    let arr = []
    for(let i = 0; i < (max - min - 1); i++) {
      arr.push(i)
      this[`markLine${i}`] = React.createRef()
    }
    return (
      <div className="slider-wrap">
        <div className="slider-line" ref={this.sliderLine}>
          <div style={{position: 'absolute', left: '0', top: '0', height: '100%', width: this.state.left + 'px', background: '#6EDB43'}}></div>
          {
            arr.map((item, index) => {
              return (<span className="slider-marking-line" ref={this[`markLine${index}`]} style={{left: (index + 1) * this.state.averageStep + 'px' }} key={index}></span>)
            })
          }
          <div 
            className="slider-block" 
            ref={this.sliderBlock}
            onTouchStart={this.touchStart.bind(this)} 
            onTouchMove={this.touchMove.bind(this)} 
            onTouchEnd={this.touchEnd.bind(this)}
            style={{left: this.state.left + 'px'}}
          >   
            <img className="slider-block-bg" src={require('../../assets/imgs/slider-block.png')}></img>
            <span className="slider-block-label">{this.state.value}个月</span>
          </div>
                    
        </div>
        <div className="slider-min-max">
          <span className="slider-min">{min < 10 ? '0' + min : min}</span>
          <span className="slider-max">{max < 10 ? '0' + max : max}</span>
        </div>
      </div>
    )
  }
}