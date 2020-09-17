import { ThenableWebDriver, Key, By, Origin, WebElementPromise } from 'selenium-webdriver';
import { getActionSelect } from './element-getters';
import { hScrollTo, Vector, DeltaVector } from './util';

const ACTIONS = {
    ADD_PARTICLE: 'add particle',
    ZOOM_PAN: 'zoom pan'
};

async function selectAction(driver: ThenableWebDriver, action: string): Promise<void> {
    const actionSelect = getActionSelect(driver);
    const keys = Object.keys(ACTIONS).map(() => Key.UP);
    for (const option of await actionSelect.findElements(By.xpath('./option'))) {
        if (await option.getText() === action) {
            break;
        }
        keys.push(Key.DOWN);
    }
    keys.push(Key.ENTER);
    await driver.actions()
                .click(actionSelect)
                .sendKeys(...keys)
                .perform();
}

export function selectAddParticleAction(driver: ThenableWebDriver): Promise<void> {
    return selectAction(driver, ACTIONS.ADD_PARTICLE);
}

export function selectZoomPanAction(driver: ThenableWebDriver): Promise<void> {
    return selectAction(driver, ACTIONS.ZOOM_PAN);
}

export function move(driver: ThenableWebDriver, { x, y }: { x: number, y: number }): Promise<void> {
    return driver.actions()
                 .move({ duration: 0, x, y })
                 .perform();
}

export function relMove(driver: ThenableWebDriver, { dx = 0, dy = 0 }: DeltaVector): Promise<void> {
    return driver.actions()
                 .move({ duration: 0, origin: Origin.POINTER, x: dx, y: dy })
                 .perform();
}

export function drag(driver: ThenableWebDriver, start: Vector, ...positions: Vector[]): Promise<void> {
    const actions = driver.actions()
                          .move({ duration: 0, ...start })
                          .press();
    for (const position of positions) {
        actions.move({ duration: 0, ...position });
    }
    return actions.release()
                  .perform();
}

export function relDrag(driver: ThenableWebDriver, start: Vector, ...deltas: DeltaVector[]): Promise<void> {
    const actions = driver.actions()
                          .move({ duration: 0, ...start })
                          .press();
    for (const { dx = 0, dy = 0 } of deltas) {
        actions.move({ duration: 0, origin: Origin.POINTER, x: dx, y: dy });
    }
    return actions.release()
                  .perform();
}

export function click(driver: ThenableWebDriver, { x = 0, y = 0 }: { x?: number, y?: number }): Promise<void> {
    return driver.actions()
                 .move({ duration: 0, x, y })
                 .click()
                 .perform();
}

export async function clickElement(element: WebElementPromise): Promise<void> {
    if (!(await element.isDisplayed())) {
        await hScrollTo(element);
    }
    await element.click();
}

export function clearAndSendKeys(driver: ThenableWebDriver, ...keys: string[]): Promise<void> {
    return driver.actions()
                 .keyDown(Key.CONTROL)
                 .sendKeys('a', Key.BACK_SPACE)
                 .keyUp(Key.CONTROL)
                 .sendKeys(...keys)
                 .perform();
}

export function chord(driver: ThenableWebDriver, ...keys: string[]): Promise<void> {
    const actions = driver.actions();
    for (const key of keys) {
        actions.keyDown(key);
    }
    for (const key of keys.reverse()) {
        actions.keyUp(key);
    }
    return actions.perform();
}

interface CircleSpec {
    cx: number;
    cy: number;
    r: number;
}

export function addParticle(driver: ThenableWebDriver, { cx, cy, r }: CircleSpec): Promise<void> {
    return driver.actions()
                 .move({ duration: 0, x: cx, y: cy })
                 .press()
                 .move({ duration: 0, origin: Origin.POINTER, x: r })
                 .release()
                 .perform();
}

export enum WheelDirection {
    UP, DOWN
}

function wheelScript(element: Element, deltaY: number, count: number) {
    for (let i = 0; i < count; i++) {
        element.dispatchEvent(new WheelEvent('wheel', { deltaY }));
    }
}

export function wheel(element: WebElementPromise, direction: WheelDirection, count = 1): Promise<void> {
    return element.getDriver()
                  .executeScript(wheelScript, element, direction === WheelDirection.UP ? -1 : 1, count);
}
