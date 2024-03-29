//NPM packages
const fs = require('fs');
const pdf = require('pdf-parse');
const Excel = require('exceljs');

let dataBuffer = fs.readFileSync('docs/session-11/a_conf62_sr182.pdf');

pdf(dataBuffer).then(function(data) {
    

    //pull in the full text of the pdf, remove line breaks and extra spaces, and log it
    let fullText = data.text;
    //console.log(fullText);
    //fullText = fullText.replace(/\n/g, " ");
    fullText = fullText.replace(/\s+/g, ' ').trim();
    fullText = fullText.replace(/- /g,"");

    //initialize search variables and output; set search start location
    var speeches = [];
    var speakers = [];
    var speakerCount = [];
    var splitCount =[];
    let errors = [];
    let startDocChr = fullText.indexOf("1. ");
    let number = 2;
    let startChr = startDocChr;
    let endChr = 0;
    let currentSpeech = "";
    
    //create prefix terms array
    const prefixes = ["Mr.", "Miss", "Mrs.", "Ms.", "Prince", "Sir", "Rev."];
    const allTitles = ["Mr.", "Miss", "Mrs.", "Ms.", "Prince", "Sir", "Rev.", "ACTING PRESIDENT", "PRESIDENT", "SECRETARY-GENERAL"];

    //IDENTIFY SPEECHES------------------------------------------------------------------
    
    //helper function to check if there are more speeches left if we missed one
    var speechesLeft = function(){
        if (fullText.indexOf(number + ". ") !== -1){
            return true;
        }
        else if (fullText.indexOf((number + 1) + ". ") !== -1){
            number++;
            errors.push(number - 1);
            return true;
        }
        else if (fullText.indexOf((number + 2) + ". ") !== -1){
            number += 2;
            errors.push(number - 1, number)
            return true;
        }
        else{
            return false;
        }
    }

    //while loop to iterate through each speaking entry except the last one
    while (speechesLeft() == true){
        endChr = fullText.indexOf(number + ". ", startChr);
        currentSpeech = fullText.substring(startChr, endChr-1);
        speeches.push(currentSpeech);
        startChr = endChr;
        number++;
    }

    //statments to add the last speech
    endChr = fullText.indexOf("The meeting rose");
    currentSpeech = fullText.substring(startChr, endChr-1);
    speeches.push(currentSpeech);
    
    //HELPER FUNCTIONS
    
    //uppercase checker helper function
    //returns true if string [letter] is uppercase, false if not
    var isUppercase = function(inputString){
        if (inputString.toUpperCase() === inputString) {
            if (inputString === " " || inputString === "  "){
                return false;
            }
            else if (!(inputString.toLowerCase() != inputString.toUpperCase())){
                return false;
            }
            else {
                return true;
            }
          } else {
                return false;
          }
    }
    //returns word bounds for a string and a position input. Used below before cleaning whitespace.
    function getWordBoundsAtPosition(str, position) {
        const isSpace = (c) => /\s/.exec(c);
        let start = position - 1;
        let end = position;
      
        while (start >= 0 && !isSpace(str[start])) {
          start -= 1;
        }
        start = Math.max(0, start + 1);
      
        while (end < str.length && !isSpace(str[end])) {
          end += 1;
        }
        end = Math.max(start, end);
        
        return [start, end];
      }
      //returns true or false depending on if input string has a number in it
      function hasNumber(myString) {
        return /\d/.test(myString);
      }

    
    
    //PULLING TITLES------------------------------------------------------------------

    //try best to clean the data into just the titles
    for (const j of speeches){
        let startInChr = 0;
        let endInChr = 0;
        let holding = "";
        //console.log(j); //debugging

        //check each character in each speech
        for (let k = 0; k < j.length; k++){
            holding = "";
            var checker = j.charAt(k); //debugging
            var checkcheck = j.charAt(k+1); //debugging
            
            //catch up to last checked character
            if (k <= endInChr){
                continue;
            }

            //check for two capitals in a row to start logging
            else if (isUppercase(j.charAt(k)) && isUppercase(j.charAt(k+1))){
                //console.log(checker); //debugging
                //console.log(checkcheck); //debugging
                startInChr = k;
                endInChr = j.indexOf(" ", k);
                if (endInChr == -1){ //in case there is no space at the end of the speech for whatever reason
                    endInChr = j.length;
                }
                holding = j.substring(startInChr, endInChr + 1);
                var checkCapsNextWord = function(){
                    startInChr = endInChr + 1;
                    if (isUppercase(j.charAt(startInChr)) && isUppercase(j.charAt(startInChr+1))){
                        endInChr = j.indexOf(" ", startInChr);
                        holding += j.substring(startInChr, endInChr + 1);
                        checkCapsNextWord();
                    }
                }
                checkCapsNextWord();

                //stop logging if the string in question is a UN transcript element instead of a diplomat speech
                if (holding.includes("CONF.") || holding.includes("XX")){
                    continue;
                }

                //find the country in parenthesis if one is available
                //first check for an open parenthesis
                if (j.charAt(endInChr + 1) === '('){
                    let nextClose = j.indexOf(")", endInChr +1 );
                    
                    //if no ), add 90
                    if (nextClose === -1){
                        holding += j.substring(endInChr, endInChr + 90);
                    }

                    //if the ) comes more than 90 characters later, cut it off
                    else if ((nextClose - endInChr) > 90){
                        holding += j.substring(endInChr, endInChr + 90);
                        //errors.push() //later: figure out a way to add the speech number if there's an error.
                    }
                    //otherwise, add up to the )
                    else {
                        holding += j.substring(endInChr, nextClose + 1);
                    }
                }                

                //find a prefix if one exists
                const [start, end] = getWordBoundsAtPosition(j, k-2);
                let wordBefore = j.substring(start, end);
                if(prefixes.includes(wordBefore)){
                    holding = wordBefore + ' ' + holding;
                }

                //log the string
                speakers.push(holding.replace(/\s+/g, ' ').trim());
            }
        }
    }

    //CLEAN SPEAKERS LIST------------------------------------------------------------------
    //check if any of the speakers are case insensitive subsets of one another
    //for (const m)
    for (const m of speakers){
        for (let n = 0; n < speakers.length; n++){
            if (m.toLowerCase().includes(speakers[n].toLowerCase())){
                speakers[n] = m;
            }
        }
    }

    //COUNT HOW MANY TIMES EACH SPEAKER SPOKE
    //double for loop, iterate over each element, if we see the same one, add it to the counter and delete the element. at end, append counter to string
    for (let n = 0; n < speakers.length; n++){
        var countTimesSpoke = 0;
        for (let o = 0; o < speakers.length; o++){
            if (speakers[n] === speakers[o]){
                countTimesSpoke++;
            }
        }
        speakerCount.push(speakers[n] + ": " + countTimesSpoke);
    }
    //remove duplicate counts and sort alphabetically
    speakerCount = [...new Set(speakerCount)];
    speakerCount = Array.from(speakerCount);
    speakerCount = speakerCount.sort();

    //CREATE THE DOUBLE ARRAY
    for (const p of speakerCount){
        let speaker = {};
        if (p.includes("(")){
            if (p.indexOf(")", p.indexOf("("))){
                speaker.name = p.substring(0, p.indexOf('(')-1);
                speaker.country = p.substring(p.indexOf("(")+1, p.indexOf(")", p.indexOf("(")));
                speaker.timesSpoke = parseInt(p.substring(p.indexOf(":")+2, p.length));
            }
            else {
                speaker.name = p.substring(0, p.indexOf(':'));
                speaker.country = "-------";
                speaker.timesSpoke = parseInt(p.substring(p.indexOf(":")+2, p.length));
            }
        }
        else {
            speaker.name = p.substring(0, p.indexOf(':'));
            speaker.country = "-------";
            speaker.timesSpoke = parseInt(p.substring(p.indexOf(":")+2, p.length));
        }
        splitCount.push(speaker);
    }

    //ADD TO EXCEL SPREADSHEET
    const fileName = 'temp.xlsx';

    const wb = new Excel.Workbook();
    const ws = wb.addWorksheet('My Sheet');

    //set columns
    ws.columns = [
        { header: 'Name', key: 'name' },
        { header: 'Country', key: 'country' },
        { header: 'Times Spoke', key: 'timesSpoke' }
    ];

    //add speaker objects
    ws.addRows(splitCount);

    //autosize column width
    ws.columns.forEach(function (column, i) {
        var maxLength = 0;
        column["eachCell"]({ includeEmpty: true }, function (cell) {
            var columnLength = cell.value ? cell.value.toString().length : 10;
            if (columnLength > maxLength ) {
                maxLength = columnLength;
            }
        });
        column.width = maxLength < 10 ? 10 : maxLength;
    });

    //fill red cells where 1) numbers/./() in wrong places; 2) name doesn't include the prefix string
    ws.getColumn('name').eachCell(function(cell, rowNumber) {
        if (hasNumber(cell.value) || (cell.value.includes("(") || cell.value.includes(")"))){
            cell.fill = {
                type: 'pattern',
                pattern:'solid',
                fgColor:{argb:'FF0000'}
            };
        }
    });
    ws.getColumn('name').eachCell(function(cell, rowNumber) {
        if (cell.value.includes('.')){
            var lastPeriod = cell.value.lastIndexOf('.');
            if ((cell.value.charAt(lastPeriod - 1) != "r") && (cell.value.charAt(lastPeriod - 1) != "s")){
                cell.fill = {
                    type: 'pattern',
                    pattern:'solid',
                    fgColor:{argb:'FF0000'}
                };
            }
        }
    });
    ws.getColumn('name').eachCell(function(cell, rowNumber) {
        if (!(allTitles.some(v => cell.value.includes(v)))){
            cell.fill = {
                type: 'pattern',
                pattern:'solid',
                fgColor:{argb:'FF0000'}
            };
        }
    });
    ws.getColumn('country').eachCell(function(cell, rowNumber) {
        if (hasNumber(cell.value) || (cell.value.includes("(") || cell.value.includes(")"))){
            cell.fill = {
                type: 'pattern',
                pattern:'solid',
                fgColor:{argb:'FF0000'}
            };
        }
    });
    ws.getColumn('country').eachCell(function(cell, rowNumber) {
        if (cell.value.includes('.')){
            var lastPeriod = cell.value.lastIndexOf('.');
            if ((cell.value.charAt(lastPeriod - 1) != "r") && (cell.value.charAt(lastPeriod - 1) != "s")){
                cell.fill = {
                    type: 'pattern',
                    pattern:'solid',
                    fgColor:{argb:'FF0000'}
                };
            }
        }
    });

    wb.xlsx
    .writeFile(fileName)
    .then(() => {
        console.log('file created');
    })
    .catch(err => {
        console.log(err.message);
    });

    //log all speakers
    console.log("-----------------------COUNTS------------------------");
    console.log(speakerCount);
    console.log("-----------------------ERRORS------------------------");
    console.log(errors);
});