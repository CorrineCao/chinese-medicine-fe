import { request } from 'umi';

/**  用户列表 */
export async function authList(params: API.PageApiParams, options?: Record<string, any>) {
  return request<any>('/api/v1/perm/list', {
    params: { ...params },
    ...(options || {}),
  });
}
