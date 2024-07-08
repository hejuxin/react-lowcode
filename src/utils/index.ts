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