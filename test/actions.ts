import { ThenableWebDriver, Key, By, Origin } from 'selenium-webdriver';
import { getActionSelect } from './element-getters';

export async function selectAddParticleAction(driver: ThenableWebDriver): Promise<void> {
    const actionSelect = await getActionSelect(driver);
    const keys = [];
    for (const option of await actionSelect.findElements(By.xpath('./option'))) {
        keys.push(Key.DOWN);
        if (await option.getText() === 'add particle') {
            break;
        }
    }
    keys.push(Key.ENTER);
    await driver.actions()
                .click(actionSelect)
                .sendKeys(...keys)
                .perform();
}

export function move(driver: ThenableWebDriver, { x, y }: { x: number, y: number }): Promise<void> {
    return driver.actions()
                 .move({ duration: 0, origin: Origin.VIEWPORT, x, y })
                 .perform();
}

export function relativeMove(driver: ThenableWebDriver, { x = 0, y = 0 }: { x?: number, y?: number }): Promise<void> {
    return driver.actions()
                 .move({ duration: 0, origin: Origin.POINTER, x, y })
                 .perform();
}

export function click(driver: ThenableWebDriver, { x = 0, y = 0 }: { x?: number, y?: number }): Promise<void> {
    return driver.actions()
                 .move({ duration: 0, origin: Origin.VIEWPORT, x, y })
                 .click()
                 .perform();
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
                 .move({ duration: 0, origin: Origin.VIEWPORT, x: cx, y: cy })
                 .press()
                 .move({ duration: 0, origin: Origin.POINTER, x: r })
                 .release()
                 .perform();
}
