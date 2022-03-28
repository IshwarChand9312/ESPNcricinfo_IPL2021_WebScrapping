const url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595";
const request = require("request");
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");

const AllMatchObj = require("./AllMatches");

const iplPath = path.join(__dirname,"IPL");
dirCreater(iplPath);

request(url, cb);

function cb(error, sysetemCode, html){

    if(error){
        console.log("error : " + error);
    }
    else {
        extractLink(html);
    }
}

function extractLink(html){

    let $ = cheerio.load(html);
    let anchorElem = $("a[data-hover='View All Results']");
    let  link = $(anchorElem).attr("href");
  //  console.log(link);
    let fullLink = "https://www.espncricinfo.com"+link;
   // console.log(fullLink);
   AllMatchObj.gAllMatches(fullLink);
}
function dirCreater(filepath){

    if(fs.existsSync(filepath) == false){
        fs.mkdirSync(filepath);
    }

}

