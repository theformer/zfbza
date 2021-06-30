import React from 'react'
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    // 更新 state 使下一次渲染能够显示降级后的 UI
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.log(error)
    // 你同样可以将错误日志上报给服务器
    // logErrorToMyService(error, info);
  }

  render() {
    if (this.state.hasError) {
      // 你可以自定义降级后的 UI 并渲染
      return (
        <div style={wrapStyle}>
          <img style={imgStyle} src={require('../../assets/imgs/wrong.png')}></img>
          <div>哦哦，出了点小问题~~</div>
        </div>
      )
    }

    return this.props.children
  }
}
let wrapStyle = {
  width: '100vw',
  height: '100vw',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  color: '#8e8e93',
  fontSize: '.32rem'
}
let imgStyle = {
  width: '100vw'
}