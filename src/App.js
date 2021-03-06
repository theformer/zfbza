import React, { Component, Fragment, Suspense, lazy } from 'react';
// import { HashRouter as Router, Route,Redirect, Switch } from "react-router-dom";

import { HashRouter as Router, Route, Control } from 'react-keeper'

import Loading from "./components/loading/loading";
import 'antd-mobile/dist/antd-mobile.css';
import "./common/css/reset.scss";
import "./common/js/flexble";
import "./components/loading/loading"
import store from "./mobx/store/index";
import { Provider } from "mobx-react";
import { jump, judgePathRepeat, getHrefParams, back } from './utlis/utlis';
import eruda from 'eruda'

// eruda.init()

window.onload = function (){
  setTimeout(function (){
    // pushHistory()
    window.addEventListener('popstate', function (event) {
      if (window.poph5) {
        window.ZWJSBridge.close().then((result) => {
          console.log(result);
        }).catch((error) => {
          console.log(error);
        });
      }else if(window.goHomePage){
        window.my.navigateTo({
          url: '../index/index'
        })
      }
    },false);
  },0)
}


// 路由懒加载

const Index = lazy(() => import('./components/index'))                              //首页登录
const Test = lazy(() => import('./components/test'))
const Page404 = lazy(() => import('./components/404'))
const Believecode = lazy(() => import('./components/believe-code'))                  //身份填写
const Authentication = lazy(() => import('./components/auth-entication'))            //身份填写
const Choosebuilding = lazy(() => import('./components/choose-building'))            //选择楼栋
const Chooseele = lazy(() => import('./components/choose-ele'))                      //选择单元
const Chooseroom = lazy(() => import('./components/choose-room'))                    //选择房间
const Userinformation = lazy(() => import('./components/user-information'))          //住户信息
const Registersuccess = lazy(() => import('./components/register-success'))          //登记成功
const Homepage = lazy(() => import('./components/home-page'))                        //首页
const Commonproblem = lazy(() => import('./components/common-problem'))              //常见问题
const Wenzhouhealthy = lazy(() => import('./components/wenzhou-healthy'))            //温州健康码
const Personalinformation = lazy(() => import('./components/personal-information'))  //个人信息
const Logout = lazy(() => import('./components/logout'))                             //退出协议
const Passway = lazy(() => import('./components/pass-way'))                          //通行方式
const Contactnumber = lazy(() => import('./components/contact-number'))              //联系电话
const Privacypage = lazy(() => import('./components/privacy-page'))                  //用户协议声明
const Messagelist = lazy(() => import('./components/message-list'))                  //消息列表
const Houseinfo = lazy(() => import('./components/house-info'))                      //小区信息
const Ehome = lazy(() => import('./components/e-home'))                              //我的e家
const Addmember = lazy(() => import('./components/add-member'))                      //新增成员
const Memberdetail = lazy(() => import('./components/member-detail'))                //成员详情
const Visitorinfo = lazy(() => import('./components/visitor-info'))                  //访客信息
const Visitordetail = lazy(() => import('./components/visitor-detail'))              //访客详情
const Registerdetail = lazy(() => import('./components/register-detail'))            //登记详情
const Reportrepair = lazy(() => import('./components/report-repair'))                //报事报修
const Reportdetail = lazy(() => import('./components/report-detail'))                //报事报修详情
const Coordinateinfo = lazy(() => import('./components/coordinate-info'))            //用户协议声明




const Conduct = lazy(() => import('./components/conduct'))                      //信息宣传
const Content = lazy(() => import('./components/content'))                      //信息详情
const Candicine = lazy(() => import('./components/candicine'))                  //详情描述
const Mycar = lazy(() => import('./components/mycar'))                          //我的车辆
const Addcar = lazy(() => import('./components/addcar'))                        //新增车辆
const Cardetails = lazy(() => import('./components/cardetails'))                 //车辆详情
const Myhousing = lazy(() => import('./components/my-housing'))                 //我的小区
const Myhouse = lazy(() => import('./components/my-house'))                 //我的房屋
const HouseDetail = lazy(() => import('./components/house-detail'))         //房屋详情
const SelectiveType = lazy(() => import('./components/selective-type'))   //投诉
const PropertyLog = lazy(() => import('./components/property-log'))   //物业日志
const LogDetails = lazy(() => import('./components/log-details'))   //日志详情
const AdviceCharge = lazy(() => import('./components/advice-charge'))   //缴费通知











function WaitingComponent(Component) {
  return props => (
    <Suspense fallback={<Loading></Loading>}>
      <Component {...props} />
    </Suspense>
  );
}
const loginFilter = (cb, props) => {
  cb()
}

const routePush = (cb, props) => {
  let routes = sessionStorage.getItem('YYRoutes')
  if (!routes) {
    routes = []
  } else {
    routes = JSON.parse(routes)
  }

  if (!judgePathRepeat(props.path, routes)) {
    routes.push({
      path: props.path,
      params: getHrefParams()
    })
  } else {
    for (let i = 0; i < routes.length; i++) {
      if (routes[i].path === props.path) {
        routes[i].params = getHrefParams()
      }
    }
  }
  for (let i = 0; i < routes.length; i++) {
    if (routes[i].path === props.path) {
      routes.splice(i + 1)
    }
  }
  sessionStorage.setItem('YYRoutes', JSON.stringify(routes))
  cb()
}

class App extends Component {
  render() {
    return (
      <Provider store={store} {...store}>
        <Router>
          <Fragment>
            <div className="container">
              <Route path="/believe-code" component={WaitingComponent(Believecode)}></Route>
              <Route path="/visitor-info" component={WaitingComponent(Visitorinfo)}></Route>
              <Route path="/coordinate-info" component={WaitingComponent(Coordinateinfo)}></Route>
              <Route path="/logout" component={WaitingComponent(Logout)}></Route>
              <Route path="/common-problem" component={WaitingComponent(Commonproblem)}></Route>
              <Route path="/pass-way" component={WaitingComponent(Passway)}></Route>
              <Route path="/choose-room" component={WaitingComponent(Chooseroom)}></Route>
              <Route path="/choose-ele" component={WaitingComponent(Chooseele)}></Route>
              <Route path="/privacy-page" component={WaitingComponent(Privacypage)}></Route>
              <Route path="/contact-number" component={WaitingComponent(Contactnumber)}></Route>
              <Route path="/personal-information" component={WaitingComponent(Personalinformation)}></Route>
              <Route path="/wenzhou-healthy" component={WaitingComponent(Wenzhouhealthy)}></Route>
              <Route path="/home-page" component={WaitingComponent(Homepage)}></Route>
              <Route path="/register-success" component={WaitingComponent(Registersuccess)}></Route>
              <Route path="/user-information" component={WaitingComponent(Userinformation)}></Route>
              <Route path="/choose-building" component={WaitingComponent(Choosebuilding)}></Route>
              <Route path="/auth-entication" component={WaitingComponent(Authentication)}></Route>
              <Route path="/test" component={WaitingComponent(Test)}></Route>
              <Route path="/" component={WaitingComponent(Index)}></Route>
              <Route miss component={WaitingComponent(Page404)}></Route>

              <Route path="/conduct" component={WaitingComponent(Conduct)}></Route>
              <Route path="/content" component={WaitingComponent(Content)}></Route>
              <Route path="/candicine" component={WaitingComponent(Candicine)}></Route>
              <Route path="/mycar" component={WaitingComponent(Mycar)}></Route>
              <Route path="/addcar" component={WaitingComponent(Addcar)}></Route>
              <Route path="/cardetails/:id" component={WaitingComponent(Cardetails)}></Route>
              <Route path="/myhousing" component={WaitingComponent(Myhousing)}></Route>
              <Route path="/myhouse" component={WaitingComponent(Myhouse)}></Route>
              <Route path="/housedetail" component={WaitingComponent(HouseDetail)}></Route>
              <Route path="/propertylog" component={WaitingComponent(PropertyLog)}></Route>
              <Route path="/logdetails" component={WaitingComponent(LogDetails)}></Route>
              <Route path="/selectivetype" component={WaitingComponent(SelectiveType)}></Route>
              <Route path="/advicecharge" component={WaitingComponent(AdviceCharge)}></Route>

              <Route path="/report-detail" component={WaitingComponent(Reportdetail)}></Route>
              <Route path="/report-repair" component={WaitingComponent(Reportrepair)}></Route>
              <Route path="/register-detail" component={WaitingComponent(Registerdetail)}></Route>
              <Route path="/visitor-detail" component={WaitingComponent(Visitordetail)}></Route>
              <Route path="/member-detail/:userId" component={WaitingComponent(Memberdetail)}></Route>
              <Route path="/add-member" component={WaitingComponent(Addmember)}></Route>
              <Route path="/e-home" component={WaitingComponent(Ehome)}></Route>
              <Route path="/house-info/:complexCode" component={WaitingComponent(Houseinfo)}></Route>
              <Route path="/message-list" component={WaitingComponent(Messagelist)}></Route>

            </div>
          </Fragment>
        </Router>
      </Provider>
    );
  }
}

export default App;
