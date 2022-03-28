const request = require("request");
const cheerio = require("cheerio");
const extratMatchesObj = require("./scorecard");
function getAllMatchesLink(url){
    request(url, function(err, response, html){
        if(err){
            console.log(err);
        } else{
            extractlink(html);
        }
    })
}

function extractlink(html){
    let $ = cheerio.load(html);
    let scorecardElem = $("a[data-hover='Scorecard']");
    for(let i =0; i < scorecardElem.length;i++){
       let link= $(scorecardElem[i]).attr("href");
       let fullLink = "https://www.espncricinfo.com" + link;
     //  console.log(fullLink);
       // console.log(link);
      // console.log(fullLink);
       extratMatchesObj.eAllMatches(fullLink)
    }
}

module.exports = {
    gAllMatches : getAllMatchesLink
}