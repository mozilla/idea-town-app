const autoprefixer = require('gulp-autoprefixer');
const babelify = require('babelify');
const browserify = require('browserify');
const buffer = require('vinyl-buffer');
const cache = require('gulp-cache');
const del = require('del');
const eslint = require('gulp-eslint');
const globby = require('globby');
const gulp = require('gulp');
const gulpif = require('gulp-if');
const gutil = require('gulp-util');
const imagemin = require('gulp-imagemin');
const inject = require('gulp-inject');
const minifycss = require('gulp-minify-css');
const notify = require('gulp-notify');
const rename = require('gulp-rename');
const runSequence = require('run-sequence');
const sass = require('gulp-sass');
const source = require('vinyl-source-stream');
const sourcemaps = require('gulp-sourcemaps');
const through = require('through2');
const uglify = require('gulp-uglify');
const connect = require('gulp-connect');

const IS_DEBUG = process.env.NODE_ENV !== 'production';

const SRC_PATH = './src/';
const DEST_PATH = './dist/';

// Lint the gulpfile
gulp.task('selfie', function selfieTask() {
  return gulp.src('gulpfile.js')
    .pipe(eslint())
    .pipe(eslint.format());
});

gulp.task('lint', function lintTask() {
  return gulp.src(['*.js', SRC_PATH + 'app/**/*.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
});

gulp.task('clean', function cleanTask(done) {
  del([
    DEST_PATH
  ], done);
});

gulp.task('npm:tabzilla:img', function npmTabzillaImgTask() {
  return gulp.src('./node_modules/mozilla-tabzilla/media/**')
    .pipe(gulp.dest(DEST_PATH + 'vendor/mozilla-tabzilla/media'));
});

// Copy the tabzilla assets into the src dir for inclusion in minimization
gulp.task('npm:tabzilla:css', function npmTabzillaCssTask() {
  return gulp.src('./node_modules/mozilla-tabzilla/css/tabzilla.css')
    .pipe(rename('mozilla-tabzilla/css/tabzilla.scss'))
    .pipe(gulp.dest(SRC_PATH + 'styles/vendor'));
});

// Copy the normalize assets into the src dir for inclusion in minimization
gulp.task('npm:normalize', function npmNormalizeTask() {
  return gulp.src('./node_modules/normalize.css/normalize.css')
    .pipe(rename('normalize.css/normalize.scss'))
    .pipe(gulp.dest(SRC_PATH + 'styles/vendor'));
});

gulp.task('vendor', function vendorTask(done) {
  return runSequence([
    'npm:tabzilla:img',
    'npm:tabzilla:css',
    'npm:normalize'
  ], done);
});

gulp.task('index', function() {
  return gulp.src(SRC_PATH + 'index.html')
    .pipe(
      inject(gulp.src([DEST_PATH + 'app/app.js', DEST_PATH + 'styles/**/*.min.css'], {read: false}), {ignorePath: 'dist'})
    )
    .pipe(gulp.dest(DEST_PATH + 'index.html'));
});

// based on https://github.com/gulpjs/gulp/blob/master/docs/recipes/browserify-with-globs.md
gulp.task('scripts', function scriptsTask() {
  const bundledStream = through();

  // this part runs second
  bundledStream
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
     // don't uglify in development. eases build chain debugging
    .pipe(gulpif(!IS_DEBUG, uglify()))
    .on('error', gutil.log)
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(DEST_PATH + 'app/'));

  // this part runs first, then pipes to bundledStream
  globby([SRC_PATH + 'app/**/*.js'], function(err, entries) {
    if (err) { return bundledStream.emit('error', err); }
    const b = browserify({
      entries: entries,
      debug: IS_DEBUG,
      transform: [babelify]
    });
    b.bundle().pipe(bundledStream);
  });

  return bundledStream;
});

// TODO: any good reason this step isn't including the vendor css?
gulp.task('styles', function stylesTask() {
  return gulp.src(SRC_PATH + 'styles/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer('last 2 version'))
    .pipe(gulp.dest(DEST_PATH + 'styles'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(minifycss())
    .pipe(gulp.dest(DEST_PATH + 'styles'));
});

gulp.task('images', function imagesTask() {
  return gulp.src(SRC_PATH + 'images/**/*')
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest(DEST_PATH + 'images'));
});

gulp.task('build', function buildTask(done) {
  runSequence(
    'clean',
    'vendor',
    'scripts',
    'styles',
    'images',
    'index',
    done
  );
});

gulp.task('watch', ['build'], function watchTask () {
  gulp.watch(SRC_PATH + 'styles/**/*', ['styles']);
  gulp.watch(SRC_PATH + 'images/**/*', ['images']);
  gulp.watch(SRC_PATH + 'app/**/*', ['scripts']);
});

// Set up a webserver for the static assets
gulp.task('connect', function connectTask () {
  connect.server({
    root: DEST_PATH,
    livereload: false,
    port: 9988
  });
});

gulp.task('server', ['build', 'connect', 'watch']);

gulp.task('default', ['server']);
