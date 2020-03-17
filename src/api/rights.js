import axios from './config'

export const getRights = _ =>axios.get('rights/list')
