import React, { Component } from "react";
import { inject, observer } from 'mobx-react';
import { jump, setTitle, pxTovw, getUrlValue, ftTovw, formatPhone } from '../../utlis/utlis'
import http from '../../utlis/http'
import { Toast, List, PullToRefresh, Button } from 'antd-mobile'
import { Activate, Deactivate, Release, Finish } from 'common/yy-refresh-indiccator'
import YYImage from 'common/yy-image'
import "./index.scss"


const prefix = 'log-details'
Toast.config({
  mask: false
})

class LogDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }
  componentWillMount() {
    // setTitle.call(this, '日志详情')
  }
  componentDidMount() {
  }
  render() {
    // const { dataSource, isLoading, refreshing, hasNextPage } = this.state
    // const item = (item) => {
      return (
        <React.Fragment>
          <div className={`${prefix}-box`}>
           <div className={`${prefix}-box-one`}>
            <div className={`${prefix}-box-title`}>绿化日志</div>
            <div className={`${prefix}-box-date`}>2021-4-17 </div>
           </div>
           <div className={`${prefix}-box-word`}>
              随着社会经济的不断发展，人们对生活环境的要求也逐步提高，
              因此，城市发展的过程中，积极地进行环保设施的建设具有重要意义；
                在城市造林绿化工作中苗木移栽是该工程建设的重点。在城市造林绿化工作中苗木移栽是该工程建设的重点。
           </div>
           <div className={`${prefix}-box-imgs`}>
            <img src={require('assets/imgs/propaganda_pic@2x.png')} className={`${prefix}-box-icon`} />
           </div>
           <div className={`${prefix}-box-word`}>
           随着社会经济的不断发展，人们对生活环境的要求也逐步提高，因此，城市发展的过程中，积极地进行环保设施的建设具有重要意义；

            在城市造林绿化工作中苗木移栽是该工程建设的重点。在城市造林绿化工作中苗木移栽是该工程建设的重点。
           </div>
          </div>
        </React.Fragment>
      );
    };
  // }
}

export default inject('store')(
  observer(LogDetails)
)