import { Builder, ThenableWebDriver, WebElementCondition } from 'selenium-webdriver';
import * as chrome from 'selenium-webdriver/chrome';
import { request } from 'http';
import * as config from '../config';

export interface Context {
    driver: ThenableWebDriver;
    width: number;
    height: number;
}

const WAIT_TIMEOUT_MILLIS = 2000;

export async function setup(this: Context): Promise<void> {
    const options = new chrome.Options().headless()
                                        .windowSize({ width: config.selenium.width, height: config.selenium.height });
    if (process.env.NODE_ENV === 'development') {
        options.addArguments('--remote-debugging-address=0.0.0.0')
               .addArguments(`--remote-debugging-port=${config.selenium.browserDebugPublishPort}`)
               .addArguments('--force-devtools-available');
    }
    const driver = new Builder().forBrowser('chrome')
                                .usingServer(`http://localhost:${config.selenium.publishPort}`)
                                .setChromeOptions(options)
                                .build();
    const wait = driver.wait.bind(driver);
    driver.wait = (function(condition: WebElementCondition, ...args: [ number | undefined, string | undefined]) {
        return args.length ? wait(condition, ...args) : wait(condition, WAIT_TIMEOUT_MILLIS);
    }).bind(driver);
    await driver.get(`http://${config.app.container}/index.html`);

    this.width = config.selenium.width;
    this.height = config.selenium.height;
    this.driver = driver;
}

export async function cleanup(this: Context): Promise<void> {
    if (process.env.NODE_ENV === 'development') {
        const sessionId = (await this.driver.getSession()).getId();
        await new Promise(resolve => {
            const uri = `http://localhost:${config.selenium.publishPort}/session/${sessionId}`;
            const req = request(uri, { method: 'DELETE' });
            req.end(() => {
                req.socket.unref();
                resolve();
            });
        });
    } else {
        await this.driver.quit();
    }
}
