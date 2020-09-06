import { By } from 'selenium-webdriver';
import { Key } from 'selenium-webdriver/lib/input';
import {
    addParticle,
    click,
    move,
    relativeMove,
    selectAddParticleAction,
    clearAndSendKeys
} from '../actions';
import { Context, setup, cleanup } from '../context';
import {
    getParticleDescription,
    getParticleDescriptions,
    getParticleDescriptionInputs,
    getParticleCircle,
    getToolbar,
    getParticleDescriptionInput
} from '../element-getters';
import {
    getLeftX,
    getTopY,
    getCenterX,
    getCenterY,
    getWidth,
    count,
    getActiveElement
} from '../util';

describe('particle description', function() {
    beforeEach(setup);
    afterEach(cleanup);

    describe('exists when', function() {
        it('circle hovered', async function(this: Context) {
            await selectAddParticleAction(this.driver);
            await addParticle(this.driver, { cx: 200, cy: 200, r: 5 });
            await move(this.driver, { x: 205, y: 200 });
            await getParticleDescription(this.driver);
        });

        it('description hovered', async function(this: Context) {
            await selectAddParticleAction(this.driver);
            await addParticle(this.driver, { cx: 200, cy: 200, r: 5 });
            await move(this.driver, { x: 204, y: 200 });
            await relativeMove(this.driver, { x: 2 });
            await getParticleDescription(this.driver);
        });

        it('circle focused', async function(this: Context) {
            await selectAddParticleAction(this.driver);
            await addParticle(this.driver, { cx: 200, cy: 200, r: 5 });
            await click(this.driver, { x: 200, y: 200 });
            await move(this.driver, { x: 0, y: 0 });
            await getParticleDescription(this.driver);
        });

        it('description focused', async function(this: Context) {
            await selectAddParticleAction(this.driver);
            await addParticle(this.driver, { cx: 200, cy: 200, r: 5 });
            await click(this.driver, { x: 200, y: 200 });
            await click(this.driver, { x: 206, y: 200 });
            await move(this.driver, { x: 0, y: 0 });
            await getParticleDescription(this.driver);
        });
    });

    it('does not exist when circle/description not hovered/focused', async function(this: Context) {
        await selectAddParticleAction(this.driver);
        await addParticle(this.driver, { cx: 200, cy: 200, r: 5 });
        await move(this.driver, { x: 194, y: 200 });
        expect(await count(getParticleDescriptions(this.driver))).toBe(0);
    });

    it('circle, description, description input clicks', async function(this: Context) {
        await selectAddParticleAction(this.driver);
        await addParticle(this.driver, { cx: 200, cy: 200, r: 5 });
        await click(this.driver, { x: 200, y: 200, });
        await getParticleDescription(this.driver).click();
        await getParticleDescriptionInput(this.driver).click();
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
        const description = getParticleDescription(this.driver);
        const header = (await description.findElements(By.css('table>tr>th')))[0];
        expect(await header.getText()).toBe('position');
    });

    it('radius field', async function(this: Context) {
        await selectAddParticleAction(this.driver);
        await addParticle(this.driver, { cx: 200, cy: 200, r: 5 });
        await move(this.driver, { x: 200, y: 200 });
        const description = getParticleDescription(this.driver);
        const header = (await description.findElements(By.css('table>tr>th')))[1];
        expect(await header.getText()).toBe('radius');
    });

    it('moves with circle', async function(this: Context) {
        await selectAddParticleAction(this.driver);
        await addParticle(this.driver, { cx: 200, cy: 200, r: 5 });
        await click(this.driver, { x: 200, y: 200 });
        const input = (await getParticleDescriptionInputs(this.driver))[0];
        await input.click();
        await clearAndSendKeys(this.driver, '210', Key.ENTER);
        expect(await getLeftX(getParticleDescription(this.driver))).toBe(215);
    });

    describe('hovered not focused', function() {
        it('position is circle center', async function(this: Context) {
            await selectAddParticleAction(this.driver);
            await addParticle(this.driver, { cx: 200, cy: 200, r: 5 });
            await move(this.driver, { x: 200, y: 200 });
            const description = getParticleDescription(this.driver);
            const position = (await description.findElements(By.css('table>tr>td')))[0];
            expect(await position.getText()).toBe(`(200, ${this.height - 200})`);
        });

        it('radius is circle radius', async function(this: Context) {
            await selectAddParticleAction(this.driver);
            await addParticle(this.driver, { cx: 200, cy: 200, r: 5 });
            await move(this.driver, { x: 200, y: 200 });
            const description = getParticleDescription(this.driver);
            const val = (await description.findElements(By.css('table>tr>td')))[1];
            expect(await val.getText()).toBe('5');
        });
    });

    describe('focused', function() {
        it('position x is circle center x', async function(this: Context) {
            await selectAddParticleAction(this.driver);
            await addParticle(this.driver, { cx: 200, cy: 200, r: 5 });
            await click(this.driver, { x: 200, y: 200 });
            const input = (await getParticleDescriptionInputs(this.driver))[0];
            expect(await input.getAttribute('value')).toBe('200');
        });

        it('set position x', async function(this: Context) {
            await selectAddParticleAction(this.driver);
            await addParticle(this.driver, { cx: 200, cy: 200, r: 5 });
            await click(this.driver, { x: 200, y: 200 });
            const input = (await getParticleDescriptionInputs(this.driver))[0];
            await input.click();
            await clearAndSendKeys(this.driver, '20', Key.ENTER);
            expect(await getCenterX(getParticleCircle(this.driver))).toBe(20);
            expect(await input.getAttribute('value')).toBe('20');
        });

        it('position x input reset when blurred', async function(this: Context) {
            await selectAddParticleAction(this.driver);
            await addParticle(this.driver, { cx: 200, cy: 200, r: 5 });
            await click(this.driver, { x: 200, y: 200 });
            const inputs = await getParticleDescriptionInputs(this.driver);
            await inputs[0].click();
            await clearAndSendKeys(this.driver, '210');
            await inputs[1].click();
            expect(await inputs[0].getAttribute('value')).toBe('200');
        });

        it('set position x to nonnumber', async function(this: Context) {
            await selectAddParticleAction(this.driver);
            await addParticle(this.driver, { cx: 200, cy: 200, r: 5 });
            await click(this.driver, { x: 200, y: 200 });
            const input = (await getParticleDescriptionInputs(this.driver))[0];
            await input.click();
            await clearAndSendKeys(this.driver, 'abc', Key.ENTER);
            expect(await getCenterX(getParticleCircle(this.driver))).toBe(200);
            expect(await input.getAttribute('value')).toBe('200');
        });

        it('set position x to overlapping', async function(this: Context) {
            await selectAddParticleAction(this.driver);
            await addParticle(this.driver, { cx: 200, cy: 200, r: 5 });
            await addParticle(this.driver, { cx: 189, cy: 200, r: 5 });
            await click(this.driver, { x: 200, y: 200 });
            const input = (await getParticleDescriptionInputs(this.driver))[0];
            await input.click();
            await clearAndSendKeys(this.driver, '199', Key.ENTER);
            expect(await getCenterX(getParticleCircle(this.driver))).toBe(200);
            expect(await input.getAttribute('value')).toBe('200');
        });

        it('position y is circle center y', async function(this: Context) {
            await selectAddParticleAction(this.driver);
            await addParticle(this.driver, { cx: 200, cy: 200, r: 5 });
            await click(this.driver, { x: 200, y: 200 });
            const input = (await getParticleDescriptionInputs(this.driver))[1];
            expect(await input.getAttribute('value')).toBe(`${this.height - 200}`);
        });

        it('set position y', async function(this: Context) {
            await selectAddParticleAction(this.driver);
            await addParticle(this.driver, { cx: 200, cy: 200, r: 5 });
            await click(this.driver, { x: 200, y: 200 });
            const input = (await getParticleDescriptionInputs(this.driver))[1];
            await input.click();
            await clearAndSendKeys(this.driver, '210', Key.ENTER);
            expect(await getCenterY(getParticleCircle(this.driver))).toBe(this.height - 210);
            expect(await input.getAttribute('value')).toBe('210');
        });

        it('position y input reset when blurred', async function(this: Context) {
            await selectAddParticleAction(this.driver);
            await addParticle(this.driver, { cx: 200, cy: 200, r: 5 });
            await click(this.driver, { x: 200, y: 200 });
            const inputs = await getParticleDescriptionInputs(this.driver);
            await inputs[1].click();
            await clearAndSendKeys(this.driver, `${this.height - 210}`);
            await inputs[0].click();
            expect(await inputs[1].getAttribute('value')).toBe(`${this.height - 200}`);
        });

        it('set position y to nonnumber', async function(this: Context) {
            await selectAddParticleAction(this.driver);
            await addParticle(this.driver, { cx: 200, cy: 200, r: 5 });
            await click(this.driver, { x: 200, y: 200 });
            const input = (await getParticleDescriptionInputs(this.driver))[1];
            await input.click();
            await clearAndSendKeys(this.driver, 'abc', Key.ENTER);
            expect(await getCenterY(getParticleCircle(this.driver))).toBe(200);
            expect(await input.getAttribute('value')).toBe(`${this.height - 200}`);
        });

        it('set position y to overlapping', async function(this: Context) {
            await selectAddParticleAction(this.driver);
            await addParticle(this.driver, { cx: 200, cy: 200, r: 5 });
            await addParticle(this.driver, { cx: 200, cy: 211, r: 5 });
            await click(this.driver, { x: 200, y: 200 });
            const input = (await getParticleDescriptionInputs(this.driver))[1];
            await input.click();
            await clearAndSendKeys(this.driver, `${this.height - 201}`, Key.ENTER);
            expect(await getCenterY(getParticleCircle(this.driver))).toBe(200);
            expect(await input.getAttribute('value')).toBe(`${this.height - 200}`);
        });

        it('radius is circle radius', async function(this: Context) {
            await selectAddParticleAction(this.driver);
            await addParticle(this.driver, { cx: 200, cy: 200, r: 5 });
            await click(this.driver, { x: 200, y: 200 });
            const input = (await getParticleDescriptionInputs(this.driver))[2];
            expect(await input.getAttribute('value')).toBe('5');
        });

        it('set radius', async function(this: Context) {
            await selectAddParticleAction(this.driver);
            await addParticle(this.driver, { cx: 200, cy: 200, r: 5 });
            await click(this.driver, { x: 200, y: 200 });
            const input = (await getParticleDescriptionInputs(this.driver))[2];
            await input.click();
            await clearAndSendKeys(this.driver, '10', Key.ENTER);
            expect(await getWidth(getParticleCircle(this.driver))).toBe(20);
            expect(await input.getAttribute('value')).toBe('10');
        });

        it('radius input reset when blurred', async function(this: Context) {
            await selectAddParticleAction(this.driver);
            await addParticle(this.driver, { cx: 200, cy: 200, r: 5 });
            await click(this.driver, { x: 200, y: 200 });
            const inputs = await getParticleDescriptionInputs(this.driver);
            await inputs[2].click();
            await clearAndSendKeys(this.driver, '10');
            await inputs[0].click();
            expect(await inputs[2].getAttribute('value')).toBe('5');
        });

        it('set radius to nonnumber', async function(this: Context) {
            await selectAddParticleAction(this.driver);
            await addParticle(this.driver, { cx: 200, cy: 200, r: 5 });
            await click(this.driver, { x: 200, y: 200 });
            const input = (await getParticleDescriptionInputs(this.driver))[2];
            await input.click();
            await clearAndSendKeys(this.driver, 'abc', Key.ENTER);
            expect(await getWidth(getParticleCircle(this.driver))).toBe(10);
            expect(await input.getAttribute('value')).toBe('5');
        });

        it('set radius to overlapping', async function(this: Context) {
            await selectAddParticleAction(this.driver);
            await addParticle(this.driver, { cx: 200, cy: 200, r: 5 });
            await addParticle(this.driver, { cx: 185, cy: 200, r: 5 });
            await click(this.driver, { x: 200, y: 200 });
            const input = (await getParticleDescriptionInputs(this.driver))[2];
            await input.click();
            await clearAndSendKeys(this.driver, '10', Key.ENTER);
            expect(await getWidth(getParticleCircle(this.driver))).toBe(10);
            expect(await input.getAttribute('value')).toBe('5');
        });

        it('prevent overlaps from negative radius input', async function(this: Context) {
            await selectAddParticleAction(this.driver);
            await addParticle(this.driver, { cx: 200, cy: 200, r: 5 });
            await addParticle(this.driver, { cx: 185, cy: 200, r: 5 });
            await click(this.driver, { x: 200, y: 200 });
            const input = (await getParticleDescriptionInputs(this.driver))[2];
            await input.click();
            await clearAndSendKeys(this.driver, '-10', Key.ENTER);
            expect(await getWidth(getParticleCircle(this.driver))).toBe(10);
            expect(await input.getAttribute('value')).toBe('5');
        });

        it('prevent setting radius to zero', async function(this: Context) {
            await selectAddParticleAction(this.driver);
            await addParticle(this.driver, { cx: 200, cy: 200, r: 5 });
            await click(this.driver, { x: 200, y: 200 });
            const input = (await getParticleDescriptionInputs(this.driver))[2];
            await input.click();
            await clearAndSendKeys(this.driver, '0', Key.ENTER);
            expect(await getWidth(getParticleCircle(this.driver))).toBe(10);
            expect(await input.getAttribute('value')).toBe('5');
        });
    });
});
