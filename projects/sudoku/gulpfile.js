const CommonRegistry = require('./../../common-registry');
const { registry, series, parallel } = require('gulp');

let options = {
    buildDir: './build/',
    viewsSrc: './src/views/*.pug',
    stylesDir: './src/styles/**/*.sass'
};

registry(new CommonRegistry(options));

module.exports.default = series('clean', parallel(['buildHtml', 'buildStyles'])); // jshint undef: false
