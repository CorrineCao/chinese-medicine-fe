import { request } from 'umi';

/**  用户列表 */
export async function userList(params: API.PageApiParams, options?: Record<string, any>) {
  return request<any>('/api/user/list', {
    params: { ...params },
    ...(options || {}),
  });
}

/**  新增用户 */
export async function addUser(params: any, options?: Record<string, any>) {
  return request<any>('/api/user/addUser', {
    method: 'POST',
    params: { ...params },
    ...(options || {}),
  });
}

/**  删除用户 */
export async function delUser(params: { id: string }, options?: Record<string, any>) {
  return request<any>(`/api/user/${params.id}`, {
    method: 'DELETE',
    // params: { ...params },
    ...(options || {}),
  });
}

/**  编辑用户 */
export async function editUser(body: any, options?: Record<string, any>) {
  return request<any>('/api/user', {
    method: 'POST',
    data: { ...body },
    ...(options || {}),
  });
}


/**  编辑角色 */
export async function setRole(params: any, options?: Record<string, any>) {
  return request<any>('/api/user/setRole', {
    method: 'POST',
    params: { ...params },
    ...(options || {}),
  });
}

/**  角色列表 */
export async function allRoleList(params: API.PageApiParams, options?: Record<string, any>) {
  return request<any>('/api/v1/role/listAll', {
    params: { ...params },
    ...(options || {}),
  });
}
