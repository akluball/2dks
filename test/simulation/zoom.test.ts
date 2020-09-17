import { Context, setup, cleanup } from '../context';
import {
    WheelDirection,
    selectZoomPanAction,
    wheel,
    selectAddParticleAction,
    addParticle
} from '../actions';
import { getSvg, getParticleCircle } from '../element-getters';
import { getCenter, getWidth } from '../util';

describe('zoom', function() {
    beforeEach(setup);
    afterEach(cleanup);

    it('requires zoom/pan action selected', async function(this: Context) {
        await selectAddParticleAction(this.driver);
        await addParticle(this.driver, { cx: 200, cy: 200, r: 10 });
        await wheel(getSvg(this.driver), WheelDirection.UP);
        expect(await getWidth(getParticleCircle(this.driver))).toBe(20);
    });

    describe('in', function() {
        it('before add particle', async function(this: Context) {
            await selectZoomPanAction(this.driver);
            await wheel(getSvg(this.driver), WheelDirection.UP);
            await selectAddParticleAction(this.driver);
            await addParticle(this.driver, { cx: 200, cy: 200, r: 5 });
            const circle = getParticleCircle(this.driver);
            expect(await getWidth(circle)).toBe(10);
            expect(await getCenter(circle)).toEqual({ x: 200, y: 200 });
        });

        it('after add particle', async function(this: Context) {
            const svg = getSvg(this.driver);
            const center = await getCenter(svg);
            await selectAddParticleAction(this.driver);
            await addParticle(this.driver, { cx: center.x, cy: center.y, r: 10 });
            await selectZoomPanAction(this.driver);
            await wheel(svg, WheelDirection.UP);
            const circle = getParticleCircle(this.driver);
            expect(await getWidth(circle)).toBe(22);
            expect(await getCenter(circle)).toEqual(center);
        });

        it('multiple', async function(this: Context) {
            const svg = getSvg(this.driver);
            const center = await getCenter(svg);
            await selectAddParticleAction(this.driver);
            await addParticle(this.driver, { cx: center.x, cy: center.y, r: 100 });
            await selectZoomPanAction(this.driver);
            await wheel(svg, WheelDirection.UP);
            await wheel(svg, WheelDirection.UP);
            const circle = getParticleCircle(this.driver);
            expect(await getWidth(circle)).toBe(242);
            expect(await getCenter(circle)).toEqual(center);
        });
    });

    describe('out', function() {
        it('before add particle', async function(this: Context) {
            await selectZoomPanAction(this.driver);
            await wheel(getSvg(this.driver), WheelDirection.DOWN);
            await selectAddParticleAction(this.driver);
            await addParticle(this.driver, { cx: 200, cy: 200, r: 5 });
            const circle = getParticleCircle(this.driver);
            expect(await getWidth(circle)).toBe(10);
            expect(await getCenter(circle)).toEqual({ x: 200, y: 200 });
        });

        it('after add particle', async function(this: Context) {
            const svg = getSvg(this.driver);
            const center = await getCenter(svg);
            await selectAddParticleAction(this.driver);
            await addParticle(this.driver, { cx: center.x, cy: center.y, r: 11 });
            await selectZoomPanAction(this.driver);
            await wheel(svg, WheelDirection.DOWN);
            const circle = getParticleCircle(this.driver);
            expect(await getWidth(circle)).toBe(20);
            expect(await getCenter(circle)).toEqual(center);
        });

        it('multiple', async function(this: Context) {
            const svg = getSvg(this.driver);
            const center = await getCenter(svg);
            await selectAddParticleAction(this.driver);
            await addParticle(this.driver, { cx: center.x, cy: center.y, r: 121 });
            await selectZoomPanAction(this.driver);
            await wheel(svg, WheelDirection.DOWN);
            await wheel(svg, WheelDirection.DOWN);
            const circle = getParticleCircle(this.driver);
            expect(await getWidth(circle)).toBe(200);
            expect(await getCenter(circle)).toEqual(center);
        });
    });
});
