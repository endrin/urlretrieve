var gulp = require('gulp'),
    $ = require('gulp-load-plugins')({lazy: true});

var config = {

  testFiles: 'test/*.js',
  codeFiles: [
    '*.js',
    'test/**/*.js',
    '!node_modules/**.*'
  ],

  mocha: {
    ui: 'bdd',
    reporter: 'nyan',
    timeout: 2000
  }
};

gulp.task('lint', function () {
  return gulp
    .src(config.codeFiles)
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish', {verbose: true}))
    .pipe($.jshint.reporter('fail'))
  ;
});

gulp.task('test', ['lint'], function () {
  return gulp
    .src(config.testFiles, {read: false})
    .pipe($.mocha(config.mocha))
  ;
});

gulp.task('test-dev', function () {
  return gulp.watch(
    config.codeFiles,
    { interval: 500 },
    ['test']
  );
});
