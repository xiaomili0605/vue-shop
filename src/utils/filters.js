/**
 * 过滤日期时间
 * 根据给定的时间得到一个时间
 */
export const formatTimer = originVal => {
    // originVal 给定的时间
    const dt = new Date(originVal)
    // 年
    const y = dt.getFullYear()
    // 月份
    const m = (dt.getMonth() + 1 + '').padStart(2, '0')
    // 日
    const d = (dt.getDate() + '').padStart(2, '0')
    // 小时
    const hh = (dt.getHours() + '').padStart(2, '0')
    // 分钟
    const mm = (dt.getMinutes() + '').padStart(2, '')
    // 秒
    const ss = (dt.getSeconds() + '').padStart(2, '0')
    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
  }