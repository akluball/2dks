import { By, until } from 'selenium-webdriver';
import { Context, setup, cleanup } from './context';
import { getBody } from './element-getters';
import { getWidth, getHeight } from './util';

describe('index', function () {
    beforeEach(setup);
    afterEach(cleanup);

    it('title', async function(this: Context) {
        await this.driver.wait(until.titleIs('2-Dimensional Kinetics Simulator'));
    });

    it('body contains app component', async function(this: Context) {
        await getBody(this.driver).findElement(By.xpath('./app'));
    });

    it('body has viewport width', async function(this: Context) {
        expect(await getWidth(getBody(this.driver))).toBe(this.width);
    });

    it('body has viewport height', async function(this: Context) {
        expect(await getHeight(getBody(this.driver))).toBe(this.height);
    });
});
