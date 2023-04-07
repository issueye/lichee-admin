import { axios } from './axios/index'

// 获取数据库源列表
export const apiGetDbSourceList = (params) => {
    return axios.getData('/api/dbSource', params)
};

//保存数据库源
export const apiSaveDbSource = (params) => {
    return axios.postJSON('/api/dbSource', params)
};
//编辑数据库源
export const apiEditDbSource = (params) => {
    return axios.putJSON(`/api/dbSource`, params)
};

// 删除数据库源
export const apiDelDbSource = (params) => {
    return axios.deleteJSON(`/api/dbSource/${params.id}`)
};

// 测试连接数据库
export const apiTestLinkDb = (params) => {
    return axios.postJSON('/api/dbSource/testLink', params)
}