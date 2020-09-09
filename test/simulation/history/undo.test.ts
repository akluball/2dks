import { Key } from 'selenium-webdriver';
import {
    addParticle,
    chord,
    click,
    clearAndSendKeys,
    selectAddParticleAction
} from '../../actions';
import { Context, setup, cleanup } from '../../context';
import {
    getParticleCircles,
    getUndoButton,
    getRedoButton,
    getParticleCircle,
    getPositionXInput,
    getPositionYInput,
    getRadiusInput,
    getVelocityXInput,
    getStepButton,
    getVelocityYInput
} from '../../element-getters';
import {
    count,
    getCenterX,
    getCenterY,
    getWidth
} from '../../util';

describe('undo', function() {
    beforeEach(setup);
    afterEach(cleanup);

    describe('ctrl-z shortcut', function() {
        it('works when simulation focused', async function(this: Context) {
            await selectAddParticleAction(this.driver);
            await addParticle(this.driver, { cx: 200, cy: 200, r: 5 });
            await chord(this.driver, Key.CONTROL, 'z');
            expect(await count(getParticleCircles(this.driver))).toBe(0);
        });

        it('does not work when simulation blurred', async function(this: Context) {
            await selectAddParticleAction(this.driver);
            await addParticle(this.driver, { cx: 200, cy: 200, r: 5 });
            await this.driver.executeScript('document.activeElement.blur()');
            await chord(this.driver, Key.CONTROL, 'z');
            expect(await count(getParticleCircles(this.driver))).toBe(1);
        });
    });

    it('multiple times', async function(this: Context) {
        await selectAddParticleAction(this.driver);
        await addParticle(this.driver, { cx: 200, cy: 200, r: 5 });
        await addParticle(this.driver, { cx: 200, cy: 300, r: 5 });
        const undo = getUndoButton(this.driver);
        await undo.click();
        await undo.click();
        expect(await count(getParticleCircles(this.driver))).toBe(0);
    });

    it('then redo then undo', async function(this: Context) {
        await selectAddParticleAction(this.driver);
        await addParticle(this.driver, { cx: 200, cy: 200, r: 5 });
        const undo = getUndoButton(this.driver);
        await undo.click();
        await getRedoButton(this.driver).click();
        await undo.click();
        expect(await count(getParticleCircles(this.driver))).toBe(0);
    });

    it('add particle', async function(this: Context) {
        await selectAddParticleAction(this.driver);
        await addParticle(this.driver, { cx: 200, cy: 200, r: 5 });
        await getUndoButton(this.driver).click();
        expect(await count(getParticleCircles(this.driver))).toBe(0);
    });

    it('set position x', async function(this: Context) {
        await selectAddParticleAction(this.driver);
        await addParticle(this.driver, { cx: 200, cy: 200, r: 5 });
        await click(this.driver, { x: 200, y: 200 });
        await getPositionXInput(this.driver).click();
        await clearAndSendKeys(this.driver, '210', Key.ENTER);
        await getUndoButton(this.driver).click();
        expect(await getCenterX(getParticleCircle(this.driver))).toBe(200);
    });

    it('set position y', async function(this: Context) {
        await selectAddParticleAction(this.driver);
        await addParticle(this.driver, { cx: 200, cy: 200, r: 5 });
        await click(this.driver, { x: 200, y: 200 });
        await getPositionYInput(this.driver).click();
        await clearAndSendKeys(this.driver, '210', Key.ENTER);
        await getUndoButton(this.driver).click();
        expect(await getCenterY(getParticleCircle(this.driver))).toBe(200);
    });

    it('set radius', async function(this: Context) {
        await selectAddParticleAction(this.driver);
        await addParticle(this.driver, { cx: 200, cy: 200, r: 5 });
        await click(this.driver, { x: 200, y: 200 });
        await getRadiusInput(this.driver).click();
        await clearAndSendKeys(this.driver, '10', Key.ENTER);
        await getUndoButton(this.driver).click();
        expect(await getWidth(getParticleCircle(this.driver))).toBe(10);
    });

    it('set velocity x', async function(this: Context) {
        await selectAddParticleAction(this.driver);
        await addParticle(this.driver, { cx: 200, cy: 200, r: 5 });
        await click(this.driver, { x: 200, y: 200 });
        await getVelocityXInput(this.driver).click();
        await clearAndSendKeys(this.driver, '5', Key.ENTER);
        await getUndoButton(this.driver).click();
        await getStepButton(this.driver).click();
        expect(await getCenterX(getParticleCircle(this.driver))).toBe(200);
    });

    it('set velocity y', async function(this: Context) {
        await selectAddParticleAction(this.driver);
        await addParticle(this.driver, { cx: 200, cy: 200, r: 5 });
        await click(this.driver, { x: 200, y: 200 });
        await getVelocityYInput(this.driver).click();
        await clearAndSendKeys(this.driver, '5', Key.ENTER);
        await getUndoButton(this.driver).click();
        await getStepButton(this.driver).click();
        expect(await getCenterY(getParticleCircle(this.driver))).toBe(200);
    });

    describe('step', function() {
        it('position x', async function(this: Context) {
            await selectAddParticleAction(this.driver);
            await addParticle(this.driver, { cx: 200, cy: 200, r: 5 });
            await click(this.driver, { x: 200, y: 200 });
            await getVelocityXInput(this.driver).click();
            await clearAndSendKeys(this.driver, '5', Key.ENTER);
            await getStepButton(this.driver).click();
            await getUndoButton(this.driver).click();
            expect(await getCenterX(getParticleCircle(this.driver))).toBe(200);
        });

        it('position y', async function(this: Context) {
            await selectAddParticleAction(this.driver);
            await addParticle(this.driver, { cx: 200, cy: 200, r: 5 });
            await click(this.driver, { x: 200, y: 200 });
            await getVelocityYInput(this.driver).click();
            await clearAndSendKeys(this.driver, '5', Key.ENTER);
            await getStepButton(this.driver).click();
            await getUndoButton(this.driver).click();
            expect(await getCenterY(getParticleCircle(this.driver))).toBe(200);
        });
    });
});
