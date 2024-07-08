import axios from 'axios'
import { HOST } from './host'

class UploadApi {
  // 上传
  productUpload = async (data: any) => {
    const url: string = `${HOST}/imageUpload/productUpload`
    return await axios.post(url, data).catch((err) => {
      return err
    })
  }
}

export default new UploadApi()
