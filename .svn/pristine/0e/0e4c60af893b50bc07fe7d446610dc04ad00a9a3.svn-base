/* eslint-disable no-console */
/* eslint-disable no-debugger */
// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import {Toast, Button, WhiteSpace, Tabs, Badge, ListView, PullToRefresh} from 'antd-mobile'
import './index.scss'
import {back, ftTovw, jump, pxTovw, setTitle,setStorage,getStorage} from '../../utlis/utlis'
import http from '../../utlis/http'
import { Activate, Deactivate, Release, Finish } from 'common/yy-refresh-indiccator'        //下拉刷新的状态

const prefix = 'message-list'


Toast.config({
    mask: false
})
class Index extends Component {
    constructor(props) {
        super(props)
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        })
        this.state={
            a : [
                {name:'大风起兮风飞扬',
                    title:'水景苑-1-A-201新增业主王某人，联系电话19957708465',
                    time:'2020-08-05 12:12:36'},
                {name:'时不利兮骓不逝',
                    title:'水景苑-1-A-201新增业主魏某人，联系电话19957708465',
                    time:'2020-08-05 12:12:36'},
                {name:'俺的猛士兮走四方',
                    title:'水景苑-1-A-201新增业主陈某人，联系电话19957708465',
                    time:'2020-08-05 12:12:36'},
            ],
            dataList:[],
            pageSize:20,
            pageNum:1,
            refListreshing:true,        //是否下拉刷新
            request:true,
            isLoading:true,
            dataSource,
            tabs:[{
                    title:'消息列表'
                },
                { title:'通知公告' },],
            dataListRight:[]

        }
    }

    componentDidMount() {
        // 修改mobx中存储的值
        setTitle.call(this, '消息列表')
        this.getMessageList()


    }
    //获取楼栋列表
    async getMessageList(){
        let userid,complexCode
        await getStorage('zjuserid',res=>{
            userid =  res
        })
        await getStorage('complexCode',res=>{
            complexCode =  res
        })
        Toast.loading()
        http.get({
            url: `/api/news/list?complexCode=${complexCode}&userId=${userid}&pageSize=${this.state.pageSize}&${this.state.pageNum}`,
            // data: {
            //     complexCode:complexCode,
            //     userId:userid,
            //     pageSize:this.state.pageSize,
            //     pageCount: this.state.pageNum
            //
            // }
        }).then(res=> {
            Toast.hide()
            this.setLoaded()
            let _self = this
            if(res.data.code ==1 &&res.data.data.array.length>0){
                _self.setState({
                    dataList :_self.state.dataList.concat(res.data.data.array),
                },()=>{
                    this.state.dataList.forEach(e=>{
                        if(e.isSee ==0){
                            _self.setState({
                                tabs:[{
                                    title: <Badge dot>消息列表</Badge>
                                }, { title:'通知公告' },]
                            })
                        }
                    })
                })

            }
            console.log(_self.state.dataList,7777)
        })
    }
    onEndListReached = () => {
        console.log('我在动吗')
        if (!this.state.isLoading) {
            this.setState({
                pageNum:this.state.pageNum+1,
                isLoading: true
            }, () => {
                this.getMessageList()
            })
        }
    }
    // 下拉刷新
    onListRefresh = () => {
        let pageNum = this.state.pageNum
        pageNum = 1
        this.setState({
            refListreshing: true,
            request:true,
            dataList:[],
            pageNum,
        }, () => {
            this.getMessageList()
        })
    }
    setLoaded() {
        this.setState({
            request:true,
            isLoading: false,
            refListreshing: false
        })
    }

    toIndex() {
        // 跳转
        jump.call(this, '/index')
    }
    goBack() {
        // 返回
        back.call(this)
    }
    //登记入住
    changeCheckIn(){

    }
    //访客登记
    changeRegister(){

    }
    //数组遍历
    getBtnCount(){
        let a = []
        return a
    }

    onChangeMessageClick =(i) =>{
        console.log(i,'我是i')
        this.setState({
            pageNum:1
        })
        // this.state.dataList = []
        Toast.loading()
        http.get({
            url: `/api/news/query/one?newsId=${i.id}`,
            // data: {
            //     newsId: i.id
            // }
        }).then(res => {
            Toast.hide()
            if(res.data.code ==1){
                this.state.dataList.forEach(e=>{
                    if(i.id==e.id){
                        e.isSee = 1
                    }
                })
                this.setState({
                    dataList:this.state.dataList
                })

            }

        })
        // jump.call(this, '/choose-room')

    }

    render() {
        // 从mobx中拿所需属性
        const { dataSource, refListreshing,request} = this.state

        const item = (item) => {
                    return <div className={`${prefix}-list flex flex-column`} onClick={this.onChangeMessageClick.bind(this,item)}>
                        <div className={`${prefix}-list-line`}></div>
                        <div className={`${prefix}-list-head flex align-center`}>
                            {
                                (() => {
                                    if(item.isSee==0){
                                        return    <div>
                                            <img className={`${prefix}-list-head-photo`} src={require('./../../assets/imgs/common/home_icon_reddot_d.png')} alt=""/>
                                            <div className={`${prefix}-list-header head-litter word-space-one`}>{item.title}</div>
                                        </div>

                                    }
                                    return  <div className={`${prefix}-list-header word-space-one`}>{item.title}</div>
                                })()
                            }

                        </div>
                        <div className={`${prefix}-list-title word-space-two`}>{item.content}</div>
                        <div  className={`${prefix}-list-time`}>{item.createTime}</div>
                    </div>
        }
        return (
            <div className={`${prefix} flex flex-column`}>
                <div className={`${prefix}-height`}>
                    <Tabs tabs={this.state.tabs}
                          initialPage={0}
                          style={{
                              position:'absolute',
                              top:'0',
                          }}
                          onChange={(tab, index) => { console.log('onChange', index, tab); }}
                          onTabClick={(tab, index) => { console.log('onTabClick', index, tab); }}
                    >

                        <div className={`${prefix}-min-height-left`}>
                            {
                                this.state.dataList.length >0?(
                                    <ListView
                                        ref={el => this.lv = el}
                                        dataSource={dataSource.cloneWithRows(this.state.dataList)}
                                        renderRow={item}
                                        className="am-list"
                                        pageSize={this.state.pageSize}
                                        scrollRenderAheadDistance={500}
                                        onEndReached={this.onEndListReached}
                                        onEndReachedThreshold={10}
                                        renderHeader={() =>{} }
                                        style={{
                                            // height:'100%',
                                            minHeight:'100vh'
                                        }}
                                        pullToRefresh={
                                            <PullToRefresh
                                                damping={pxTovw(120)}
                                                ref={el => this.ptr = el}
                                                refreshing={refListreshing}
                                                onRefresh={this.onListRefresh}
                                                indicator={{ activate: <Activate />, deactivate: <Deactivate />, release: <Release />, finish: <Finish /> }}

                                            >
                                            </PullToRefresh>
                                        }
                                    />
                                ):<span></span>
                            }


                            {
                                this.state.request && this.state.dataList.length <= 0 ? (
                                    <div className={`flex flex-center align-center flex-column color-999`} style={{ fontSize: ftTovw(28), height: '100%', paddingBottom: pxTovw(100), paddingTop: pxTovw(100) }}>
                                        <img src={require('assets/imgs/common/blank.png')} style={{ width: '50', height: pxTovw(170) }} alt="暂无数据" />
                                        <div className="size28">暂无数据</div>
                                    </div>
                                ) : null
                            }
                            {/*<div className={`${prefix}-bg flex1`}></div>*/}
                        </div>
                        <div className={`${prefix}-min-height-right`}>
                            {  this.getBtnCount().map(item=>{
                                return <div className={`${prefix}-list flex flex-column`}>
                                    <div className={`${prefix}-list-line`}></div>
                                    <div>
                                        <div className={`${prefix}-list-header`}>{item.name}</div>
                                    </div>
                                    <div className={`${prefix}-list-title`}>{item.title}</div>
                                    <div  className={`${prefix}-list-time`}>{item.time}</div>
                                </div>
                            }   )}
                            {
                                this.state.request && this.state.dataListRight.length <= 0 ? (
                                    <div className={`flex flex-center align-center flex-column color-999`} style={{ fontSize: ftTovw(28), height: '100%', paddingBottom: pxTovw(100), paddingTop: pxTovw(100) }}>
                                        <img src={require('assets/imgs/common/blank.png')} style={{ width: '50', height: pxTovw(170) }} alt="暂无数据" />
                                        <div className="size28">暂无数据</div>
                                    </div>
                                ) : null
                            }
                        </div>
                    </Tabs>
                </div>





            </div>
        )
    }
}
// inject 将store注入到当Test组件的props中
export default inject('store')(
    observer(Index)
)
