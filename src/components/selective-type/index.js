import React, { Component } from "react";
import { inject, observer } from 'mobx-react';
import { jump, setTitle, pxTovw, getUrlValue, ftTovw, formatPhone } from '../../utlis/utlis'
import http from '../../utlis/http'
import { Toast } from 'antd-mobile'
import { Activate, Deactivate, Release, Finish } from 'common/yy-refresh-indiccator'
import YYImage from 'common/yy-image'

import "./index.scss";

const prefix = 'selective-type'
Toast.config({
  mask: false
})

class SelectiveType extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectList: []
    }
  }
  componentWillMount() {
    // setTitle.call(this, '选择类型')
  }
  componentDidMount() {
  }
  render() {
    return(
      <div className={`${prefix}-select`}>
        <div className={`${prefix}-select-type`}>
          <div className={`${prefix}-select-list flex`}>
            <div className={`${prefix}-select-item flex1`}>
              居家报修
            </div>
            <div className={`${prefix}-select-radio`}>
              <input type="radio"></input>
            </div>
          </div>
          <div className={`${prefix}-select-list flex`}>
            <div className={`${prefix}-select-item flex1`}>
              小区报修
            </div>
            <div className={`${prefix}-select-radio`}>
              <input type="radio"></input>
            </div>
          </div>
        </div>
      </div>
      
    )
  }
}

export default inject('store')(
  observer(SelectiveType)
)