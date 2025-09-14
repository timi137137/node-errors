/**
 * 通用错误集
 */
export const GeneralError = {
  UNKNOWN: ['未知错误', 500],
  NEED_LOGIN: ['需要登录', 401],
  PERMISSION_DENIED: ['拒绝访问', 403],
  NO_SUCH_OBJECT: ['对象不存在', 404],
  RATE_LIMITED: ['请求过于频繁，请稍后再试', 429],
  THIRD_PARTY_ERROR: ['第三方服务错误', 505],
  INVALID_PARAMETERS: ['缺少参数', 400],
  ALREADY_EXISTS: ['存在冲突', 409],
  WRONG_STATUS: ['状态异常', 406],
  CAPTCHA_ERROR: ['验证失败', 403],
} as const;
