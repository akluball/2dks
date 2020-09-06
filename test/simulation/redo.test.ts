import { Key } from 'selenium-webdriver';
import {
    addParticle,
    chord,
    click,
    selectAddParticleAction,
    clearAndSendKeys
} from '../actions';
import { Context, setup, cleanup } from '../context';
import {
    getUndoButton,
    getRedoButton,
    getParticleCircles,
    getParticleDescriptionInputs,
    getParticleCircle
} from '../element-getters';
import {
    count,
    getCenterX,
    getCenterY,
    getWidth
} from '../util';

describe('redo', function() {
    beforeEach(setup);
    afterEach(cleanup);

    describe('ctrl-shift-z shortcut', async function(this: Context) {
        it('simulation focused', async function(this: Context) {
            await selectAddParticleAction(this.driver);
            await addParticle(this.driver, { cx: 200, cy: 200, r: 5 });
            await getUndoButton(this.driver).click();
            await chord(this.driver, Key.CONTROL, Key.SHIFT, 'z');
            expect(await count(getParticleCircles(this.driver))).toBe(1);
        });

        it('simulation blurred', async function(this: Context) {
            await selectAddParticleAction(this.driver);
            await addParticle(this.driver, { cx: 200, cy: 200, r: 5 });
            await getUndoButton(this.driver).click();
            await this.driver.executeScript('document.activeElement.blur()');
            await chord(this.driver, Key.CONTROL, Key.SHIFT, 'z');
            expect(await count(getParticleCircles(this.driver))).toBe(0);
        });
    });

    it('only performed once', async function(this: Context) {
        await selectAddParticleAction(this.driver);
        await addParticle(this.driver, { cx: 200, cy: 200, r: 5 });
        await getUndoButton(this.driver).click();
        const redo = getRedoButton(this.driver);
        await redo.click();
        await redo.click();
        expect(await count(getParticleCircles(this.driver))).toBe(1);
    });

    it('add particle', async function(this: Context) {
        await selectAddParticleAction(this.driver);
        await addParticle(this.driver, { cx: 200, cy: 200, r: 5 });
        await getUndoButton(this.driver).click();
        await getRedoButton(this.driver).click();
        expect(await count(getParticleCircles(this.driver))).toBe(1);
    });

    it('set position x', async function(this: Context) {
        await selectAddParticleAction(this.driver);
        await addParticle(this.driver, { cx: 200, cy: 200, r: 5 });
        await click(this.driver, { x: 200, y: 200 });
        const input = (await getParticleDescriptionInputs(this.driver))[0];
        await input.click();
        await clearAndSendKeys(this.driver, '300', Key.ENTER);
        await getUndoButton(this.driver).click();
        await getRedoButton(this.driver).click();
        expect(await getCenterX(getParticleCircle(this.driver))).toBe(300);
    });

    it('set position y', async function(this: Context) {
        await selectAddParticleAction(this.driver);
        await addParticle(this.driver, { cx: 200, cy: 200, r: 5 });
        await click(this.driver, { x: 200, y: 200 });
        const input = (await getParticleDescriptionInputs(this.driver))[1];
        await input.click();
        await clearAndSendKeys(this.driver, '300', Key.ENTER);
        await getUndoButton(this.driver).click();
        await getRedoButton(this.driver).click();
        expect(await getCenterY(getParticleCircle(this.driver))).toBe(300);
    });

    it('set radius', async function(this: Context) {
        await selectAddParticleAction(this.driver);
        await addParticle(this.driver, { cx: 200, cy: 200, r: 5 });
        await click(this.driver, { x: 200, y: 200 });
        const input = (await getParticleDescriptionInputs(this.driver))[2];
        await input.click();
        await clearAndSendKeys(this.driver, '10', Key.ENTER);
        await getUndoButton(this.driver).click();
        await getRedoButton(this.driver).click();
        expect(await getWidth(getParticleCircle(this.driver))).toBe(20);
    });
});
