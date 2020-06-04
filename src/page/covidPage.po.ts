const fs = require('fs');
const { convertCSVToArray } = require("convert-csv-to-array");

export class CovidPage {
  async readCVSFileAndConvertToArray(file) {
    const data = fs.readFileSync(process.cwd() + file, 'utf8');
    let arrayofObjectsWithoutHeader = [];
	  arrayofObjectsWithoutHeader = convertCSVToArray(data, {
      header: false
    });

    return arrayofObjectsWithoutHeader;
  }

  async getLastDayFromData(data) {
    const lastDay = data[data.length -1];
    const resultObject = {
      country: lastDay.location,
      newCase: lastDay.new_cases,
      newDeaths: lastDay.new_deaths
    };

    return Object.keys(resultObject).toString() +  `\r\n` + Object.values(resultObject).toString();
  }

  async writeDataToCSVFile(fileContent) {
    fs.writeFile(process.cwd() + '/src/data/result-data.csv', fileContent, (err) => {
      if (err) {
          console.error(err);
      } else {
          console.log('File saved');
      }
    });
  }
}