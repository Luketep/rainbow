// MODULES
const gulp = require('gulp');
const concat = require('gulp-concat');
const browserify = require('browserify');
const babelify = require('babelify');
const util = require('gulp-util');
const buffer = require('vinyl-buffer');
const source = require('vinyl-source-stream');
const uglify = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');
const clean = require('gulp-clean');
const stylus = require('gulp-stylus');
// CONFIGURATION
const baseSourcePath = './client';
const paths = {
	src: {
		static: [
			baseSourcePath + '/index.html',
			baseSourcePath + '/resources/**'
		],
		stylus: [
			baseSourcePath + '/css/**'
		],
		javascript: [
			baseSourcePath + '/js/**/*.js'
		],
	},
	targetFolder: 'target',
	target: {
		static: [
			'index.html',
			baseSourcePath + '/css/**/*.css',
			baseSourcePath + '/resources/'
		],
		javascript: 'target/js',
		stylus: 'target/css'
	}
};
// SET UP ENVIRONMENT
process.env.NODE_ENV = 'development';

// GULP TASKS
gulp.task('clean', function(){
	return gulp.src(paths.targetFolder, {
			read: false
		})
		.pipe(clean());
});

gulp.task('build', function() {
	return browserify(baseSourcePath + '/js/index.js', {
			debug: true
		})
		.transform(babelify, {})
		.bundle()
		.on('error', util.log.bind(util, 'Browserify Error'))
		.pipe(source('build.js'))
		.pipe(buffer())
		.pipe(sourcemaps.init({
			loadMaps: true
		}))
		.pipe(uglify({
			mangle: false
		}))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('./target/js'));
});

gulp.task('stylus', () => {
	return gulp.src(paths.src.stylus)
		.pipe(sourcemaps.init())
		.pipe(stylus({
			compress: true
		}))
		.pipe(concat('bundle.css'))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(paths.target.stylus));
});

gulp.task('move-static', function() {
	return gulp.src(paths.src.static, {
			base: baseSourcePath
		})
		.pipe(gulp.dest(paths.targetFolder));
});

gulp.task('watch', ['move-static', 'build', 'stylus'], function() {
	gulp.watch(paths.src.static, ['move-static']);
	gulp.watch(paths.src.javascript, ['build']);
	gulp.watch(paths.src.stylus, ['stylus']);
});

gulp.task('default', ['move-static', 'build', 'stylus']);