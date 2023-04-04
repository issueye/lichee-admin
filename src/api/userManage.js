import { axios } from './axios/index'

// 获取用户列表
export const apiGetUserList = (params) => {
    return axios.getData('/api/user', params)
};

//保存用户
export const apiSaveUser = (params) => {
    return axios.postJSON('/api/user', params)
};
//编辑用户
export const apiEditUser = (params) => {
    return axios.putJSON(`/api/user`, params)
};

//编辑用户
export const apiEditUserStatus = (params) => {
    return axios.putJSON(`/api/user/status/${params.id}`, params)
};

// 删除用户
export const apiDelUser = (params) => {
    return axios.deleteJSON(`/api/user/${params.id}`)
};