import { request } from 'umi';

/**  角色列表 */
export async function roleList(params: API.PageApiParams, options?: Record<string, any>) {
  return request<any>('/api/v1/role/list', {
    params: { ...params },
    ...(options || {}),
  });
}

/**  新增角色 */
export async function addRole(body: any, options?: Record<string, any>) {
  return request<any>('/api/v1/role/', {
    method: 'POST',
    data: { ...body },
    ...(options || {}),
  });
}

/**  删除角色 */
export async function delRole(params: { id: string }, options?: Record<string, any>) {
  return request<any>(`/api/v1/role/${params.id}`, {
    method: 'DELETE',
    // params: { ...params },
    ...(options || {}),
  });
}

/**  编辑角色 */
export async function editRole(body: any, options?: Record<string, any>) {
  return request<any>('/api/v1/role/', {
    method: 'PUT',
    data: { ...body },
    ...(options || {}),
  });
}

/**  权限列表 */
export async function allAuthList(params: API.PageApiParams, options?: Record<string, any>) {
  return request<any>('/api/v1/perm/listAll', {
    params: { ...params },
    ...(options || {}),
  });
}
