import { Context, setup, cleanup } from '../context';
import {
    selectZoomPanAction,
    selectAddParticleAction,
    addParticle,
    drag,
    click,
    clickElement,
    relDrag,
} from '../actions';
import {
    getParticleCircle,
    getToolbar,
    getParticleDescription,
    getGridToggle
} from '../element-getters';
import {
    getCenterX,
    getCenterY,
    getCenter,
    getLeftX,
    getTopY,
    resizeBody
} from '../util';

describe('pan', function() {
    beforeEach(setup);
    afterEach(cleanup);

    it('horizontal', async function(this: Context) {
        await selectAddParticleAction(this.driver);
        await addParticle(this.driver, { cx: 200, cy: 200, r: 5 });
        await selectZoomPanAction(this.driver);
        await relDrag(this.driver, { x: 100, y: 200 }, { dx: 50 }, { dx: 50 });
        expect(await getCenterX(getParticleCircle(this.driver))).toBe(300);
    });

    it('vertical', async function(this: Context) {
        await selectAddParticleAction(this.driver);
        await addParticle(this.driver, { cx: 200, cy: 200, r: 5 });
        await selectZoomPanAction(this.driver);
        await relDrag(this.driver, { x: 200, y: 100 }, { dy: 50 }, { dy: 50 });
        expect(await getCenterY(getParticleCircle(this.driver))).toBe(300);
    });

    it('none when press on particle', async function(this: Context) {
        await selectAddParticleAction(this.driver);
        await addParticle(this.driver, { cx: 200, cy: 200, r: 5 });
        await selectZoomPanAction(this.driver);
        await relDrag(this.driver, { x: 200, y: 200 }, { dy: 10 });
        expect(await getCenterY(await getParticleCircle(this.driver))).toBe(200);
    });

    it('grid line press', async function(this: Context) {
        await resizeBody(this.driver, '400px', '400px');
        await selectAddParticleAction(this.driver);
        await addParticle(this.driver, { cx: 200, cy: 200, r: 5 });
        await selectZoomPanAction(this.driver);
        await clickElement(getGridToggle(this.driver));
        await relDrag(this.driver, { x: 100, y: 200 }, { dx: 5, dy: 5 });
        expect(await getCenter(getParticleCircle(this.driver))).toEqual({ x: 205, y: 205 });
    });

    it('stop draggin on leave', async function(this: Context) {
        await selectAddParticleAction(this.driver);
        await addParticle(this.driver, { cx: 200, cy: 200, r: 5 });
        await selectZoomPanAction(this.driver);
        const toolbarCenter = await getCenter(await getToolbar(this.driver));
        await drag(this.driver, { x: 100, y: 200 }, toolbarCenter, { x: 200, y: 300 });
        expect(await getCenterY(getParticleCircle(this.driver))).not.toBe(300);
    });

    it('before add particle', async function(this: Context) {
        await selectZoomPanAction(this.driver);
        await relDrag(this.driver, { x: 200, y: 200 }, { dx: 5, dy: 10 });
        await selectAddParticleAction(this.driver);
        await addParticle(this.driver, { cx: 200, cy: 200, r: 5 });
        expect(await getCenter(getParticleCircle(this.driver))).toEqual({ x: 200, y: 200 });
    });

    it('after add particle transforms description', async function(this: Context) {
        await selectAddParticleAction(this.driver);
        await addParticle(this.driver, { cx: 200, cy: 200, r: 5 });
        await selectZoomPanAction(this.driver);
        await relDrag(this.driver, { x: 180, y: 180 }, { dx: 10, dy: 5 });
        await click(this.driver, await getCenter(getParticleCircle(this.driver)));
        expect(await getLeftX(getParticleDescription(this.driver))).toEqual(215);
        expect(await getTopY(getParticleDescription(this.driver))).toEqual(205);
    });
});
