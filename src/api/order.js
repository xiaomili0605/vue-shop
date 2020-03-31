import axios from './config'
/**
 * 获取订单数据列表
 */
export const getOrders = data => axios.get('orders', { params: data })

/**
 * 获取物流进度数据
 */
export const getProgress = _ => axios.get('/kuaidi/804909574412544580')