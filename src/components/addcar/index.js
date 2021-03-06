import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { Toast, List, Picker, Button } from "antd-mobile";
import "./index.scss";
import { setTitle, back, validCarNum,getStorage,setStorage } from "../../utlis/utlis";
import Keybord from "../../common/car-number-input/keybord";
import http from "../../utlis/http";

const prefix = "addcar";
Toast.config({
  mask: false,
});
let colorStyle = {
  color: "#2B333F",
};
const CarBrands = (props) => (
  <div
    onClick={props.onClick}
    style={{ color: "#2B333F" }}
    className="line-box"
  >
    <div className="test" style={{ display: "flex" }}>
      <div className="left-sign" style={{}}>
        {props.children}
      </div>
      <div className="right-sign flex" style={{}}>
        {!props.value ? (
          <div className="right-sign-text tips">{props.extra}</div>
        ) : (
          <div className="right-sign-text">{props.value}</div>
        )}{" "}
        <img
          className="right-sign-img"
          src={require("./../../assets/imgs/common/next@2x.png")}
          alt=""
        />
      </div>
    </div>
  </div>
);

class Addcar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentNumIndex: -1,
      showKeyboard: false,
      valueArr: [],
      carList: [
        { label: '奥迪', value: '奥迪' },
        { label: '阿斯顿·马丁', value: '阿斯顿·马丁' },
        { label: '阿尔法·罗密欧', value: '阿尔法·罗密欧' },
        { label: '爱驰', value: '爱驰' },
        { label: 'APEX', value: 'APEX' },
        { label: 'Aspark', value: 'Aspark' },
        { label: 'AUXUN傲旋', value: 'AUXUN傲旋' },
        { label: 'AC Schnitzer', value: 'AC Schnitzer' },
        { label: 'ABT', value: 'ABT' },
        { label: 'Aurus', value: 'Aurus' },
        { label: '安凯客车', value: '安凯客车' },
        { label: 'Aria', value: 'Aria' },
        { label: 'Arash', value: 'Arash' },
        { label: 'Apollo', value: 'Apollo' },
        { label: 'ATS', value: 'ATS' },
        { label: 'ARCFOX', value: 'ARCFOX' },
        { label: '艾康尼克', value: '艾康尼克' },
        { label: 'ALPINA', value: 'ALPINA' },
        { label: 'Agile Automotive', value: 'Agile Automotive' },
        { label: '本田', value: '本田' },
        { label: '宝马', value: '宝马' },
        { label: '奔驰', value: '奔驰' },
        { label: '别克', value: '别克' },
        { label: '比亚迪', value: '比亚迪' },
        { label: '保时捷', value: '保时捷' },
        { label: '宝骏', value: '宝骏' },
        { label: '标致', value: '标致' },
        { label: '宾利', value: '宾利' },
        { label: '奔腾', value: '奔腾' },
        { label: '北京', value: '北京' },
        { label: '北京汽车', value: '北京汽车' },
        { label: '北汽制造', value: '北汽制造' },
        { label: '宝沃', value: '宝沃' },
        { label: '北汽新能源', value: '北汽新能源' },
        { label: '北汽昌河', value: '北汽昌河' },
        { label: '北汽幻速', value: '北汽幻速' },
        { label: '北汽威旺', value: '北汽威旺' },
        { label: '铂驰', value: '铂驰' },
        { label: '布加迪', value: '布加迪' },
        { label: 'Bollinger Motors', value: 'Bollinger Motors' },
        { label: '比德文汽车', value: '比德文汽车' },
        { label: '博郡汽车', value: '博郡汽车' },
        { label: '巴博斯', value: '巴博斯' },
        { label: '北京清行', value: '北京清行' },
        { label: '保斐利', value: '保斐利' },
        { label: 'BAC', value: 'BAC' },
        { label: '拜腾', value: '拜腾' },
        { label: '宾尼法利纳', value: '宾尼法利纳' },
        { label: '北汽道达', value: '北汽道达' },
        { label: '比速汽车', value: '比速汽车' },
        { label: '长安', value: '长安' },
        { label: '长安欧尚', value: '长安欧尚' },
        { label: '长城', value: '长城' },
        { label: '长安凯程', value: '长安凯程' },
        { label: '长安跨越', value: '长安跨越' },
        { label: 'Czinger', value: 'Czinger' },
        { label: 'Canoo', value: 'Canoo' },
        { label: '车驰汽车', value: '车驰汽车' },
        { label: 'Conquest', value: 'Conquest' },
        { label: 'Caterham', value: 'Caterham' },
        { label: 'Cupra', value: 'Cupra' },
        { label: '成功汽车', value: '成功汽车' },
        { label: '长江EV', value: '长江EV' },
        { label: '昶洧', value: '昶洧' },
        { label: '大众', value: '大众' },
        { label: '东风风神', value: '东风风神' },
        { label: '东风风行', value: '东风风行' },
        { label: '东风风光', value: '东风风光' },
        { label: '道奇', value: '道奇' },
        { label: '东风', value: '东风' },
        { label: '东风小康', value: '东风小康' },
        { label: '东南', value: '东南' },
        { label: '东风风度', value: '东风风度' },
        { label: 'DAVID BROWN', value: 'DAVID BROWN' },
        { label: '东风富康', value: '东风富康' },
        { label: '大运', value: '大运' },
        { label: 'De Tomaso', value: 'De Tomaso' },
        { label: '大发', value: '大发' },
        { label: '大乘汽车', value: '大乘汽车' },
        { label: 'Dacia', value: 'Dacia' },
        { label: 'DS', value: 'DS' },
        { label: '东风·瑞泰特', value: '东风·瑞泰特' },
        { label: 'DMC', value: 'DMC' },
        { label: 'Datsun', value: 'Datsun' },
        { label: 'Donkervoort', value: 'Donkervoort' },
        { label: '电咖', value: '电咖' },
        { label: 'Elemental', value: 'Elemental' },
        { label: '丰田', value: '丰田' },
        { label: '福特', value: '福特' },
        { label: '法拉利', value: '法拉利' },
        { label: '福田', value: '福田' },
        { label: '菲亚特', value: '菲亚特' },
        { label: '福迪', value: '福迪' },
        { label: '枫叶汽车', value: '枫叶汽车' },
        { label: 'Fisker', value: 'Fisker' },
        { label: '弗那萨利', value: '弗那萨利' },
        { label: 'FM Auto', value: 'FM Auto' },
        { label: '福汽启腾', value: '福汽启腾' },
        { label: 'Faraday Future', value: 'Faraday Future' },
        { label: '广汽传祺', value: '广汽传祺' },
        { label: '广汽新能源', value: '广汽新能源' },
        { label: '观致', value: '观致' },
        { label: 'GMC', value: 'GMC' },
        { label: '广汽集团', value: '广汽集团' },
        { label: '高合HiPhi', value: '高合HiPhi' },
        { label: '格罗夫', value: '格罗夫' },
        { label: 'GYON', value: 'GYON' },
        { label: '国机智骏', value: '国机智骏' },
        { label: 'Ginetta', value: 'Ginetta' },
        { label: 'GFG Style', value: 'GFG Style' },
        { label: '广汽吉奥', value: '广汽吉奥' },
        { label: 'Gumpert', value: 'Gumpert' },
        { label: '光冈', value: '光冈' },
        { label: 'GAZ', value: 'GAZ' },
        { label: 'GTA', value: 'GTA' },
        { label: '国金汽车', value: '国金汽车' },
        { label: 'GLM', value: 'GLM' },
        { label: '广通客车', value: '广通客车' },
        { label: '哈弗', value: '哈弗' },
        { label: '红旗', value: '红旗' },
        { label: '海马', value: '海马' },
        { label: '黄海', value: '黄海' },
        { label: 'HYCAN合创', value: 'HYCAN合创' },
        { label: '华颂', value: '华颂' },
        { label: '华人运通', value: '华人运通' },
        { label: 'Hudson', value: 'Hudson' },
        { label: '哈飞', value: '哈飞' },
        { label: '悍马', value: '悍马' },
        { label: '汉龙汽车', value: '汉龙汽车' },
        { label: '华普', value: '华普' },
        { label: '华泰', value: '华泰' },
        { label: 'Hispano Suiza', value: 'Hispano Suiza' },
        { label: '海格', value: '海格' },
        { label: '红星汽车', value: '红星汽车' },
        { label: '恒天', value: '恒天' },
        { label: 'Hennessey', value: 'Hennessey' },
        { label: '华骐', value: '华骐' },
        { label: '华利', value: '华利' },
        { label: '霍顿', value: '霍顿' },
        { label: '华凯', value: '华凯' },
        { label: '华泰新能源', value: '华泰新能源' },
        { label: '汉腾汽车', value: '汉腾汽车' },
        { label: 'IED', value: 'IED' },
        { label: 'INKAS', value: 'INKAS' },
        { label: 'Icona', value: 'Icona' },
        { label: 'Inferno', value: 'Inferno' },
        { label: 'Italdesign', value: 'Italdesign' },
        { label: '吉利汽车', value: '吉利汽车' },
        { label: '捷豹', value: '捷豹' },
        { label: 'Jeep', value: 'Jeep' },
        { label: '捷达', value: '捷达' },
        { label: '江淮', value: '江淮' },
        { label: '捷途', value: '捷途' },
        { label: '金杯', value: '金杯' },
        { label: '江铃', value: '江铃' },
        { label: '几何汽车', value: '几何汽车' },
        { label: '江铃集团新能源', value: '江铃集团新能源' },
        { label: '君马汽车', value: '君马汽车' },
        { label: '金冠汽车', value: '金冠汽车' },
        { label: '捷尼赛思', value: '捷尼赛思' },
        { label: '钧天', value: '钧天' },
        { label: '金龙', value: '金龙' },
        { label: '九龙', value: '九龙' },
        { label: '金旅', value: '金旅' },
        { label: '奇点汽车', value: '奇点汽车' },
        { label: '凯迪拉克', value: '凯迪拉克' },
        { label: '克莱斯勒', value: '克莱斯勒' },
        { label: '开瑞', value: '开瑞' },
        { label: '凯翼', value: '凯翼' },
        { label: 'KTM', value: 'KTM' },
        { label: '科尼赛克', value: '科尼赛克' },
        { label: 'Karma', value: 'Karma' },
        { label: '凯佰赫', value: '凯佰赫' },
        { label: '卡尔森', value: '卡尔森' },
        { label: '卡威', value: '卡威' },
        { label: '开沃汽车', value: '开沃汽车' },
        { label: '卡升', value: '卡升' },
        { label: '雷克萨斯', value: '雷克萨斯' },
        { label: '领克', value: '领克' },
        { label: '路虎', value: '路虎' },
        { label: '林肯', value: '林肯' },
        { label: '兰博基尼', value: '兰博基尼' },
        { label: '劳斯莱斯', value: '劳斯莱斯' },
        { label: '铃木', value: '铃木' },
        { label: '雷诺', value: '雷诺' },
        { label: '理想汽车', value: '理想汽车' },
        { label: '零跑汽车', value: '零跑汽车' },
        { label: '猎豹汽车', value: '猎豹汽车' },
        { label: '路特斯', value: '路特斯' },
        { label: '理念', value: '理念' },
        { label: 'Lorinser', value: 'Lorinser' },
        { label: 'LITE', value: 'LITE' },
        { label: '凌宝汽车', value: '凌宝汽车' },
        { label: '力帆汽车', value: '力帆汽车' },
        { label: '陆风', value: '陆风' },
        { label: '莲花汽车', value: '莲花汽车' },
        { label: '蓝旗亚', value: '蓝旗亚' },
        { label: '罗夫哈特', value: '罗夫哈特' },
        { label: '领途汽车', value: '领途汽车' },
        { label: '朗世', value: '朗世' },
        { label: '拉共达', value: '拉共达' },
        { label: 'LEVC', value: 'LEVC' },
        { label: '陆地方舟', value: '陆地方舟' },
        { label: '绿驰', value: '绿驰' },
        { label: '领志', value: '领志' },
        { label: 'LOCAL MOTORS', value: 'LOCAL MOTORS' },
        { label: '拉达', value: '拉达' },
        { label: '雷诺三星', value: '雷诺三星' },
        { label: 'LeSEE', value: 'LeSEE' },
        { label: 'Lucid', value: 'Lucid' },
        { label: '马自达', value: '马自达' },
        { label: '名爵', value: '名爵' },
        { label: '玛莎拉蒂', value: '玛莎拉蒂' },
        { label: 'MINI', value: 'MINI' },
        { label: '迈凯伦', value: '迈凯伦' },
        { label: '迈迈', value: '迈迈' },
        { label: '迈巴赫', value: '迈巴赫' },
        { label: '迈莎锐', value: '迈莎锐' },
        { label: 'Mole', value: 'Mole' },
        { label: 'MELKUS', value: 'MELKUS' },
        { label: 'Micro', value: 'Micro' },
        { label: '摩根', value: '摩根' },
        { label: 'MAGNA', value: 'MAGNA' },
        { label: 'Mahindra', value: 'Mahindra' },
        { label: 'Mazzanti', value: 'Mazzanti' },
        { label: '哪吒汽车', value: '哪吒汽车' },
        { label: '纳智捷', value: '纳智捷' },
        { label: 'Nikola', value: 'Nikola' },
        { label: 'Neuron EV', value: 'Neuron EV' },
        { label: 'Noble', value: 'Noble' },
        { label: 'nanoFLOWCELL', value: 'nanoFLOWCELL' },
        { label: 'NEVS国能汽车', value: 'NEVS国能汽车' },
        { label: '讴歌', value: '讴歌' },
        { label: '欧拉', value: '欧拉' },
        { label: '欧宝', value: '欧宝' },
        { label: '欧朗', value: '欧朗' },
        { label: 'Polestar极星', value: 'Polestar极星' },
        { label: '帕加尼', value: '帕加尼' },
        { label: 'Piëch Automotive', value: 'Piëch Automotive' },
        { label: 'Puritalia', value: 'Puritalia' },
        { label: '佩奇奥', value: '佩奇奥' },
        { label: '起亚', value: '起亚' },
        { label: '奇瑞', value: '奇瑞' },
        { label: '启辰', value: '启辰' },
        { label: '庆铃汽车', value: '庆铃汽车' },
        { label: '清源汽车', value: '清源汽车' },
        { label: '骐铃汽车', value: '骐铃汽车' },
        { label: '全球鹰', value: '全球鹰' },
        { label: '乔治·巴顿', value: '乔治·巴顿' },
        { label: '前途', value: '前途' },
        { label: '日产', value: '日产' },
        { label: '荣威', value: '荣威' },
        { label: '瑞麒', value: '瑞麒' },
        { label: 'RIVIAN', value: 'RIVIAN' },
        { label: '容大智造', value: '容大智造' },
        { label: '如虎', value: '如虎' },
        { label: 'Rinspeed', value: 'Rinspeed' },
        { label: 'RENOVO', value: 'RENOVO' },
        { label: 'Rezvani', value: 'Rezvani' },
        { label: 'Rimac', value: 'Rimac' },
        { label: '瑞驰新能源', value: '瑞驰新能源' },
        { label: '斯柯达', value: '斯柯达' },
        { label: '三菱', value: '三菱' },
        { label: '斯巴鲁', value: '斯巴鲁' },
        { label: '上汽MAXUS', value: '上汽MAXUS' },
        { label: 'smart', value: 'smart' },
        { label: 'SWM斯威汽车', value: 'SWM斯威汽车' },
        { label: '思铭', value: '思铭' },
        { label: 'SRM鑫源', value: 'SRM鑫源' },
        { label: '思皓', value: '思皓' },
        { label: 'SONY', value: 'SONY' },
        { label: '上喆', value: '上喆' },
        { label: 'SHELBY', value: 'SHELBY' },
        { label: 'Sono Motors', value: 'Sono Motors' },
        { label: '萨博', value: '萨博' },
        { label: '世爵', value: '世爵' },
        { label: '双龙', value: '双龙' },
        { label: '双环', value: '双环' },
        { label: 'SPIRRA', value: 'SPIRRA' },
        { label: 'Scion', value: 'Scion' },
        { label: 'SSC', value: 'SSC' },
        { label: '首望', value: '首望' },
        { label: '陕汽通家', value: '陕汽通家' },
        { label: 'SERES赛力斯', value: 'SERES赛力斯' },
        { label: '上海', value: '上海' },
        { label: '赛麟', value: '赛麟' },
        { label: '斯太尔', value: '斯太尔' },
        { label: '斯达泰克', value: '斯达泰克' },
        { label: '特斯拉', value: '特斯拉' },
        { label: '腾势', value: '腾势' },
        { label: 'Troller', value: 'Troller' },
        { label: 'TOGG', value: 'TOGG' },
        { label: '天美汽车', value: '天美汽车' },
        { label: 'Triton', value: 'Triton' },
        { label: 'Tramontana', value: 'Tramontana' },
        { label: 'TVR', value: 'TVR' },
        { label: '天际汽车', value: '天际汽车' },
        { label: '塔塔', value: '塔塔' },
        { label: '泰卡特', value: '泰卡特' },
        { label: '泰克鲁斯·腾风', value: '泰克鲁斯·腾风' },
        { label: 'Ultima', value: 'Ultima' },
        { label: 'Vega Innovations', value: 'Vega Innovations' },
        { label: 'Vinfast', value: 'Vinfast' },
        { label: 'Venturi', value: 'Venturi' },
        { label: 'VLF Automotive', value: 'VLF Automotive' },
        { label: '沃尔沃', value: '沃尔沃' },
        { label: '五菱汽车', value: '五菱汽车' },
        { label: 'WEY', value: 'WEY' },
        { label: '蔚来', value: '蔚来' },
        { label: '五十铃', value: '五十铃' },
        { label: '威马汽车', value: '威马汽车' },
        { label: '瓦滋', value: '瓦滋' },
        { label: '潍柴汽车', value: '潍柴汽车' },
        { label: '威兹曼', value: '威兹曼' },
        { label: '威麟', value: '威麟' },
        { label: '沃克斯豪尔', value: '沃克斯豪尔' },
        { label: '潍柴英致', value: '潍柴英致' },
        { label: 'W Motors', value: 'W Motors' },
        { label: '雪佛兰', value: '雪佛兰' },
        { label: '现代', value: '现代' },
        { label: '雪铁龙', value: '雪铁龙' },
        { label: '小鹏汽车', value: '小鹏汽车' },
        { label: '新宝骏', value: '新宝骏' },
        { label: '星途', value: '星途' },
        { label: '西雅特', value: '西雅特' },
        { label: '新特汽车', value: '新特汽车' },
        { label: '新凯', value: '新凯' },
        { label: '英菲尼迪', value: '英菲尼迪' },
        { label: '野马汽车', value: '野马汽车' },
        { label: '依维柯', value: '依维柯' },
        { label: '驭胜', value: '驭胜' },
        { label: '一汽凌河', value: '一汽凌河' },
        { label: '远程汽车', value: '远程汽车' },
        { label: '银隆新能源', value: '银隆新能源' },
        { label: '永源', value: '永源' },
        { label: '一汽', value: '一汽' },
        { label: '云雀汽车', value: '云雀汽车' },
        { label: '御捷', value: '御捷' },
        { label: '裕路', value: '裕路' },
        { label: '游侠', value: '游侠' },
        { label: 'YAMAHA', value: 'YAMAHA' },
        { label: '宇通客车', value: '宇通客车' },
        { label: '云度', value: '云度' },
        { label: '众泰', value: '众泰' },
        { label: '中华', value: '中华' },
        { label: '中兴', value: '中兴' },
        { label: '之诺', value: '之诺' },
        { label: 'Zenvo', value: 'Zenvo' },
        { label: '知豆', value: '知豆' },
        { label: '正道汽车', value: '正道汽车' },
      ],
      colorList: [
        { label: '银色', value: '银色' },
        { label: '黄色', value: '黄色' },
        { label: '红色', value: '红色' },
        { label: '蓝色', value: '蓝色' },
        { label: '绿色', value: '绿色' },
        { label: '黑色', value: '黑色' },
        { label: '白色', value: '白色' },
      ],
      carNoColorList: [
        { label: '黄色', value: '黄色' },
        { label: '白色', value: '白色' },
        { label: '蓝色', value: '蓝色' },
        { label: '绿色', value: '绿色' },
        { label: '黑色', value: '黑色' },
      ],
      modelList: [
        { label: '轿车', value: '轿车' },
        { label: 'SUV', value: 'SUV' },
        { label: '跑车', value: '跑车' },
        { label: '皮卡', value: '皮卡' },
        { label: '微面', value: '微面' },
      ],
      carBrand: '',
      carColor: '',
      carType: '',
      carNoColor: '',
      carBrandVisible: false,
      carColorVisible: false,
      carTypeVisible: false,
      carNoColorVisible: false,
    }
  }
  componentDidMount() {
    setTitle.call(this, '新增车辆')
  }
  componentWillUnmount() {
    Keybord.hide()
  }
  showKeyboard(index) {
    let that = this;
    let id = this.state.id;
    if (!Keybord.getState(id) || !Keybord.getState(id).show) {
      Keybord.show({
        id,
        bindClick: this.bindClick.bind(this),
        bindDelete: this.bindDelete.bind(this),
        bindHide: this.bindHide.bind(this),
        zIndex: 10
      });
    }
    this.setState({
      currentNumIndex: index
    })
  }
  bindClick(value) {
    let valueArr = this.state.valueArr
    let length = valueArr.length
    let currentNumIndex = this.state.currentNumIndex
    if (length === 0) {
      if (/^[A-Z]|[0-9]$/.test(value)) {
        Toast.info('第一个字符应为汉字', 3, null, false)
        return
      }
    }
    if (length >= 1) {
      if (currentNumIndex === 0) {
        if (/^[A-Z]|[0-9]$/.test(value)) {
          Toast.info('第一个字符应为汉字', 3, null, false)
          return
        }
      } else if (currentNumIndex != 6) {
        if (!(/^[A-Z]|[0-9]$/.test(value))) {
          Toast.info('第二个字符开始应为字母或数字', 3, null, false)
          return
        }
      }
    }
    // valueArr.splice(currentNumIndex, 1, value);
    valueArr[currentNumIndex] = value
    if ((this.state.isEnergy && currentNumIndex < 7) || (!this.state.isEnergy && currentNumIndex < 6)) {
      this.setState({
        currentNumIndex: currentNumIndex + 1
      })
    }
    this.setState({
      valueArr
    })
  }
  bindDelete() {
    let valueArr = this.state.valueArr;
    let length = valueArr.length;
    let currentNumIndex = this.state.currentNumIndex;
    if (length > 0) {
      valueArr[currentNumIndex] = ''
      let nextIndex = currentNumIndex - 1
      this.setState({
        valueArr,
        currentNumIndex: nextIndex < 0 ? 0 : nextIndex
      })
    }
  }

  bindHide() {
    this.setState({
      currentNumIndex: -1
    })
  }
  setEnergy(index) {
    this.setState({
      isEnergy: true,
      currentNumIndex: index
    })
    this.showKeyboard(index)
  }
  // 取消
  onCancle = () => {

  }
  showCarBrand() {
    Keybord.hide()
    this.setState({ carBrandVisible: true })
  }
  showCarColor() {
    Keybord.hide()
    this.setState({ carColorVisible: true })
  }
  showCarType() {
    Keybord.hide()
    this.setState({ carTypeVisible: true })
  }
  showNoColor() {
    Keybord.hide()
    this.setState({ carNoColorVisible: true })
  }


  // 添加车辆
  async addCar() {
    let carNumber = ''
    this.state.valueArr.forEach(el => {
      carNumber = carNumber + el
    })
    console.log(carNumber, '车牌号')
    if (!validCarNum(carNumber)) {
      Toast.fail('车牌号验证失败')
      return
    }
    let userId
    await getStorage('zjuserid',res=>{
      userId = res
    })
    let data = {
      // userId: window.localStorage.getItem('user').id,
      userId:userId,
      // userId: '613569671e334413a7b523ad789341e2',
      model: this.state.carType.toString(),
      brand: this.state.carBrand.toString(),
      isNewEnergy: carNumber.length > 7 ? '1' : '0',
      colour: this.state.carColor.toString(),
      licenseColor: this.state.carNoColor.toString(),
      carNumber,
    }
    if (data.model === '') {
      Toast.fail('请选择车型')
      return
    }
    if (data.brand === '') {
      Toast.fail('请选择车辆品牌')
      return
    }
    if (data.colour === '') {
      Toast.fail('请选择车辆颜色')
      return
    }
    if (data.licenseColor === '') {
      Toast.fail('请选择车牌号颜色')
      return
    }
    if (data.carNumber === '') {
      Toast.fail('请输入车牌号')
      return
    }
    http.post({
      url: '/test/car/save',
      data
    }).then(res => {
      console.log(res, '添加车辆返回的参数')
      const { code, message } = res.data
      if (code !== '1') {
        Toast.fail(message ? message : '添加车辆失败')
        return
      }
      Toast.success('添加车辆成功')
      back.call(this)
    }).catch(err => {
      Toast.fail('服务器连接失败')
    })

  }
  render() {
    const { currentNumIndex, isEnergy, carNum, valueArr, carList, colorList, modelList, carNoColorList } = this.state
    return (
      <div className={`${prefix}-carnum-list`}>
        <div className={`${prefix}-carnum`}>
          <div className={`${prefix}-carnum-number`}>请输入车牌号</div>
          <div className={`${prefix}-carnum-box`}>
            <div
              className={`${prefix}-carnum-item flex-center ${
                currentNumIndex === 0 ? `${prefix}-carnum-active` : ""
              }`}
              onClick={this.showKeyboard.bind(this, 0)}
            >
              {valueArr && valueArr[0]}
            </div>
            <div
              className={`${prefix}-carnum-item ${
                currentNumIndex === 1 ? `${prefix}-carnum-active` : ""
              }`}
              onClick={this.showKeyboard.bind(this, 1)}
            >
              {valueArr && valueArr[1]}
            </div>
            <div className={`${prefix}-carnum-split`}>
              <div>—</div>
            </div>
            <div
              className={`${prefix}-carnum-item flex-center ${
                currentNumIndex === 2 ? `${prefix}-carnum-active` : ""
              }`}
              onClick={this.showKeyboard.bind(this, 2)}
            >
              {valueArr && valueArr[2]}
            </div>
            <div
              className={`${prefix}-carnum-item flex-center ${
                currentNumIndex === 3 ? `${prefix}-carnum-active` : ""
              }`}
              onClick={this.showKeyboard.bind(this, 3)}
            >
              {valueArr && valueArr[3]}
            </div>
            <div
              className={`${prefix}-carnum-item flex-center ${
                currentNumIndex === 4 ? `${prefix}-carnum-active` : ""
              }`}
              onClick={this.showKeyboard.bind(this, 4)}
            >
              {valueArr && valueArr[4]}
            </div>
            <div
              className={`${prefix}-carnum-item flex-center ${
                currentNumIndex === 5 ? `${prefix}-carnum-active` : ""
              }`}
              onClick={this.showKeyboard.bind(this, 5)}
            >
              {valueArr && valueArr[5]}
            </div>
            <div
              className={`${prefix}-carnum-item flex-center ${
                currentNumIndex === 6 ? `${prefix}-carnum-active` : ""
              }`}
              onClick={this.showKeyboard.bind(this, 6)}
            >
              {valueArr && valueArr[6]}
            </div>
            {!isEnergy ? (
              <div
                onClick={this.setEnergy.bind(this, 7)}
                className={`${prefix}-carnum-energy-item`}
              >
                <img
                  style={{ width: "100%", height: "100%" }}
                  src={require("./../../assets/imgs/mycar/Car_icon_Addto_d.png")}
                ></img>
              </div>
            ) : null}
            {isEnergy ? (
              <div
                onClick={this.showKeyboard.bind(this, 7)}
                className={`${prefix}-carnum-item flex-center ${
                  currentNumIndex === 7 ? `${prefix}-carnum-active` : ""
                }`}
              >
                {carNum && carNum[7]}
                {valueArr && valueArr[7]}
              </div>
            ) : null}
          </div>
        </div>
        <div className={`${prefix}-carnum-list-picker`}>
          <Picker
            data={carList}
            extra="请选择品牌"
            style={colorStyle}

            cols={1}
            id="carBrand"
            value={this.state.carBrand}
            visible={this.state.carBrandVisible}
            onOk={val => {
              this.setState({ carBrand: val, carBrandVisible: false }) }}
            onDismiss={val => this.setState({ carBrandVisible: false })}
          >
            <CarBrands onClick={this.showCarBrand.bind(this)} value={this.state.carBrand}>品牌</CarBrands>
            {/*<List.Item arrow="horizontal" onClick={this.showCarBrand.bind(this)}>品牌</List.Item>*/}
          </Picker>
          <Picker
            data={colorList}
            extra="请选择车身颜色"
            cols={1}
            value={this.state.carColor}
            visible={this.state.carColorVisible}
            onOk={(val) =>
              this.setState({ carColor: val, carColorVisible: false })
            }
            onDismiss={(val) => this.setState({ carColorVisible: false })}
          >
            <CarBrands
              onClick={this.showCarColor.bind(this)}
              value={this.state.carColor}
            >
              颜色
            </CarBrands>
            {/*<List.Item arrow="horizontal" onClick={this.showCarColor.bind(this)}>颜色</List.Item>*/}
          </Picker>
          <Picker
            data={modelList}
            extra="请选择车型"
            cols={1}
            value={this.state.carType}
            visible={this.state.carTypeVisible}
            onOk={(val) =>
              this.setState({ carType: val, carTypeVisible: false })
            }
            onDismiss={(val) => this.setState({ carTypeVisible: false })}
          >
            <CarBrands
              onClick={this.showCarType.bind(this)}
              value={this.state.carType}
            >
              车型
            </CarBrands>
            {/*<List.Item arrow="horizontal" onClick={this.showCarType.bind(this)}>车型</List.Item>*/}
          </Picker>
          <Picker
            data={carNoColorList}
            extra="请选择车牌颜色"
            cols={1}
            value={this.state.carNoColor}
            visible={this.state.carNoColorVisible}
            onOk={(val) =>
              this.setState({ carNoColor: val, carNoColorVisible: false })
            }
            onDismiss={(val) => this.setState({ carNoColorVisible: false })}
          >
            <CarBrands
              onClick={this.showNoColor.bind(this)}
              value={this.state.carNoColor}
            >
              车牌颜色
            </CarBrands>
            {/*<List.Item arrow="horizontal" onClick={this.showNoColor.bind(this)}>车牌颜色</List.Item>*/}
          </Picker>
        </div>
        <div className={`${prefix}-carnum-affirm`}>
          {this.state.carNoColor &&
          this.state.carType &&
          this.state.carBrand &&
          this.state.carBrand ? (
            <input
              type="button"
              className={`${prefix}-carnum-button btn-color`}
              onClick={this.addCar.bind(this)}
              value="确认"
            />
          ) : (
            <input
              type="button"
              className={`${prefix}-carnum-button`}
              onClick={this.addCar.bind(this)}
              value="确认"
            />
          )}
        </div>
      </div>
    )

  }
}


export default inject('store')(
  observer(Addcar)
)
