import {
    decorate,
    observable
} from 'mobx'
const sUserAgent = window.navigator.userAgent.toLowerCase()
class CommonStore {
    // Mozilla/5.0 (iPhone; CPU iPhone OS 12_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 ChannelId(0) LyraVM Nebula AlipayDefined() AliApp(AP/10.1.80) AlipayClient/10.1.80 Language/en AlipayIDE
    // Mozilla/5.0 (Android 9.0; Nexus 5 Build/_BuildID_ AppleWebKit/603.1.30 (KHTML, like Gecko) Mobile/15E148 ChannelId(0) LyraVM Nebula AlipayDefined() AliApp(AP/10.1.80) AlipayClient/10.1.80 Language/en AlipayIDE
    bIsDtDreamApp = sUserAgent.indexOf('dtdreamweb') > -1 // 浙里办APP
    bIsAlipayMini = sUserAgent.indexOf('miniprogram') > -1 && sUserAgent.indexOf('alipay') > -1 // 浙里办支付宝小程序
    bIsAliXcx = sUserAgent.indexOf('AlipayIDE') > -1 // 支付宝小程序
}
decorate(CommonStore, {
    bIsDtDreamApp: observable,
    bIsAlipayMini: observable,
    bIsAliXcx:observable
})

export default CommonStore
