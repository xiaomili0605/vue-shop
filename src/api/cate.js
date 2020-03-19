import axios from './config'

/**
 * 获取商品分类列表
 */
export const getCate = data => axios.get('categories', { params: data } )

/**
 * 点击添加分类时，获取父级父类数据
 */
export const getParentCate = type => axios.get('categories', { params: { type: 2 } })

/**
 * 添加分类
 */
export const addCateInfo = data => axios.post('categories', data)
