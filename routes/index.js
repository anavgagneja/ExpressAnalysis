Skip to content
This repository
Search
Pull requests
Issues
Gist
 @jeanmichaeldiei
 Unwatch 3
  Star 0
 Fork 0 anavgagneja/BoilerMake
 Code  Issues 0  Pull requests 0  Projects 0  Wiki  Pulse  Graphs
Branch: master Find file Copy pathBoilerMake/routes/index.js
197426c  8 minutes ago
@anavgagneja anavgagneja Configured Progress Bars for language and emotional analysis
2 contributors @Dhruv97 @anavgagneja
RawBlameHistory
82 lines (63 sloc)  2.3 KB
var express = require('express');
var router = express.Router();

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
                 value: obj["score"]*100
             }
             emotionArray.push(newObj);
         });

         var language = tone["document_tone"]["tone_categories"][1]["tones"]

         language.forEach(function(obj){
             var newObj = {
                 name: obj["tone_name"],
                 value: obj["score"]*100
             }
             languageArray.push(newObj);
         });

         var social = tone["document_tone"]["tone_categories"][2]["tones"]

         social.forEach(function(obj){
             var newObj = {
                 name: obj["tone_name"],
                 value: obj["score"]*100
             }
             socialArray.push(newObj);
         });

         emotionArray.forEach(function(obj){
             console.log(obj.name +  " - " + obj.value);
         });
         languageArray.forEach(function(obj){
             console.log(obj.name +  " - " + obj.value);
         });
         socialArray.forEach(function(obj){
             console.log(obj.name +  " - " + obj.value);
         });
           res.render('editor', { emotionArray: emotionArray,languageArray: languageArray, socialArray: socialArray});
     }
    });

});

module.exports = router;
