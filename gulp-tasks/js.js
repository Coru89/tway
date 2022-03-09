// not working

const { dest, src } = require('gulp');

const js = () => {
    return src("./src/js/**/*.js")
      .pipe(gulp.vinylNamed())
      .pipe(gulp.webpack(require("./webpack.config.js"), gulp.webpackCompiler, reload))
      .pipe(dest("./dist/js"))
  }

  module.exports = js;