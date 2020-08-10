/* eslint-disable @typescript-eslint/no-var-requires */

const { createReadStream, createWriteStream } = require('fs');
const http = require('http');
const os = require('os');
const path = require('path');
const readline = require('readline');
const sh = require('shelljs');
const { Transform, pipeline } = require('stream');
const { promisify } = require('util');
const { createGzip } = require('zlib');

let BROWSER_OPEN_COMMAND;
switch (os.platform()) {
    case 'win32':
        BROWSER_OPEN_COMMAND = 'start';
        break;
    case 'darwin':
        BROWSER_OPEN_COMMAND = 'open';
        break;
    case 'aix':
        BROWSER_OPEN_COMMAND = 'defaultbrowser';
        break;
    default:
        BROWSER_OPEN_COMMAND = 'xdg-open';
}

async function get(url) {
    return new Promise((resolve, reject) => {
        http.get(url, resolve).on('error', reject);
    });
}

function gzip(file) {
    return promisify(pipeline)(
        createReadStream(file),
        createGzip(),
        createWriteStream(`${file}.gz`)
    );
}

function noFail(fn) {
    const { fatal } = sh.config;
    sh.config.fatal = false;
    const result = fn();
    sh.config.fatal = fatal;
    return result;
}

function onExit(cb) {
    [ 'exit', 'SIGINT', 'SIGUSR1', 'SIGUSR2', 'SIGTERM' ].forEach(event => {
        process.on(event, cb);
    });
    [ 'uncaughtException', 'unhandledRejection' ].forEach(event => {
        process.on(event, err => {
            console.error(err);
            cb();
        });
    });
}

function root(...components) {
    return path.resolve(__dirname, ...components);
}

class LineAggregator extends Transform {
    constructor(options) {
        super(options);
        this.carry = '';
    }

    _transform(chunk, encoding, callback) {
        if (encoding === 'buffer') {
            chunk = chunk.toString('utf-8');
            encoding = 'utf-8';
        }
        const lines = chunk.split(/\r?\n/);
        if (lines.length > 0) {
            lines[0] = this.carry + lines[0];
            this.carry = lines[lines.length - 1];
            lines.splice(lines.length - 1, 1);
            if (lines.length > 0) {
                this.push(lines.join(os.EOL) + os.EOL, encoding);
            }
        }
        callback();
    }

    _flush(callback) {
        this.push(this.carry, 'utf-8');
        this.carry = '';
        callback();
    }
}

class ShiftyCli {
    moveCursor = promisify(readline.moveCursor.bind(readline, process.stdout));
    clearScreenDown = promisify(readline.clearScreenDown.bind(readline, process.stdout));
    write = promisify(process.stdout.write.bind(process.stdout));

    constructor(prompt, lineHandler) {
        this.lineHandler = lineHandler;
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            prompt
        });
        this.rl.on('line', this.onLine.bind(this));
        this.rl.prompt();
        this.synchronizer = Promise.resolve();
    }

    addInputStreams(...streams) {
        for (const is of streams) {
            is.pipe(new LineAggregator({ encoding: 'utf-8' }))
              .on('data', this.onData.bind(this));
        }
    }

    synchronize(cb) {
        this.synchronizer = this.synchronizer.then(cb)
                                             .catch(console.error);
    }

    onLine(line) {
        const cb = async () => {
            if (this.lineHandler(line)) {
                this.rl.prompt();
            }
        };
        this.synchronize(cb);
    }

    async onData(chunk) {
        const cb = async () => {
            const line = this.rl.line;
            const { rows, cols } = this.rl.getCursorPos();
            await this.moveCursor(-cols - 2, -rows);
            await this.clearScreenDown();
            this.rl.line = '';
            await this.write(chunk);
            await this.write(os.EOL);
            this.rl.prompt();
            this.rl.write(line);
        };
        this.synchronize(cb);
    }

    close() {
        this.rl.close();
        this.rl.removeAllListeners();
    }
}

async function sleep(millis) {
    return new Promise(resolve => {
        setTimeout(resolve, millis);
    });
}

module.exports = {
    BROWSER_OPEN_COMMAND,
    get,
    gzip,
    noFail,
    onExit,
    root,
    ShiftyCli,
    sleep
};