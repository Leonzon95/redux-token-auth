import axios from 'axios'
import { invertMapKeysAndValues } from './utility'
import {
  AuthHeaders,
  AuthResponse,
  DeviceStorage,
  SingleLayerStringMap,
} from '../types'

const authHeaderKeys: Array<string> = [
  'access-token',
  'token-type',
  'client',
  'expiry',
  'uid',
  'admin-access-token',
  'admin-token-type',
  'admin-client',
  'admin-expiry',
  'admin-uid',
]

export const setAuthHeaders = (headers: AuthHeaders): void => {
  authHeaderKeys.forEach((key: string) => {
    console.log(headers[key])
    if (!headers[key]) {
      axios.defaults.headers.common[key] = window.localStorage.getItem(key)
      console.log(window.localStorage.getItem(key))
    } else {
      axios.defaults.headers.common[key] = headers[key]
    }
  })
}

export const persistAuthHeadersInDeviceStorage = (Storage: DeviceStorage, headers: AuthHeaders): void => {
  authHeaderKeys.forEach((key: string) => {
    Storage.setItem(key, headers[key])
  })
}

export const deleteAuthHeaders = (): void => {
  authHeaderKeys.forEach((key: string) => {
    delete axios.defaults.headers.common[key]
  })
}

export const deleteAuthHeadersFromDeviceStorage = async (Storage: DeviceStorage): Promise<void> => {
  authHeaderKeys.forEach((key: string) => {
    Storage.removeItem(key)
  })
}

export const getUserAttributesFromResponse = (
  userAttributes: SingleLayerStringMap,
  response: AuthResponse
): SingleLayerStringMap => {
  const invertedUserAttributes: SingleLayerStringMap = invertMapKeysAndValues(userAttributes)
  const userAttributesBackendKeys: string[] = Object.keys(invertedUserAttributes)
  const userAttributesToReturn: SingleLayerStringMap = {}
  Object.keys(response.data.data).forEach((key: string) => {
    if (userAttributesBackendKeys.indexOf(key) !== -1) {
      userAttributesToReturn[invertedUserAttributes[key]] = response.data.data[key]
    }
  })
  return userAttributesToReturn
}
