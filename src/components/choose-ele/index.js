/* eslint-disable no-console */
/* eslint-disable no-debugger */
// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Toast,SearchBar, Button,PullToRefresh, ListView, } from 'antd-mobile'
import './index.scss'
import {back, ftTovw, jump, pxTovw, setTitle,getStorage,setStorage} from '../../utlis/utlis'
import http from '../../utlis/http'
import { Activate, Deactivate, Release, Finish } from 'common/yy-refresh-indiccator'        //下拉刷新的状态


const prefix = 'choose-ele'
Toast.config({
    mask: false
})
class ChooseEle extends Component {
    constructor(props) {
        super(props)
        //创建ListViewDataSource对象
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        })
        this.state = {
            searchVal:'',
            buildingId:'',
            dataSource,             //数据源
            refreshing:true,        //是否下拉刷新
            pageSize: 20,          //当前请求条数
            pageNum:1,              //当前页数
            isLoading: true,        //是否请求状态
            request:true,
            data:[],
            loading: false


        }
    }
    //获取楼栋列表
    getBuildList(){
        http.get({
            url: `/test/unit/info?buildingId=${this.state.buildingId}&pageSize=${this.state.pageSize}&pageCount=${this.state.pageNum}`,
        }).then(res=>{
            Toast.hide()
            this.setLoaded()
            if(res.data.code ==1){
                res.data.data =this.state.data.concat(res.data.data)
                this.setState({
                    data :res.data.data
                })
            }else{
                Toast.info(res.data.message)
            }
        })
    }
    //挂载
    async componentDidMount() {
        setTitle.call(this, '选择单元')
        //获取楼栋
        // this.state.buildingId = localStorage.getItem('buildingId')
        await getStorage('buildingId',res=>{
            this.setState({
                buildingId:res
            },()=>{
                this.getBuildList()
            })
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
    // 下拉刷新
    onRefresh = () => {
        let pageNum = this.state.pageNum
        pageNum = 1
        this.setState({
            refreshing: true,
            request: true,
            isLoading: false,
            data:[],
            pageNum,
        }, () => {
            this.getBuildList()
        })
    }
    setLoaded() {
        this.setState({
            request: true,
            isLoading: false,
            refreshing: false
        })
    }
    //滑到底部时加载更多
    onEndReached = () => {
        if (!this.state.loading) {
            this.setState({
                pageNum: this.state.pageNum + 1,
                loading: true,
            }, () => {
                this.getBuildList()
            })
            let timer = setTimeout(() => {
                this.setState({
                    loading: false,
                })
                clearTimeout(timer)
            }, 1000)
        }
    }


    //清空搜索框
    onClearClick(){
        // this.getBuildList()
    }
   async getUserBuild(item){
       await setStorage('unitId',item.id)

        jump.call(this, '/choose-room')

    }
    //模糊搜索
    async onSearchClick(){
        this.state.data =[]
        Toast.loading()
        let complexCode
        await getStorage('complexCode',res=>{
            complexCode = res
        })
        http.get({
            url: `/api/building/likeList?complexCode=${complexCode}&buildingName=${this.state.searchVal}`,
        }).then(res=>{
            Toast.hide()
            if(res.data.code==1){
                this.setState({
                    data:res.data.data
                })
            }else{
                Toast.info(res.data.message)
            }
        })
    }
    onChange =(value)=>{
        this.setState({ searchVal:value });
    }
    //搜索框取消输入
    onCancel(val){
        this.setState({
            searchVal:''
        })
        // this.onSearchClick()
    }
    render() {
        const { dataSource,request,refreshing, isLoading } = this.state
        // 从mobx中拿所需属性
        const item = (item) => {
            return      <div onClick={this.getUserBuild.bind(this, item)}>
                            <div className={`${prefix}-body`}>
                                <div className={`${prefix}-body-text`}>{item.unitName}</div>
                                <img src={require('./../../assets/imgs/logins/next@3x.png')} className={`${prefix}-body-png`} alt=""/>
                            </div>
                            <div className={`body-line`}></div>
                        </div>
        }
        return (
            <div className={`${prefix} flex flex-column`}>
                <div>
                    <div className={`${prefix}-main`}>
                        <div className={`${prefix}-main-head`}>
                            选择单元
                        </div>
                        {
                            (() => {
                                if(this.state.data.length>0){
                                    return <div className={`${prefix}-main-name`}>{this.state.data[0].complexName+this.state.data[0].buildingName}</div>
                                }
                                return  null
                            })()
                        }
                        <div>
                            {/*<SearchBar*/}
                            {/*    className={`${prefix}-main-search`}*/}
                            {/*    placeholder="请输入搜索关键字"*/}
                            {/*    value={this.state.searchVal}*/}
                            {/*    onSubmit={this.onSearchClick.bind(this)}*/}
                            {/*    onClear={this.onClearClick.bind(this)}*/}
                            {/*    onFocus={this.onFocus.bind(this)}*/}
                            {/*    onBlur={this.onBlur.bind(this)}*/}
                            {/*    onCancel={this.onCancel.bind(this)}*/}
                            {/*    onChange={this.onChange}*/}
                            {/*/>*/}
                        </div>
                    </div>
                    <div className={`${prefix}-line`}></div>
                </div>


                <div className={'flex1 hiden-box'}>
                    <ListView
                        ref={el=>this.lv=el}
                        dataSource={dataSource.cloneWithRows(this.state.data&&this.state.data.length<=0?['暂无数据']:this.state.data)}
                        renderFooter={()=>(<div style={{textAlign:'center',fontSize:pxTovw(28),paddingBottom:pxTovw(50)}}>
                            {isLoading?'加载中...':(this.state.data&&this.state.data.length>=this.state.data?'没有更多了~':'')}
                        </div>)}
                        renderRow={item}
                        className="am-list"
                        initialListSize={this.state.pageSize}
                        pageSize={this.state.pageSize}
                        scrollRenderAheadDistance={500}
                        onEndReached={this.onEndReached}
                        onEndReachedThreshold={10}
                        style={{
                            height:'100%'
                        }}
                        renderHeader={()=><div style={{width:'100%',height:pxTovw(20),background:'#f8f8f8'}}></div>}
                        pullToRefresh={
                            <PullToRefresh
                                damping={pxTovw(120)}
                                ref={el=>this.ptr=el}
                                refreshing={refreshing}
                                onRefresh={this.onRefresh}
                                distanceToRefresh={parseFloat(document.documentElement.style.fontSize)}
                                indicator={{activate:<Activate/>,deactivate:<Deactivate/>,release:<Release/>,finish:<Finish/>}}
                            >
                            </PullToRefresh>
                        }
                    />
                        {/*{*/}
                        {/*    (() => {*/}
                        {/*        this.getBtnCount().map(item =>{*/}
                        {/*            return <div key={item} ></div>*/}
                        {/*        })*/}
                        {/*    })()*/}
                        {/*}*/}
                </div>

                {

                    request && (!this.state.data || this.state.data.length <= 0) ? (
                        <div className={`flex flex-center align-center flex-column color-999`} style={{ fontSize: ftTovw(28), height: '100%', paddingBottom: pxTovw(100), paddingTop: pxTovw(100) }}>
                            <img src={require('assets/imgs/common/blank.png')} style={{ width: '50', height: pxTovw(170) }} alt="暂无数据" />
                            <div className="size28">暂无数据</div>
                        </div>
                    ) : null
                }

            </div>
        )
    }
}
// inject 将store注入到当Test组件的props中
export default inject('store')(
    observer(ChooseEle)
)
