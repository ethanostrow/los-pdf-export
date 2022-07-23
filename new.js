//NPM packages
const fs = require('fs');
const pdf = require('pdf-parse');

let dataBuffer = fs.readFileSync('docs/session-1/a_conf62_sr1.pdf');

pdf(dataBuffer).then(function(data) {
    

    //pull in the full text of the pdf, remove line breaks and extra spaces, and log it
    let fullText = data.text;
    //console.log(fullText);
    //fullText = fullText.replace(/\n/g, " ");
    fullText = fullText.replace(/\s+/g, ' ').trim();
    //fullText = fullText.replace(/- /g,"");
    console.log(fullText);

    //create search terms array and parameters
    const searchTerms = ["Mr.", "Miss", "Sir", "ACTING PRESIDENT", "PRESIDENT", "SECRETARY-GENERAL"];
    

    //initialize search variables and output; set search start location
    let speakers = [];
    let startDocChr = fullText.indexOf("1. ");
    let startChr = 0;
    let endChr = 0;

});