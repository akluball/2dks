import { ThenableWebDriver, By, until, WebElement, WebElementPromise } from 'selenium-webdriver';

export function getBody(driver: ThenableWebDriver): WebElementPromise {
    return driver.wait(until.elementLocated(By.css('body')));
}

export function getApp(driver: ThenableWebDriver): WebElementPromise {
    return driver.wait(until.elementLocated(By.css('app')));
}

export function getSimulation(driver: ThenableWebDriver): WebElementPromise {
    return driver.findElement(By.css('simulation'));
}

export function getSvg(driver: ThenableWebDriver): WebElementPromise {
    return getSimulation(driver).findElement(By.css('svg'));
}

export function getToolbar(driver: ThenableWebDriver): WebElementPromise {
    return driver.wait(until.elementLocated(By.css('toolbar')));
}

export function getToolbarContent(driver: ThenableWebDriver): WebElementPromise {
    return getToolbar(driver).findElement(By.className('toolbar_content'));
}

export function getToolbarToggle(driver: ThenableWebDriver): WebElementPromise {
    return getToolbar(driver).findElement(By.className('toolbar_toggle'));
}

export function getActionSelect(driver: ThenableWebDriver): WebElementPromise {
    return getToolbarContent(driver).findElement(By.css('select'));
}

export function getUndoButton(driver: ThenableWebDriver): WebElementPromise {
    return driver.findElement(By.css('.toolbar_content >button[value=undo]'));
}

export function getRedoButton(driver: ThenableWebDriver): WebElementPromise {
    return driver.findElement(By.css('.toolbar_content > button[value=redo]'));
}

export function getPendingParticleCircle(driver: ThenableWebDriver): WebElementPromise {
    return driver.findElement(By.css('svg > g > circle'));
}

export function getPendingParticleCircles(driver: ThenableWebDriver): Promise<WebElement[]> {
    return driver.findElements(By.css('svg > g > circle'));
}

export function getParticleCircle(driver: ThenableWebDriver): WebElementPromise {
    return driver.findElement(By.css('g[particle-component] > circle'));
}

export function getParticleCircles(driver: ThenableWebDriver): Promise<WebElement[]> {
    return driver.findElements(By.css('g[particle-component] > circle'));
}

export function getParticleDescription(driver: ThenableWebDriver): WebElementPromise {
    return driver.findElement(By.css('particle-description'));
}

export function getParticleDescriptions(driver: ThenableWebDriver): Promise<WebElement[]> {
    return driver.findElements(By.css('particle-description'));
}

export function getParticleDescriptionInput(driver: ThenableWebDriver): WebElementPromise {
    return driver.findElement(By.css('particle-description > table > tr > td > input'));
}

export function getParticleDescriptionInputs(driver: ThenableWebDriver): Promise<WebElement[]> {
    return driver.findElements(By.css('particle-description > table > tr > td > input'));
}
