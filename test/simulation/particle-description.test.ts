import {
    addParticle,
    click,
    move,
    relMove,
    selectAddParticleAction,
} from '../actions';
import { Context, setup, cleanup } from '../context';
import {
    getParticleDescription,
    getParticleDescriptions,
    getToolbar,
    getPositionXInput,
    getPositionHeader,
    getRadiusHeader,
    getVelocityHeader,
    getPositionCell,
    getRadiusCell,
    getVelocityCell
} from '../element-getters';
import {
    getLeftX,
    getTopY,
    getCenterY,
    count,
    getActiveElement
} from '../util';

describe('particle description', function() {
    beforeEach(setup);
    afterEach(cleanup);

    it('exists when circle hovered', async function(this: Context) {
        await selectAddParticleAction(this.driver);
        await addParticle(this.driver, { cx: 200, cy: 200, r: 5 });
        await move(this.driver, { x: 205, y: 200 });
        await getParticleDescription(this.driver);
    });

    it('exists when description hovered', async function(this: Context) {
        await selectAddParticleAction(this.driver);
        await addParticle(this.driver, { cx: 200, cy: 200, r: 5 });
        await move(this.driver, { x: 204, y: 200 });
        await relMove(this.driver, { dx: 2 });
        await getParticleDescription(this.driver);
    });

    it('exists when circle focused', async function(this: Context) {
        await selectAddParticleAction(this.driver);
        await addParticle(this.driver, { cx: 200, cy: 200, r: 5 });
        await click(this.driver, { x: 200, y: 200 });
        await move(this.driver, { x: 0, y: 0 });
        await getParticleDescription(this.driver);
    });

    it('exists when description focused', async function(this: Context) {
        await selectAddParticleAction(this.driver);
        await addParticle(this.driver, { cx: 200, cy: 200, r: 5 });
        await click(this.driver, { x: 200, y: 200 });
        await click(this.driver, { x: 206, y: 200 });
        await move(this.driver, { x: 0, y: 0 });
        await getParticleDescription(this.driver);
    });

    it('does not exist when circle/description not hovered/focused', async function(this: Context) {
        await selectAddParticleAction(this.driver);
        await addParticle(this.driver, { cx: 200, cy: 200, r: 5 });
        await move(this.driver, { x: 194, y: 200 });
        expect(await count(getParticleDescriptions(this.driver))).toBe(0);
    });

    it('circle, description, description input click sequence', async function(this: Context) {
        await selectAddParticleAction(this.driver);
        await addParticle(this.driver, { cx: 200, cy: 200, r: 5 });
        await click(this.driver, { x: 200, y: 200, });
        await getParticleDescription(this.driver).click();
        await getPositionXInput(this.driver).click();
        expect(await getActiveElement(this.driver).getTagName()).toBe('input');
    });

    it('switches on different circle focus', async function(this: Context) {
        await selectAddParticleAction(this.driver);
        await addParticle(this.driver, { cx: 200, cy: 200, r: 5 });
        await addParticle(this.driver, { cx: 200, cy: 215, r: 5 });
        await click(this.driver, { x: 200, y: 200 });
        await click(this.driver, { x: 200, y: 215 });
        const description = getParticleDescription(this.driver);
        expect(await getTopY(description)).toBe(215);
    });

    it('in front of overlapping particle', async function(this: Context) {
        await selectAddParticleAction(this.driver);
        await addParticle(this.driver, { cx: 200, cy: 200, r: 5 });
        await addParticle(this.driver, { cx: 189, cy: 200, r: 5 });
        await click(this.driver, { x: 189, y: 200 });
        await click(this.driver, { x: 195, y: 200 });
        expect(await getActiveElement(this.driver).getTagName()).toBe('particle-description');
    });

    it('in front of toolbar', async function(this: Context) {
        await selectAddParticleAction(this.driver);
        const toolbar = getToolbar(this.driver);
        const toolbarCenterY = await getCenterY(toolbar);
        const toolbarLeftX = await getLeftX(toolbar);
        await addParticle(this.driver, { cx: toolbarLeftX - 1, cy: toolbarCenterY, r: -5 });
        await click(this.driver, { x: toolbarLeftX - 1, y: toolbarCenterY });
        await click(this.driver, { x: toolbarLeftX + 4, y: toolbarCenterY });
        expect(await getActiveElement(this.driver).getTagName()).toBe('particle-description');
    });

    it('left x is right x of circle', async function(this: Context) {
        await selectAddParticleAction(this.driver);
        await addParticle(this.driver, { cx: 200, cy: 200, r: 5 });
        await move(this.driver, { x: 200, y: 200 });
        expect(await getLeftX(getParticleDescription(this.driver))).toBe(205);
    });

    it('top y centered by circle', async function(this: Context) {
        await selectAddParticleAction(this.driver);
        await addParticle(this.driver, { cx: 200, cy: 200, r: 5 });
        await move(this.driver, { x: 200, y: 200 });
        expect(await getTopY(getParticleDescription(this.driver))).toBe(200);
    });

    it('position field', async function(this: Context) {
        await selectAddParticleAction(this.driver);
        await addParticle(this.driver, { cx: 200, cy: 200, r: 5 });
        await move(this.driver, { x: 200, y: 200 });
        expect(await getPositionHeader(this.driver).getText()).toBe('position');
    });

    it('radius field', async function(this: Context) {
        await selectAddParticleAction(this.driver);
        await addParticle(this.driver, { cx: 200, cy: 200, r: 5 });
        await move(this.driver, { x: 200, y: 200 });
        expect(await getRadiusHeader(this.driver).getText()).toBe('radius');
    });

    it('velocity field', async function(this: Context) {
        await selectAddParticleAction(this.driver);
        await addParticle(this.driver, { cx: 200, cy: 200, r: 5 });
        await move(this.driver, { x: 200, y: 200 });
        expect(await getVelocityHeader(this.driver).getText()).toBe('velocity');
    });

    it('position is circle center', async function(this: Context) {
        await selectAddParticleAction(this.driver);
        await addParticle(this.driver, { cx: 200, cy: 200, r: 5 });
        await move(this.driver, { x: 200, y: 200 });
        expect(await getPositionCell(this.driver).getText()).toBe(`(200,${this.height - 200})`);
    });

    it('radius is circle radius', async function(this: Context) {
        await selectAddParticleAction(this.driver);
        await addParticle(this.driver, { cx: 200, cy: 200, r: 5 });
        await move(this.driver, { x: 200, y: 200 });
        expect(await getRadiusCell(this.driver).getText()).toBe('5');
    });

    it('velocity initially 0', async function(this: Context) {
        await selectAddParticleAction(this.driver);
        await addParticle(this.driver, { cx: 200, cy: 200, r: 5 });
        await move(this.driver, { x: 200, y: 200 });
        expect(await getVelocityCell(this.driver).getText()).toBe('(0,0)');
    });
});
