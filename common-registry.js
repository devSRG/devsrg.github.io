const del = require('del');
const DefaultRegistry = require('undertaker-registry');
const { src, dest } = require('gulp');
const pug = require('gulp-pug');
const sass = require('gulp-sass')(require('sass'));
const rename = require('gulp-rename');

class CommonRegistry extends DefaultRegistry {
    constructor(opts) {
        super();

        opts = opts || {};

        this.buildDir = opts.buildDir || './build';
        this.viewsDir = opts.viewsDir || './src/**/*.pug';
        this.stylesDir = opts.stylesDir || './src/**/*.sass';
        this.jsDir = opts.jsDir || './src/**/*.js';
    }

    init(gulpInst) {
        gulpInst.task('clean', function () {
            if (this.buildDir.includes('build')) {
                return del([this.buildDir], {force: true});
            } else {
                return Promise.reject(new Error('Trying to delete non build directory. Please check the build path again.'));
            }
        }.bind(this));

        gulpInst.task('buildHtml', function () {
            return src(this.viewsDir)
                .pipe(pug({pretty: true}))
                .pipe(rename({dirname: ''}))
                .pipe(dest(this.buildDir));
        }.bind(this));

        gulpInst.task('buildStyles', function () {
            return src(this.stylesDir)
                .pipe(sass())
                .pipe(rename({dirname: ''}))
                .pipe(dest(this.buildDir));
        }.bind(this));

        gulpInst.task('copyJS', function () {
            return src(this.jsDir)
                .pipe(rename({dirname: ''}))
                .pipe(dest(this.buildDir));
        }.bind(this));
    }
}

module.exports = CommonRegistry;
