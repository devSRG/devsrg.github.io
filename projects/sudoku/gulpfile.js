const CommonRegistry = require('./../../common-registry');
const { registry, series, parallel } = require('gulp');

registry(new CommonRegistry());

module.exports.default = series('clean', parallel(['buildHtml', 'buildStyles', 'copyJS'])); // jshint undef: false
