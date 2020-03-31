import axios from 'axios'

// 配置代理时，需要这里配置
axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/'

axios.defaults.timeout = 3000
axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.transformRequest = function (data) {
    if (!data) return data
    let str = ``
    for (let key in data) {
        if (!data.hasOwnProperty(key)) break
        str += `&${key}=${data[key]}`
    }
    return str.substring(1)
}

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 每次请求带上 token(第一次是没有token的，因为第一次响应数据中的token才保存sessionStorage中，下次请求就会有了token了)
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
}, function (error) {
// 对请求错误做些什么
  return Promise.reject(error)
})
// 添加响应拦截器
axios.interceptors.response.use(function (response) {
// 对响应数据做点什么
  const data = response.data
  return data
}, function (error) {
// 对响应错误做点什么
  return Promise.reject(error)
})

export default axios