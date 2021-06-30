import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Toast, ImagePicker , Button } from 'antd-mobile'
import { Activate, Deactivate, Release, Finish } from './../../common/yy-refresh-indiccator'
import './index.scss'
import { back, jump, pxTovw } from '../../utlis/utlis'

const prefix = 'candicine'
Toast.config({
  mask: false
})

const data = [{
  url: "https://zos.alipayobjects.com/rmsportal/PZUUCKTRIHWiZSY.jpeg",
  id: '2121',
}, {
  url: "https://zos.alipayobjects.com/rmsportal/hqQWgTXdrlmVVYi.jpeg",
  id: '2122',
}];

class Candicine extends Component {
  constructor(props) {
    super(props);
    this.state = {
      files: data,
    }
  }
  componentDidMount() {

  }
  onChange = (files, type, index) => {
    // console.log(files, type, index);
    this.setState({
      files,
    });
  }
  render() {
    const { files } = this.state;
    return(
      <div className={`${prefix}-box`}>
        <div className={`${prefix}-noise-question`}>
          <div className={`${prefix}-noise-top`}>
            噪音问题
          </div>
          <div className={`${prefix}-noise-between`}>
          <textarea rows="10" defaultValue="请详细描述相关事宜">
            
          </textarea>
          </div>
          <div className={`${prefix}-noise-bottom`}>
            添加照片(3-5张)
            <ImagePicker
              files={files}
              onChange={this.onChange}
              onImageClick={(index, fs) => console.log(index, fs)}
              selectable={files.length < 5}
              accept="image/gif,image/jpeg,image/jpg,image/png"
        />
          </div>
          <div className={`${prefix}-footer-button`}>
            <Button disabled type="primary" className={`${prefix}-button`}>提交</Button>
          </div>
        </div>
        
      </div>
    )
  }
}


export default inject('store')(
  observer(Candicine)
)
