import { Context, setup, cleanup } from '../context';
import { clickElement, selectZoomPanAction, relDrag, wheel, WheelDirection } from '../actions';
import {
    getGridToggle,
    getHorizontalGridLines,
    getHorizontalGridLineLabels,
    getVerticalGridLines,
    getVerticalGridLineLabels,
    getSvg
} from '../element-getters';
import {
    count,
    resizeBody,
    getLeftX,
    getTopY,
    getTopLeft,
    getTopRight,
    getBottomRight,
    getBottomLeft
} from '../util';
import { WebElement } from 'selenium-webdriver';

async function verticalSpacing(a: WebElement, b: WebElement): Promise<number> {
    const aCenter = await getTopY(a);
    const bCenter = await getTopY(b);
    return Math.abs(bCenter - aCenter);
}

async function horizontalSpacing(a: WebElement, b: WebElement): Promise<number> {
    const aCenter = await getLeftX(a);
    const bCenter = await getLeftX(b);
    return Math.abs(bCenter - aCenter);
}

describe('grid', function() {
    beforeEach(setup);
    afterEach(cleanup);

    it('initially off', async function(this: Context) {
        expect(await count(getVerticalGridLines(this.driver))).toBe(0);
        expect(await count(getHorizontalGridLines(this.driver))).toBe(0);
    });

    describe('toggle', function() {
        it('text gray when off', async function(this: Context) {
            expect(await getGridToggle(this.driver).getCssValue('color')).toBe('rgba(128, 128, 128, 1)');
        });

        it('text black when on', async function(this: Context) {
            const toggle = getGridToggle(this.driver);
            await toggle.click();
            expect(await getGridToggle(this.driver).getCssValue('color')).toBe('rgba(0, 0, 0, 1)');
        });
    });

    describe('horizontals', async function(this: Context) {
        describe('100 spacing', function() {
            beforeEach(async function(this: Context) {
                await resizeBody(this.driver, '300px', '300px');
                await clickElement(getGridToggle(this.driver));
            });

            it('count', async function(this: Context) {
                const lines = await getHorizontalGridLines(this.driver);
                expect(lines.length).toBe(3);
            });

            it('min', async function(this: Context) {
                const lines = await getHorizontalGridLines(this.driver);
                expect(await getTopLeft(lines[0])).toEqual({ x: 0, y: 300 });
                expect(await getBottomRight(lines[0])).toEqual({ x: 300, y: 300 });
            });

            it('max', async function(this: Context) {
                const lines = await getHorizontalGridLines(this.driver);
                expect(await getTopLeft(lines[2])).toEqual({ x: 0, y: 100 });
                expect(await getBottomRight(lines[2])).toEqual({ x: 300, y: 100 });
            });

            it('spacing', async function(this: Context) {
                const lines = await getHorizontalGridLines(this.driver);
                expect(await verticalSpacing(lines[0], lines[1])).toBe(100);
            });

            it('label count', async function(this: Context) {
                const labels = await getHorizontalGridLineLabels(this.driver);
                expect(labels.length).toBe(3);
            });

            it('min label', async function(this: Context) {
                const labels = await getHorizontalGridLineLabels(this.driver);
                expect(await labels[0].getAttribute('innerHTML')).toBe('0');
                expect(await getLeftX(labels[0])).toBe(0);
                expect(await getTopY(labels[0])).toBe(301);
            });

            it('max label', async function(this: Context) {
                const labels = await getHorizontalGridLineLabels(this.driver);
                expect(await labels[2].getText()).toBe('200');
                expect(await getLeftX(labels[2])).toBe(0);
                expect(await getTopY(labels[2])).toBe(101);
            });
        });

        describe('.1 spacing', function() {
            beforeEach(async function(this: Context) {
                await resizeBody(this.driver, '400px', '300px');
                await clickElement(getGridToggle(this.driver));
                await selectZoomPanAction(this.driver);
                const svg = getSvg(this.driver);
                await wheel(svg, WheelDirection.UP, 49);
            });

            it('count', async function(this: Context) {
                const lines = await getHorizontalGridLines(this.driver);
                expect(lines.length).toBe(29);
            });

            it('min', async function(this: Context) {
                const lines = await getHorizontalGridLines(this.driver);
                expect(await getTopLeft(lines[0])).toEqual({ x: 0, y: 299 });
                expect(await getBottomRight(lines[0])).toEqual({ x: 400, y: 299 });
            });

            it('max', async function(this: Context) {
                const lines = await getHorizontalGridLines(this.driver);
                expect(await getTopLeft(lines[28])).toEqual({ x: 0, y: 1 });
                expect(await getBottomRight(lines[28])).toEqual({ x: 400, y: 1 });
            });

            it('spacing', async function(this: Context) {
                const lines = await getHorizontalGridLines(this.driver);
                expect([ 10, 11 ]).toContain(await verticalSpacing(lines[0], lines[1]));
            });

            it('label count', async function(this: Context) {
                const labels = await getHorizontalGridLineLabels(this.driver);
                expect(labels.length).toBe(29);
            });

            it('label min', async function(this: Context) {
                const labels = await getHorizontalGridLineLabels(this.driver);
                expect(await labels[0].getAttribute('innerHTML')).toBe('148.6');
            });

            it('label max', async function(this: Context) {
                const labels = await getHorizontalGridLineLabels(this.driver);
                expect(await labels[28].getAttribute('innerHTML')).toBe('151.4');
            });
        });

        describe('1000 spacing', function() {
            beforeEach(async function(this: Context) {
                await resizeBody(this.driver, '600px', '600px');
                await clickElement(getGridToggle(this.driver));
                await selectZoomPanAction(this.driver);
                const svg = getSvg(this.driver);
                await wheel(svg, WheelDirection.DOWN, 17);
            });

            it('count', async function(this: Context) {
                const lines = await getHorizontalGridLines(this.driver);
                expect(lines.length).toBe(3);
            });

            it('min', async function(this: Context) {
                const lines = await getHorizontalGridLines(this.driver);
                expect(await getTopLeft(lines[0])).toEqual({ x: 0, y: 557 });
                expect(await getBottomRight(lines[0])).toEqual({ x: 600, y: 557 });
            });

            it('max', async function(this: Context) {
                const lines = await getHorizontalGridLines(this.driver);
                expect(await getTopLeft(lines[2])).toEqual({ x: 0, y: 162 });
                expect(await getBottomRight(lines[2])).toEqual({ x: 600, y: 162 });
            });

            it('spacing', async function(this: Context) {
                const lines = await getHorizontalGridLines(this.driver);
                expect(await verticalSpacing(lines[0], lines[1])).toBe(198);
            });

            it('label count', async function(this: Context) {
                const labels = await getHorizontalGridLineLabels(this.driver);
                expect(labels.length).toBe(3);
            });

            it('label min', async function(this: Context) {
                const labels = await getHorizontalGridLineLabels(this.driver);
                expect(await labels[0].getText()).toBe('-1000');
                expect(await getTopLeft(labels[0])).toEqual({ x: 0, y: 558 });
            });

            it('label max', async function(this: Context) {
                const labels = await getHorizontalGridLineLabels(this.driver);
                expect(await labels[2].getText()).toBe('1000');
                expect(await getTopLeft(labels[2])).toEqual({ x: 0, y: 163 });
            });
        });

        describe('after pan up', function() {
            beforeEach(async function(this: Context) {
                await resizeBody(this.driver, '300px', '300px');
                await clickElement(getGridToggle(this.driver));
                await selectZoomPanAction(this.driver);
                await relDrag(this.driver, { x: 100, y: 200 }, { dy: 10 });
            });

            it('count', async function(this: Context) {
                const lines = await getHorizontalGridLines(this.driver);
                expect(lines.length).toBe(3);
            });

            it('min', async function(this: Context) {
                const lines = await getHorizontalGridLines(this.driver);
                expect(await getTopLeft(lines[0])).toEqual({ x: 0, y: 210 });
                expect(await getBottomRight(lines[0])).toEqual({ x: 300, y: 210 });
            });

            it('max', async function(this: Context) {
                const lines = await getHorizontalGridLines(this.driver);
                expect(await getTopLeft(lines[2])).toEqual({ x: 0, y: 10 });
                expect(await getBottomRight(lines[2])).toEqual({ x: 300, y: 10 });
            });
        });

        describe('after pan down', function() {
            beforeEach(async function(this: Context) {
                await resizeBody(this.driver, '300px', '300px');
                await clickElement(getGridToggle(this.driver));
                await selectZoomPanAction(this.driver);
                await relDrag(this.driver, { x: 100, y: 290 }, { dy: -110 });
            });

            it('count', async function(this: Context) {
                const lines = await getHorizontalGridLines(this.driver);
                expect(lines.length).toBe(3);
            });

            it('min', async function(this: Context) {
                const lines = await getHorizontalGridLines(this.driver);
                expect(await getTopLeft(lines[0])).toEqual({ x: 0, y: 290 });
                expect(await getBottomRight(lines[0])).toEqual({ x: 300, y: 290 });
            });

            it('max', async function(this: Context) {
                const lines = await getHorizontalGridLines(this.driver);
                expect(await getTopLeft(lines[2])).toEqual({ x: 0, y: 90 });
                expect(await getBottomRight(lines[2])).toEqual({ x: 300, y: 90 });
            });
        });

        describe('after horizontal pan', function() {
            beforeEach(async function(this: Context) {
                await resizeBody(this.driver, '300px', '300px');
                await clickElement(getGridToggle(this.driver));
                await selectZoomPanAction(this.driver);
                await relDrag(this.driver, { x: 100, y: 200 }, { dy: 0 });
            });

            it('count', async function(this: Context) {
                const lines = await getHorizontalGridLines(this.driver);
                expect(lines.length).toBe(3);
            });

            it('min', async function(this: Context) {
                const lines = await getHorizontalGridLines(this.driver);
                expect(await getTopLeft(lines[0])).toEqual({ x: 0, y: 300 });
                expect(await getBottomRight(lines[0])).toEqual({ x: 300, y: 300 });
            });

            it('max', async function(this: Context) {
                const lines = await getHorizontalGridLines(this.driver);
                expect(await getTopLeft(lines[2])).toEqual({ x: 0, y: 100 });
                expect(await getBottomRight(lines[2])).toEqual({ x: 300, y: 100 });
            });
        });
    });

    describe('verticals', async function(this: Context) {
        describe('100 spacing', function() {
            beforeEach(async function(this: Context) {
                await resizeBody(this.driver, '300px', '300px');
                await clickElement(getGridToggle(this.driver));
            });

            it('count', async function(this: Context) {
                const lines = await getVerticalGridLines(this.driver);
                expect(lines.length).toBe(3);
            });

            it('min', async function(this: Context) {
                const lines = await getVerticalGridLines(this.driver);
                expect(await getBottomLeft(lines[0])).toEqual({ x: 0, y: 300 });
                expect(await getTopRight(lines[0])).toEqual({ x: 0, y: 0 });
            });

            it('max', async function(this: Context) {
                const lines = await getVerticalGridLines(this.driver);
                expect(await getBottomLeft(lines[2])).toEqual({ x: 200, y: 300 });
                expect(await getTopRight(lines[2])).toEqual({ x: 200, y: 0 });
            });

            it('spacing', async function(this: Context) {
                const lines = await getVerticalGridLines(this.driver);
                expect(await horizontalSpacing(lines[0], lines[1])).toBe(100);
            });

            it('label count', async function(this: Context) {
                const labels = await getVerticalGridLineLabels(this.driver);
                expect(labels.length).toBe(3);
            });

            it('label min', async function(this: Context) {
                const labels = await getVerticalGridLineLabels(this.driver);
                expect(await labels[0].getText()).toBe('0');
                expect(await labels[0].getAttribute('x')).toBe('1');
                expect(await labels[0].getAttribute('y')).toBe('300');
            });

            it('label max', async function(this: Context) {
                const labels = await getVerticalGridLineLabels(this.driver);
                expect(await labels[2].getText()).toBe('200');
                expect(await labels[2].getAttribute('x')).toBe('201');
                expect(await labels[2].getAttribute('y')).toBe('300');
            });
        });

        describe('.1 spacing', function() {
            beforeEach(async function(this: Context) {
                await resizeBody(this.driver, '300px', '400px');
                await clickElement(getGridToggle(this.driver));
                await selectZoomPanAction(this.driver);
                const svg = getSvg(this.driver);
                for (let i = 0; i < 49; i++) {
                    await wheel(svg, WheelDirection.UP);
                }
            });

            it('count', async function(this: Context) {
                const lines = await getVerticalGridLines(this.driver);
                expect(lines.length).toBe(29);
            });

            it('min', async function(this: Context) {
                const lines = await getVerticalGridLines(this.driver);
                expect(await getTopLeft(lines[0])).toEqual({ x: 1, y: 0 });
                expect(await getBottomRight(lines[0])).toEqual({ x: 1, y: 400 });
            });

            it('max', async function(this: Context) {
                const lines = await getVerticalGridLines(this.driver);
                expect(await getTopLeft(lines[28])).toEqual({ x: 299, y: 0 });
                expect(await getBottomRight(lines[28])).toEqual({ x: 299, y: 400 });
            });

            it('spacing', async function(this: Context) {
                const lines = await getVerticalGridLines(this.driver);
                expect([ 10, 11 ]).toContain(await horizontalSpacing(lines[0], lines[1]));
            });

            it('label count', async function(this: Context) {
                const labels = await getVerticalGridLineLabels(this.driver);
                expect(labels.length).toBe(29);
            });

            it('label min', async function(this: Context) {
                const labels = await getVerticalGridLineLabels(this.driver);
                expect(await labels[0].getText()).toBe('148.6');
            });

            it('label max', async function(this: Context) {
                const labels = await getVerticalGridLineLabels(this.driver);
                expect(await labels[28].getAttribute('innerHTML')).toBe('151.4');
            });
        });

        describe('1000 spacing', function() {
            beforeEach(async function(this: Context) {
                await resizeBody(this.driver, '600px', '600px');
                await clickElement(getGridToggle(this.driver));
                await selectZoomPanAction(this.driver);
                const svg = getSvg(this.driver);
                for (let i = 0; i < 17; i++) {
                    await wheel(svg, WheelDirection.DOWN);
                }
            });

            it('count', async function(this: Context) {
                const lines = await getVerticalGridLines(this.driver);
                expect(lines.length).toBe(3);
            });

            it('min', async function(this: Context) {
                const lines = await getVerticalGridLines(this.driver);
                expect(await getTopLeft(lines[0])).toEqual({ x: 43, y: 0 });
                expect(await getBottomRight(lines[0])).toEqual({ x: 43, y: 600 });
            });

            it('max', async function(this: Context) {
                const lines = await getVerticalGridLines(this.driver);
                expect(await getTopLeft(lines[2])).toEqual({ x: 438, y: 0 });
                expect(await getBottomRight(lines[2])).toEqual({ x: 438, y: 600 });
            });

            it('spacing', async function(this: Context) {
                const lines = await getVerticalGridLines(this.driver);
                expect(await horizontalSpacing(lines[0], lines[1])).toBe(198);
            });

            it('label count', async function(this: Context) {
                const labels = await getVerticalGridLineLabels(this.driver);
                expect(labels.length).toBe(3);
            });

            it('label min', async function(this: Context) {
                const labels = await getVerticalGridLineLabels(this.driver);
                expect(await labels[0].getText()).toBe('-1000');
                expect(await getBottomLeft(labels[0])).toEqual({ x: 44, y: 600 });
            });

            it('label max', async function(this: Context) {
                const labels = await getVerticalGridLineLabels(this.driver);
                expect(await labels[2].getText()).toBe('1000');
                expect(await getBottomLeft(labels[2])).toEqual({ x: 439, y: 600 });
            });
        });

        describe('after pan left', function() {
            beforeEach(async function(this: Context) {
                await resizeBody(this.driver, '300px', '300px');
                await clickElement(getGridToggle(this.driver));
                await selectZoomPanAction(this.driver);
                await relDrag(this.driver, { x: 100, y: 150 }, { dx: 110 });
            });

            it('count', async function(this: Context) {
                const lines = await getVerticalGridLines(this.driver);
                expect(lines.length).toBe(3);
            });

            it('min', async function(this: Context) {
                const lines = await getVerticalGridLines(this.driver);
                expect(await getBottomLeft(lines[0])).toEqual({ x: 10, y: 300 });
                expect(await getTopRight(lines[0])).toEqual({ x: 10, y: 0 });
            });

            it('max', async function(this: Context) {
                const lines = await getVerticalGridLines(this.driver);
                expect(await getBottomLeft(lines[2])).toEqual({ x: 210, y: 300 });
                expect(await getTopRight(lines[2])).toEqual({ x: 210, y: 0 });
            });
        });

        describe('after pan right', function() {
            beforeEach(async function(this: Context) {
                await resizeBody(this.driver, '300px', '300px');
                await clickElement(getGridToggle(this.driver));
                await selectZoomPanAction(this.driver);
                await relDrag(this.driver, { x: 100, y: 150 }, { dx: -10 });
            });

            it('count', async function(this: Context) {
                const lines = await getVerticalGridLines(this.driver);
                expect(lines.length).toBe(3);
            });

            it('min', async function(this: Context) {
                const lines = await getVerticalGridLines(this.driver);
                expect(await getBottomLeft(lines[0])).toEqual({ x: 90, y: 300 });
                expect(await getTopRight(lines[0])).toEqual({ x: 90, y: 0 });
            });

            it('max', async function(this: Context) {
                const lines = await getVerticalGridLines(this.driver);
                expect(await getBottomLeft(lines[2])).toEqual({ x: 290, y: 300 });
                expect(await getTopRight(lines[2])).toEqual({ x: 290, y: 0 });
            });
        });

        describe('after vertical pan', function() {
            beforeEach(async function(this: Context) {
                await resizeBody(this.driver, '300px', '300px');
                await clickElement(getGridToggle(this.driver));
                await selectZoomPanAction(this.driver);
                await relDrag(this.driver, { x: 100, y: 150 }, { dy: 10 });
            });

            it('count', async function(this: Context) {
                const lines = await getVerticalGridLines(this.driver);
                expect(lines.length).toBe(3);
            });

            it('min', async function(this: Context) {
                const lines = await getVerticalGridLines(this.driver);
                expect(await getBottomLeft(lines[0])).toEqual({ x: 0, y: 300 });
                expect(await getTopRight(lines[0])).toEqual({ x: 0, y: 0 });
            });

            it('max', async function(this: Context) {
                const lines = await getVerticalGridLines(this.driver);
                expect(await getBottomLeft(lines[2])).toEqual({ x: 200, y: 300 });
                expect(await getTopRight(lines[2])).toEqual({ x: 200, y: 0 });
            });
        });
    });
});
