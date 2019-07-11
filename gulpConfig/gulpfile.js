const gulp = require('gulp');
const babel = require('gulp-babel');
const rimraf = require('rimraf');
const merge2 = require('merge2');
const ts = require('gulp-typescript')
const tsDefaultReporter = ts.reporter.defaultReporter();;
const through2 = require('through2');
let sass = require('gulp-sass');
sass.compiler = require('node-sass');
const getBabelCommonConfig = require('./babel');
const { getProjectPath, cssInjection } = require('./utils');

const postcss = require('gulp-postcss');
const postcssConfig = require('./postcssConfig');

const libDir = getProjectPath('lib');
const esDir = getProjectPath('es');

const packageJson = require(getProjectPath('package.json'));

// scanRoot扫描打包组件的目录 typeRoot为模块声明目录
const customParams = packageJson.customParams || {};
const {scanRoot='src/components', typeRoot='src/typings'} = customParams;
const scanRootDir = getProjectPath(scanRoot);
const typeRootDir = getProjectPath(typeRoot);

function babelify(js, modules){
    const babelConfig = getBabelCommonConfig(modules);

    return js.pipe(babel(babelConfig)).pipe(through2.obj(function(file, encoding, next){
        if (file.path.match(/(\/|\\)style(\/|\\)index\.js/)) {
            const content = file.contents.toString(encoding);
            file.contents = Buffer.from(cssInjection(content));
            this.push(file);
            next();
        }else{
            this.push(file);
            next();
        }
    })).pipe(gulp.dest(modules === false ? esDir : libDir));
}

function compile(modules) {
    const source = [scanRootDir+'/**/*.tsx', scanRootDir+'/**/*.ts', typeRootDir+'/**/*.d.ts'];
    rimraf.sync(modules === false ? esDir : libDir);
    
    // css打包
    const sassGulp = gulp.src([scanRootDir+'/**/*.scss'])
        .pipe(sass().on('error', sass.logError))
        .pipe( postcss(postcssConfig.plugins) )
        .pipe(gulp.dest(modules === false ? esDir : libDir));
    
    // js打包 
    const tsConfig = {
        target: 'es6',
        jsx: 'preserve',
        moduleResolution: 'node',
        declaration: true,
        "lib": ["dom", "es2017"],
        noImplicitAny: false,
        experimentalDecorators: true,
        allowSyntheticDefaultImports: true
    };
    const tsResult = gulp.src(source).pipe(
        ts(tsConfig, {
            error(e) {
              tsDefaultReporter.error(e);
              error = 1;
            },
            finish: tsDefaultReporter.finish,
          })
    );

    const js = babelify(tsResult.js, modules);
    const tsd = tsResult.dts.pipe(gulp.dest(modules === false ? esDir : libDir));
    // 静态资源
    const assets = gulp
    .src([scanRootDir+'/**/*.jpg',scanRootDir+'/**/*.png',scanRootDir+'/**/*.svg'])
    .pipe(gulp.dest(modules === false ? esDir : libDir));
        
    return merge2([sassGulp, js, tsd, assets]);
}

gulp.task('run-es', (done) => {
    console.log('[run-es] Compile...');
    compile(false).on('finish',()=>{
        console.log("[run-es] end...");
        done();
    });
});
gulp.task('run-lib', (done) => {
    console.log('[run-lib] Compile...');
    compile('auto').on('finish',()=>{
        console.log("[run-lib] end...");
        done();
    });
});

console.log(gulp.task);

gulp.task('compile', gulp.parallel('run-es', 'run-lib'));


