const cheerio = require('cheerio');
const https = require('https');
const http = require('http');
const request = require('request');

module.exports = async function(app, db) {
  
  request('https://www.formula1.com/en/teams.html', (err, res, body) => {
    if (err) { 
      return console.log(err); 
    }
    const $ = cheerio.load(body);

    $("div.team-listing > div.row > div").each((i, value) => {
      const details = $(value).find("a").attr("href");
      const teamPoints = $(value).find("a > fieldset > div > div.listing-standing > div.points").text().trim().match(/\d+/g)[0];

      request('https://www.formula1.com/' + details, (err, res, body1) => {
        if (err) { 
          return console.log(err); 
        }
        const team = {};

        const $ = cheerio.load(body1);
        team.created = new Date();

        team.teamName = $("table.stat-list > tbody > tr:first").find("td").text().trim();
        team.teamCountry = $("table.stat-list > tbody > tr:nth-child(2)").find("td").text().trim();
        team.teamChief = $("table.stat-list > tbody > tr:nth-child(3)").find("td").text().trim();
        team.teamTechnicalChief = $("table.stat-list > tbody > tr:nth-child(4)").find("td").text().trim();
        team.teamChassis = $("table.stat-list > tbody > tr:nth-child(5)").find("td").text().trim();
        team.teamPowerUnit = $("table.stat-list > tbody > tr:nth-child(6)").find("td").text().trim();
        team.teamFirstTeamEntry = $("table.stat-list > tbody > tr:nth-child(7)").find("td").text().trim();
        team.teamWorldChampionships = $("table.stat-list > tbody > tr:nth-child(8)").find("td").text().trim();
        team.teamPolePositions = $("table.stat-list > tbody > tr:nth-child(9)").find("td").text().trim();
        team.teamFastestLaps = $("table.stat-list > tbody > tr:nth-child(10)").find("td").text().trim();
        team.drivers = [];
        $("ul.drivers > li").each((j, driver) => {
          team.drivers.push($(driver).find("h1.driver-name").text());
        })

        const collection = db.collection("teams");
        collection.insertOne(team, function(err, results) {
          err
            ? console.log(err)
            : console.log("OK");
        });
      });
    }) 
  });
};
  
  