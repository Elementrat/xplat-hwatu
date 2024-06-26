const withTM = require("next-transpile-modules")(["ux"]);

module.exports = withTM({
  basePath: '',
  images: {
    domains: ['images.unsplash.com'],
  },
  swcMinify: true,
  transpilePackages: ['@ionic/react', '@ionic/core', '@stencil/core', 'ionicons'],
})
