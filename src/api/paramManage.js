import { axios } from './axios/index'

// 获取参数列表
export const apiGetParamList = (params) => {
    return axios.getData('/api/param', params)
};

//保存参数
export const apiSaveParam = (params) => {
    return axios.postJSON('/api/param', params)
};

//编辑参数
export const apiEditParam = (params) => {
    return axios.putJSON(`/api/param`, params)
};

// 删除参数
export const apiDelParam = (params) => {
    return axios.deleteJSON(`/api/param/${params.area_id}/${params.id}`)
};

// 获取参数域列表
export const apiGetAreaList = (params) => {
    return axios.getData('/api/area', params)
}

//保存参数域
export const apiSaveArea = (params) => {
    return axios.postJSON('/api/area', params)
};

//删除参数域
export const apiDelAraea = (params) => {
    return axios.deleteJSON(`/api/area/${params.id}`)
};

//删除参数域
export const apiEditArea = (params) => {
    return axios.putJSON('/api/area', params)
}


