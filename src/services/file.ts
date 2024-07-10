import axios from 'axios'
import { HOST } from './host'

export async function fetchFileUpload(data: any, options?: Record<string, any>) {
  const url: string = `${HOST}/upload`
  return await axios.
    post(url, data, {
      headers: {
        ...options,
        'Content-Type': 'multipart/form-data',
        // token: extraData.token,
        "Authorization": "wjgYepr0kXnY5WBvmqMt1dxXYQmA8Qv8"
      }
    }).catch((err) => {
      return err
    })
}
