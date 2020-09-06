import { WebElementPromise, ThenableWebDriver, By, WebElement } from 'selenium-webdriver';

const scripts = {
    emToPixels: function(element: Element, ems: number) {
        const a = document.createElement('div');
        a.style.width = `${ems}em`;
        a.style.position = 'fixed';
        a.style.top = '10em';
        document.body.appendChild(a);
        (element.parentElement as Element).appendChild(element);
        const width = a.getBoundingClientRect().width;
        a.remove();
        return width;
    },
    getActiveElement: function() {
        return document.activeElement;
    },
    getHeight: function(element: Element) {
        return element.getBoundingClientRect().height;
    },
    getWidth: function(element: Element) {
        return element.getBoundingClientRect().width;
    },
    getLeftX: function(element: Element) {
        return element.getBoundingClientRect().left;
    },
    getRightX: function(element: Element) {
        return element.getBoundingClientRect().right;
    },
    getTopY: function(element: Element) {
        return element.getBoundingClientRect().top;
    },
    getBottomY: function(element: Element) {
        return element.getBoundingClientRect().bottom;
    },
    getViewportHeight: function() {
        return window.innerHeight;
    },
    getViewportWidth: function() {
        return window.innerWidth;
    }
};

export function emToPixels(element: WebElement, ems: number): Promise<number> {
    return element.getDriver().executeScript(scripts.emToPixels, element, ems);
}

export function getViewportHeight(driver: ThenableWebDriver): Promise<number> {
    return driver.executeScript(scripts.getViewportHeight);
}

export function getViewportWidth(driver: ThenableWebDriver): Promise<number> {
    return driver.executeScript(scripts.getViewportWidth);
}

export async function getViewportMiddleX(driver: ThenableWebDriver): Promise<number> {
    const width = await getViewportWidth(driver);
    return width / 2;
}

export async function getViewportMiddleY(driver: ThenableWebDriver): Promise<number> {
    const height = await getViewportHeight(driver);
    return height / 2;
}

export function getActiveElement(driver: ThenableWebDriver): WebElementPromise {
    return new WebElementPromise(driver, driver.executeScript(scripts.getActiveElement));
}

export function getParent(element: WebElement): WebElementPromise {
    return element.findElement(By.xpath('..'));
}

export function getHeight(element: WebElement): Promise<number> {
    return element.getDriver().executeScript(scripts.getHeight, element);
}

export function getParentHeight(element: WebElement): Promise<number> {
    return getHeight(getParent(element));
}

export function getWidth(element: WebElement): Promise<number> {
    return element.getDriver().executeScript(scripts.getWidth, element);
}

export function getParentWidth(element: WebElement): Promise<number> {
    return getWidth(getParent(element));
}

export function getLeftX(element: WebElement): Promise<number> {
    return element.getDriver().executeScript(scripts.getLeftX, element);
}

export function getParentLeftX(element: WebElement): Promise<number> {
    return getLeftX(getParent(element));
}

export function getRightX(element: WebElement): Promise<number> {
    return element.getDriver().executeScript(scripts.getRightX, element);
}

export function getParentRightX(element: WebElement): Promise<number> {
    return getRightX(getParent(element));
}

export function getTopY(element: WebElement): Promise<number> {
    return element.getDriver().executeScript(scripts.getTopY, element);
}

export function getParentTopY(element: WebElement): Promise<number> {
    return getTopY(getParent(element));
}

export function getBottomY(element: WebElement): Promise<number> {
    return element.getDriver().executeScript(scripts.getBottomY, element);
}

export function getParentBottomY(element: WebElement): Promise<number> {
    return getBottomY(getParent(element));
}

export async function getCenterX(element: WebElement): Promise<number> {
    const left = await getLeftX(element);
    const right = await getRightX(element);
    return Math.floor(left + (right - left) / 2);
}

export async function getCenterY(element: WebElement): Promise<number> {
    const top = await getTopY(element);
    const bottom = await getBottomY(element);
    return Math.floor(top + (bottom - top) / 2);
}

export function getParentCenterY(element: WebElement): Promise<number> {
    return getCenterY(getParent(element));
}

export async function count(elements: Promise<WebElement[]>): Promise<number> {
    return (await elements).length;
}

export function sleep(millis: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, millis));
}
