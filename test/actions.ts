import {
    ThenableWebDriver,
    Key,
    By,
    Origin,
    WebElementPromise,
    WebDriver,
    WebElement
} from 'selenium-webdriver';
import {
    getActionSelect,
    getGravitySimulatorSelect,
    getMassInput,
    getGravitationalConstantInput,
    getPositionXInput,
    getPositionYInput,
    getVelocityXInput,
    getVelocityYInput,
    getRadiusInput,
    getCollisionSimulatorSelect,
    getLastParticleCircle
} from './element-getters';
import { hScrollTo, Vector, DeltaVector } from './util';

interface OptionalVector {
    x?: number;
    y?: number;
}

enum Action {
    ADD_PARTICLE = 'add particle',
    ZOOM_PAN = 'zoom pan'
}

async function selectAction(driver: ThenableWebDriver, action: Action): Promise<void> {
    const actionSelect = getActionSelect(driver);
    const keys = Object.keys(Action).map(() => Key.UP);
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
    return selectAction(driver, Action.ADD_PARTICLE);
}

export function selectZoomPanAction(driver: ThenableWebDriver): Promise<void> {
    return selectAction(driver, Action.ZOOM_PAN);
}

enum GravitySimulator {
    INTEGRATE = 'integrate',
    NONE ='none'
}

async function selectGravitySimulator(driver: ThenableWebDriver, simulator: GravitySimulator): Promise<void> {
    const actionSelect = getGravitySimulatorSelect(driver);
    const keys = Object.keys(GravitySimulator).map(() => Key.UP);
    for (const option of await actionSelect.findElements(By.xpath('./option'))) {
        if (await option.getText() === simulator) {
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

export function selectIntegrateGravitySimulator(driver: ThenableWebDriver): Promise<void> {
    return selectGravitySimulator(driver, GravitySimulator.INTEGRATE);
}

export function selectNoneGravitySimulator(driver: ThenableWebDriver): Promise<void> {
    return selectGravitySimulator(driver, GravitySimulator.NONE);
}

enum CollisionSimulator {
    ELASTIC = 'elastic',
    NONE = 'none'
}

async function selectCollisionSimulator(driver: ThenableWebDriver, simulator: CollisionSimulator): Promise<void> {
    const actionSelect = getCollisionSimulatorSelect(driver);
    const keys = Object.keys(GravitySimulator).map(() => Key.UP);
    for (const option of await actionSelect.findElements(By.xpath('./option'))) {
        if (await option.getText() === simulator) {
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

export function selectElasticCollisionSimulator(driver: ThenableWebDriver): Promise<void> {
    return selectCollisionSimulator(driver, CollisionSimulator.ELASTIC);
}

export function selectNoneCollisionSimulator(driver: ThenableWebDriver): Promise<void> {
    return selectCollisionSimulator(driver, CollisionSimulator.NONE);
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

export function click(driver: ThenableWebDriver, { x = 0, y = 0 }: OptionalVector): Promise<void> {
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

export function clearAndSendKeys(driver: WebDriver, ...keys: string[]): Promise<void> {
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

export async function setGravitationalConstant(driver: ThenableWebDriver, gravitationalConstant: number): Promise<void> {
    await clickElement(getGravitationalConstantInput(driver));
    await clearAndSendKeys(driver, gravitationalConstant.toString(), Key.ENTER);
}

interface WebElementPromiseGetter {
    (driver: WebDriver): WebElementPromise;
}

async function getDescriptionField(particle: WebElement, getter: WebElementPromiseGetter): Promise<number> {
    await particle.click();
    const field = parseFloat(await getter(particle.getDriver()).getAttribute('value'));
    await particle.getDriver()
                  .actions()
                  .sendKeys(Key.ESCAPE)
                  .move({ duration: 0, origin: Origin.VIEWPORT })
                  .perform();
    return field;
}

function getVelocityX(particle: WebElement) {
    return getDescriptionField(particle, getVelocityXInput);
}

function getVelocityY(particle: WebElement) {
    return getDescriptionField(particle, getVelocityYInput);
}

export async function getVelocity(particle: WebElement): Promise<Vector> {
    return {
        x: await getVelocityX(particle),
        y: await getVelocityY(particle)
    };
}

async function setDescriptionField(particle: WebElementPromise,
                                   getter: WebElementPromiseGetter,
                                   value: number): Promise<void> {
    const driver = particle.getDriver();
    await particle.click();
    await getter(driver).click();
    await clearAndSendKeys(driver, value.toString(), Key.ENTER, Key.ESCAPE);
}

export function setPositionX(particle: WebElementPromise, positionX: number): Promise<void> {
    return setDescriptionField(particle, getPositionXInput, positionX);
}

export function setPositionY(particle: WebElementPromise, positionY: number): Promise<void> {
    return setDescriptionField(particle, getPositionYInput, positionY);
}

export function setVelocityX(particle: WebElementPromise, velocityX: number): Promise<void> {
    return setDescriptionField(particle, getVelocityXInput, velocityX);
}

export function setVelocityY(particle: WebElementPromise, velocityY: number): Promise<void> {
    return setDescriptionField(particle, getVelocityYInput, velocityY);
}

export function setRadius(particle: WebElementPromise, radius: number): Promise<void> {
    return setDescriptionField(particle, getRadiusInput, radius);
}

export function setMass(particle: WebElementPromise, mass: number): Promise<void> {
    return setDescriptionField(particle, getMassInput, mass);
}

export class ParticleBuilder {
    private _position = { x: 0, y: 0 };
    private _velocity: OptionalVector = {};
    private _radius = 0;
    private _mass: number |undefined;

    constructor(private driver: ThenableWebDriver) {
    }

    position({ x, y }: OptionalVector): ParticleBuilder {
        if (x !== undefined) {
            this._position.x = x;
        }
        if (y !== undefined) {
            this._position.y = y;
        }
        return this;
    }

    velocity({ x, y }: OptionalVector): ParticleBuilder {
        if (x !== undefined) {
            this._velocity.x = x;
        }
        if (y !== undefined) {
            this._velocity.y = y;
        }
        return this;

    }

    radius(radius: number): ParticleBuilder {
        this._radius = radius;
        return this;
    }

    mass(mass: number): ParticleBuilder {
        this._mass = mass;
        return this;
    }

    async build(): Promise<WebElementPromise> {
        await addParticle(this.driver, { cx: this._position.x, cy: this._position.y, r: this._radius });
        const particle = getLastParticleCircle(this.driver);
        if (this._mass !== undefined) {
            await setMass(particle, this._mass);
        }
        if (this._velocity.x !== undefined) {
            await setVelocityX(particle, this._velocity.x);
        }
        if (this._velocity.y !== undefined) {
            await setVelocityY(particle, this._velocity.y);
        }
        return particle;
    }
}
