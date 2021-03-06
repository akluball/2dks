import { Origin } from 'selenium-webdriver';
import {
    addParticle,
    relMove,
    selectAddParticleAction,
    move
} from '../actions';
import { TOGGLE_TRANSITION_MILLIS } from '../constant';
import { Context, setup, cleanup } from '../context';
import {
    getToolbar,
    getParticleCircles,
    getParticleCircle,
    getToolbarToggle,
    getPendingParticleCircle,
    getPendingParticleCircles,
    getMassCell,
    getVelocityCell
} from '../element-getters';
import {
    getCenterX,
    getCenterY,
    sleep,
    getWidth,
    count
} from '../util';

describe('add particle', function() {
    beforeEach(setup);
    afterEach(cleanup);

    it('only adds one particle', async function(this: Context) {
        await selectAddParticleAction(this.driver);
        await addParticle(this.driver, { cx: 200, cy: 200, r: 5 });
        expect(await count(getParticleCircles(this.driver))).toBe(1);
    });

    it('center at press', async function(this: Context) {
        await selectAddParticleAction(this.driver);
        await addParticle(this.driver, { cx: 200, cy: 200, r: 5 });
        const circle = getParticleCircle(this.driver);
        expect(await getCenterX(circle)).toBe(200);
        expect(await getCenterY(circle)).toBe(200);
    });

    it('has drag distance radius', async function(this: Context) {
        await selectAddParticleAction(this.driver);

        await this.driver.actions()
                         .move({ duration: 0, x: 200, y: 200 })
                         .press()
                         .move({ duration: 0, origin: Origin.POINTER, x: 4 })
                         .perform();
        const pendingCircle = getPendingParticleCircle(this.driver);
        expect(await getWidth(pendingCircle)).toBe(8);

        await relMove(this.driver, { dx: -4, dy: 3 });
        expect(await getWidth(pendingCircle)).toBe(6);

        await this.driver.actions()
                         .move({ duration: 0, origin: Origin.POINTER, x: 4 })
                         .release()
                         .perform();
        const circle = getParticleCircle(this.driver);
        expect(await getWidth(circle)).toBe(10);

        await relMove(this.driver, { dx: 1 });
        expect(await getWidth(circle)).toBe(10);
    });

    it('mass 1/1000 of volume', async function(this: Context) {
        await selectAddParticleAction(this.driver);
        await addParticle(this.driver, { cx: 200, cy: 200, r: 10 });
        await move(this.driver, { x: 200, y: 200 });
        expect(await getMassCell(this.driver).getText()).toBe('4.1887902047863905');
    });

    it('velocity is 0', async function(this: Context) {
        await selectAddParticleAction(this.driver);
        await addParticle(this.driver, { cx: 200, cy: 200, r: 5 });
        await move(this.driver, { x: 200, y: 200 });
        expect(await getVelocityCell(this.driver).getText()).toBe('(0,0)');
    });

    it('must have nonzero radius', async function(this: Context) {
        await selectAddParticleAction(this.driver);
        await addParticle(this.driver, { cx: 200, cy: 200, r: 0 });
        expect(await count(getParticleCircles(this.driver))).toBe(0);
    });

    it('does not add on leave', async function(this: Context) {
        await selectAddParticleAction(this.driver);
        await this.driver.actions()
                         .move({ duration: 0, x: 200, y: 200 })
                         .press()
                         .move({ duration: 0, origin: getToolbar(this.driver) })
                         .release()
                         .perform();
        expect(await count(getParticleCircles(this.driver))).toBe(0);
    });

    it('does not add on toolbar click', async function(this: Context) {
        await selectAddParticleAction(this.driver);
        await this.driver.actions().click(getToolbar(this.driver)).perform();
        expect(await count(getParticleCircles(this.driver))).toBe(0);
    });

    it('no pending particle when center overlaps', async function(this: Context) {
        await selectAddParticleAction(this.driver);
        await addParticle(this.driver, { cx: 200, cy: 200, r: 5 });
        await this.driver.actions()
                         .move({ duration: 0, x: 196, y: 200 })
                         .press()
                         .perform();
        expect(await count(getPendingParticleCircles(this.driver))).toBe(0);
    });

    it('adds on contents hidden toolbar click', async function(this: Context) {
        await selectAddParticleAction(this.driver);
        await getToolbarToggle(this.driver).click();
        await sleep(TOGGLE_TRANSITION_MILLIS);
        await addParticle(this.driver, { cx: 200, cy: 200, r: 5 });
        await getParticleCircle(this.driver);
    });

    it('should not add when particles overlap', async function(this: Context) {
        await selectAddParticleAction(this.driver);
        await addParticle(this.driver, { cx: 200, cy: 200, r: 5 });
        await addParticle(this.driver, { cx: 190, cy: 200, r: 5 });
        expect(await count(getParticleCircles(this.driver))).toBe(1);
    });

    it('pending particle should be gray', async function(this: Context) {
        await selectAddParticleAction(this.driver);
        await this.driver.actions()
                         .move({ duration: 0, x: 200, y: 200 })
                         .press()
                         .perform();
        const circle = getPendingParticleCircle(this.driver);
        expect(await circle.getAttribute('fill')).toBe('gray');
    });

    it('overlapping pending particle should be red', async function(this: Context) {
        await selectAddParticleAction(this.driver);
        await addParticle(this.driver, { cx: 200, cy: 200, r: 5 });
        await this.driver.actions()
                         .move({ duration: 0, x: 190, y: 200 })
                         .press()
                         .move({ duration: 0, origin: Origin.POINTER, x: 5 })
                         .perform();
        const circle = getPendingParticleCircle(this.driver);
        expect(await circle.getAttribute('fill')).toBe('red');
        await relMove(this.driver, { dx: -1 });
        expect(await circle.getAttribute('fill')).toBe('gray');
    });

    it('added particle should be black', async function(this: Context) {
        await selectAddParticleAction(this.driver);
        await addParticle(this.driver, { cx: 200, cy: 200, r: 5 });
        const circle = getParticleCircle(this.driver);
        expect(await circle.getAttribute('fill')).toBe('black');
    });
});
