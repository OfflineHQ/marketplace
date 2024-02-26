const { join } = require('path');

module.exports = {
  plugins: {
    // pass in the local tailwind config
    tailwindcss: {
      config: join(__dirname, 'tailwind.config.js'),
    },
    autoprefixer: {},
  },
};
