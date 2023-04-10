import { axios } from './axios/index'
//获取任务列表
export const apiGetTaskList = (params) => {
    return axios.getData('/api/job', params)
};
//保存任务
export const apiSaveTaskName = (params) => {
    return axios.postJSON('/api/job', params)
};
//编辑任务
export const apiEditTaskName = (params) => {
    return axios.putJSON(`/api/job`, params)
};

//编辑状态
export const apiEditTaskStatus = (params) => {
    return axios.putJSON(`/api/job/status/${params.id}`, params)
};

// 删除任务
export const apiDelTask = (params) => {
    return axios.deleteJSON(`/api/job/${params.id}`)
};

// 运行一次任务
export const apiAtOnceRun = (id) => {
    return axios.getData(`/api/job/atOnceRun/${id}`)
}
