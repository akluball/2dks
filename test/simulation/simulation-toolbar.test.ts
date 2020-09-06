import { Context, setup, cleanup } from '../context';
import { By } from 'selenium-webdriver';
import { TOOLBAR_TOGGLE_TRANSITION_MILLIS } from '../constant';
import {
    getToolbar,
    getToolbarContent,
    getToolbarToggle,
    getActionSelect,
    getUndoButton,
    getRedoButton
} from '../element-getters';
import { LEFT_ARROW, RIGHT_ARROW, UNDO, REDO } from '../symbol';
import {
    emToPixels,
    sleep,
    getLeftX,
    getParentLeftX,
    getTopY,
    getParentTopY,
    getRightX,
    getParentRightX,
    getWidth,
    getParentWidth
} from '../util';

describe('simulation toolbar component', function() {
    beforeEach(setup);
    afterEach(cleanup);

    it('left x 2em from parent left x', async function(this: Context) {
        const toolbar = getToolbar(this.driver);
        const expected = (await getParentLeftX(toolbar)) + (await emToPixels(toolbar, 2));
        expect(await getLeftX(toolbar)).toBe(expected);
    });

    it('top y 2em from parent', async function(this: Context) {
        const toolbar = getToolbar(this.driver);
        const expected = (await getParentTopY(toolbar)) + (await emToPixels(toolbar, 2));
        expect(await getTopY(toolbar)).toBe(expected);
    });

    it('right x 2em from parent', async function(this: Context) {
        const toolbar = getToolbar(this.driver);
        const expected = (await getParentLeftX(toolbar)) + (await emToPixels(toolbar, 2));
        expect(await getLeftX(toolbar)).toBe(expected);
    });

    describe('content visible', function() {
        it('content left x is parent left x', async function(this: Context) {
            const content = getToolbarContent(this.driver);
            expect(await getLeftX(content)).toBe(await getParentLeftX(content));
        });

        it('content width all but toggle width', async function(this: Context) {
            const content = getToolbarContent(this.driver);
            const toggle = getToolbarToggle(this.driver);
            const expected = (await getParentWidth(content)) - (await getWidth(toggle));
            expect(await getWidth(content)).toBe(expected);
        });

        it('content right x is toggle left x', async function(this: Context) {
            const content = getToolbarContent(this.driver);
            const toggle = getToolbarToggle(this.driver);
            expect(await getRightX(content)).toBe(await getLeftX(toggle));
        });

        it('toggle right x is parent right x', async function(this: Context) {
            const toggle = getToolbarToggle(this.driver);
            expect(await getRightX(toggle)).toBe(await getParentRightX(toggle));
        });

        it('toggle text is left arrow', async function(this: Context) {
            expect(await getToolbarToggle(this.driver).getText()).toBe(LEFT_ARROW);
        });
    });

    describe('content hidden', function() {
        it('content left x is parent left x', async function(this: Context) {
            await getToolbarToggle(this.driver).click();
            await sleep(TOOLBAR_TOGGLE_TRANSITION_MILLIS);
            const content = getToolbarContent(this.driver);
            expect(await getLeftX(content)).toBe(await getParentLeftX(content));
        });

        it('content width is border width', async function(this: Context) {
            await getToolbarToggle(this.driver).click();
            await sleep(TOOLBAR_TOGGLE_TRANSITION_MILLIS);
            const content = getToolbarContent(this.driver);
            expect(await getWidth(content)).toBe(4);
        });

        it('content right x is toggle left x', async function(this: Context) {
            const toggle = getToolbarToggle(this.driver);
            await toggle.click();
            await sleep(TOOLBAR_TOGGLE_TRANSITION_MILLIS);
            const content = getToolbarContent(this.driver);
            expect(await getRightX(content)).toBe(await getLeftX(toggle));
        });

        it('toggle text is right arrow', async function(this: Context) {
            const toggle = getToolbarToggle(this.driver);
            await toggle.click();
            await sleep(TOOLBAR_TOGGLE_TRANSITION_MILLIS);
            expect(await toggle.getText()).toBe(RIGHT_ARROW);
        });

        it('toggle click makes contents visible', async function(this: Context) {
            const toggle = getToolbarToggle(this.driver);
            await toggle.click();
            await sleep(TOOLBAR_TOGGLE_TRANSITION_MILLIS);
            await toggle.click();
            await sleep(TOOLBAR_TOGGLE_TRANSITION_MILLIS);
            expect(await toggle.getText()).toBe(LEFT_ARROW);
        });
    });

    describe('action select', async function(this: Context) {
        it('should have add particle option', async function(this: Context) {
            await getActionSelect(this.driver).findElement(By.css('option[value=add-particle]'));
        });
    });

    it('should have undo button', async function(this: Context) {
        expect(await getUndoButton(this.driver).getText()).toBe(UNDO);
    });

    it('should have redo button', async function(this: Context) {
        expect(await getRedoButton(this.driver).getText()).toBe(REDO);
    });
});
