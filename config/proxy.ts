/**
 * 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 * For details, please see
 * https://pro.ant.design/docs/deploy
 */
const targetPrefix = 'http://120.27.238.159:8081/';
export default {
  dev: {
    '/api/': {
      target: targetPrefix,
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
    },
  },
  test: {
    '/api/': {
      target: targetPrefix,
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
  pre: {
    '/api/': {
      target: targetPrefix,
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
};
