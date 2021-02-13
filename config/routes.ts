export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user',
        routes: [
          {
            name: 'login',
            path: '/user/login',
            component: './User/login',
          },
        ],
      },
    ],
  },
 {
    path: '/list',
    name: 'list',
    icon: 'setting',
    // access: 'canAdmin',
    // component: './Admin',
    routes: [
      {
        path: '/list/user',
        name: 'user-list',
        component: './UserList',
      },
      {
        path: '/list/auth',
        name: 'auth-list',
        component: './AuthList',
      },
      {
        path: '/list/role',
        name: 'role-list',
        component: './RoleList',
      },
    ],
  },
  {
    path: '/test',
    name: 'test',
    icon: 'smile',
    component: './TableList',
  },
  {
    path: '/',
    redirect: '/list/user',
  },
  {
    component: './404',
  },
];
