var gulp          = require('gulp'),
    clean         = require('gulp-clean'),
    concat        = require('gulp-concat'),
    cssmin        = require('gulp-cssmin'),
    footer        = require('gulp-footer'),
    fs            = require('fs'),
    glob          = require('glob'),
    header        = require('gulp-header'),
    htmlmin       = require('gulp-htmlmin'),
    jscs          = require('gulp-jscs'),
    jshint        = require('gulp-jshint'),
    karma         = require('gulp-karma'),
    livereload    = require('gulp-livereload'),
    lr            = require('tiny-lr'),
    ngmin         = require('gulp-ngmin'),
    notify        = require('gulp-notify'),
    plumber       = require('gulp-plumber'),
    q             = require('q'),
    sass          = require('gulp-ruby-sass'),
    template      = require('gulp-template'),
    templateCache = require('gulp-angular-templatecache'),
    uglify        = require('gulp-uglify'),
    watch         = require('gulp-watch'),
    _             = require('underscore');

var server = lr();

var MODULE_PREFIX  = '(function(window, angular, undefined){';
var MODULE_POSTFIX = '})(window, window.angular);';

var dest = {
  dir: './build',
  js: {
    dir:    './build/js',
    app:    'app.js',
    vendor: 'vendor.js'
  },
  css: {
    dir:    './build/css',
    app:    'app.css',
    vendor: 'vendor.css'
  }
};

var files = {
  js: {
    app: [
      'src/app/**/*.js',
      'settings.js'
    ],
    spec: [
      'vendor/angular-mocks/angular-mocks.js',
      'src/spec/**/*.spec.js'
    ],
    vendor: [
      'src/common/**/*.js',
      'vendor/angular/angular.js',
      'vendor/angular-resource/angular-resource.js',
      'vendor/angular-cookies/angular-cookies.js',
      'vendor/angular-ui-router/release/angular-ui-router.js',
      'vendor/jquery/dist/jquery.js',
      'vendor/underscore/underscore.js'
    ]
  },
  sass: {
    app: ['src/sass/main.scss'],
    vendor: []
  },
  css: {
    app: ['src/sass/**/*.css'],
    vendor: []
  },
  templates: ['src/templates/**/*.html'],
  index: 'src/index.html'
};

gulp.task('build:styles', function() {
  gulp.src(files.sass.app)
    .pipe(plumber())
    .pipe(sass())
    .pipe(concat(dest.css.app))
    .pipe(livereload(server))
    .pipe(gulp.dest(dest.css.dir));
});

var buildTemplateCache = function(dest) {
  gulp.src(files.templates)
    .pipe(templateCache({module: 'app.templates', standalone: true}))
    .pipe(ngmin())
    .pipe(gulp.dest(dest));  
};

gulp.task('build:scripts', function() {

  gulp.src(files.js.app)
    .pipe(plumber())
    .pipe(jscs())
    .pipe(jshint())
    .pipe(ngmin())
    .pipe(livereload(server))
    .pipe(gulp.dest(dest.js.dir));

  buildTemplateCache(dest.js.dir);

  gulp.src(files.js.vendor)
    .pipe(gulp.dest(dest.js.dir));
});

gulp.task('test', function() {

  buildTemplateCache('./tmp');

  gulp.src(files.js.vendor.concat(['./tmp/*.js'], files.js.app, files.js.spec))
    .pipe(plumber())
    .pipe(karma({
      configFile: 'karma.conf.js',
      action: 'run'
    }));
});

gulp.task('index', function() {

  var buildDir = process.cwd() + '/build'

  var data = {
    scripts: glob.sync('**/*.js', {cwd: buildDir}),
    styles: glob.sync('**/*.css', {cwd: buildDir})
  };

  var exclude = [
    'angular.js', 'angular.min.js', 
    'jquery.js', 'jquery.min.js'
  ];

  data.scripts = _.filter(data.scripts, function(s) {
    return !_.some(exclude, function(e) {
      return s.indexOf(e) > 0;
    });
  });

  data.headScripts = ['js/angular.js', 'js/jquery.js'];

  gulp.src(files.index)
    .pipe(template(data))
    .pipe(notify({message: "Created <%- file.relative %>", title: 'Gulp - Project Base'}))
    .pipe(gulp.dest(dest.dir));
});

gulp.task('watch', function() {

  server.listen(35729, function(error) {
    if (error) {
      return console.log(error);
    }
  });

  gulp.watch('src/**/*.js', ['build:scripts', 'index']);
  gulp.watch('src/**/*.tpl.html', ['build:scripts', 'index']);
  gulp.watch('src/**/*.scss', ['build:styles', 'index']);
});

gulp.task('clean', function() {
  var rmBuild = q.defer();
  var rmTmp = q.defer();

  fs.rmdir('./build', function() {
    rmBuild.resolve();
  });

  fs.rmdir('./tmp', function() {
    rmTmp.resolve();
  });

  return q.all([rmBuild.promise, rmTmp.promise]);
});

gulp.task('default', ['clean'], function() {
  gulp.start('build:styles', 'build:scripts', 'index', 'watch');
});
