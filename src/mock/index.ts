const defaultTabBarSetting = ['home', 'meals', window.bo === 'cn' && 'mall', 'orders', 'gifts', 'my'].filter(Boolean) as string[]

console.log(window.i18n)
export const mockTabbarData: ITabbarConfig = {
  tabs: defaultTabBarSetting.map((item: string) => {
    const isInclude = ['meals', 'my'].includes(item)
    return {
      type: item,
      name: window?.i18n.tbo?.(`decorate.${item}`),
      icon: `tab-${item}new0`,
      pic: '',
      activePic: '',
      isShow: Number(isInclude),
      mode: 0 // 图标类型（0 系统图标 1 自定义）
    }
  }),
  enableName: 0, // 是否显示名称(0 不显示 1 显示)
  enablePosition: 0, // 是否悬浮(0 悬浮 1固定底部)
  backgroundColor: '#fff', // 背景颜色
  pagesShow: {} as { [type: string]: number }
}