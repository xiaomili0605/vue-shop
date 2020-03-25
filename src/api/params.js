import axios from './config'

/**
 * 获取商品分类数据列表
 */
export const getCate = _ => axios.get('categories')

/**
 * 获取三级分类数据
 */
export const getInfo = (id, data) => axios.get(`categories/${id}/attributes`, { params: data })

/**
 * 添加动态参数或静态属性
 */
export const addParamsInfo = (id, data) => axios.post(`categories/${id}/attributes`, data)

/**
 * 修改动态参数或静态属性时，先通过id获取数据
 */
export const getEditParamsInfo = (cateId, attr_id, data) => axios.get(`categories/${cateId}/attributes/${attr_id}`, { params: data } )


/**
 * 修改完成后发送请求
 */
export const editParamsInfo = (cateId, attr_id, data) => axios.put(`categories/${cateId}/attributes/${attr_id}`, data)

/**
 * 删除参数
 */
export const removeParamsInfo = (cateId, attr_id) => axios.delete(`categories/${cateId}/attributes/${attr_id}`)

/**
 * 添加参数请求
 */
export const additionParamsInfo = (cateId, attr_id, data) => axios.put(`categories/${cateId}/attributes/${attr_id}`, data)