import { Key } from 'selenium-webdriver';
import {
    addParticle,
    chord,
    click,
    selectAddParticleAction,
    setMass,
    selectIntegrateGravitySimulator,
    selectNoneGravitySimulator,
    move,
    setGravitationalConstant,
    setPositionX,
    setPositionY,
    setVelocityX,
    setVelocityY,
    setRadius,
    selectNoneCollisionSimulator,
    selectElasticCollisionSimulator
} from '../../actions';
import { Context, setup, cleanup } from '../../context';
import {
    getParticleCircles,
    getUndoButton,
    getRedoButton,
    getParticleCircle,
    getVelocityXInput,
    getStepButton,
    getVelocityYInput,
    getMassInput,
    getGravitySimulatorSelect,
    getVelocityCell,
    getGravitationalConstantInput,
    getCollisionSimulatorSelect
} from '../../element-getters';
import {
    count,
    getCenterX,
    getCenterY,
    getWidth,
    getSelectedOption
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

    it('select gravity simulator', async function(this: Context) {
        await selectNoneGravitySimulator(this.driver);
        await selectIntegrateGravitySimulator(this.driver);
        await getUndoButton(this.driver).click();
        expect(await getSelectedOption(getGravitySimulatorSelect(this.driver)).getText()).toBe('none');
    });

    it('set gravitational constant', async function(this: Context) {
        await setGravitationalConstant(this.driver, .5);
        await getUndoButton(this.driver).click();
        expect(await getGravitationalConstantInput(this.driver).getAttribute('value')).toBe('1');
    });

    it('select collision simulator', async function(this: Context) {
        await selectNoneCollisionSimulator(this.driver);
        await selectElasticCollisionSimulator(this.driver);
        await getUndoButton(this.driver).click();
        expect(await getSelectedOption(getCollisionSimulatorSelect(this.driver)).getText()).toBe('none');
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
        await setPositionX(getParticleCircle(this.driver), 210);
        await getUndoButton(this.driver).click();
        expect(await getCenterX(getParticleCircle(this.driver))).toBe(200);
    });

    it('set position y', async function(this: Context) {
        await selectAddParticleAction(this.driver);
        await addParticle(this.driver, { cx: 200, cy: 200, r: 5 });
        await setPositionY(getParticleCircle(this.driver), 210);
        await getUndoButton(this.driver).click();
        expect(await getCenterY(getParticleCircle(this.driver))).toBe(200);
    });

    it('set velocity x', async function(this: Context) {
        await selectAddParticleAction(this.driver);
        await addParticle(this.driver, { cx: 200, cy: 200, r: 5 });
        await setVelocityX(getParticleCircle(this.driver), 5);
        await getUndoButton(this.driver).click();
        await move(this.driver, { x: 200, y: 200 });
        expect(await getVelocityCell(this.driver).getText()).toBe('(0,0)');
    });

    it('set velocity y', async function(this: Context) {
        await selectAddParticleAction(this.driver);
        await addParticle(this.driver, { cx: 200, cy: 200, r: 5 });
        await setVelocityY(getParticleCircle(this.driver), 5);
        await getUndoButton(this.driver).click();
        await move(this.driver, { x: 200, y: 200 });
        expect(await getVelocityCell(this.driver).getText()).toBe('(0,0)');
    });

    it('set radius', async function(this: Context) {
        await selectAddParticleAction(this.driver);
        await addParticle(this.driver, { cx: 200, cy: 200, r: 5 });
        await setRadius(getParticleCircle(this.driver), 10);
        await getUndoButton(this.driver).click();
        expect(await getWidth(getParticleCircle(this.driver))).toBe(10);
    });

    it('set mass', async function(this: Context) {
        await selectAddParticleAction(this.driver);
        await addParticle(this.driver, { cx: 200, cy: 200, r: 10 });
        await setMass(getParticleCircle(this.driver), 100);
        await getUndoButton(this.driver).click();
        await click(this.driver, { x: 200, y: 200 });
        expect(await getMassInput(this.driver).getAttribute('value')).toBe('4.1887902047863905');
    });

    describe('step', function() {
        it('position x', async function(this: Context) {
            await selectAddParticleAction(this.driver);
            await addParticle(this.driver, { cx: 200, cy: 200, r: 5 });
            await setVelocityX(getParticleCircle(this.driver), 5);
            await getStepButton(this.driver).click();
            await getUndoButton(this.driver).click();
            expect(await getCenterX(getParticleCircle(this.driver))).toBe(200);
        });

        it('position y', async function(this: Context) {
            await selectAddParticleAction(this.driver);
            await addParticle(this.driver, { cx: 200, cy: 200, r: 5 });
            await setVelocityY(getParticleCircle(this.driver), 5);
            await getStepButton(this.driver).click();
            await getUndoButton(this.driver).click();
            expect(await getCenterY(getParticleCircle(this.driver))).toBe(200);
        });

        it('velocity x', async function(this: Context) {
            await selectIntegrateGravitySimulator(this.driver);
            await selectAddParticleAction(this.driver);
            await addParticle(this.driver, { cx: 180, cy: 140, r: 5 });
            await addParticle(this.driver, { cx: 100, cy: 200, r: 5 });
            await setMass(getParticleCircle(this.driver, 1), 100000);
            await setMass(getParticleCircle(this.driver, 2), 10);
            await getStepButton(this.driver).click();
            await getUndoButton(this.driver).click();
            await getParticleCircle(this.driver, 2).click();
            expect(await getVelocityXInput(this.driver).getAttribute('value')).toBe('0');
        });

        it('velocity y', async function(this: Context) {
            await selectIntegrateGravitySimulator(this.driver);
            await selectAddParticleAction(this.driver);
            await addParticle(this.driver, { cx: 180, cy: 140, r: 5 });
            await addParticle(this.driver, { cx: 100, cy: 200, r: 5 });
            await setMass(getParticleCircle(this.driver, 1), 100000);
            await setMass(getParticleCircle(this.driver, 2), 10);
            await getStepButton(this.driver).click();
            await getUndoButton(this.driver).click();
            await getParticleCircle(this.driver, 2).click();
            expect(await getVelocityYInput(this.driver).getAttribute('value')).toBe('0');
        });
    });
});
