import { browser, by, element, ElementFinder } from "protractor";
import { protractor } from "protractor/built/ptor";
import * as Constant from "../common/constant";

const timeout = Constant.TIMEOUT;

export class BaseAction {

  getAppURL = async (url: string) => {
    browser.get(url);
    browser.logger.info("Navigated to - " + url);
  };

  async getCurrentUrl(): Promise<string> {
    await browser.sleep(2000); // Take a breach and wait for browser to be loaded
    return await browser.getCurrentUrl();
  }

  async clickElementByText(text: any) {
    await element(by.xpath(`//*[text()="${text}"]`)).click();
  }

  randomNumber(min?: number, max?: number) {
    typeof max !== "number"
      ? (max = 99999999)
      : browser.logger.info(`Max Number: ${max}`);
    typeof min !== "number"
      ? (min = 1)
      : browser.logger.info(`Min Number: ${min}`);
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  // Alert
  // switches to alert and accepts it
  async acceptAlert() {
    await browser.switchTo().alert().accept();
    browser.logger.info("Accepted the Alert");
  }

  // switches to alert and dismisses it
  async dismissAlert() {
    await browser.switchTo().alert().dismiss();
    browser.logger.info("Dismissed the Alert");
  }

  // checks for alert and dismisses if present
  checkAlertAndDismiss = async () => {
    const alert = browser.switchTo().alert();
    if (alert !== null) {
      await this.dismissAlert();
    }
    browser.logger.info("Checked the alert and dismissed it.");
  };

  // checks for alert and accepts if present
  checkAlertAndAccept = async () => {
    const alert = browser.switchTo().alert();
    if (alert !== null) {
      await this.acceptAlert();
    }
    browser.logger.info("Checked the alert and accepted it.");
  };

  // checks for alert and writes text, if present
  checkAlertAndWriteText = async () => {
    const alert = browser.switchTo().alert();
    if (alert !== null) {
      await this.dismissAlert();
    }
    browser.logger.info("Checked the alert and dismissed it.");
  };

  // Actions
  // Method to navigate menu - two level
  menuHoverOneLevel = async (
    element1: ElementFinder,
    element2: ElementFinder
  ) => {
    browser.logger.info(
      "Navigating from - " + element1.locator() + " to - " + element2.locator()
    );
    await browser
      .actions()
      .click(element1)
      .perform()
      .then(function (click) {
        browser.actions().click(element2).perform();
      });
  };

  // Method to navigate menu - three level
  menuHoverTwoLevel = async (element1, element2, element3) => {
    browser.logger.info(
      "Navigating from - " +
        element1.locator() +
        " to - " +
        element2.locator() +
        " and the +" +
        element3.locator()
    );
    await browser
      .actions()
      .click(element1)
      .perform()
      .then(function (click) {
        browser
          .actions()
          .click(element2)
          .perform()
          .then(function (click) {
            browser.actions().click(element3).perform();
          });
      });
  };

  // Method to move to element and click
  moveToElementAndClick = async (element: ElementFinder) => {
    browser.logger.info(
      "Moving to element and clicking it - " + element.locator()
    );
    await browser
      .actions()
      .mouseMove(element)
      .perform()
      .then(function (click) {
        browser.actions().click(element).perform();
      });
  };

  dragAndDropElement = async (source: ElementFinder, target: ElementFinder) => {
    browser.logger.info(
      "Dragging - " + source + " and placing it to target -" + target
    );
    browser.actions().dragAndDrop(source, target).perform();
  };

  doubleClickElement = async (element: ElementFinder) => {
    browser.logger.info("Double Clicking element - " + element);
    browser.actions().doubleClick(element).perform();
  };

  clickElement = async (element: ElementFinder) => {
    browser.logger.info("Clicking - " + element.locator());
    await browser.actions().mouseMove(element).perform();
    await element.click();
  };
  forceClickElement = async (element: ElementFinder) => {
    browser.logger.info("Force clicking - " + element.locator());
    browser.executeScript("arguments[0].click();", element.getWebElement());
  };

  clearText = async (element: ElementFinder) => {
    browser.logger.info("Cleared - " + element.locator());
    await browser.actions().mouseMove(element).perform();
    await element.clear();
  };

  inputTextInTextBox = async (element: ElementFinder, TextToBeKeyed) => {
    browser.logger.info(
      "Entering text - " + TextToBeKeyed + " in " + element.locator()
    );
    await browser.actions().mouseMove(element).perform();
    await element.clear();
    await element.sendKeys(TextToBeKeyed);
  };

  inputTextByLabel = async (label: string, text: any) => {
    browser.logger.info("Entering text - " + text + " in label - " + label);
    await this.inputTextInTextBox(
      element(by.xpath(`//label[text()="${label}"]/..//input`)),
      text
    );
  };

  async selectDropdownByNumber(element: ElementFinder, optNumber: number) {
    await element.click();
    await browser.sleep(1000);
    element.all(by.repeater("item in $ctrl.items")).then((elements) => {
      elements[optNumber].click();
    });
  }
  async getTextOfElement(element: ElementFinder): Promise<string> {
    await browser.actions().mouseMove(element).perform();
    await this.waitForVisibilityOfElement(element);
    browser.logger.info(await element.getText());
    return await element.getText();
  }

  async getAttributeOfElement(element: ElementFinder, type): Promise<string> {
    await browser.actions().mouseMove(element).perform();
    await this.waitForVisibilityOfElement(element);
    browser.logger.info(await element.getAttribute(type));
    return await element.getAttribute(type)
  }

  getTextOfElementR = async (element) => {
    await element.getText().then(function (text) {
      return text;
    });
  };

  isElementPresent = async (element: ElementFinder): Promise<boolean> => {
    browser.logger.info(
      "Waiting for element to be present - " + element.locator()
    );
    return element
      .isPresent()
      .then(function (isPresent) {
        return (isPresent = true);
      })
      .catch((err) => {
        return false;
      });
  };

  isTextDisplayed = async (text: string): Promise<boolean> => {
    const item = element(by.xpath(`//*[contains(text(),"${text}")]`));
    try {
      await this.waitForPresenceOfElement(item);
      await browser.actions().mouseMove(item).perform();
    } catch (err) {
      await browser.logger.info(err);
    }
    return await this.isElementDisplayed(item);
  };

  isElementDisplayed = async (element: ElementFinder): Promise<boolean> => {
    browser.logger.info(
      "Waiting for element to be displayed - " + element.locator()
    );

    return element
      .isDisplayed()
      .then(function (isDisplayed) {
        return (isDisplayed = true);
      })
      .catch((err) => {
        return false;
      });
  };

  isElementEnabled = async (element: ElementFinder) => {
    browser.logger.info(
      "Waiting for element to be enabled - " + element.locator()
    );
    await element.isEnabled().then(function (isEnabled) {
      if (isEnabled) {
        return (isEnabled = true);
      } else {
        return (isEnabled = false);
      }
    });
  };

  isElementSelected = async (element: ElementFinder) => {
    browser.logger.info(
      "Waiting for element to be selected - " + element.locator()
    );
    await element.isSelected().then(function (isSelected) {
      if (isSelected) {
        return (isSelected = true);
      } else {
        return (isSelected = false);
      }
    });
  };

  waitForPresenceOfElement = function (
    element: ElementFinder,
    timeout?: number
  ) {
    timeout === null || timeout === undefined
      ? (timeout = Constant.TIMEOUT)
      : timeout;
    return browser.wait(
      protractor.ExpectedConditions.and(
        protractor.ExpectedConditions.presenceOf(element)
      ),
      timeout
    );
  };

  waitForVisibilityOfElement = async function (
    element: ElementFinder,
    timeout?: number
  ) {
    timeout === null || timeout === undefined
      ? (timeout = Constant.TIMEOUT)
      : timeout;
    return browser.wait(
      protractor.ExpectedConditions.and(
        protractor.ExpectedConditions.visibilityOf(element)
      ),
      timeout
    );
  };

  waitForTextToBePresentInElement = function (
    element: ElementFinder,
    actualText,
    timeout?: number
  ) {
    timeout === null || timeout === undefined
      ? (timeout = Constant.TIMEOUT)
      : timeout;
    const hasText = function () {
      return element.getText().then(function ($actualText) {
        return $actualText;
      });
    };
    return browser.wait(
      protractor.ExpectedConditions.and(
        protractor.ExpectedConditions.presenceOf(element),
        hasText
      )
    );
  };

  waitForURLContain(urlExpected: string, timeout?: number) {
    timeout === null || timeout === undefined
      ? (timeout = Constant.TIMEOUT)
      : timeout;
    try {
      const condition = browser.ExpectedConditions;
      browser.wait(condition.urlContains(urlExpected), timeout);
    } catch (e) {
      console.error("URL not contain text.", e);
    }
  }
}
