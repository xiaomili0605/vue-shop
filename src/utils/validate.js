/**
 * 过滤特殊字符
 */
export const stripscript = str => {
    const pattern = new RegExp(
      "[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（） ——|{}【】‘；：”“'。，、？]"
    )
    let newStr = ''
    for (let i = 0; i < str.length; i++) {
      newStr = newStr + str.substr(i, 1).replace(pattern, '')
    }
    return newStr
  }
  
  /**
   * 邮箱 验证
   * 通过返回 true 不通过 返回 false
   */
  export const validateEmail = value => {
    const reg = /^([a-zA-Z]|[0-9])(\w|-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/
    if (!reg.test(value)) return false
    return true
  }
  
  /**
   * 密码 验证
   * 6至20位的字母+数字 通过返回 true 不通过 返回 false
   */
  export const validatePassWord = value => {
    const reg = /^(?!\D+$)(?![^a-zA-Z]+$)\S{6,20}$/
    if (!reg.test(value)) return false
    return true
  }
  
  /**
   * 验证码 验证
   * 6位数字+字母 通过返回 true 不通过 返回 false
   */
  export const validateVCode = value => {
    const reg = /^[a-zA-Z0-9]{6}$/
    if (!reg.test(value)) return false
    return true
  }
  
  /**
   * 手机号 验证
   * 通过返回 true 不通过 返回 false
   */
  export const validateMobile = value => {
    const reg = /^[1][3|4|5|6|7|8|9][0-9]{9}$/
    if (!reg.test(value)) return false
    return true
  }  