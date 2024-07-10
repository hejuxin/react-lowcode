const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://sm.ms/api/',
      changeOrigin: true,
      followRedirects: true // This will likely fix the redirect issue
    })
  );
};