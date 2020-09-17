import { By } from 'selenium-webdriver';
import { Context, setup, cleanup } from '../context';
import { addParticle, relDrag, clickElement, move } from '../actions';
import { toggle_TRANSITION_MILLIS } from '../constant';
import {
    getToolbar,
    getToolbarContent,
    getToolbarToggle,
    getActionSelect,
    getUndoButton,
    getRedoButton,
    getStepButton,
    getGridToggle,
    getBody,
    getParticleCircles,
    getMouseTrackerToggle,
    getMouseTracker,
    getMouseTrackers
} from '../element-getters';
import {
    LEFT_ARROW,
    RIGHT_ARROW,
    UNDO,
    REDO,
    STEP
} from '../symbol';
import {
    emToPixels,
    sleep,
    getLeftX,
    getParentLeftX,
    getTopY,
    getBottomY,
    getParentTopY,
    getRightX,
    getParentRightX,
    getWidth,
    getParentWidth,
    resizeBody,
    count,
    getParent,
    getTopRight
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

    describe('visible', function() {
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

    describe('hidden', function() {
        it('content left x is parent left x', async function(this: Context) {
            await getToolbarToggle(this.driver).click();
            await sleep(toggle_TRANSITION_MILLIS);
            const content = getToolbarContent(this.driver);
            expect(await getLeftX(content)).toBe(await getParentLeftX(content));
        });

        it('content width is border width', async function(this: Context) {
            await getToolbarToggle(this.driver).click();
            await sleep(toggle_TRANSITION_MILLIS);
            expect(await getWidth(getToolbarContent(this.driver))).toBe(4);
        });

        it('content right x is toggle left x', async function(this: Context) {
            const toggle = getToolbarToggle(this.driver);
            await toggle.click();
            await sleep(toggle_TRANSITION_MILLIS);
            const content = getToolbarContent(this.driver);
            expect(await getRightX(content)).toBe(await getLeftX(toggle));
        });

        it('toggle text is right arrow', async function(this: Context) {
            const toggle = getToolbarToggle(this.driver);
            await toggle.click();
            await sleep(toggle_TRANSITION_MILLIS);
            expect(await toggle.getText()).toBe(RIGHT_ARROW);
        });

        it('toggle click makes contents visible', async function(this: Context) {
            const toggle = getToolbarToggle(this.driver);
            await toggle.click();
            await sleep(toggle_TRANSITION_MILLIS);
            await toggle.click();
            await sleep(toggle_TRANSITION_MILLIS);
            expect(await toggle.getText()).toBe(LEFT_ARROW);
        });
    });

    it('content draggable', async function(this: Context) {
        const content = getToolbarContent(this.driver);
        const width = await getWidth(getBody(this.driver)) - await getWidth(content) + 10;
        await resizeBody(this.driver, `${width}px`);
        await relDrag(this.driver,
                      { x: await getRightX(content) - 1, y: await getBottomY(content) - 1 },
                      { dx: -8 });
        expect(await content.getAttribute('scrollLeft')).toBe('8');
    });

    it('content draggable until leave', async function(this: Context) {
        const content = getToolbarContent(this.driver);
        const width = await getWidth(getBody(this.driver)) - await getWidth(content) + 10;
        await resizeBody(this.driver, `${width}px`);
        await relDrag(this.driver,
                      { x: await getRightX(content) - 1, y: await getBottomY(content) - 1 },
                      { dx: -4 },
                      { dy: 2 },
                      { dx: -4 },
                      { dy: -2 });
        expect(await content.getAttribute('scrollLeft')).toBe('4');
    });

    describe('action select', async function(this: Context) {
        it('defaults to add particle option', async function(this: Context) {
            await addParticle(this.driver, { cx: 200, cy: 200, r: 5 });
            expect(await count(getParticleCircles(this.driver))).toBe(1);
        });

        it('add particle option', async function(this: Context) {
            const addParticle = await getActionSelect(this.driver).findElement(By.css('option[value=add-particle]'));
            expect(await addParticle.getText()).toBe('add particle');
        });

        it('zoom/pan option', async function(this: Context) {
            const zoomPan = await getActionSelect(this.driver).findElement(By.css('option[value=zoom-pan]'));
            expect(await zoomPan.getText()).toBe('zoom/pan');
        });
    });

    it('undo button', async function(this: Context) {
        expect(await getUndoButton(this.driver).getText()).toBe(UNDO);
    });

    it('redo button', async function(this: Context) {
        expect(await getRedoButton(this.driver).getText()).toBe(REDO);
    });

    it('step button', async function(this: Context) {
        expect(await getStepButton(this.driver).getText()).toBe(STEP);
    });

    it('grid toggle', async function(this: Context) {
        expect(await getGridToggle(this.driver).getText()).toBe('grid');
    });

    describe('mouse tracker toggle', function() {
        it('text', async function(this: Context) {
            expect(await getMouseTrackerToggle(this.driver).getText()).toBe('tracker');
        });

        it('initially off', async function(this: Context) {
            expect(await count(getMouseTrackers(this.driver))).toBe(0);
        });

        it('gray when off', async function(this: Context) {
            expect(await getMouseTrackerToggle(this.driver).getCssValue('color')).toBe('rgba(128, 128, 128, 1)');
        });

        it('black when on', async function(this: Context) {
            const toggle = getMouseTrackerToggle(this.driver);
            await clickElement(toggle);
            expect(await toggle.getCssValue('color')).toBe('rgba(0, 0, 0, 1)');
        });

        it('at top right corner of simulation', async function(this: Context) {
            await clickElement(getMouseTrackerToggle(this.driver));
            const mouseTracker = getMouseTracker(this.driver);
            expect(await getTopRight(mouseTracker)).toEqual(await getTopRight(getParent(mouseTracker)));
        });

        it('at top right corner of simulation', async function(this: Context) {
            await clickElement(getMouseTrackerToggle(this.driver));
            await move(this.driver, { x: 200, y: 200 });
            expect(await getMouseTracker(this.driver).getText()).toBe(`(200,${this.height - 200})`);
        });
    });
});
