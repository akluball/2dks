import { request } from 'http';
import { Builder, By, until, ThenableWebDriver } from 'selenium-webdriver';
import { Options } from 'selenium-webdriver/chrome';
import * as config from '../../config';

const timeoutMillis = 2000;

interface Context {
    driver: ThenableWebDriver
}

beforeEach(async function(this: Context) {
    const options = new Options();
    if (process.env.NODE_ENV === 'development') {
        options.headless()
               .addArguments('--remote-debugging-address=0.0.0.0')
               .addArguments(`--remote-debugging-port=${config.selenium.browserDebugPublishPort}`)
               .addArguments('--force-devtools-available');
    }
    this.driver = new Builder().forBrowser('chrome')
                               .usingServer(`http://localhost:${config.selenium.publishPort}`)
                               .setChromeOptions(options)
                               .build();
    await this.driver.get(`http://${config.app.container}/index.html`);
});

afterEach(async function (this: Context) {
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
});

it('title', async function(this: Context) {
    await this.driver.wait(until.titleIs('2-Dimensional Kinetics Simulator'), timeoutMillis);
});

it('main', async function(this: Context) {
    const main = await this.driver.wait(until.elementLocated(By.tagName('main')), timeoutMillis);
    await this.driver.wait(until.elementTextMatches(main, /\s*2dks placeholder\s*/), timeoutMillis);
});
