import { axios } from '../axios/index'

export const login = (params) => {
  return axios.postJSON('/api/login', params)
};