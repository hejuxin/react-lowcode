

// 装修首页快捷入口列表
export const getHomeEntriesArr = (tabMode: ITabMode) => {
  const bo = window.bo;
  // let arr = []
  if (tabMode === 'brandCode') {
    return ['dinein', 'delivery', 'pickup', bo === 'cn' && 'scancode', 'orders', 'member', 'integralRedeem', 'coupon', bo === 'cn' && 'mall'].filter(Boolean)
  } else if (tabMode === 'storeCode') {
    return ['dinein', 'togo', 'orders', 'member', 'coupon', bo === 'cn' && 'mall'].filter(Boolean)
  }
}

export const getHomeEntriesItemDisable = (entry: string, tabMode: ITabMode) => {
  let disable = false
  let errStr = ''
  // const { miniAppWxAuthstatus, miniAppAliAuthstatus, officialAccountAuthstatus } = wechatMobx

  if (entry === 'mall' && !Number(localStorage.getItem('IsMallInit'))) {
    disable = true
    errStr = '需要先开启商城，顾客端才能看到商城内容。'
  } 
  // else if (entry === 'scancode' && !(miniAppWxAuthstatus?.status === 3 && miniAppWxAuthstatus?.auditStatus === 0 || miniAppAliAuthstatus?.status === 3 && miniAppAliAuthstatus?.auditStatus === 0 || officialAccountAuthstatus?.status === 1 && officialAccountAuthstatus?.authStatus === 0)) {
  //   disable = true
  //   errStr = i18n.t('decorate.homeEntriesTip')
  // } 
  else {
    disable = false
    errStr = ''
  }
  // else if (entry === 'buyTogether' && miniAppWxAuthstatus.status !== 3) {
  //   disable = true
  //   errStr = '需绑定小程序后，才可进行拼单'
  // }

  return {
    disable,
    errStr
  }
}

// // 装修点单页字体大小配置样式
// export const getMealFontSettingStyle = (styleObj: IMealFontSetting, key: keyof IMealFontSetting) => {
//   if (!styleObj) {
//     return {}
//   }
//   const styles = styleObj[key]
//   return {
//     // ...styles,
//     fontSize: Number(styles.fontSize) - 2,
//     fontWeight: styles.fontWeight ? 700 : 500
//   }
// }
