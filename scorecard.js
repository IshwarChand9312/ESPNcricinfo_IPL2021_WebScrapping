const url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595/delhi-capitals-vs-mumbai-indians-final-1237181/full-scorecard";
const request = require("request");
const cheerio = require("cheerio");
const path = require("path");
const fs = require("fs");
const xlsx = require("xlsx");

function extractMatchDetail(url){
    request(url, cb);
}

function cb(error, sysetemCode, html){

    if(error){
        console.log("error : " + error);
    }
    else {
        extractAllMatchesDetail(html);
    }
}

function extractAllMatchesDetail(html){
// venue , date opponene, result, runs balls fours sixes sr
    let $ = cheerio.load(html);
    //.header-info -> venue,data,match or .event .description
    // result 
    let numsArr = $(".match-header-container .match-header-info .description");
    let res = $(".match-header-container .event .status-text");
    let stringArr = numsArr.text().split(',');
    let venue = stringArr[1].trim();
    let date =  stringArr[2].trim();
    let result= res.text().trim();
    let innings = $(".match-scorecard-page .Collapsible");
    let htmlString = "";

    for(let i = 0 ; i < innings.length ; i++ ){
        let teamName = $(innings[i]).find("h5").text().split("INNINGS")[0].trim();
        let opntIdx = i == 1 ? 0 : 1;
        let OpntTeamName = $(innings[opntIdx]).find("h5").text().split("INNINGS")[0].trim();
       // console.log(`${venue} ${date} ${result} ${teamName} ${OpntTeamName}`);
        let allRows = $(innings[i]).find(".table.batsman tbody tr");
        for(let j = 0 ; j < allRows.length ; j++){
               let allCols = $(allRows[j]).find("td");
                let isWorthy = $(allCols[0]).hasClass("batsman-cell");
                if(isWorthy == true){
                   let playerName = $(allCols[0]).text().trim();
                   let run =  $(allCols[2]).text().trim();
                   let balls =  $(allCols[3]).text().trim();
                   let fours =  $(allCols[5]).text().trim();
                   let sixes =  $(allCols[6]).text().trim();
                   let sr =  $(allCols[7]).text().trim();
                  // console.log(`${playerName} ${run} ${balls} ${fours} ${sixes} ${sr}`);
                   processPlayer(teamName, playerName, run, balls, fours, sixes, sr, OpntTeamName, venue, date, result);
                }
        }
    }

    //console.log(htmlString);
}

function processPlayer(teamName, playerName, runs, balls, fours, sixes, sr, opponentName, venue, date, result){

    let teamPath = path.join(__dirname, "IPL", teamName);
    dirCreater(teamPath);
    let filePath = path.join(teamPath, playerName + ".xlsx");
    console.log(filePath);
    let content = excelReader(filePath, playerName);
    let playerObj = {
        teamName,
        playerName,
        runs,
        balls,
        fours,
        sixes,
        sr,
        opponentName,
        venue,
        date,
        result
    }
    content.push(playerObj);
    excelWriter(filePath, content, playerName);
}

function dirCreater(filepath){

    if(fs.existsSync(filepath) == false){
        fs.mkdirSync(filepath);
    }

}

function excelWriter(FilePath, json, sheetName){
    let newWB = xlsx.utils.book_new();
    let newWS = xlsx.utils.json_to_sheet(json);
    xlsx.utils.book_append_sheet(newWB, newWS, sheetName);
    xlsx.writeFile(newWB, FilePath);
}

function excelReader(filePath, sheetName){
    if(fs.existsSync(filePath) == false){
        return [];
    }

    let wb = xlsx.readFile(filePath);
    let excelData = wb.Sheets[sheetName];
  //  console.log(excelData.text());
    let ans = xlsx.utils.sheet_to_json(excelData);
    return ans;
}

module.exports = {
    eAllMatches : extractMatchDetail
}
