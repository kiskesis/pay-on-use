const path = require('path');
module.exports = {
  webpack: {
    alias: {
      'components': path.resolve(__dirname, 'src/components/'),
      'styles': path.resolve(__dirname, 'src/styles/'),
      'images': path.resolve(__dirname, 'src/images/'),
      'constants': path.resolve(__dirname, 'src/constants'),
    }
  }
}