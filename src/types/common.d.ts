// 图片/视频
interface IMedia {
  url: string;
  width?: number;
  height?: number;
  type?: 'img' | 'video'
}