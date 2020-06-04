  
import { browser, by, element, ElementFinder } from 'protractor';
import * as Constant from '../common/constant';

import { BaseAction } from '../common/baseAction';
import { BasePage } from '../page/basePage.po';
import { CovidPage } from '../page/covidPage.po';

const log = browser.logger;

const basePage = new BasePage();
const baseAction = new BaseAction();
const covidPage = new CovidPage();

describe('Covid Test', () => {

  beforeEach(async () => {
    await browser.manage().deleteAllCookies();
    browser.ignoreSynchronization = true; 
  });

  it('Covid Test', async () => {
    log.info('Go to the Coronavirus source data page');
    await basePage.gotoPageURL('https://ourworldindata.org/coronavirus-source-data');

    log.info('Verify that COVID-19 dataset is shown');
    await baseAction.isTextDisplayed('Our work belongs to everyone');

    log.info('Download COVID-19 dataset (.csv file)');
    let href = await baseAction.getAttributeOfElement(
      element(by.xpath(`//h5[contains(text(),"Our work belongs to everyone")]/..//a[contains(text(), '.csv')]`)),
      'href'
    );
    await browser.get(href);
    await browser.sleep(3000); // Wait to download succesfully

    log.info('Read COVID-19 dataset and convert to array');
    let result =  await covidPage.readCVSFileAndConvertToArray('/src/data/owid-covid-data.csv')
    
    log.info('Get Last Day from Data');
    let csvContent = await covidPage.getLastDayFromData(result);

    log.info('Write the new data to csv file')
    await covidPage.writeDataToCSVFile(csvContent);
 
  });

});
