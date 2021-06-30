import React, {Component} from 'react'
import Signals from 'signals'
import './index.scss'

function SmartSelect() {
  let _smartSelect = this
  _smartSelect.broadData = new Signals()
  _smartSelect.Datas = {
    showList: false
  }
  class Box extends Component{
    componentDidMount() {
      _smartSelect.Datas.handleChange = this.props.handleChange
      if(this.props.show) {
        _smartSelect.Datas.showList = true
      }
      _smartSelect.broadData.dispatch(_smartSelect.Datas)
    }
    componentWillUnmount() {
      _smartSelect.broadData.removeAll()
      _smartSelect.Datas.showList = false
    }
    render() {
      const {className} = this.props
      return (
        <div className={['select-box', className].join(' ')}>
          {this.props.children}
        </div>
      )
    }
  }

  class Title extends Component{
    constructor(props) {
      super(props)
      this.state = {
        showList: false,
      }
    }
    componentDidMount() {
      let that = this
      _smartSelect.broadData.addOnce(function(data) {
        that.setState({
          showList: data.showList
        })
      })
    }
    changeShowStatus() {
      this.setState({
        showList: !_smartSelect.Datas.showList
      })
      _smartSelect.Datas.showList = !_smartSelect.Datas.showList
      _smartSelect.broadData.dispatch(_smartSelect.Datas)
    }
    render() {
      const {className, iconClass} = this.props
      return (
        <div className={['select-title'].join(' ')} onClick={this.changeShowStatus.bind(this)}>
          <div className={['select-custom-title', className].join(' ')}>
            {this.props.children}
          </div>
          <span className={['select-icon',this.state.showList ? 'select-transform' :'select-transfor',  'icon-Mine_btn_next_d',iconClass].join(' ')} ></span>
        </div>
                
      )
    }
  }
  class List extends Component{
    constructor(props) {
      super(props)
      this.state = {
        showList: false
      }
    }
    componentDidMount() {
      let that = this
      _smartSelect.broadData.addOnce(function(data) {
        that.setState({
          showList: data.showList
        })
      })
    }
    changeShowList() {
      let that = this
      _smartSelect.broadData.addOnce(function(data) {
        that.setState({
          showList: data.showList
        })
      })
    }
    render() {
      const {className} = this.props
      this.changeShowList()
      return (
        <div className={['select-list', className, this.state.showList ? '' : 'select-list-hidden'].join(' ')}>
          {this.props.children}
        </div>
      )
    }
  }
  class Item extends Component{
    constructor(props) {
      super(props)
      this.state = {
        selected: props.selected,
        selectedId: '',
        selectedValue: ''
      }
    }
    componentDidMount() {
      if(this.state.selected) {
        _smartSelect.Datas.selectedId = this.props.id
        _smartSelect.Datas.selectedValue = this.props.value
        _smartSelect.broadData.dispatch(_smartSelect.Datas)
      }
    }
    setCurrent(params) {
      _smartSelect.broadData.addOnce(function(data) {
        data.handleChange({
          selectedId: data.selectedId,
          selectedValue: data.selectedValue
        })
      })
      this.setState({
        showList: !_smartSelect.Datas.showList
      })
      _smartSelect.Datas.showList = !_smartSelect.Datas.showList
      _smartSelect.Datas.selectedId = params.id
      _smartSelect.Datas.selectedValue =params.value
      _smartSelect.broadData.dispatch(_smartSelect.Datas)
    }
    getCurrent() {
      let that = this
      _smartSelect.broadData.addOnce(function(data) {
        that.setState({
          selectedId: data.selectedId,
          selectedValue: data.selectedValue
        })
      })
    }
    render() {
      this.getCurrent()
      const {id, value, className} = this.props
      return (
        <div id={id} value={value} className={['select-item'].join(' ')} onClick={this.setCurrent.bind(this, {id: id, value: value})}>
          <div className={['select-custom-item', className].join(' ')}>
            {this.props.children}
          </div>
          <span className={['select-icon', this.state.selectedId === id ? 'icon-Garage_icon_check-mark_d' : ''].join(' ')}></span>
        </div>
      )
    }
  }
    
  return {
    Box, 
    Title, 
    List, 
    Item
  }
}
export default SmartSelect