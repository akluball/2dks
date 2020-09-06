import { By } from 'selenium-webdriver';
import { Context, setup, cleanup } from '../context';
import { getSimulation, getSvg } from '../element-getters';
import {
    getLeftX,
    getParentLeftX,
    getTopY,
    getParentTopY,
    getWidth,
    getParentWidth,
    getHeight,
    getParentHeight,
    getParentRightX,
    getRightX,
    getParentBottomY,
    getBottomY
} from '../util';

describe('simulation component', function() {
    beforeEach(setup);
    afterEach(cleanup);

    it('contains simulation toolbar component', async function(this: Context) {
        await getSimulation(this.driver).findElement(By.xpath('./toolbar'));
    });

    describe('svg', function() {
        it('left x is parent left x', async function(this: Context) {
            const svg = getSvg(this.driver);
            expect(await getLeftX(svg)).toBe(await getParentLeftX(svg));
        });

        it('top y is parent top y', async function(this: Context) {
            const svg = getSvg(this.driver);
            expect(await getTopY(svg)).toBe(await getParentTopY(svg));
        });

        it('right x is parent right x', async function(this: Context) {
            const svg = getSvg(this.driver);
            expect(await getRightX(svg)).toBe(await getParentRightX(svg));
        });

        it('bottom y is parent bottom y', async function(this: Context) {
            const svg = getSvg(this.driver);
            expect(await getBottomY(svg)).toBe(await getParentBottomY(svg));
        });
    });

    it('left x is parent left x', async function(this: Context) {
        const simulation = getSimulation(this.driver);
        expect(await getLeftX(simulation)).toBe(await getParentLeftX(simulation));
    });

    it('top y is parent top y', async function(this: Context) {
        const simulation = getSimulation(this.driver);
        expect(await getTopY(simulation)).toBe(await getParentTopY(simulation));
    });

    it('width is parent width', async function(this: Context) {
        const simulation = getSimulation(this.driver);
        expect(await getWidth(simulation)).toBe(await getParentWidth(simulation));
    });

    it('height is parent height', async function(this: Context) {
        const simulation = getSimulation(this.driver);
        expect(await getHeight(simulation)).toBe(await getParentHeight(simulation));
    });
});
