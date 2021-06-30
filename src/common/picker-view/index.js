import React, {Component} from 'react'

import './index.scss'

let prefix = 'picker-view'
class PickerView extends Component {
  constructor(props) {
    super(props)
    let wrapHeight = '100%'
    let columnWidth = `calc(100% / ${props.data.length})`
    if(props.cascade) {
      columnWidth = `calc(100% / ${props.columnNumber})`
    }
    let columnStyle = {
      width: columnWidth,
      height: 'auto',
      position: 'relative',
      overflow: 'hidden'
    }
    let hasCustomHeight = (props.itemSyle && props.itemSyle.height) || (props.indicatorStyle && props.indicatorStyle.height)
    if(hasCustomHeight) {
      wrapHeight = 'auto'
      columnStyle = {
        ...columnStyle,
        height: `calc(${props.itemStyle.height} * ${props.rowNumber - 1} + ${props.indicatorStyle.height})`
      }
    }
    let wrapStyle = {
      height: wrapHeight
    }
    let listStyle = {
      top: '0'
    }
    let indicatorStyle = {
      height: `calc(100% / ${props.rowNumber})`,
      width: '100%',
      borderBottom: '1px solid #ededed',
      borderTop: '1px solid #ededed',
      boxSizing: 'border-box',
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      ...props.indicatorStyle
    }
    let itemStyle = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      transition: 'all .2s cubic-bezier(0, 0, 0.2, 1.15)',
      fontSize: '.32rem',
      color: '#8e8e93',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      ...props.itemStyle
    }
    let currentIndexArr = []
    if(props.cascade) {
      currentIndexArr = generateArr(props.columnNumber)
      if(props.value && props.value.length > 0) {
        currentIndexArr = this.calculateCurrent(currentIndexArr, props.data, 0, props.value.length)
      }
    }else {
      currentIndexArr = generateArr(props.data.length)
      if(props.value && props.value.length > 0) {
        props.data.forEach((dataItem, dataIndex) => {
          dataItem.forEach((item, index) => {
            if(item.value === props.value[dataIndex]) {
              currentIndexArr[dataIndex] = index
            }
          })
        })
      }
    }
    let transArr = generateArr(props.data.length)
    if(props.cascade) {
      transArr = generateArr(props.columnNumber)
    }
    let columnArr = []
    if(props.columnNumber) {
      columnArr = generateArr(props.columnNumber)
    }
    this.calculateCurrent = this.calculateCurrent.bind(this)
    this.generateColumn = this.generateColumn.bind(this)
    this.getCascadeValue = this.getCascadeValue.bind(this)
    this.getCascadeLabel = this.getCascadeLabel.bind(this)
    this.state = {
      data: props.data,
      wrapStyle,
      columnStyle,
      listStyle,
      indicatorStyle,
      itemStyle,
      startY: 0,
      transArr,
      listTop: 0,
      currentIndexArr,
      value: props.value,
      cascade: props.cascade,
      columnArr,
    }
  }
  componentDidMount() {
    let transArrTemp = []
    if(this.props.cascade) {
      let value = this.getCascadeValue([], this.props.data, 0, this.props.columnNumber - 1)
      let label = this.getCascadeLabel([], this.props.data, 0, this.props.columnNumber - 1)
      this.props.bindChange(value, label)
    }

    if((!this.props.itemStyle || !this.props.itemStyle.height) && (!this.props.indicatorStyle || !this.props.indicatorStyle.height)) {
      this.setState(prevState => {
        return {
          average: this.refs['column0'] && this.refs['column0'].offsetHeight / this.props.rowNumber,
          listStyle: {
            top: this.refs['column0'] && this.refs['column0'].offsetHeight / this.props.rowNumber * ((this.props.rowNumber - 1 )/ 2) + 'px'
          },
          itemStyle: {
            ...prevState.itemStyle,
            height: this.refs['column0'] && this.refs['column0'].offsetHeight / this.props.rowNumber
          },
        }
      }, () => {
        this.state.transArr.forEach((item, index)=> {
          transArrTemp[index] = -this.state.currentIndexArr[index] * this.state.average
          this[`lastTrans${index}`] = transArrTemp[index]
        })
        this.setState({
          transArr: transArrTemp,
        })
      })
    }else {
      this.setState({
        average: (this.refs['column0'] && this.refs['column0'].offsetHeight - this.refs['indicator0'].offsetHeight) / (this.props.rowNumber -1),
        listStyle: {
          top: `calc(${this.props.itemStyle.height} * ${(this.props.rowNumber - 1) / 2})`
        }
      }, () => {
        this.state.transArr.forEach((item, index)=> {
          transArrTemp[index] = -this.state.currentIndexArr[index] * this.state.average
          this[`lastTrans${index}`] = transArrTemp[index]
        })
        this.setState({
          transArr: transArrTemp
        })
        // console.log(transArrTemp);
      })
    }
    this.setState({
      indicatorHeight: this.refs['indicator0'] && this.refs['indicator0'].offsetHeight
    })
  }
  touchStart(index, e) {
    e.persist()
    this.setState({
      startY: e.touches[0].clientY,
      listStyle: {
        ...this.state.listStyle,
        transition: 'none'
      }
    })
  }
  touchMove(index, e) {

    e.persist()
    if(this.refs[`list${index}`].children&&this.refs[`list${index}`].children.length > 1) {
      let distance = e.touches[0].clientY - this.state.startY
      if(!this[`lastTrans${index}`]) {
        this[`lastTrans${index}`] = 0
      }
      if(this.props.cascade) {
        for(let i = 0; i < this.props.columnNumber; i++) {
          if(i > index) {
            this[`lastTrans${i}`] = 0
          }
        }
      }
      let trans = distance / 2 + this[`lastTrans${index}`]
      let transArrTemp = []
      this.state.transArr.forEach((item, itemIndex) => {
        if(this.props.cascade && itemIndex > index) {
          transArrTemp.push(0)
        }else {
          transArrTemp.push(item)
        }

      })
      transArrTemp[index] = trans

      let currentIndex = Math.round(Math.abs(trans / this.state.average))
      if(trans > 0) {
        currentIndex = 0
      }
      if(trans < -this.refs[`list${index}`].offsetHeight + this.refs[`indicator${index}`].offsetHeight) {
        currentIndex = this.refs[`list${index}`].children.length - 1
      }
      let indexArrTemp = []
      this.state.currentIndexArr.forEach((item, itemIndex) => {
        if(this.props.cascade && itemIndex > index) {
          indexArrTemp.push(0)
        }else {
          indexArrTemp.push(item)
        }
      })
      indexArrTemp[index] = Math.abs(currentIndex)
      this.setState({
        listStyle: {
          ...this.state.listStyle,
          transition: 'all .5s cubic-bezier(0, 0, 0.2, 1.15)'
        }
      }, () => {
        this.setState({
          transArr: transArrTemp,
          currentIndexArr: indexArrTemp
        }, () => {
          if(this.props.cascade) {
            let value = this.getCascadeValue([], this.props.data, 0, this.props.columnNumber - 1)
            let label = this.getCascadeLabel([], this.props.data, 0, this.props.columnNumber - 1)
            this.props.bindChange && this.props.bindChange(value, label)
          }else {
            let data = this.props.data[index]
            let currentArr = this.state.currentIndexArr
            let value = currentArr.map((item) => data[item].value)
            let label = currentArr.map((item) => data[item].label)
            this.props.bindChange && this.props.bindChange(value, label)
          }
        })
      })
    }
  }
  touchEnd(index, e) {
    e.persist()
    if(this.refs[`list${index}`].children&&this.refs[`list${index}`].children.length > 1) {
      let trans = this.state.transArr[index]
      if(trans > 0) {
        trans = 0
      }else if(trans < -(this.refs[`list${index}`].children.length - 1) * this.state.average) {
        trans = -(this.refs[`list${index}`].children.length - 1) * this.state.average
      } else {
        trans = Math.round(trans / this.state.average) * this.state.average
      }
      this[`lastTrans${index}`] = trans
      let transArrTemp = []
      this.state.transArr.forEach(item => {
        transArrTemp.push(item)
      })
      transArrTemp[index] = trans
      this.setState({
        listStyle: {
          ...this.state.listStyle,
          transition: 'all .5s cubic-bezier(0, 0, 0.2, 1.15)'
        }
      }, function() {
        this.setState({
          transArr: transArrTemp
        })
      })
    }
    // console.log(this.state.currentIndexArr);
  }
  getCascadeValue(value, arr, index, length) {
    let currentArr = arr[this.state.currentIndexArr[index]]
    value.push(currentArr && currentArr.value)
    ++index
    if(index > length) {
      return value
    }
    return this.getCascadeValue(value, currentArr.children, index, length)
  }
  getCascadeLabel(label, arr, index, length) {
    let currentArr = arr[this.state.currentIndexArr[index]]
    label.push(currentArr && currentArr.label)
    ++index
    if(index > length) {
      return label
    }
    return this.getCascadeLabel(label, currentArr.children, index, length)
  }
  calculateCurrent(currentIndexArr, arr, index, length) {
    let temp = []
    arr.forEach((dataItem, dataIndex) => {
      if(dataItem.value === this.props.value[index]) {
        currentIndexArr[index] = dataIndex
        temp = dataItem.children
      }
    })
    index++
    if(index >= length) {
      return currentIndexArr
    }
    return this.calculateCurrent(currentIndexArr, temp, index, length)
  }
  generateColumn(columnArr, dataArr, index, length) {
    let temp = []
    let column = <div
      ref={`column${index}`}
      className={`${prefix}-column`}
      key={index}
      style={this.state.columnStyle}
      onTouchStart={this.touchStart.bind(this, index)}
      onTouchMove={this.touchMove.bind(this, index)}
      onTouchEnd={this.touchEnd.bind(this, index)}>
      <div ref={`indicator${index}`} className={`${prefix}-indicator`} style={this.state.indicatorStyle}></div>
      <div
        ref={`list${index}`} className={`${prefix}-list`}
        style={{...this.state.listStyle, transform: `translate(0, ${this.state.transArr[index]}px)`}}>
        {
          dataArr.map((dataItem, dataIndex) => {
            return (
              this.state.currentIndexArr[index] === dataIndex
                ? <div key={dataIndex} className={`${prefix}-item`}
                  style={{...this.state.itemStyle, height: `${this.state.indicatorHeight}px`, color: '#333', fontSize: '.36rem'}}>
                  {dataItem.label}
                </div>
                : (
                  Math.abs(this.state.currentIndexArr[index] - dataIndex) <= (this.props.rowNumber - 1) / 2
                    ? <div key={dataIndex} className={`${prefix}-item`} style={{...this.state.itemStyle, opacity: `${((this.props.rowNumber - 1) / 2 - Math.abs(this.state.currentIndexArr[index] - dataIndex)) * 2 / 10 + 0.2}`}}>
                      {dataItem.label}
                    </div>
                    : <div key={dataIndex} className={`${prefix}-item`} style={{...this.state.itemStyle, opacity: '0.2'}}>
                      {dataItem.label}
                    </div>
                )
            )
          })
        }
      </div>
    </div>
    columnArr.push(column)
    let data = dataArr[this.state.currentIndexArr[index]] && dataArr[this.state.currentIndexArr[index]].children
    ++index
    if(index >= length) {
      return columnArr
    }
    return this.generateColumn(columnArr, data, index, length)
  }
  render() {
    return (
      <div className={`${prefix}-wrap`} style={this.state.wrapStyle}>
        {
          this.state.cascade

            ? this.generateColumn([], this.state.data, 0, this.props.columnNumber).map((item) => {
              return item
            })

            :this.state.data.map((item, index) => {
              return (
                <div
                  ref={`column${index}`}
                  className={`${prefix}-column`}
                  key={index}
                  style={this.state.columnStyle}
                  onTouchStart={this.touchStart.bind(this, index)}
                  onTouchMove={this.touchMove.bind(this, index)}
                  onTouchEnd={this.touchEnd.bind(this, index)}>
                  <div ref={`indicator${index}`} className={`${prefix}-indicator`} style={this.state.indicatorStyle}></div>
                  <div
                    ref={`list${index}`} className={`${prefix}-list`}
                    style={{...this.state.listStyle, transform: `translate(0, ${this.state.transArr[index]}px)`}}>
                    {
                      item.map((dataItem, dataIndex) => {
                        return (
                          this.state.currentIndexArr[index] === dataIndex
                            ? <div key={dataIndex} className={`${prefix}-item`}
                              style={{...this.state.itemStyle, height: `${this.state.indicatorHeight}px`, color: '#333', fontSize: '.36rem'}}>
                              {dataItem.label}
                            </div>
                            : (
                              Math.abs(this.state.currentIndexArr[index] - dataIndex) <= (this.props.rowNumber - 1) / 2
                                ? <div key={dataIndex} className={`${prefix}-item`} style={{...this.state.itemStyle, opacity: `${((this.props.rowNumber - 1) / 2 - Math.abs(this.state.currentIndexArr[index] - dataIndex)) * 2 / 10 + 0.2}`}}>
                                  {dataItem.label}
                                </div>
                                : <div key={dataIndex} className={`${prefix}-item`} style={{...this.state.itemStyle, opacity: '0.2'}}>
                                  {dataItem.label}
                                </div>
                            )
                        )
                      })
                    }
                  </div>
                </div>
              )
            })
        }
      </div>
    )
  }
}
function generateArr(length) {
  let temp = []
  for(let i = 0; i < length; i++) {
    temp.push(0)
  }
  return temp
}
PickerView.defaultProps = {
  rowNumber: 5,
  cascade: false
}
export default PickerView
