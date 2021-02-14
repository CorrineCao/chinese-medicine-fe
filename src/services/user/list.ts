import { request } from 'umi';

/**  用户列表 */
export async function userList(params: API.PageApiParams, options?: Record<string, any>) {
  return request<any>('/api/user/list', {
    params: { ...params },
    ...(options || {}),
  });
}
