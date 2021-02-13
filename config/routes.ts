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
    icon: 'crown',
    // access: 'canAdmin',
    // component: './Admin',
    routes: [
      {
        path: '/list/user',
        name: 'user-list',
        icon: 'smile',
        component: './TableList',
      },
      {
        path: '/list/auth',
        name: 'auth-list',
        icon: 'smile',
        component: './TableList',
      },
      {
        path: '/list/role',
        name: 'role-list',
        icon: 'smile',
        component: './TableList',
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
