import { request } from 'umi';

export async function getSysCode(options?: Record<string, any>) {
  return request<any>('/api/v1/sysCode/my/all', {
    ...(options || {}),
  });
}

export async function getAllPerm(options?: Record<string, any>) {
  return request<any>('/api/v1/perm/myPerm', {
    ...(options || {}),
  });
}
