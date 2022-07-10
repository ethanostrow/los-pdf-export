//NPM packages
const fs = require('fs');
const pdf = require('pdf-parse');

let dataBuffer = fs.readFileSync('docs/session-1/a_conf62_sr1.pdf');

pdf(dataBuffer).then(function(data) {
    //pull in the full text of the pdf, remove line breaks and extra spaces, and log it
    let fullText = data.text;
    fullText = fullText.replace(/\n/g, " ");
    fullText = fullText.replace(/\s+/g, ' ').trim();
    console.log(fullText);

    //create search terms array and parameters
    const searchTerms = ["Mr.", "Miss", "Sir", "ACTING PRESIDENT", "PRESIDENT, SECRETARY-GENERAL"];
    

    //initialize search variables and output; set search start location
    let speakers = [];
    let startDocChr = fullText.indexOf("1. ");
    let endDocChr = fullText.indexOf("The meeting rose");
    let startChr = 0;
    let endChr = 0;

    //search for the key terms
    for (const term of searchTerms){
        while (fullText.indexOf(term) !== -1){
            startChr = fullText.indexOf(term, startDocChr);

            //pick the appropriate string length for the type of title in question
            if (fullText.substring(startChr, startChr + 1) != "M" && fullText.substring(startChr, startChr + 1) != "S"){
                endChr = fullText.indexOf("NT", startChr) + 2;
            }
            else {
                endChr = fullText.indexOf(")", startChr) + 1;
            }

            //make sure we don't have a stupidly long substring
            if(endChr-startChr>60){
                endChr = startChr + 60;
            }

            //push the substring to the storage array and remove it from the document
            speakers.push(fullText.substring(startChr, endChr));
            fullText = fullText.substring(0, startChr - 1) + fullText.substring(endChr + 1, fullText.length);
        }
    }
    console.log(speakers);
});