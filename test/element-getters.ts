import { ThenableWebDriver, By, WebElement, WebElementPromise, Locator, WebDriver } from 'selenium-webdriver';

export function getBody(driver: ThenableWebDriver): WebElementPromise {
    return driver.findElement(By.css('body'));
}

export function getApp(driver: ThenableWebDriver): WebElementPromise {
    return driver.findElement(By.css('app'));
}

export function getSimulation(driver: ThenableWebDriver): WebElementPromise {
    return driver.findElement(By.css('simulation'));
}

export function getSvg(driver: ThenableWebDriver): WebElementPromise {
    return driver.findElement(By.css('simulation > svg'));
}

export function getToolbar(driver: ThenableWebDriver): WebElementPromise {
    return driver.findElement(By.css('simulation > toolbar'));
}

export function getToolbarContent(driver: ThenableWebDriver): WebElementPromise {
    return driver.findElement(By.css('simulation > toolbar > .content'));
}

export function getToolbarToggle(driver: ThenableWebDriver): WebElementPromise {
    return driver.findElement(By.css('simulation > toolbar > .toggle'));
}

function toolbarSelect(i: number): Locator {
    return By.css(`simulation > toolbar > .content > select:nth-of-type(${i})`);
}

export function getActionSelect(driver: ThenableWebDriver): WebElementPromise {
    return driver.findElement(toolbarSelect(1));
}

export function getGravitySimulatorSelect(driver: ThenableWebDriver): WebElementPromise {
    return driver.findElement(toolbarSelect(2));
}

export function getGravitationalConstantInput(driver: ThenableWebDriver): WebElementPromise {
    return driver.findElement(By.css('simulation > toolbar > .content > number-edit > input'));
}

export function getCollisionSimulatorSelect(driver: ThenableWebDriver): WebElementPromise {
    return driver.findElement(toolbarSelect(3));
}

function toolbarButton(i: number): Locator {
    return By.css(`simulation > toolbar > .content > button:nth-of-type(${i})`);
}

export function getUndoButton(driver: ThenableWebDriver): WebElementPromise {
    return driver.findElement(toolbarButton(1));
}

export function getRedoButton(driver: ThenableWebDriver): WebElementPromise {
    return driver.findElement(toolbarButton(2));
}

export function getStepButton(driver: ThenableWebDriver): WebElementPromise {
    return driver.findElement(toolbarButton(3));
}

export function getGridToggle(driver: ThenableWebDriver): WebElementPromise {
    return driver.findElement(toolbarButton(4));
}

export function getMouseTrackerToggle(driver: ThenableWebDriver): WebElementPromise {
    return driver.findElement(toolbarButton(5));
}

export function getMouseTracker(driver: ThenableWebDriver): WebElementPromise {
    return driver.findElement(By.css('simulation > mouse-tracker'));
}

export function getMouseTrackers(driver: ThenableWebDriver): Promise<WebElement[]> {
    return driver.findElements(By.css('simulation > mouse-tracker'));
}

export function getHorizontalGridLines(driver: ThenableWebDriver): Promise<WebElement[]> {
    return driver.findElements(By.css('simulation > svg > g[grid] > g[horizontal] > line'));
}

export function getHorizontalGridLineLabels(driver: ThenableWebDriver): Promise<WebElement[]> {
    return driver.findElements(By.css('simulation > svg > g[grid] > g[horizontal] > text'));
}

export function getVerticalGridLines(driver: ThenableWebDriver): Promise<WebElement[]> {
    return driver.findElements(By.css('simulation > svg > g[grid] > g[vertical] > line'));
}

export function getVerticalGridLineLabels(driver: ThenableWebDriver): Promise<WebElement[]> {
    return driver.findElements(By.css('simulation > svg > g[grid] > g[vertical] > text'));
}

export function getPendingParticleCircle(driver: ThenableWebDriver): WebElementPromise {
    return driver.findElement(By.css('svg > g > circle'));
}

export function getPendingParticleCircles(driver: ThenableWebDriver): Promise<WebElement[]> {
    return driver.findElements(By.css('svg > g > circle'));
}

export function getParticleCircle(driver: ThenableWebDriver, i = 1): WebElementPromise {
    return driver.findElement(By.css(`svg > g > g[particle-component]:nth-of-type(${i}) > circle`));
}

export function getLastParticleCircle(driver: ThenableWebDriver): WebElementPromise {
    return driver.findElement(By.css('svg > g > g[particle-component]:last-of-type > circle'));
}

export function getParticleCircles(driver: ThenableWebDriver): Promise<WebElement[]> {
    return driver.findElements(By.css('svg > g > g[particle-component] > circle'));
}

export function getParticleDescription(driver: ThenableWebDriver): WebElementPromise {
    return driver.findElement(By.css('particle-description'));
}

export function getParticleDescriptions(driver: ThenableWebDriver): Promise<WebElement[]> {
    return driver.findElements(By.css('particle-description'));
}

function descriptionHeader(i: number): Locator {
    return By.css(`particle-description > table > tr:nth-of-type(${i}) > th`);
}

export function getPositionHeader(driver: ThenableWebDriver): WebElementPromise {
    return driver.findElement(descriptionHeader(1));
}

export function getRadiusHeader(driver: ThenableWebDriver): WebElementPromise {
    return driver.findElement(descriptionHeader(2));
}

export function getVelocityHeader(driver: ThenableWebDriver): WebElementPromise {
    return driver.findElement(descriptionHeader(3));
}

export function getMassHeader(driver: ThenableWebDriver): WebElementPromise {
    return driver.findElement(descriptionHeader(4));
}

function descriptionCell(i: number): Locator {
    return By.css(`particle-description > table > tr:nth-of-type(${i}) > td`);
}

export function getPositionCell(driver: ThenableWebDriver): WebElementPromise {
    return driver.findElement(descriptionCell(1));
}

export function getVelocityCell(driver: ThenableWebDriver): WebElementPromise {
    return driver.findElement(descriptionCell(3));
}

export function getRadiusCell(driver: ThenableWebDriver): WebElementPromise {
    return driver.findElement(descriptionCell(2));
}

export function getMassCell(driver: ThenableWebDriver): WebElementPromise {
    return driver.findElement(descriptionCell(4));
}

function descriptionInput(i: number, j = 1): Locator {
    return By.css(`particle-description > table > tr:nth-of-type(${i}) > td > number-edit:nth-of-type(${j}) > input`);
}

export function getPositionXInput(driver: WebDriver): WebElementPromise {
    return driver.findElement(descriptionInput(1, 1));
}

export function getPositionYInput(driver: WebDriver): WebElementPromise {
    return driver.findElement(descriptionInput(1, 2));
}

export function getRadiusInput(driver: WebDriver): WebElementPromise {
    return driver.findElement(descriptionInput(2));
}

export function getVelocityXInput(driver: WebDriver): WebElementPromise {
    return driver.findElement(descriptionInput(3, 1));
}

export function getVelocityYInput(driver: WebDriver): WebElementPromise {
    return driver.findElement(descriptionInput(3, 2));
}

export function getMassInput(driver: WebDriver): WebElementPromise {
    return driver.findElement(descriptionInput(4));
}
