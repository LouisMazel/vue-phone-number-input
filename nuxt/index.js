const { resolve } = require('path')

module.exports = function VuePhoneNumberInput () {
  this.addPlugin({
    ssr: false,
    src: resolve(__dirname, 'plugin.js'),
    fileName: 'vue-phone-number-input.js'
  })
}

module.exports.meta = require(__dirname, './../package.json')