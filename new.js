//NPM packages
const fs = require('fs');
const pdf = require('pdf-parse');

let dataBuffer = fs.readFileSync('docs/session-1/a_conf62_sr2.pdf');

pdf(dataBuffer).then(function(data) {
    

    //pull in the full text of the pdf, remove line breaks and extra spaces, and log it
    let fullText = data.text;
    //console.log(fullText);
    //fullText = fullText.replace(/\n/g, " ");
    fullText = fullText.replace(/\s+/g, ' ').trim();
    //fullText = fullTextf.replace(/- /g,"");

    //initialize search variables and output; set search start location
    var speeches = [];
    var speakers = [];
    var speakerCount = [];
    let errors = [];
    let startDocChr = fullText.indexOf("1. ");
    let number = 2;
    let startChr = startDocChr;
    let endChr = 0;
    let currentSpeech = "";
    
    //create prefix terms array
    const prefixes = ["Mr.", "Miss", "Sir", "Rev."];

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
                    
                    //if no ), add 40
                    if (nextClose === -1){
                        holding += j.substring(endInChr, endInChr + 40);
                    }

                    //if the ) comes more than 15 characters later, cut it off
                    else if ((nextClose - endInChr) > 40){
                        holding += j.substring(endInChr, endInChr + 40);
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
        var timesSpoke = 0;
        for (let o = 0; o < speakers.length; o++){
            if (speakers[n] === speakers[o]){
                timesSpoke++;
            }
        }
        speakerCount.push(speakers[n] + ": " + timesSpoke);
    }
    //remove duplicate counts
    speakerCount = [...new Set(speakerCount)];
    speakerCount = Array.from(speakerCount);

    //log all speakers
    //console.log(speeches); //debugging
    console.log("-----------------------SPEAKERS------------------------");
    console.log(speakers);
    console.log("-----------------------COUNTS------------------------");
    console.log(speakerCount);
    console.log("-----------------------ERRORS------------------------");
    console.log(errors);
});