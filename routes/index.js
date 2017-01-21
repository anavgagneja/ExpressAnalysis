    var express = require('express');
    var router = express.Router();

    //Requires for spell-checker
    var dictionary = require('dictionary-en-us');
    var nspell = require('nspell');

    /* GET home page. */
    var watson = require('watson-developer-cloud');

    var tone_analyzer = new watson.ToneAnalyzerV3({
      username: 'cdedd54c-683f-4e0a-848c-262a02f354e8',
      password: 'ypYZZkbvj6bc',
      version: 'v3',
      version_date: '2016-05-19 '
    });

    router.get('/', function(req, res, next) {

         res.render('editor', { emotionArray: [],languageArray: [], socialArray: []});

    });


    router.post('/add', function(req, res, next) {

        tone_analyzer.tone({ text: req.body.txt },

            dictionary(function (err, dict) {
              if (err) {
                throw err;
              }

              var spell = nspell(dict);
              var email = req.body.txt;
              var punctuationless = email.replace(/[.,\/#!$%\^&\*;:{}=\_`~()]/g,"");
              var finalString = punctuationless.replace(/\s{2,}/g," ");
              var words = finalString.split(" ");

              var numWords = words.length;
              var misspelled = 0;

              for(var letter=65;letter<91;letter++)
              {
                  var _char = String.fromCharCode(letter);
                  spell.remove(_char);
              }
              for(var letter=97;letter<=122;letter++)
              {
                  var _char = String.fromCharCode(letter);
                  spell.remove(_char);
              }

              spell.add('A');
              spell.add('a');
              spell.add('i');
              spell.add('I');
              console.log(words);

              words.forEach(function(obj) {
                    if(spell.correct(obj) == false) {
                        console.log(obj);
                        misspelled++;
                    }
              })
              var ratio = misspelled/numWords;
              console.log("There are " + misspelled + " misspelled words out of " + numWords + " words. Ratio: " + ratio);
               res.render('editor', { misspelled: misspelled,ratio: ratio, numWords: numWords});
            });



          function(err, tone) {
            if (err)
              console.log(err);
            else {
              console.log(JSON.stringify(tone, null, 2) + "\n\n\n");
              var object = tone["document_tone"]["tone_categories"][0]["tones"][0]["tone_name"]
             //console.log(JSON.stringify(object, null, 2));

             var emotionArray = [];
             var languageArray = [];
             var socialArray = [];

             var emotion = tone["document_tone"]["tone_categories"][0]["tones"]

             emotion.forEach(function(obj){
                 var newObj = {
                     name: obj["tone_name"],
                     value: obj["score"]
                 }
                 emotionArray.push(newObj);
             });

             var language = tone["document_tone"]["tone_categories"][1]["tones"]

             language.forEach(function(obj){
                 var newObj = {
                     name: obj["tone_name"],
                     value: obj["score"]
                 }
                 languageArray.push(newObj);
             });

             var social = tone["document_tone"]["tone_categories"][2]["tones"]

             social.forEach(function(obj){
                 var newObj = {
                     name: obj["tone_name"],
                     value: obj["score"]
                 }
                 socialArray.push(newObj);
             });

             emotionArray.forEach(function(obj){
                 console.log(obj.name +  " - " + obj.value);

             });
               res.render('editor', { emotionArray: emotionArray,languageArray: languageArray, socialArray: socialArray});
         }
        });

    });

    module.exports = router;
