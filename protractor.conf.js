'use strict';
const log4js = require('log4js');
let SpecReporter = require('jasmine-spec-reporter').SpecReporter;
var nodemailer = require('nodemailer');
var q = require('q');

exports.config = {
  // seleniumAddress: 'http://localhost:4444/wd/hub',
  directConnect: true,

  // This setting tells protractor to wait for all apps
  // to load on the page instead of just the first.
  useAllAngular2AppRoots: true,

  capabilities: {
    browserName: 'chrome',
    chromeOptions: {
      args: ['incognito', 'disable-extensions', 'no-sandbox'],
      prefs: {
        download: {
          'prompt_for_download': false,
          'default_directory': process.cwd() + '/src/data'
        }
      }
    }
  },
  framework: 'jasmine2',
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 500000,
    print: function () {}
  },
  SELENIUM_PROMISE_MANAGER: false,
  suites: {
    covidTest: './src/specs/covid.spec.ts',

  },
  // Config for log4js
  beforeLaunch: function () {
    log4js.configure({
      appenders: {
        out: {
          type: 'log4js-protractor-appender',
          category: 'protractorLog4js'
        }
      },
      categories: {
        default: {
          appenders: ['out'],
          level: 'info'
        }
      }
    });
  },



  onPrepare: function () {
    browser.logger = log4js.getLogger('protractorLog4js');

    let fs = require('fs');

    function rmDir(dirPath) {
      try {
        var files = fs.readdirSync(dirPath);
      } catch (e) {
        return;
      }
      if (files.length > 0)
        for (var i = 0; i < files.length; i++) {
          var filePath = dirPath + '/' + files[i];
          if (fs.statSync(filePath).isFile())
            fs.unlinkSync(filePath);
          else
            rmDir(filePath);
        }
    }

    // delete ./data  
    rmDir(process.cwd() + '/src/data');

    jasmine.getEnv().addReporter(
      new SpecReporter({
        spec: {
          displayStacktrace: true
        },
        summary: {
          displayDuration: false
        }
      })
    );

    require('ts-node').register({
      project: './tsconfig.json'
    });
    browser.driver
      .manage()
      .window()
      .maximize();
    // .setSize(1920, 1080);
    // browser.ignoreSynchronization = true;
  },
  onComplete: function () {
    return q.fcall(function () {
      return new Promise(function (fulfill, reject) {
        var transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'toants.301@gmail.com',
            pass: 'toanking12'
          }
        });
        var mailOptions = {
          from: '"TestMail" <toants.301@gmail.com> ',
          to: 'sangmai350@gmail.com',
          subject: 'Test_Report',
          text: 'Test_Report of app',
          attachments: [{
            'path': 'src/data/result-data.csv',
          }]
        };
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
        });
      });
    }).delay(5000);
  }
}
