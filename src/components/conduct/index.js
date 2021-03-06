/* eslint-disable no-console */
/* eslint-disable no-debugger */
// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Toast, ListView, PullToRefresh, } from 'antd-mobile'
import { Activate, Deactivate, Release, Finish } from './../../common/yy-refresh-indiccator'
import './index.scss'
import {back, ftTovw, jump, pxTovw, setTitle,setStorage,getStorage} from '../../utlis/utlis'
import http from '../../utlis/http'
import index from '../index'

const prefix = 'conduct'
Toast.config({
  mask: false
})

class Conduct extends Component {
  constructor(props) {
    super(props);
    // 声明实例
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    })
    this.state = {
      dataSource,
      isLoading: true,
      conductList: [],
      pageNum: [1],
      pageSize: 10,
    }
  }
  componentDidMount() {
    setTitle.call(this, '信息宣传')

    http.post({
      url: '/test/sys/news/query/list',
      data: {
      }
    }).then(res => {
      let data = res && res.data && res.data.data
      if (data) {
        this.setState({
          conductList: data
        })
      } else {

      }
    }).catch(() => {

    })
  }
  async onJumpTo(item){
   await setStorage('wzid',item.id)
    jump.call(this, '/content')
  }
  onEndReached = () => {
    if (!this.state.isLoading) {
      this.setState({
        isLoading: true
      }, () => {
      })
      let timer = setTimeout(() => {
        this.setState({
          loading: false
        })
        clearTimeout(timer)
      }, 1000)
    }
  }
  onRefresh = () => {

  }
  render() {
    const { dataSource, conductList, refreshing } = this.state
    const item = (item) => {
      return (
        <React.Fragment>
          <div className={`${prefix}-conduct`}>
            <div className={`${prefix}-list`}>
              <div className={`${prefix}-time`}>
                {item.createTime}
              </div>
              {
                item.dataArray.map((item) => {
                  return (
                    <div className={`${prefix}-list-content`} onClick={this.onJumpTo.bind(this,item)}>
                      <div className={`${prefix}-list-picture`}>
                        <img src={item.coverPicture} alt="loading" className={`${prefix}-list-img`} />
                      </div>
                      <div className={`${prefix}-word word-space-two`}>
                        {item.title}
                      </div>
                    </div>
                  )
                })
              }
            </div>
          </div>
        </React.Fragment>
      );
    };
    return (
      <div className="flex flex-column" style={{ height: '100vh', background: '#F4F7F9' }}>
        <ListView
          ref={el => this.lv = el}
          dataSource={dataSource.cloneWithRows(conductList)}
          renderFooter={() => (<div style={{ textAlign: 'center', fontSize: ftTovw(28), paddingBottom: pxTovw(80) }}>
            {this.state.isLoading ? '没有更多了~' : 'Loaded'}
          </div>)}
          renderRow={item}
          style={{
            height: '100%'
          }}
          pageSize={4}
          scrollRenderAheadDistance={500}
          onEndReached={this.onEndReached}
          onEndReachedThreshold={10}
          pullToRefresh={
            <PullToRefresh
              damping={pxTovw(120)}
              ref={el => this.ptr = el}
              refreshing={refreshing}
              onRefresh={this.onRefresh}
              distanceToRefresh={parseFloat(document.documentElement.style.fontSize)}
              indicator={{ activate: <Activate />, deactivate: <Deactivate />, release: <Release />, finish: <Finish /> }}
            >
            </PullToRefresh>
          }
        />
      </div>
    );
  }
}
// inject 将store注入到当Conduct组件的props中
export default inject('store')(
  observer(Conduct)
)
