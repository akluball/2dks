import { WebElementPromise, ThenableWebDriver, By, WebElement, IRectangle } from 'selenium-webdriver';

export interface Vector {
    x: number;
    y: number;
}

export interface DeltaVector {
    dx?: number;
    dy?: number;
}

const scripts = {
    getHeight: function(element: Element) {
        return Math.round(element.getBoundingClientRect().height);
    },
    getWidth: function(element: Element) {
        return Math.round(element.getBoundingClientRect().width);
    },
    getTopLeft: function(element: Element)  {
        const { left, top } = element.getBoundingClientRect();
        return {
            x: Math.round(left),
            y: Math.round(top)
        };
    },
    getTopRight: function(element: Element)  {
        const { right, top } = element.getBoundingClientRect();
        return {
            x: Math.round(right),
            y: Math.round(top)
        };
    },
    getBottomRight: function(element: Element)  {
        const { right, bottom } = element.getBoundingClientRect();
        return {
            x: Math.round(right),
            y: Math.round(bottom)
        };
    },
    getBottomLeft: function(element: Element)  {
        const { left, bottom } = element.getBoundingClientRect();
        return {
            x: Math.round(left),
            y: Math.round(bottom)
        };
    },
    getCenterLeft: function(element: Element) {
        const { left, top, bottom } = element.getBoundingClientRect();
        return {
            x: Math.round(left),
            y: Math.round((top + bottom) / 2)
        };
    },
    getCenterRight: function(element: Element) {
        const { right, top, bottom } = element.getBoundingClientRect();
        return {
            x: Math.round(right),
            y: Math.round((top + bottom) / 2)
        };
    },
    getLeftX: function(element: Element) {
        return Math.round(element.getBoundingClientRect().left);
    },
    getRightX: function(element: Element) {
        return Math.round(element.getBoundingClientRect().right);
    },
    getTopY: function(element: Element) {
        return Math.round(element.getBoundingClientRect().top);
    },
    getBottomY: function(element: Element) {
        return Math.round(element.getBoundingClientRect().bottom);
    },
    getCenter: function(element: Element) {
        const { left, right, top, bottom } = element.getBoundingClientRect();
        return { x: Math.round((left + right) / 2), y: Math.round((top + bottom) / 2) };
    },
    getCenterX: function(element: Element) {
        const { left, right } = element.getBoundingClientRect();
        return Math.round((left + right) / 2);
    },
    getCenterY: function(element: Element) {
        const { top, bottom } = element.getBoundingClientRect();
        return Math.round((top + bottom) / 2);
    },
    getViewportHeight: function() {
        return window.innerHeight;
    },
    getViewportWidth: function() {
        return window.innerWidth;
    },
    remToPixels: function(element: Element, rems: number) {
        const a = document.createElement('div');
        a.style.width = `${rems}rem`;
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
    resizeBody: function(width?: string, height?: string) {
        if (width) {
            document.body.style.width = width;
        }
        if (height) {
            document.body.style.height = height;
        }
    },
    hScrollTo: function(element: HTMLElement) {
        const parent = element.parentElement;
        if (!parent) {
            return;
        }
        const { right } = element.getBoundingClientRect();
        const { right: parentRight } = parent.getBoundingClientRect();
        parent.scrollLeft = right - parentRight;
    }
};

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

export function getTopLeft(element: WebElement): Promise<Vector> {
    return element.getDriver().executeScript(scripts.getTopLeft, element);
}

export function getTopRight(element: WebElement): Promise<Vector> {
    return element.getDriver().executeScript(scripts.getTopRight, element);
}

export function getBottomRight(element: WebElement): Promise<Vector> {
    return element.getDriver().executeScript(scripts.getBottomRight, element);
}

export function getBottomLeft(element: WebElement): Promise<Vector> {
    return element.getDriver().executeScript(scripts.getBottomLeft, element);
}

export function getCenterLeft(element: WebElement): Promise<Vector> {
    return element.getDriver().executeScript(scripts.getCenterLeft, element);
}

export function getCenterRight(element: WebElement): Promise<Vector> {
    return element.getDriver().executeScript(scripts.getCenterRight, element);
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

export async function getCenter(element: WebElement): Promise<Vector> {
    return element.getDriver().executeScript(scripts.getCenter, element);
}

export async function getCenterX(element: WebElement): Promise<number> {
    return element.getDriver().executeScript(scripts.getCenterX, element);
}

export async function getCenterY(element: WebElement): Promise<number> {
    return element.getDriver().executeScript(scripts.getCenterY, element);
}

export function getParentCenterY(element: WebElement): Promise<number> {
    return getCenterY(getParent(element));
}

export function getActiveElement(driver: ThenableWebDriver): WebElementPromise {
    return new WebElementPromise(driver, driver.executeScript(scripts.getActiveElement));
}

export function getParent(element: WebElement): WebElementPromise {
    return element.findElement(By.xpath('..'));
}

export function emToPixels(element: WebElement, ems: number): Promise<number> {
    return element.getDriver().executeScript(scripts.remToPixels, element, ems);
}

export async function count(elements: Promise<WebElement[]>): Promise<number> {
    return (await elements).length;
}

export function resizeBody(driver: ThenableWebDriver, width?: string, height?: string): Promise<IRectangle> {
    return driver.executeScript(scripts.resizeBody, width, height);
}

export function hScrollTo(element: WebElementPromise): Promise<void> {
    return element.getDriver().executeScript(scripts.hScrollTo, element);
}

export function sleep(millis: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, millis));
}
