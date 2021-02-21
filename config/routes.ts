export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user/loginPage',
        component: './User/login',
      },
    ],
  },
 {
    path: '/list',
    name: 'list',
    icon: 'setting',
    routes: [
      {
        path: '/list/user',
        name: 'user-list',
        access: 'canUser',
        component: './UserList',
      },
      {
        path: '/list/auth',
        name: 'auth-list',
        access: 'canAuth',
        component: './AuthList',
      },
      {
        path: '/list/role',
        name: 'role-list',
        access: 'canRole',
        component: './RoleList',
      },
    ],
  },
  {
    path: '/',
    redirect: '/list/user',
  },
  {
    component: './404',
  },
];
