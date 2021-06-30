import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Toast, ListView, PullToRefresh, } from 'antd-mobile'
import { Activate, Deactivate, Release, Finish } from './../../common/yy-refresh-indiccator'
import './index.scss'

import {back, getUrlValue, jump, pxTovw, setTitle} from '../../utlis/utlis'
import http from "../../utlis/http";


const prefix = 'coordinate-info'


class CoordinateInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  componentDidMount() {
    setTitle.call(this, '隐私政策')


  }
  render() {
    const {list,flag,url } = this.state
    return(
      <div className={`${prefix} flex flex-column`}>
        <h2>用户协议声明</h2>
        <div>
          <p>亲爱的用户，您好：</p>
          <p>欢迎您使用智安小区助手。</p>
          <p>以下智安小区助手协议条款是您与浙江易云物联科技有限公司以及其附属公司(以下统称“易云”)订立的具备法律效力的协议。本条款确立您使用智安小区助手产品、软件、服务以及相关网站(以下统称“本服务”)时享有的法律责任和权利。在本条款中，“您”指任何使用和访问本服务的个人。</p>
          <p>您需要同意这些智安小区助手协议条款，包括易云隐私政策和任何相应的您和易云之间约定的协议(以下统称“本条款”)才能使用本服务。请您务必仔细阅读以下条款，并勾选条款结尾处的方框以表明您已经阅读并接受这些条款。如您不同意全部或任一部分的条款，您将不能且不应使用本服务。</p>
          <h3>1.我们会保护您的个人数据</h3>
          <p>
            易云尊重并保护所有使用智安小区助手用户的个人隐私权，您注册的个人资料(如昵称、头像、性别、年龄、电话或电子邮件地址等)，除经您明确同意，或根据相关法律、法规的强制性规定须披露外，易云不会主动地收集、披露、转让或提供给第三方。为了数据安全，易云将您的数据保存在云端，在未经您同意并授权的情况下，易云不会将该数据用于其它目的。</p>
          <h3>
            2.第三方服务</h3>
          <p>
            运营商和第三方将可能会通过智安小区助手平台上提供相应的产品和服务，例如第三方app以及服务内容。当您在选择第三方的产品和服务时，就表示您认可并同意第三方的服务条款。因此，易云强烈建议您提前仔细阅读第三方的相关协议内容和隐私政策条款，因为易云对第三方提供的产品和服务不具有管控和审查的权利或义务，所以，若因您使用第三方的产品或服务而遭受了权益上的损害，易云不对此承担任何责任。</p>
            <h3>
              3.数据授权和收集</h3>
          <p>
            为了更好的提高产品稳定性以及更好的为您提供个性化服务，易云及与智安小区助手合作的第三方厂商将会收集有关您产品的一些错误信息或数据。您在打开“智安小区助手”时弹出的提示界面中点击“同意”或您使用“智安小区助手”本身即表明您已经同意并授权易云对您的以下信息进行收集和分析：设备信息，如手机操作系统、手机语言、终端型号、手机联网模式、位置等；客户端信息，如客户端版本号、客户端下载渠道、用户打开/关闭客户端的时间等；应用信息，如应用报错信息、服务启动等。对于您同意第三方对自己的相关信息进行处理的情形，请您遵循本条款第2条的内容。</p>
          <p>
            为了保证您的数据不丢失，定时将您的数据同步到云端，同步到云端的数据不能被批量销毁。对于同步到云端的数据会被永久保存。</p>
          <p>
            为了提升您使用易云产品的体验和便捷程度，“智安小区助手”在默认的情况下会自动把您已明确同意易云收集的数据共享给其他易云产品，例如“温州智安”。同样，在默认的情况下，易云其他产品也会把您同意易云收集的数据共享给“智安小区助手”，例如“温州智安”。</p>
          <p>
            在您使用智安小区助手过程中，为了避免您被过度打扰，请您授权智安小区助手可以自动开启或关闭蓝牙功能。</p>
          <p>
            对于您已明确同意易云收集的个人信息，将按照易云的“隐私政策”处理，因此请您仔细阅读其内容。您可以通过点击打开“智安小区助手”时弹出的“提示”界面中的“易云隐私政策”来获取其全部内容。</p>
          <h3>
            4.风险及责任</h3>
          <p>
            (1)您应该对使用智安小区助手的结果自行承担风险。易云不做任何形式的保证：不保证服务及其结果满足您的要求，不保证产品各项服务不中断，不保证服务及数据结果的安全性、正确性、及时性、合法性。因网络状况、通讯线路、第三方网站或服务商等任何原因而导致您不能正常使用智安小区助手，易云不承担任何法律责任。除非特别说明，易云向您提供的服务均为免费。某些服务需要电话、数据服务或短信等功能支持，您可能需要支付给第三方费用。易云不会主动收集您的个人身份信息，除非这些信息是您主动提供的。</p>
          <p>
            (2)由于您的自身行为以及不可抗力等情形，导致上述可能涉及您隐私或您认为是隐私信息的内容发生被泄露、披露，或被第三方获得、使用、转让等情形的，均由您个人承担不利后果，易云不承担任何责任。</p>
          <p>
            (3)基于智安小区助手呈现的所有数据或结果，仅供参考。由此产生的任何风险或事故，易云不承担任何责任。</p>
          <p>
            (4)您需要承担因数据同步到云端或本地所产生的网络流量。</p>
          <p>
            (5)在管辖法律许可的最大范围内，易云对于因使用本软件而产生的任何“附加”损害赔偿或任何种类或性质的任何附带的、间接的、特别的或惩罚性的损害赔偿(包括但不限于利润损失、业务经营损失、收益损失、数据丢失、收入损失、商誉损失或逾期利益的损失)不承担任何责任，而不论该责任是根据合同、侵权行为(包括过失的可能性或严格责任制)还是以其他方式主张，也不论该损失是否可被预见，即使最终用户已被警告可能有上述损失或损害。</p>
          <p>
            (6)在管辖法律许可的最大范围内，易云对于最终用户使用本软件所承担的责任上限不应超过最终用户为购买本软件所支付的代价。
          </p>
          <h3>
            5.使用限制
          </h3>
          <p>
            本软件易云及其许可人拥有完全的知识版权。您在遵守法律、法规、政策及本协议的前提下，可依本协议使用本软件。您无权也不得实施包括但不限于下列行为：
          </p>
          <p>
            (1)删除本软件中的任何版权声明或提示以及任何其他信息、内容。
          </p>
          <p>
            (2)对本软件进行反向工程、反向汇编、反向编译等。
          </p>
          <p>
            (3)对本协议规定的条款之外，使用、复制、修改、租赁或转让本软件或其中的一部分。
          </p>
          <p>
            (4)向第三人提供本软件，许可他人使用本软件或将本软件用于易云禁止的目的(如商业目的等)。
          </p>
          <p>
            (5)对本软件的图像、文字等相关信息，擅自实施包括但不限于下列行为：使用、复制、修改、链接、转载、汇编、发表、出版、建立镜像站点、擅自借助本软件发展与之有关的的衍生产品、作品及服务等。
          </p>
          <p>
            (6)利用本软件储存、发表、传播违反国家法律、法规以及国家政策规定的内容。
          </p>
          <p>
            (7)利用本软件存储、发表、传播侵害他人知识产权、商业秘密等合法权利的内容。
          </p>
          <p>
            (8)进行危害计算机网络安全的行为。
          </p>
          <p>
            (9)智安小区助手运营方有权对用户使用智安小区助手服务的行为及信息进行审查、监督及处理，包括但不限于用户信息（账号信息、个人信息等）、发布内容（位置、文字、图片、音频、视频）、用户行为（构建关系、评论、私信、参与话题、参与活动、信息发布、举报投诉等）等范畴。
          </p>
          <h3>
            6.版本升级
          </h3>
          <p>
            本软件将来是否提供升级版本将由易云决定。如果易云决定提供本软件的升级版本，则除非升级版本有替代的“软件服务条款”，否则升级版本仍使用本条款。您选择操作升级的动作即表示您已经明确“同意”遵守相关的软件服务条款，如您不同意软件服务条款的任何内容，那么请您不要操作升级动作。
          </p>
          <h3>
            7．权利终止
          </h3>
          <p>
            本协议任何条款的部分或全部无效，不影响其它条款的效力。易云或其许可人有权随时中止或终止本协议。本协议中止后，您必须立即停止使用本软件，删除已经复制、安装的所有软件及相关资料。
          </p>
          <p>
            浙江易云物联科技有限公司版权所有，保留在法律许可范围内的解释权。
          </p>
        </div>
      </div>

    )
  }
}

export default inject('store')(
  observer(CoordinateInfo)
)
