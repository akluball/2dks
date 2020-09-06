import { By } from 'selenium-webdriver';
import { Context, setup, cleanup } from '../context';
import { getApp } from '../element-getters';
import {
    getLeftX,
    getParentLeftX,
    getParentTopY,
    getTopY,
    getWidth,
    getParentWidth,
    getParentHeight,
    getHeight
} from '../util';

describe('app component', function () {
    beforeEach(setup);
    afterEach(cleanup);

    it('contains simulation component', async function(this: Context) {
        await getApp(this.driver).findElement(By.xpath('./simulation'));
    });

    it('has same left x as parent', async function(this: Context) {
        const app = getApp(this.driver);
        expect(await getLeftX(app)).toBe(await getParentLeftX(app));
    });

    it('has same top y as parent', async function(this: Context) {
        const app = getApp(this.driver);
        expect(await getTopY(app)).toBe(await getParentTopY(app));
    });

    it('has same width as parent', async function(this: Context) {
        const app = getApp(this.driver);
        expect(await getWidth(app)).toBe(await getParentWidth(app));
    });

    it('has same height as parent', async function(this: Context) {
        const app = getApp(this.driver);
        expect(await getHeight(app)).toBe(await getParentHeight(app));
    });
});
