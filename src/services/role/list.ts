import { request } from 'umi';

/**  用户列表 */
export async function roleList(params: API.PageApiParams, options?: Record<string, any>) {
  return request<any>('/api/v1/role/list', {
    params: { ...params },
    ...(options || {}),
  });
}
