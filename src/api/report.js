import axios from './config'

/**
 * 获取折线图数据
 */
export const getReport = _ => axios.get('reports/type/1')