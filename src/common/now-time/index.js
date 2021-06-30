import React, {Component, useCallback} from 'react'
import './index.scss'

let prefix = 'now-time'
let timer = null

class NowTime extends Component {
  constructor(props) {
    super(props)
    this.state={
      timeYear:new Date().getFullYear(),
      timeMonth:(new Date().getMonth()+1)>9?(new Date().getMonth()+1):'0'+(new Date().getMonth()+1),
      timeData:new Date().getDate()>9?new Date().getDate():'0'+new Date().getDate(),
      timeHouse:new Date().getHours()>9?new Date().getHours():'0'+new Date().getHours(),
      timeMinutes:new Date().getMinutes()>9?new Date().getMinutes():'0'+new Date().getMinutes(),
      timeSeconds:new Date().getSeconds()>9?new Date().getSeconds():'0'+new Date().getSeconds()
    }
  }


  componentDidMount() {
    setInterval(() =>{
      this.setState({
        timeYear:new Date().getFullYear(),
        timeMonth:(new Date().getMonth()+1)>9?(new Date().getMonth()+1):'0'+(new Date().getMonth()+1),
        timeData:new Date().getDate()>9?new Date().getDate():'0'+new Date().getDate(),
        timeHouse:new Date().getHours()>9?new Date().getHours():'0'+new Date().getHours(),
        timeMinutes:new Date().getMinutes()>9?new Date().getMinutes():'0'+new Date().getMinutes(),
        timeSeconds:new Date().getSeconds()>9?new Date().getSeconds():'0'+new Date().getSeconds()
      })
    }, 1000);
  }
  render() {
    return (
       <div className={`${prefix}`}>
         <div className={`${prefix}-data`}>{this.state.timeYear+'-'+this.state.timeMonth+'-'+this.state.timeData}</div>
         <div className={`${prefix}-house`}>{this.state.timeHouse+':'+this.state.timeMinutes+':'+this.state.timeSeconds}</div>
       </div>
    )
  }
}



export default NowTime
