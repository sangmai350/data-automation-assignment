const fs = require('fs');
const { convertCSVToArray } = require("convert-csv-to-array");

export class CovidPage {
  async readCVSFileAndConvertToArray(file) {
    const data = fs.readFileSync(process.cwd() + file, 'utf8');
    let arrayofObjectsWithoutHeader = [];
	  arrayofObjectsWithoutHeader = convertCSVToArray(data, {
      header: false
    });


    arrayofObjectsWithoutHeader.sort((item1, item2) => {
      return new Date(item1.date) > new Date(item2.date) 
        ? 1 
        : (new Date(item1.date) < new Date(item2.date) ? -1 : 0);
    });

    return arrayofObjectsWithoutHeader;
  }

  async getLastDayFromData(data) {
    let csvFile = '';

    let lastDay = data[data.length - 1].date;
    let lastDayOfCountrys = data.filter(item => item.date === lastDay);
    let internationArray = data.filter(item => item.location === 'International');
    console.log(internationArray[internationArray.length - 1]);
    lastDayOfCountrys.push(internationArray[internationArray.length - 1]);

    for (let i = 0; i < lastDayOfCountrys.length; i++) {
      let object = {
        country: lastDayOfCountrys[i].location,
        newCase: lastDayOfCountrys[i].new_cases,
        newDeaths: lastDayOfCountrys[i].new_deaths,
      };
      if ( i === 0 ) {
        csvFile = Object.keys(object).toString() + `\r\n`;
      }
      csvFile = csvFile + Object.values(object).toString() + `\r\n`;
      
    }

    return csvFile;
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