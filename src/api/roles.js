import axios from './config'

/**
 * 获取角色列表数据
 */
export const getRoles = _ => axios.get('roles')

/**
 * 根据id删除权限
 */
export const removeRoles = (roleId, rightId) => axios.delete(`roles/${roleId}/rights/${rightId}`)

/**
 * 获取所有权限列表
 */
export const getRights = _ => axios.get('rights/tree')

/**
 * 分配权限请求，注意请求参数
 */
export const setRoles = (roleId, data) => axios.post(`roles/${roleId}/rights`, { rids: data})

