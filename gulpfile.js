const del = require('del');
const { src, dest} = require('gulp');
const pug = require('gulp-pug');
const sass = require('gulp-sass')(require('sass'));
const rename = require('gulp-rename');
const fs = require('fs');
const util = require('util');

let projects = fs.readdirSync('projects');

function buildAllProjects() {
    let promises = [];

    projects.forEach((project) => {
        promises.push(...[
            (util.promisify(buildHtml.bind(null, [project]))()),
            (util.promisify(buildCSS.bind(null, [project]))()),
            (util.promisify(copyJS.bind(null, [project]))())
        ]);
    });

    return Promise.allSettled(promises)
        .then(() => console.log('Projects built successfully'))
        .catch(err => console.log('Error building projects', err));
}

function clean() {
    return del(['build']);
}

function buildHtml(project, cb) {
    src(`./projects/${project}/src/**/*.pug`)
        .pipe(pug({pretty: true}))
        .pipe(rename({dirname: ''}))
        .pipe(dest(`./build/${project}`));

    cb();
}

function buildCSS(project, cb) {
    src(`./projects/${project}/src/**/*.sass`)
        .pipe(sass())
        .pipe(rename({dirname: ''}))
        .pipe(dest(`./build/${project}`));

    cb();
}

function copyJS(project, cb) {
    src(`./projects/${project}/src/**/*.js`)
        .pipe(rename({dirname: ''}))
        .pipe(dest(`./build/${project}`));

    cb();
}

module.exports = {
    clean,
    buildAll: buildAllProjects
};
