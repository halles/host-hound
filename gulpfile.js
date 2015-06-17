var gulp = require('gulp');
var concat = require('gulp-concat');
var usemin = require('gulp-usemin');
var rev = require('gulp-rev');
var replace = require('gulp-replace');
var templateCache = require('gulp-angular-templatecache');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-minify-css');

gulp.task('default', function() {
  // place code for your default task here
});

gulp.task('build:app', function () {
  gulp.src('frontend/index.html')
    .pipe(replace("<!-- inject:apptemplates js/templates.js -->", "<script src=\"js/templates.js\"></script>"))
    .pipe(usemin({
      vendorjs: [
        'concat',
        uglify({
          mangle: false,
          preserveComments: false
        }),
        rev()
      ],
      vendorcss: [
        'concat',
        minifyCss({compatibility: 'ie8'}),
        rev()
      ],
      appjs: [
        'concat',
        uglify({
          mangle: false,
          preserveComments: false
        }),
        rev()
      ],
      appcss: [
        'concat',
        minifyCss({compatibility: 'ie8'}),
        rev()
      ],
      enableHtmlComment: false
    }))
    .pipe(gulp.dest('public/'));
});

gulp.task('build:ngtemplates', function () {
  gulp.src(['frontend/app/**/*.html'])
    .pipe(templateCache({
      root: 'app/',
      module: 'hostHoundApp'
    }))
    .pipe(rev())
    .pipe(gulp.dest('public/js/'));
});

gulp.task('build:assets', function() {

  gulp.src('frontend/img/**')
    .pipe(gulp.dest('public/img'));

  gulp.src('frontend/fonts/**')
    .pipe(gulp.dest('public/fonts'));

  gulp.src('frontend/lib/font-awesome/fonts/*')
    .pipe(gulp.dest('public/fonts'));

});

gulp.task('build', function(){

  gulp.run('build:app', 'build:ngtemplates', 'build:assets');

});
