const cheerio = require('cheerio');
const https = require('https');
const http = require('http');
const request = require('request');

module.exports = async function(app, db) {
  
  request('https://www.formula1.com/en/drivers.html', (err, res, body) => {
    if (err) { 
      return console.log(err); 
    }
    const $ = cheerio.load(body);

    $("div.driver > div > div").each((i, value) => {
      const details = $(value).find("a").attr("href");
      request('https://www.formula1.com/' + details, (err, res, body1) => {
        if (err) { 
          return console.log(err); 
        }
        const driver = {};

        const $ = cheerio.load(body1);
        const driverNumber = $(".driver-number > span:first").text();
        const driverName = $("h1.driver-name").text();
        const stat = $("table.stat-list > tbody")
        const driverTeam = stat.find("tr:first > td").text();
        const driverCountry = stat.find("tr:nth-child(2) > td").text();
        
        driver.created = new Date();
        driver.name = driverName;
        driver.number = driverNumber;
        driver.team = driverTeam;
        driver.country = driverCountry;
        
        const collection = db.collection("drivers");
    
        collection.insertOne(driver, function(err, results) {
          err
            ? console.log("Your insertion has failed")
            : console.log("OK");
        });

      });
    })
    
  });

  // request('https://www.f1-fansite.com/fr/pilotes-f1/charles-leclerc-information-statistique/', (err, res, body) => {
  //   if (err) { 
  //     return console.log(err); 
  //   }
  //   const $ = cheerio.load(body);
  //   console.log(body);
  //   $("DriverTable").each((i, value) => {
  //     const driverId = $(value).find("Driver").attr("driverid");
  //     const driverName = $(value).find("GivenName").text();
  //     const driverLastName = $(value).find("FamilyName").text();
  //     const birthday = $(value).find("DateOfBirth").text();
  //     const nationality = $(value).find("Nationality").text();
  //   });
    
  //});

  

};
  
  