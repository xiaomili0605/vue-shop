import axios from './config'

/**
 * 获取商品分类数据列表
 */
export const getCate = _ => axios.get('categories')

/**
 * 获取动态参数数据/静态属性数据
 */
export const getMany = (id, data) => axios.get(`categories/${id}/attributes`, { params: data })

/**
 * 添加商品
 */
export const addInfo = data => axios.post('goods', data)
