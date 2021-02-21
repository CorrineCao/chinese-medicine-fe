/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access(initialState: { permList?: string[] }) {
  const { permList = [] } = initialState || {};
  return {
    canUser: permList.findIndex((item) => item === 'UC_USER_ADMIN_PAGE') >= 0,
    canAuth: permList.findIndex((item) => item === 'PERM_ADMIN_PAGE') >= 0,
    canRole: permList.findIndex((item) => item === 'ROLE_ADMIN_PAGE') >= 0,
  };
}
