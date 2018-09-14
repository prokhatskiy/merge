'use strict';
const gulp = require('gulp'), //основной плагин gulp
	sass = require('gulp-sass'), //препроцессор sass
	prefixer = require('gulp-autoprefixer'), //расставление автопрефиксов
	cssmin = require('gulp-minify-css'), //минификация css
	uglify = require('gulp-uglify'), //минификация js
	imagemin = require('gulp-imagemin'), //минимизация изображений
	rimraf = require('rimraf'), //очистка
	sourcemaps = require('gulp-sourcemaps'), //sourcemaps
	rename = require('gulp-rename'), //переименвоание файлов
	plumber = require('gulp-plumber'), //предохранитель для остановки гальпа
	watch = require('gulp-watch'), //расширение возможностей watch
	connect = require('gulp-connect'), //livereload
	pump = require('pump'),
	shell = require('gulp-shell');

var path = {
	build: {
		//Тут мы укажем куда складывать готовые после сборки файлы
		html: 'build/',
		js: 'build/js/',
		css: 'build/css/',
		img: 'build/image',
		fonts: 'build/fonts/'
	},
	src: {
		//Пути откуда брать исходники
		html: 'src/*.html', //Синтаксис src/template/*.html говорит gulp что мы хотим взять все файлы с расширением .html
		js: 'src/js/[^_]*.js', //В стилях и скриптах нам понадобятся только main файлы
		css: 'src/style/**/*.*',
		fonts: 'src/fonts/**/*.*',
		img: 'src/image/**/*.*',
		cssmin: 'build/css/**/*.*'
	},
	watch: {
		//Тут мы укажем, за изменением каких файлов мы хотим наблюдать
		html: 'src/**/*.html',
		js: 'src/js/**/*.js',
		css: 'src/style/**/*.*',
		img: 'src/image/**/*.*',
		fonts: 'src/fonts/**/*.*'
	},
	clean: './build', //директории которые могут очищаться
	outputDir: './build' //исходная корневая директория для запуска минисервера
};

gulp.task('connect', function() {
	connect.server({
		//настриваем конфиги сервера
		root: [path.outputDir], //корневая директория запуска сервера
		port: 9999, //какой порт будем использовать
		livereload: true //инициализируем работу LiveReload
	});
});

gulp.task('html:build', function() {
	gulp
		.src(path.src.html) //Выберем файлы по нужному
		.pipe(gulp.dest(path.build.html)) //выгрузим их в папку build
		.pipe(connect.reload()); //И перезагрузим наш сервер для обновлений
});

gulp.task('js:build', function() {
	gulp
		.src(path.src.js) //Найдем наш main файл
		.pipe(gulp.dest(path.build.js)) //выгрузим готовый файл в build
		.pipe(connect.reload()); //И перезагрузим сервер
});

gulp.task('image:build', function() {
	gulp
		.src(path.src.img)
		.pipe(
			imagemin({
				//Сожмем их
				progressive: true, //сжатие .jpg
				svgoPlugins: [{ removeViewBox: false }], //сжатие .svg
				interlaced: true, //сжатие .gif
				optimizationLevel: 3 //степень сжатия от 0 до 7
			})
		)
		.pipe(gulp.dest(path.build.img)) //выгрузим в build
		.pipe(connect.reload()); //перезагрузим сервер
});

gulp.task('css:build', function() {
	gulp
		.src(path.src.css) //Выберем наш основной файл стилей
		.pipe(sass().on('error', sass.logError)) //Скомпилируем sass
		.pipe(
			prefixer({
				browsers: ['last 3 version', '> 1%', 'ie 8', 'ie 7']
			})
		) //Добавим вендорные префиксы
		.pipe(gulp.dest(path.build.css)) //вызгрузим в build
		.pipe(connect.reload()); //перезагрузим сервер
});

gulp.task('fonts:build', function() {
	gulp.src(path.src.fonts).pipe(gulp.dest(path.build.fonts)); //выгружаем в build
});

gulp.task('build', [
	'html:build',
	'js:build',
	'css:build',
	'fonts:build',
	'image:build'
]);

// watch
gulp.task('watch', function() {
	//билдим html в случае изменения
	watch([path.watch.html], function(event, cb) {
		gulp.start('html:build');
	});
	//билдим css в случае изменения
	watch([path.watch.css], function(event, cb) {
		gulp.start('css:build');
	});
	//билдим js в случае изменения
	watch([path.watch.js], function(event, cb) {
		gulp.start('js:build');
	});
	//билдим статичные изображения в случае изменения
	watch([path.watch.img], function(event, cb) {
		gulp.start('image:build');
	});
	//билдим шрифты в случае изменения
	watch([path.watch.fonts], function(event, cb) {
		gulp.start('fonts:build');
	});
});

gulp.task('cssmin', function() {
	gulp
		.src(path.src.cssmin) //Выберем наш основной файл стилей
		.pipe(sourcemaps.init()) //инициализируем soucemap
		.pipe(cssmin()) //Сожмем
		.pipe(sourcemaps.write()) //пропишем sourcemap
		.pipe(rename({ suffix: '.min' })) //добавим суффикс .min к имени выходного файла
		.pipe(gulp.dest(path.build.css)); //вызгрузим в build
});

gulp.task('jsmin', function(cb) {
	pump(
		[
			gulp.src(path.src.js),
			sourcemaps.init(),
			uglify(),
			sourcemaps.write(),
			rename({ suffix: '.min' }),
			gulp.dest(path.build.js)
		],
		cb
	);
});

gulp.task('clean', function(cb) {
	rimraf(path.clean, cb);
});

gulp.task('min', ['cssmin', 'jsmin']);

gulp.task('default', ['build', 'watch', 'connect']);
