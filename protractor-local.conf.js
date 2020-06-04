"use strict";
const log4js = require("log4js");
let SpecReporter = require("jasmine-spec-reporter").SpecReporter;

exports.config = {
  // seleniumAddress: 'http://localhost:4444/wd/hub',
  directConnect: true,

  // This setting tells protractor to wait for all apps
  // to load on the page instead of just the first.
  useAllAngular2AppRoots: true,

  capabilities: {
    browserName: "chrome",
    chromeOptions: {
      args: ["incognito", "disable-extensions", "no-sandbox"],
    },
  },
  framework: "jasmine2",
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 500000,
    print: function () {},
  },
  SELENIUM_PROMISE_MANAGER: false,
  suites: {
    login: "./src/specs/login.spec.ts",
  },
  // Config for log4js
  beforeLaunch: function () {
    log4js.configure({
      appenders: {
        out: {
          type: "log4js-protractor-appender",
          category: "protractorLog4js",
        },
      },
      categories: {
        default: {
          appenders: ["out"],
          level: "info",
        },
      },
    });
  },

  onPrepare: function () {
    browser.logger = log4js.getLogger("protractorLog4js");

    jasmine.getEnv().addReporter(
      new SpecReporter({
        spec: {
          displayStacktrace: true,
        },
        summary: {
          displayDuration: false,
        },
      })
    );

    require("ts-node").register({
      project: "./tsconfig.json",
    });
    browser.driver.manage().window().maximize();
    // .setSize(1920, 1080);
    // browser.ignoreSynchronization = true;
  },
};
