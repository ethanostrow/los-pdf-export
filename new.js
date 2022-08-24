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
    //fullText = fullTextf.replace(/- /g,"");

    //initialize search variables and output; set search start location
    let speeches = [];
    let cleanSpeeches = [];
    let errors = [];
    let startDocChr = fullText.indexOf("1. ");
    let number = 2;
    let startChr = startDocChr;
    let endChr = 0;
    let currentSpeech = "";
    //console.log(number + ". ");

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

    //try best to clean the data into just the titles
    for (const j of speeches){
        let startInChr = 0;
        let endInChr = 0;
        let holding = "";
        //console.log(j); //debugging
        for (let k = 0; k < j.length; k++){
            holding = "";
            var checker = j.charAt(k); //debugging
            var checkcheck = j.charAt(k+1); //debugging
            if (k <= endInChr){
                continue;
            }
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

                //getting rid of the trailing space (super lazy)
                if (holding.charAt(holding.length - 1) === ' '){
                    holding = holding.substring(0, holding.length-1);
                }

                if(holding.includes("CONF.") || holding.includes("XX")){
                    continue;
                }

                cleanSpeeches.push(holding);
            }
        }
    }


    //log all speeches
    console.log("-----------------------SPEECHES------------------------");
    console.log(cleanSpeeches);
    console.log("-----------------------ERRORS------------------------");
    console.log(errors);
    
    
    //utility to check if we have all the appropriate numbers.
    // INSTRUCTIONS: to use, comment out the whole while loop.
    /*for (var i = 1; i < 33; i++){
        if(fullText.indexOf(i + ". ") !== 1){
            speeches.push(i);
        }
        else{
            speeches.push(-1);
        }
    }
    console.log(speeches);*/
});