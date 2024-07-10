export const deepClone = (obj: any) => {
  if (obj === null) return null;
  const clone = Object.assign({}, obj);
  Object.keys(clone).forEach(
    (key) =>
      (clone[key] =
        typeof obj[key] === 'object' ? deepClone(obj[key]) : obj[key])
  );
  return Array.isArray(obj) && obj.length
    ? (clone.length = obj.length) && Array.from(clone)
    : Array.isArray(obj)
      ? Array.from(obj)
      : clone;
};

export const removeVideo = (index?: number) => {
  const videoList: any = document.querySelector('.diy-video-list')
  if (index) {
    const video: any = document.getElementById(`video${index}`)
    videoList.removeChild(video)
  } else {
    videoList.childNodes.forEach((child: any) => {
      videoList.removeChild(child)
    })
  }
}

/**
 * 设置css3变量
 * @param {string} selector - 元素选择器
 * @param {Record<string, any>} cssMap - 设置的css3变量
 */
export function setCSSProperty (selector: string, cssMap: Record<string, any> = {}) {
  // const webApp = ['hqtop', 'handtop']
  // 兼容hqtop项目
  // if (webApp.includes((window as any)?.Config?.APP)) {
  const ele = document.querySelector(selector) as any
  Object.keys(cssMap).forEach((key) => {
      ele?.style?.setProperty?.(key, cssMap[key])
  })

  // return
  // }
}