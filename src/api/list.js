import axios from './config'

/**
 * 获取数据
 */
export const getGoods = data => axios.get('goods', { params: data })

/**
 * 根据id删除数据
 */
export const removeGoods = id => axios.delete(`goods/${id}`)
