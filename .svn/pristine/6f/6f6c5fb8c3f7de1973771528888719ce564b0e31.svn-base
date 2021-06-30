import React, { Component } from 'react'
import { pxTovw } from '../../utlis/utlis'

export default class PEmpty extends Component {
  constructor(props){
    super(props)
  }
  render() {
    return (
      <div style={{marginTop:pxTovw(20),...this.props.style}}>
        <img src={require('./images/no_data.png')} style={{width:'100vw'}}></img>
        <div style={{color:'#666',fontSize:'14px',textAlign:'center',marginTop:'15px'}}>暂无数据</div>
      </div>
    )
  }
}
