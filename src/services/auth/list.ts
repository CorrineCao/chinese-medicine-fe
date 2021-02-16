import { request } from 'umi';

/**  权限列表 */
export async function authList(params: API.PageApiParams, options?: Record<string, any>) {
  return request<any>('/api/v1/perm/list', {
    params: { ...params },
    ...(options || {}),
  });
}

/**  新增权限 */
export async function addAuth(body: any, options?: Record<string, any>) {
  return request<any>('/api/v1/perm/', {
    method: 'POST',
    data: { ...body },
    ...(options || {}),
  });
}

/**  删除权限 */
export async function delAuth(params: { id: string }, options?: Record<string, any>) {
  return request<any>(`/api/v1/perm/${params.id}`, {
    method: 'DELETE',
    // params: { ...params },
    ...(options || {}),
  });
}
