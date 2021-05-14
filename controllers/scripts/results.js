const cheerio = require('cheerio');
const https = require('https');
const http = require('http');
const request = require('request');

module.exports = async function(app, db) {
  
  request('https://www.formula1.com/en/results.html', (err, res, body) => {
    if (err) { 
      return console.log(err); 
    }
    const $ = cheerio.load(body);

    $("div.resultsarchive-filter-container > div:first").find("ul > li").each((i, linkResult) => {
        const details = $(linkResult).find("a").attr("href");
        const year = $(linkResult).find("a").text().trim();

        request("https://www.formula1.com" + details, (err, res, body) => {
            if (err) { 
                return console.log(err); 
            }
            const $ = cheerio.load(body);
            const result = {};
            result.year = year;

            $("div.resultsarchive-content").find("table.resultsarchive-table > tbody > tr").each((j, res) => {
                const gp = $(res).find("td:nth-child(2)").text().trim();
                const date = $(res).find("td:nth-child(3)").text().trim();
                const winnerFirstName = $(res).find("td:nth-child(4) > span:first").text().trim();
                const winnerLastName = $(res).find("td:nth-child(4) > span:nth-child(2)").text().trim();
                const team = $(res).find("td:nth-child(5)").text().trim();
                const laps = $(res).find("td:nth-child(6)").text().trim();
                const time = $(res).find("td:nth-child(7)").text().trim();

                result.grandPrix = gp;
                result.date = date;
                result.winner = winnerFirstName + " " + winnerLastName;
                result.team = team;
                result.laps = laps;
                result.time = time;

                const collection = db.collection("results");
    
                collection.insertOne(result, function(err, results) {
                  err
                    ? console.log("Your insertion has failed")
                    : console.log("OK");
                });
            })
        });
    })
  });
};
  
  