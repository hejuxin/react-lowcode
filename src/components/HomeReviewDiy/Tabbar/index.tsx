import React from 'react'
import './index.scss'

enum TabbarPositionEnum {
  tabbarFloat, // 悬浮
  tabbarFixed // 固定底部
}

// tabbar类型
type TTabBarType = 'home' | 'meals' | 'my' | 'orders' | 'mall' | 'gifts'
interface ITabbarProps {
  data: any
  activeTab: TTabBarType;
}

const Tabbar: React.FC<ITabbarProps> = React.memo((props) => {
  const { enableName, mode, tabs, enablePosition, backgroundColor, pagesShow } = props.data

  return (
    (!pagesShow || pagesShow?.[props.activeTab]) ? (
      <div className={`tabbar-wrapper ${enablePosition === TabbarPositionEnum.tabbarFixed ? '' : 'tabbar-float'}`} style={{ backgroundColor }}>
        {tabs.map((item: any) => {
          if (item.isShow) {
            return (
              <div key={item.type} className={`tabbar-item${item.type === props.activeTab ? ' active' : ''}`}>
                {
                  item.mode === 1 ? (
                    <img src={String(item.type === props.activeTab ? item.activePic : item.pic)} alt="" className="tabbar-item-img"/>
                  ) : (
                    <i className={`dicon dicon-${String(item.type === props.activeTab ? `${item.icon}_active` : item.icon)}`}></i>
                  )
                }
                {!!enableName && <p>{item.name || i18n.tbo(`decorate.${item.type}`)}</p>}
              </div>
            )
          }
        })}
      </div>
    ) : null
  )
})

export default Tabbar
