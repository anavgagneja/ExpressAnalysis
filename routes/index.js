var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    tone_analyzer.tone({ text: 'A word is dead when it is said, some say. Emily Dickinson' },
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
           res.render('index', { title: 'Express', emotionArray: emotionArray,languageArray: languageArray, socialArray: socialArray});
     }
    });

});

module.exports = router;
