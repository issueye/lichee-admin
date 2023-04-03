import { axios } from './axios/index'
//获取任务列表
export const getTaskList = (params) => {
    return axios.getData('/api/job', params)
};
//保存任务
export const saveTaskName = (params) => {
    return axios.postJSON('/api/job', params)
};
//编辑任务
export const editTaskName = (params) => {
    return axios.putJSON(`/api/job`, params)
};

//编辑状态
export const editTaskStatus = (params) => {
    return axios.putJSON(`/api/job/status/${params.id}`, params)
};

export const delTask = (params) => {
    return axios.deleteJSON(`/api/job/${params.id}`)
};
