/* global cp env exec exit rm set target */
/* eslint-disable @typescript-eslint/no-var-requires */
require('shelljs/make');
set('-e');

const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const config = require('./config');
const {
    BROWSER_OPEN_COMMAND,
    get,
    gzip,
    noFail,
    onExit,
    root,
    ShiftyCli,
    sleep
} = require('./util');

const bin = {
    eslint: root('node_modules', '.bin', 'eslint'),
    jasmine: root('node_modules', '.bin', 'jasmine'),
    ngc: root('node_modules', '.bin', 'ngc'),
    ngcc: root('node_modules', '.bin', 'ngcc'),
    rollup: root('node_modules', '.bin', 'rollup'),
    terser: root('node_modules', '.bin', 'terser'),
    tsc: root('node_modules', '.bin', 'tsc')
};

function minify(file) {
    const command = [
        bin.terser,
        '--define', 'ngDevMode=false',
        '--define', 'ngI18nClosureMode=false',
        '--define', 'ngJitMode=false',
        '--mangle',
        '--compress', 'passes=3',
        '--output', file,
        file
    ].join(' ');
    exec(command);
}

target.build = async function() {
    const main = root('build', 'dist', 'main.js');
    const polyfills = root('build', 'dist', 'polyfills.js');
    const ngcOptions = [];
    if (env.NODE_ENV === 'development') {
        ngcOptions.push('--sourceMap');
    }
    exec(`${bin.ngc} ${ngcOptions.join(' ')} --project ${root('src')}`);
    exec(`${bin.rollup} --config ${root('rollup.config.js')}`);
    cp(root('src', 'index.html'), root('build', 'dist', 'index.html'));
    cp(root('src', 'style.css'), root('build', 'dist', 'style.css'));
    if (env.NODE_ENV !== 'development') {
        minify(main);
        minify(polyfills);
        await gzip(main);
        await gzip(polyfills);
    }
};

target.clean = function() {
    set('+e');
    rm('-r', root('node_modules'));
    rm('-r', root('build'));
};

target.lint = function(options) {
    set('+e');
    let code;
    const base = [
        bin.eslint,
        '--env', 'es6',
        '--max-warnings', 0,
        '--color',
        ...options
    ];
    {
        const command = [
            ...base,
            '--env', 'browser',
            root('src'),
        ].join(' ');
        code = exec(command).code;
    }
    {
        const command = [
            ...base,
            '--env', 'node',
            root('test'),
            root('config'),
            root('util.js'),
            root('Makefile.js'),
            root('rollup.config.js')
        ].join(' ');
        const result = exec(command);
        if (code === 0) {
            code = result.code;
        }
    }
    exit(code);
};

target.open = function() {
    exec(`${BROWSER_OPEN_COMMAND} http://localhost:${config.app.publishPort}/index.html`);
};

target.postinstall = function() {
    exec(`${bin.ngcc} --tsconfig ${root('src', 'tsconfig.json')}`);
};

target.start = function(...options) {
    const command = [
        'docker', 'run',
        '--name', config.app.container,
        '--mount', `type=bind,source=${root('build', 'dist')},destination=/usr/share/nginx/html,readonly`,
        '--mount', `type=bind,source=${root('nginx.conf')},destination=/etc/nginx/conf.d/default.conf,readonly`,
        '--publish', `${config.app.publishPort}:80`,
        ...options,
        '--rm', '--detach',
        'nginx:1.19.1'
    ].join(' ');
    exec(command);
};

target.stop = function() {
    exec(`docker stop ${config.app.container}`);
};

async function seleniumHealthcheck() {
    const ATTEMPT_LIMIT = 100;
    const SLEEP_MILLIS = 100;
    const OK = 200;
    for (let i = 0; i < ATTEMPT_LIMIT; i++) {
        try {
            const response = await get(`http://localhost:${config.selenium.publishPort}/status`);
            if (response.statusCode === OK) {
                break;
            }
        } catch (e) { // eslint-disable-next-line no-empty
        }
        await sleep(SLEEP_MILLIS);
    }
    if (env.NODE_ENV === 'development') {
        const options = new chrome.Options().headless()
                                            .detachDriver(true)
                                            .windowSize({ width: config.selenium.width, height: config.selenium.height })
                                            .addArguments('--remote-debugging-address=0.0.0.0')
                                            .addArguments(`--remote-debugging-port=${config.selenium.browserDebugPublishPort}`)
                                            .addArguments('--force-devtools-available');
        const driver = new Builder().forBrowser('chrome')
                                    .usingServer(`http://localhost:${config.selenium.publishPort}`)
                                    .setChromeOptions(options)
                                    .build();
        await driver.get(`http://${config.app.container}/index.html`);
    }
}

target.seleniumStart = async function() {
    const options = [];
    if (env.NODE_ENV === 'development') {
        options.push('--publish',
                     `${config.selenium.browserDebugPublishPort}:${config.selenium.browserDebugPublishPort}`);
    }
    const command = [
        'docker', 'run',
        '--name', config.selenium.container,
        '--network', config.network,
        '--shm-size=2g',
        '--publish', `${config.selenium.publishPort}:4444`,
        ...options,
        '--rm', '--detach',
        'selenium/standalone-chrome:84.0'
    ].join(' ');
    exec(command);
    await seleniumHealthcheck();
};

target.seleniumStop = function() {
    exec(`docker stop ${config.selenium.container}`);
};

target.testCompile = function() {
    exec(`${bin.tsc} --build ${root('test')}`);
};

target.testSetup = async function() {
    await target.build();
    exec(`docker network create ${config.network}`);
    target.start('--network', config.network);
    await target.seleniumStart();
    target.testCompile();
};

target.test = function() {
    const command = [
        bin.jasmine,
        `--config=${root('test', 'jasmine.json')}`,
        '--color'
    ].join(' ');
    exec(command);
};

target.testCleanup = function() {
    noFail(() => {
        target.seleniumStop();
        target.stop();
        exec(`docker network rm ${config.network}`);
    });
};

target.dev = async function() {
    noFail(() => rm('-r', root('build')));
    env.NODE_ENV = 'development';
    env.JASMINE_DEFAULT_TIMEOUT_INTERVAL = '600000';
    onExit(target.testCleanup);
    await target.testSetup();
    const shiftyCli = new ShiftyCli('[shell]> ', line => {
        if (line.trim() === 'exit') {
            tscWatch.kill();
            rollupWatch.kill();
            ngcWatch.kill();
            shiftyCli.close();
            return false;
        } else {
            noFail(() => exec(line));
            return true;
        }
    });
    const options = { async: true, silent: true };
    const ngcWatch = exec(`${bin.ngc} --watch --sourceMap --project ${root('src')}`, options);
    const rollupWatch = exec(`${bin.rollup} --watch --config ${root('rollup.config.js')}`, options);
    const tscWatch = exec(`${bin.tsc} --build ${root('test')} --pretty --watch --preserveWatchOutput`, options);
    shiftyCli.addInputStreams(ngcWatch.stdout,
                              ngcWatch.stderr,
                              rollupWatch.stdout,
                              rollupWatch.stderr,
                              tscWatch.stdout,
                              tscWatch.stderr);
};

target.testLifecycle = async function() {
    onExit(target.testCleanup);
    await target.testSetup();
    target.test();
};
