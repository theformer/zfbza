import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Toast, ListView, PullToRefresh, } from 'antd-mobile'
import { Activate, Deactivate, Release, Finish } from './../../common/yy-refresh-indiccator'
import './index.scss'

import {back, getUrlValue, jump, pxTovw, setTitle,getStorage,setStorage} from '../../utlis/utlis'
import http from "../../utlis/http";


const prefix = 'content'


class Content extends Component {
  constructor(props) {
    super(props);
    this.state = {
      flag:false,
      list:{},
      url:''
    }
  }
  getContentDetail(id){
    let data = {
        id:id
    }
    http.get({
      url: '/test/sys/news/query/zlb/news?id='+data.id,
        data
    }).then(res => {
        if(res.data.code==1){
          let a = res.data.data.content.match(/(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/)
          if(a !=null&&a.length>0){
            if(a[0].indexOf('http://') == 0 || a[0].indexOf('https://') == 0 ){
              this.setState({
                flag:true,
                url:a[0]
              })
            }
          }
          this.setState({
            list:res.data.data,
          })
        }
    })
  }
 async componentDidMount() {
    setTitle.call(this, '信息详情')

    let id
   await getStorage('wzid',res=>{
       id =  res
    })
    this.getContentDetail(id)

  }
  render() {
    const {list,flag,url } = this.state
    return(
      <div className={`${prefix}-content flex flex-column`}>
        {
          flag ?  <iframe className={`flex1 mt-bom`}  scrolling="auto" src={url}></iframe>:
               <React.Fragment>
                    <div className={`${prefix}-mes-title`}>
                          {list.title}
                    </div>
                    <div className={`${prefix}-title`}>
                           <span className={`${prefix}-title-city`}>{list.author}</span><span className={`${prefix}-title-date`}>{list.createTime}</span>
                    </div>
                    <div>
                           <img src={list.coverPicture} className={`${prefix}-list-img hiden-box`} />
                    </div>
                    <div className={`${prefix}-two-word`} dangerouslySetInnerHTML={{__html: list.content}}>
                    </div>
               </React.Fragment>
        }


        <div className={`${prefix}-footer  flex1 flex flex-between`}>
          {
            (() => {
              if(list.source==1){
                return <span className={`${prefix}-footer-public`}>转载</span>
              }
              return <span className={`${prefix}-footer-public`}>原创</span>
            })()
          }
          <span className={`${prefix}-footer-number`}>阅读量 {list.readNum}</span>
        </div>
      </div>

    )
  }
}

export default inject('store')(
  observer(Content)
)
