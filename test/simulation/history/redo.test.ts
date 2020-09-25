import { Key } from 'selenium-webdriver';
import {
    addParticle,
    chord,
    click,
    selectAddParticleAction,
    clearAndSendKeys,
    selectIntegrateGravitySimulator,
    setMass,
    selectNoneGravitySimulator,
    move
} from '../../actions';
import { Context, setup, cleanup } from '../../context';
import {
    getUndoButton,
    getRedoButton,
    getParticleCircles,
    getParticleCircle,
    getPositionXInput,
    getPositionYInput,
    getRadiusInput,
    getVelocityYInput,
    getVelocityXInput,
    getStepButton,
    getMassInput,
    getGravitySimulatorSelect,
    getVelocityCell,
    getGravitationalConstantInput
} from '../../element-getters';
import {
    count,
    getCenterX,
    getCenterY,
    getWidth,
    getSelectedOption
} from '../../util';

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

    it('is cleared on new history branch', async function(this: Context) {
        await selectAddParticleAction(this.driver);
        await addParticle(this.driver, { cx: 200, cy: 200, r: 5 });
        await getUndoButton(this.driver).click();
        await addParticle(this.driver, { cx: 200, cy: 215, r: 5 });
        await getRedoButton(this.driver).click();
        expect(await count(getParticleCircles(this.driver))).toBe(1);
    });

    it('add particle', async function(this: Context) {
        await selectAddParticleAction(this.driver);
        await addParticle(this.driver, { cx: 200, cy: 200, r: 5 });
        await getUndoButton(this.driver).click();
        await getRedoButton(this.driver).click();
        expect(await count(getParticleCircles(this.driver))).toBe(1);
    });

    it('select gravity simulator', async function(this: Context) {
        await selectNoneGravitySimulator(this.driver);
        await selectIntegrateGravitySimulator(this.driver);
        await getUndoButton(this.driver).click();
        await getRedoButton(this.driver).click();
        expect(await getSelectedOption(getGravitySimulatorSelect(this.driver)).getText()).toBe('integrate');
    });

    it('set gravitational constant', async function(this: Context) {
        await getGravitationalConstantInput(this.driver).click();
        await clearAndSendKeys(this.driver, '.5', Key.ENTER);
        await getUndoButton(this.driver).click();
        await getRedoButton(this.driver).click();
        expect(await getGravitationalConstantInput(this.driver).getAttribute('value')).toBe('0.5');
    });

    it('set position x', async function(this: Context) {
        await selectAddParticleAction(this.driver);
        await addParticle(this.driver, { cx: 200, cy: 200, r: 5 });
        await click(this.driver, { x: 200, y: 200 });
        await getPositionXInput(this.driver).click();
        await clearAndSendKeys(this.driver, '300', Key.ENTER);
        await getUndoButton(this.driver).click();
        await getRedoButton(this.driver).click();
        expect(await getCenterX(getParticleCircle(this.driver))).toBe(300);
    });

    it('set position y', async function(this: Context) {
        await selectAddParticleAction(this.driver);
        await addParticle(this.driver, { cx: 200, cy: 200, r: 5 });
        await click(this.driver, { x: 200, y: 200 });
        await getPositionYInput(this.driver).click();
        await clearAndSendKeys(this.driver, '300', Key.ENTER);
        await getUndoButton(this.driver).click();
        await getRedoButton(this.driver).click();
        expect(await getCenterY(getParticleCircle(this.driver))).toBe(300);
    });

    it('set velocity x', async function(this: Context) {
        await selectAddParticleAction(this.driver);
        await addParticle(this.driver, { cx: 200, cy: 200, r: 5 });
        await click(this.driver, { x: 200, y: 200 });
        await getVelocityXInput(this.driver).click();
        await clearAndSendKeys(this.driver, '5', Key.ENTER);
        await getUndoButton(this.driver).click();
        await getRedoButton(this.driver).click();
        await move(this.driver, { x: 200, y: 200 });
        expect(await getVelocityCell(this.driver).getText()).toBe('(5,0)');
    });

    it('set velocity y', async function(this: Context) {
        await selectAddParticleAction(this.driver);
        await addParticle(this.driver, { cx: 200, cy: 200, r: 5 });
        await click(this.driver, { x: 200, y: 200 });
        await getVelocityYInput(this.driver).click();
        await clearAndSendKeys(this.driver, '5', Key.ENTER);
        await getUndoButton(this.driver).click();
        await getRedoButton(this.driver).click();
        await move(this.driver, { x: 200, y: 200 });
        expect(await getVelocityCell(this.driver).getText()).toBe('(0,5)');
    });

    it('set radius', async function(this: Context) {
        await selectAddParticleAction(this.driver);
        await addParticle(this.driver, { cx: 200, cy: 200, r: 5 });
        await click(this.driver, { x: 200, y: 200 });
        await getRadiusInput(this.driver).click();
        await clearAndSendKeys(this.driver, '10', Key.ENTER);
        await getUndoButton(this.driver).click();
        await getRedoButton(this.driver).click();
        expect(await getWidth(getParticleCircle(this.driver))).toBe(20);
    });

    it('set mass', async function(this: Context) {
        await selectAddParticleAction(this.driver);
        await addParticle(this.driver, { cx: 200, cy: 200, r: 5 });
        await click(this.driver, { x: 200, y: 200 });
        await getMassInput(this.driver).click();
        await clearAndSendKeys(this.driver, '100', Key.ENTER);
        await getUndoButton(this.driver).click();
        await getRedoButton(this.driver).click();
        await click(this.driver, { x: 200, y: 200 });
        expect(await getMassInput(this.driver).getAttribute('value')).toBe('100');
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
            await getRedoButton(this.driver).click();
            expect(await getCenterX(getParticleCircle(this.driver))).toBe(205);
        });

        it('position y', async function(this: Context) {
            await selectAddParticleAction(this.driver);
            await addParticle(this.driver, { cx: 200, cy: 200, r: 5 });
            await click(this.driver, { x: 200, y: 200 });
            await getVelocityYInput(this.driver).click();
            await clearAndSendKeys(this.driver, '5', Key.ENTER);
            await getStepButton(this.driver).click();
            await getUndoButton(this.driver).click();
            await getRedoButton(this.driver).click();
            expect(await getCenterY(getParticleCircle(this.driver))).toBe(195);
        });

        it('velocity x', async function(this: Context) {
            await selectIntegrateGravitySimulator(this.driver);
            await selectAddParticleAction(this.driver);
            await addParticle(this.driver, { cx: 180, cy: 140, r: 5 });
            await addParticle(this.driver, { cx: 100, cy: 200, r: 5 });
            await setMass(this.driver, getParticleCircle(this.driver, 1), 100000);
            await setMass(this.driver, getParticleCircle(this.driver, 2), 10);
            await getStepButton(this.driver).click();
            await getUndoButton(this.driver).click();
            await getRedoButton(this.driver).click();
            await getParticleCircle(this.driver, 2).click();
            expect(await getVelocityXInput(this.driver).getAttribute('value')).toBe('8');
        });

        it('velocity y', async function(this: Context) {
            await selectIntegrateGravitySimulator(this.driver);
            await selectAddParticleAction(this.driver);
            await addParticle(this.driver, { cx: 180, cy: 140, r: 5 });
            await addParticle(this.driver, { cx: 100, cy: 200, r: 5 });
            await setMass(this.driver, getParticleCircle(this.driver, 1), 100000);
            await setMass(this.driver, getParticleCircle(this.driver, 2), 10);
            await getStepButton(this.driver).click();
            await getUndoButton(this.driver).click();
            await getRedoButton(this.driver).click();
            await getParticleCircle(this.driver, 2).click();
            expect(await getVelocityYInput(this.driver).getAttribute('value')).toBe('6');
        });
    });
});
