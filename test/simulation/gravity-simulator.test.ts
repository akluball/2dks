import { Context, setup, cleanup } from '../context';
import {
    selectAddParticleAction,
    addParticle,
    selectIntegrateGravitySimulator,
    selectNoneGravitySimulator,
    setMass,
    setGravitationalConstant
} from '../actions';
import {
    getParticleCircle,
    getStepButton,
    getVelocityXInput,
    getVelocityYInput,
} from '../element-getters';
import { getCenterX, getCenterY } from '../util';

describe('integrate gravity simulator', function() {
    beforeEach(setup);
    afterEach(cleanup);
    beforeEach(async function (this: Context) {
        await selectIntegrateGravitySimulator(this.driver);
    });

    it('position x', async function(this: Context) {
        await selectAddParticleAction(this.driver);
        await addParticle(this.driver, { cx: 180, cy: 140, r: 5 });
        await addParticle(this.driver, { cx: 100, cy: 200, r: 5 });
        await setMass(getParticleCircle(this.driver, 1), 100000);
        await setMass(getParticleCircle(this.driver, 2), 10);
        await getStepButton(this.driver).click();
        expect(await getCenterX(getParticleCircle(this.driver, 2))).toBe(104);
    });

    it('position y', async function(this: Context) {
        await selectAddParticleAction(this.driver);
        await addParticle(this.driver, { cx: 180, cy: 140, r: 5 });
        await addParticle(this.driver, { cx: 100, cy: 200, r: 5 });
        await setMass(getParticleCircle(this.driver, 1), 100000);
        await setMass(getParticleCircle(this.driver, 2), 10);
        await getStepButton(this.driver).click();
        expect(await getCenterY(getParticleCircle(this.driver, 2))).toBe(197);
    });

    it('velocity x', async function(this: Context) {
        await selectAddParticleAction(this.driver);
        await addParticle(this.driver, { cx: 180, cy: 140, r: 5 });
        await addParticle(this.driver, { cx: 100, cy: 200, r: 5 });
        await setMass(getParticleCircle(this.driver, 1), 100000);
        await setMass(getParticleCircle(this.driver, 2), 10);
        await getStepButton(this.driver).click();
        await getParticleCircle(this.driver, 2).click();
        expect(await getVelocityXInput(this.driver).getAttribute('value')).toBe('8');
    });

    it('velocity y', async function(this: Context) {
        await selectAddParticleAction(this.driver);
        await addParticle(this.driver, { cx: 180, cy: 140, r: 5 });
        await addParticle(this.driver, { cx: 100, cy: 200, r: 5 });
        await setMass(getParticleCircle(this.driver, 1), 100000);
        await setMass(getParticleCircle(this.driver, 2), 10);
        await getStepButton(this.driver).click();
        await getParticleCircle(this.driver, 2).click();
        expect(await getVelocityYInput(this.driver).getAttribute('value')).toBe('6');
    });

    describe('gravitational constant 2', function() {
        beforeEach(async function(this: Context) {
            await setGravitationalConstant(this.driver, 2);
        });

        it('position x', async function(this: Context) {
            await selectAddParticleAction(this.driver);
            await addParticle(this.driver, { cx: 180, cy: 140, r: 5 });
            await addParticle(this.driver, { cx: 100, cy: 200, r: 5 });
            await setMass(getParticleCircle(this.driver, 1), 100000);
            await setMass(getParticleCircle(this.driver, 2), 10);
            await getStepButton(this.driver).click();
            expect(await getCenterX(getParticleCircle(this.driver, 2))).toBe(108);
        });

        it('position y', async function(this: Context) {
            await selectAddParticleAction(this.driver);
            await addParticle(this.driver, { cx: 180, cy: 140, r: 5 });
            await addParticle(this.driver, { cx: 100, cy: 200, r: 5 });
            await setMass(getParticleCircle(this.driver, 1), 100000);
            await setMass(getParticleCircle(this.driver, 2), 10);
            await getStepButton(this.driver).click();
            expect(await getCenterY(getParticleCircle(this.driver, 2))).toBe(194);
        });

        it('velocity x', async function(this: Context) {
            await selectAddParticleAction(this.driver);
            await addParticle(this.driver, { cx: 180, cy: 140, r: 5 });
            await addParticle(this.driver, { cx: 100, cy: 200, r: 5 });
            await setMass(getParticleCircle(this.driver, 1), 100000);
            await setMass(getParticleCircle(this.driver, 2), 10);
            await getStepButton(this.driver).click();
            await getParticleCircle(this.driver, 2).click();
            expect(await getVelocityXInput(this.driver).getAttribute('value')).toBe('16');
        });

        it('velocity y', async function(this: Context) {
            await selectAddParticleAction(this.driver);
            await addParticle(this.driver, { cx: 180, cy: 140, r: 5 });
            await addParticle(this.driver, { cx: 100, cy: 200, r: 5 });
            await setMass(getParticleCircle(this.driver, 1), 100000);
            await setMass(getParticleCircle(this.driver, 2), 10);
            await getStepButton(this.driver).click();
            await getParticleCircle(this.driver, 2).click();
            expect(await getVelocityYInput(this.driver).getAttribute('value')).toBe('12');
        });
    });
});

describe('no gravity simulator', function() {
    beforeEach(setup);
    afterEach(cleanup);
    beforeEach(async function (this: Context) {
        await selectNoneGravitySimulator(this.driver);
    });

    it('position x', async function(this: Context) {
        await selectAddParticleAction(this.driver);
        await addParticle(this.driver, { cx: 180, cy: 140, r: 5 });
        await addParticle(this.driver, { cx: 100, cy: 200, r: 5 });
        await setMass(getParticleCircle(this.driver, 1), 100000);
        await setMass(getParticleCircle(this.driver, 2), 10);
        await getStepButton(this.driver).click();
        expect(await getCenterX(getParticleCircle(this.driver, 2))).toBe(100);
    });

    it('position y', async function(this: Context) {
        await selectAddParticleAction(this.driver);
        await addParticle(this.driver, { cx: 180, cy: 140, r: 5 });
        await addParticle(this.driver, { cx: 100, cy: 200, r: 5 });
        await setMass(getParticleCircle(this.driver, 1), 100000);
        await setMass(getParticleCircle(this.driver, 2), 10);
        await getStepButton(this.driver).click();
        expect(await getCenterY(getParticleCircle(this.driver, 2))).toBe(200);
    });

    it('velocity x', async function(this: Context) {
        await selectAddParticleAction(this.driver);
        await addParticle(this.driver, { cx: 180, cy: 140, r: 5 });
        await addParticle(this.driver, { cx: 100, cy: 200, r: 5 });
        await setMass(getParticleCircle(this.driver, 1), 100000);
        await setMass(getParticleCircle(this.driver, 2), 10);
        await getStepButton(this.driver).click();
        await getParticleCircle(this.driver, 2).click();
        expect(await getVelocityXInput(this.driver).getAttribute('value')).toBe('0');
    });

    it('velocity y', async function(this: Context) {
        await selectAddParticleAction(this.driver);
        await addParticle(this.driver, { cx: 180, cy: 140, r: 5 });
        await addParticle(this.driver, { cx: 100, cy: 200, r: 5 });
        await setMass(getParticleCircle(this.driver, 1), 100000);
        await setMass(getParticleCircle(this.driver, 2), 10);
        await getStepButton(this.driver).click();
        await getParticleCircle(this.driver, 2).click();
        expect(await getVelocityYInput(this.driver).getAttribute('value')).toBe('0');
    });
});
