import { browser } from 'protractor';
import * as Constant from '../common/constant';

import { BaseAction } from '../common/baseAction';


export class BasePage extends BaseAction {
  async gotoPageURL(url: string) {
    await browser.get(url);
    expect(await browser.getCurrentUrl()).toBe(url);
  }

  async get() {
    await browser.get(`${Constant.URL}`);
  }

}