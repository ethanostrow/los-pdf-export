//NPM packages
const fs = require('fs');
const pdf = require('pdf-parse');

let dataBuffer = fs.readFileSync('docs/session-1/a_conf62_sr1.pdf');

pdf(dataBuffer).then(function(data) {
    //pull in the full text of the pdf, remove line breaks and extra spaces, and log it
    let fullText = data.text;
    fullText = fullText.replace(/\n/g, " ");
    fullText = fullText.replace(/\s+/g, ' ').trim();
    fullText = fullText.replace(/- /g,"");
    console.log(fullText);

    //create search terms array and parameters
    const searchTerms = ["Mr.", "Miss", "Sir", "ACTING PRESIDENT", "PRESIDENT", "SECRETARY-GENERAL"];
    

    //initialize search variables and output; set search start location
    let speakers = [];
    let startDocChr = fullText.indexOf("1. ");
    let startChr = 0;
    let endChr = 0;

    //console.log(fullText.includes("SECRETARY-GENERAL"));

    //search for the key terms
    for (const term of searchTerms){
        speakers.push(term + "-----------------------");
        while (fullText.indexOf(term) !== -1){
            startChr = fullText.indexOf(term, startDocChr);

            //pick the appropriate string length for the type of title in question
            if(term == "ACTING PRESIDENT"){
                endChr = startChr + 16;
            }
            else if(term == "PRESIDENT"){
                endChr  = startChr + 9;
            }
            else if(term == "SECRETARY-GENERAL"){
                endChr = startChr + 17;
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
            fullText = fullText.substring(startDocChr, startChr - 1) + fullText.substring(endChr + 1);
        }
    }
    console.log(speakers);
    //console.log(fullText);
});