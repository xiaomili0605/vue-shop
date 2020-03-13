import axios from './config'

/**
 * 获取数据
 */
export const getUser = data => axios.get('users', { params: data })

/**
 * 修改用户状态
 */
export const editUser = (id, type) => axios.put(`users/${id}/state/${type}`)

/**
 * 添加用户
 */
export const addUserInfo = data => axios.post('users', data)

/**
 * 根据id获取要修改的用户信息
 */
export const getEditUser = id => axios.get(`users/${id}`)

/**
 * 修改用户信息
 */
export const editUserInfo = (id, data) => axios.put(`users/${id}`, data)

/**
 * 根据id删用户
 */
export const removeUser = id => axios.delete(`users/${id}`)

