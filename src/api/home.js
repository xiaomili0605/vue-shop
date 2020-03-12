import axios from './config'
export const getMenus = _ => axios.get('menus')
