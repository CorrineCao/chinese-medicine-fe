import { request } from 'umi';

/** 登录接口 */
export async function login(body: API.LoginParams, options?: Record<string, any>) {
  return request<API.LoginResult>('/api/user/login', {
    method: 'POST',
    /*     headers: {
      'Content-Type': 'application/json',
    }, */
    // data: body,
    params: body,
    ...(options || {}),
  });
}

/** 登出接口 POST /api/login/outLogin */
export async function outLogin(options?: Record<string, any>) {
  return request<Record<string, any>>('/api/user/logout', {
    method: 'POST',
    ...(options || {}),
  });
}
