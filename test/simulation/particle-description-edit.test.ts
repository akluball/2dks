import { Key } from 'selenium-webdriver';
import { Context, setup, cleanup } from '../context';
import {
    selectAddParticleAction,
    addParticle,
    click,
    clearAndSendKeys
} from '../actions';
import {
    getPositionXInput,
    getParticleDescription,
    getParticleCircle,
    getPositionYInput,
    getRadiusInput,
    getVelocityXInput,
    getStepButton,
    getVelocityYInput
} from '../element-getters';
import {
    getLeftX,
    getCenterX,
    getCenterY,
    getWidth
} from '../util';

describe('particle description edit', function() {
    beforeEach(setup);
    afterEach(cleanup);

    describe ('position x', function() {
        it('starts as circle center x', async function(this: Context) {
            await selectAddParticleAction(this.driver);
            await addParticle(this.driver, { cx: 200, cy: 200, r: 5 });
            await click(this.driver, { x: 200, y: 200 });
            expect(await getPositionXInput(this.driver).getAttribute('value')).toBe('200');
        });

        it('moves circle', async function(this: Context) {
            await selectAddParticleAction(this.driver);
            await addParticle(this.driver, { cx: 200, cy: 200, r: 5 });
            await click(this.driver, { x: 200, y: 200 });
            await getPositionXInput(this.driver).click();
            await clearAndSendKeys(this.driver, '20', Key.ENTER);
            expect(await getCenterX(getParticleCircle(this.driver))).toBe(20);
        });

        it('updates input value', async function(this: Context) {
            await selectAddParticleAction(this.driver);
            await addParticle(this.driver, { cx: 200, cy: 200, r: 5 });
            await click(this.driver, { x: 200, y: 200 });
            await getPositionXInput(this.driver).click();
            await clearAndSendKeys(this.driver, '20', Key.ENTER);
            expect(await getPositionXInput(this.driver).getAttribute('value')).toBe('20');
        });

        it('moves description', async function(this: Context) {
            await selectAddParticleAction(this.driver);
            await addParticle(this.driver, { cx: 200, cy: 200, r: 5 });
            await click(this.driver, { x: 200, y: 200 });
            await getPositionXInput(this.driver).click();
            await clearAndSendKeys(this.driver, '210', Key.ENTER);
            expect(await getLeftX(getParticleDescription(this.driver))).toBe(215);
        });

        it('resets when blurred', async function(this: Context) {
            await selectAddParticleAction(this.driver);
            await addParticle(this.driver, { cx: 200, cy: 200, r: 5 });
            await click(this.driver, { x: 200, y: 200 });
            await getPositionXInput(this.driver).click();
            await clearAndSendKeys(this.driver, '210');
            await getPositionYInput(this.driver).click();
            expect(await getPositionXInput(this.driver).getAttribute('value')).toBe('200');
        });

        it('to nonnumber', async function(this: Context) {
            await selectAddParticleAction(this.driver);
            await addParticle(this.driver, { cx: 200, cy: 200, r: 5 });
            await click(this.driver, { x: 200, y: 200 });
            await getPositionXInput(this.driver).click();
            await clearAndSendKeys(this.driver, 'abc', Key.ENTER);
            expect(await getCenterX(getParticleCircle(this.driver))).toBe(200);
            expect(await getPositionXInput(this.driver).getAttribute('value')).toBe('200');
        });

        it('to overlapping', async function(this: Context) {
            await selectAddParticleAction(this.driver);
            await addParticle(this.driver, { cx: 200, cy: 200, r: 5 });
            await addParticle(this.driver, { cx: 189, cy: 200, r: 5 });
            await click(this.driver, { x: 200, y: 200 });
            await getPositionXInput(this.driver).click();
            await clearAndSendKeys(this.driver, '199', Key.ENTER);
            expect(await getCenterX(getParticleCircle(this.driver))).toBe(200);
            expect(await getPositionXInput(this.driver).getAttribute('value')).toBe('200');
        });
    });

    describe('position y', function() {
        it('starts as circle center', async function(this: Context) {
            await selectAddParticleAction(this.driver);
            await addParticle(this.driver, { cx: 200, cy: 200, r: 5 });
            await click(this.driver, { x: 200, y: 200 });
            expect(await getPositionYInput(this.driver).getAttribute('value')).toBe(`${this.height - 200}`);
        });

        it('moves circle', async function(this: Context) {
            await selectAddParticleAction(this.driver);
            await addParticle(this.driver, { cx: 200, cy: 200, r: 5 });
            await click(this.driver, { x: 200, y: 200 });
            await getPositionYInput(this.driver).click();
            await clearAndSendKeys(this.driver, '210', Key.ENTER);
            expect(await getCenterY(getParticleCircle(this.driver))).toBe(this.height - 210);
        });

        it('updates input values', async function(this: Context) {
            await selectAddParticleAction(this.driver);
            await addParticle(this.driver, { cx: 200, cy: 200, r: 5 });
            await click(this.driver, { x: 200, y: 200 });
            await getPositionYInput(this.driver).click();
            await clearAndSendKeys(this.driver, '210', Key.ENTER);
            expect(await getPositionYInput(this.driver).getAttribute('value')).toBe('210');
        });

        it('resets when blurred', async function(this: Context) {
            await selectAddParticleAction(this.driver);
            await addParticle(this.driver, { cx: 200, cy: 200, r: 5 });
            await click(this.driver, { x: 200, y: 200 });
            await getPositionYInput(this.driver).click();
            await clearAndSendKeys(this.driver, `${this.height - 210}`);
            await getPositionXInput(this.driver).click();
            expect(await getPositionYInput(this.driver).getAttribute('value')).toBe(`${this.height - 200}`);
        });

        it('to nonnumber', async function(this: Context) {
            await selectAddParticleAction(this.driver);
            await addParticle(this.driver, { cx: 200, cy: 200, r: 5 });
            await click(this.driver, { x: 200, y: 200 });
            await getPositionYInput(this.driver).click();
            await clearAndSendKeys(this.driver, 'abc', Key.ENTER);
            expect(await getCenterY(getParticleCircle(this.driver))).toBe(200);
            expect(await getPositionYInput(this.driver).getAttribute('value')).toBe(`${this.height - 200}`);
        });

        it('to overlapping', async function(this: Context) {
            await selectAddParticleAction(this.driver);
            await addParticle(this.driver, { cx: 200, cy: 200, r: 5 });
            await addParticle(this.driver, { cx: 200, cy: 211, r: 5 });
            await click(this.driver, { x: 200, y: 200 });
            await getPositionYInput(this.driver).click();
            await clearAndSendKeys(this.driver, `${this.height - 201}`, Key.ENTER);
            expect(await getCenterY(getParticleCircle(this.driver))).toBe(200);
            expect(await getPositionYInput(this.driver).getAttribute('value')).toBe(`${this.height - 200}`);
        });

    });

    describe('radius', function() {
        it('starts as circle radius', async function(this: Context) {
            await selectAddParticleAction(this.driver);
            await addParticle(this.driver, { cx: 200, cy: 200, r: 5 });
            await click(this.driver, { x: 200, y: 200 });
            expect(await getRadiusInput(this.driver).getAttribute('value')).toBe('5');
        });

        it('changes circle radius', async function(this: Context) {
            await selectAddParticleAction(this.driver);
            await addParticle(this.driver, { cx: 200, cy: 200, r: 5 });
            await click(this.driver, { x: 200, y: 200 });
            await getRadiusInput(this.driver).click();
            await clearAndSendKeys(this.driver, '10', Key.ENTER);
            expect(await getWidth(getParticleCircle(this.driver))).toBe(20);
        });

        it('updates input value', async function(this: Context) {
            await selectAddParticleAction(this.driver);
            await addParticle(this.driver, { cx: 200, cy: 200, r: 5 });
            await click(this.driver, { x: 200, y: 200 });
            await getRadiusInput(this.driver).click();
            await clearAndSendKeys(this.driver, '10', Key.ENTER);
            expect(await getRadiusInput(this.driver).getAttribute('value')).toBe('10');
        });

        it('reset when blurred', async function(this: Context) {
            await selectAddParticleAction(this.driver);
            await addParticle(this.driver, { cx: 200, cy: 200, r: 5 });
            await click(this.driver, { x: 200, y: 200 });
            await getRadiusInput(this.driver).click();
            await clearAndSendKeys(this.driver, '10');
            await getPositionXInput(this.driver).click();
            expect(await getRadiusInput(this.driver).getAttribute('value')).toBe('5');
        });

        it('to nonnumber', async function(this: Context) {
            await selectAddParticleAction(this.driver);
            await addParticle(this.driver, { cx: 200, cy: 200, r: 5 });
            await click(this.driver, { x: 200, y: 200 });
            await getRadiusInput(this.driver).click();
            await clearAndSendKeys(this.driver, 'abc', Key.ENTER);
            expect(await getWidth(getParticleCircle(this.driver))).toBe(10);
            expect(await getRadiusInput(this.driver).getAttribute('value')).toBe('5');
        });

        it('to overlapping', async function(this: Context) {
            await selectAddParticleAction(this.driver);
            await addParticle(this.driver, { cx: 200, cy: 200, r: 5 });
            await addParticle(this.driver, { cx: 185, cy: 200, r: 5 });
            await click(this.driver, { x: 200, y: 200 });
            await getRadiusInput(this.driver).click();
            await clearAndSendKeys(this.driver, '10', Key.ENTER);
            expect(await getWidth(getParticleCircle(this.driver))).toBe(10);
            expect(await getRadiusInput(this.driver).getAttribute('value')).toBe('5');
        });

        it('to overlapping using negative radius', async function(this: Context) {
            await selectAddParticleAction(this.driver);
            await addParticle(this.driver, { cx: 200, cy: 200, r: 5 });
            await addParticle(this.driver, { cx: 185, cy: 200, r: 5 });
            await click(this.driver, { x: 200, y: 200 });
            await getRadiusInput(this.driver).click();
            await clearAndSendKeys(this.driver, '-10', Key.ENTER);
            expect(await getWidth(getParticleCircle(this.driver))).toBe(10);
            expect(await getRadiusInput(this.driver).getAttribute('value')).toBe('5');
        });

        it('to 0', async function(this: Context) {
            await selectAddParticleAction(this.driver);
            await addParticle(this.driver, { cx: 200, cy: 200, r: 5 });
            await click(this.driver, { x: 200, y: 200 });
            await getRadiusInput(this.driver).click();
            await clearAndSendKeys(this.driver, '0', Key.ENTER);
            expect(await getWidth(getParticleCircle(this.driver))).toBe(10);
            expect(await getRadiusInput(this.driver).getAttribute('value')).toBe('5');
        });
    });

    describe('velocity x', function() {
        it('starts as 0', async function(this: Context) {
            await selectAddParticleAction(this.driver);
            await addParticle(this.driver, { cx: 200, cy: 200, r: 5 });
            await click(this.driver, { x: 200, y: 200 });
            expect(await getVelocityXInput(this.driver).getAttribute('value')).toBe('0');
        });

        it('changes particle velocity', async function(this: Context) {
            await selectAddParticleAction(this.driver);
            await addParticle(this.driver, { cx: 200, cy: 200, r: 5 });
            await click(this.driver, { x: 200, y: 200 });
            await getVelocityXInput(this.driver).click();
            await clearAndSendKeys(this.driver, '5', Key.ENTER);
            await getStepButton(this.driver).click();
            expect(await getCenterX(getParticleCircle(this.driver))).toBe(205);
        });

        it('updates input value', async function(this: Context) {
            await selectAddParticleAction(this.driver);
            await addParticle(this.driver, { cx: 200, cy: 200, r: 5 });
            await click(this.driver, { x: 200, y: 200 });
            await getVelocityXInput(this.driver).click();
            await clearAndSendKeys(this.driver, '5', Key.ENTER);
            await getStepButton(this.driver).click();
            await click(this.driver, { x: 200, y: 200 });
            expect(await getVelocityXInput(this.driver).getAttribute('value')).toBe('5');
        });

        it('reset when blurred', async function(this: Context) {
            await selectAddParticleAction(this.driver);
            await addParticle(this.driver, { cx: 200, cy: 200, r: 5 });
            await click(this.driver, { x: 200, y: 200 });
            await getVelocityXInput(this.driver);
            await clearAndSendKeys(this.driver, '5');
            await getVelocityYInput(this.driver).click();
            expect(await getVelocityXInput(this.driver).getAttribute('value')).toBe('0');
        });

        it('to nonnumber', async function(this: Context) {
            await selectAddParticleAction(this.driver);
            await addParticle(this.driver, { cx: 200, cy: 200, r: 5 });
            await click(this.driver, { x: 200, y: 200 });
            await getVelocityXInput(this.driver).click();
            await clearAndSendKeys(this.driver, 'abc', Key.ENTER);
            expect(await getVelocityXInput(this.driver).getAttribute('value')).toBe('0');
        });
    });

    describe('velocity y', function() {
        it('velocity y starts as 0', async function(this: Context) {
            await selectAddParticleAction(this.driver);
            await addParticle(this.driver, { cx: 200, cy: 200, r: 5 });
            await click(this.driver, { x: 200, y: 200 });
            expect(await getVelocityYInput(this.driver).getAttribute('value')).toBe('0');
        });

        it('changes particle velocity', async function(this: Context) {
            await selectAddParticleAction(this.driver);
            await addParticle(this.driver, { cx: 200, cy: 200, r: 5 });
            await click(this.driver, { x: 200, y: 200 });
            await getVelocityYInput(this.driver).click();
            await clearAndSendKeys(this.driver, '5', Key.ENTER);
            await getStepButton(this.driver).click();
            expect(await getCenterY(getParticleCircle(this.driver))).toBe(195);
        });

        it('updates input value', async function(this: Context) {
            await selectAddParticleAction(this.driver);
            await addParticle(this.driver, { cx: 200, cy: 200, r: 5 });
            await click(this.driver, { x: 200, y: 200 });
            await getVelocityYInput(this.driver).click();
            await clearAndSendKeys(this.driver, '5', Key.ENTER);
            await getStepButton(this.driver).click();
            await click(this.driver, { x: 200, y: 200 });
            expect(await getVelocityYInput(this.driver).getAttribute('value')).toBe('5');
        });

        it('reset when blurred', async function(this: Context) {
            await selectAddParticleAction(this.driver);
            await addParticle(this.driver, { cx: 200, cy: 200, r: 5 });
            await click(this.driver, { x: 200, y: 200 });
            await getVelocityYInput(this.driver).click();
            await clearAndSendKeys(this.driver, '5');
            await getVelocityXInput(this.driver).click();
            expect(await getVelocityYInput(this.driver).getAttribute('value')).toBe('0');
        });

        it('to nonnumber', async function(this: Context) {
            await selectAddParticleAction(this.driver);
            await addParticle(this.driver, { cx: 200, cy: 200, r: 5 });
            await click(this.driver, { x: 200, y: 200 });
            await getVelocityYInput(this.driver).click();
            await clearAndSendKeys(this.driver, 'abc', Key.ENTER);
            expect(await getVelocityYInput(this.driver).getAttribute('value')).toBe('0');
        });
    });
});
