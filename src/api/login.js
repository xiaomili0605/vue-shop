import axios from './config.js'
export const login = data => axios.post('login', data)
