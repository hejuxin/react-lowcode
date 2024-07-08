const PREFIX = 'ls.'

/** 给key添加统一的前缀 */
const _getStoreKey = (key: string) => {
  if (!key) {
    return ''
  }

  if (key.indexOf(PREFIX) === 0) {
    return key
  }

  return `${PREFIX}${key}`
}

const _serialize = (value: any) => {
  return JSON.stringify(value)
}

const _deSerialize = (value: any) => {
  if (!value) {
    return value
  }

  let deSerializeValue = ''
  try {
    deSerializeValue = JSON.parse(value)
  } catch (error) {
    deSerializeValue = value
  }

  return deSerializeValue
}

export interface ILocalStore {
  set(key: string, value: any, expire?: number): any;
  get(key: string): any;
  remove(key: string): void;
}

export const localStore: ILocalStore = {
  set: (key, value, expire = 0) => {
    const storeKey = _getStoreKey(key)

    if (value === undefined) {
      return localStore.remove(storeKey)
    }

    try {
      localStorage.setItem(storeKey, _serialize(value))
      if (expire > 0) {
        localStorage.setItem(`${storeKey}_expire`, _serialize((new Date().getTime() + expire)))
      }
    } catch (error) {
      console.error(error)
    }
  },

  get: (key) => {
    let storeKey = _getStoreKey(key)

    let storage = _deSerialize(localStorage.getItem(storeKey))
    if (!storage) {
      storeKey = key
      storage = _deSerialize(localStorage.getItem(key))
    }

    if (storage) {
      const expiredTime = _deSerialize(localStorage.getItem(`${storeKey}_expire`))
      // 缓存一直有效
      if (!expiredTime) {
        return storage
      }

      // 缓存过期 清除数据
      if (expiredTime < new Date().getTime()) {
        localStore.remove(storeKey)
        localStore.remove(`${storeKey}_expire`)
        return undefined
      }

      return storage
    }

    return undefined
  },

  remove: (key) => {
    localStorage.removeItem(key)
  }
}
