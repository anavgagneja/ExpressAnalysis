var express = require('express');
var router = express.Router();
var cors = require('cors');

//Requires for spell-checker
var dictionary = require('dictionary-en-us');
var nspell = require('nspell');

/* GET home page. */
var watson = require('watson-developer-cloud');

var tone_analyzer = new watson.ToneAnalyzerV3({
    username: '2b2e03d0-4113-4f91-99dc-ffe711238793',
    password: 'LLXFjSjiuSWZ',
    version: 'v3',
    version_date: '2016-05-19 '
});

router.get('/', function(req, res, next) {
var color = 'white';
var array = Array.apply(null, Array(5)).map(Number.prototype.valueOf,0);
var array2 = Array.apply(null, Array(3)).map(Number.prototype.valueOf,0);
var array3= Array.apply(null, Array(5)).map(Number.prototype.valueOf,0);
var coeff = 0;
    res.render('editor', { text: "", emotionArray: array,languageArray: array2, socialArray: array3, coeff: coeff, color: color});

});


var corsOptions = {
    origin: /^[^.\s]+\.mixmax\.com$/,
    credentials: true
};
router.post('/resolver', cors(corsOptions), function(req, res, next) {
    var data = JSON.parse(req.body.params);
    var html = data.text;
    res.json({
        body: html,
        raw: true
    });
});


router.post('/', function(req, res, next) {
    var ratio = 0.0;
    var numWords = 0;
    var numMisspelled = 0;
    coeff = 0;
    function calculateCoefficient(languageArray, socialArray, ratio) {
        //high emotional range + extraversion is HIGHLY impacts casualness
        //high emotional range + conscientiousness, Analytical is HIGHLY impacts professionalism
        //Agreeableness is medium impact on casualness
        //Openness is a low impact on casualness

        var high = 47.0
        var analytical = languageArray[0].value;
        var confidence = languageArray[1].value;
        var tentative = languageArray[2].value;
        var openness = socialArray[0].value;
        var conscientiousness = socialArray[1].value;
        var extraversion = socialArray[2].value;
        var agreeableness = socialArray[3].value;
        var emotionalRange = socialArray[4].value;

        coeff = openness + conscientiousness + agreeableness - tentative - extraversion;
        if(coeff < 33 && coeff >= 0) {
            color = '#CF000F';
        }
        if(coeff >= 33 && coeff < 66) {
            color = '#f1c40f';
        }
        if(coeff >= 66 && coeff <= 100) {
            color = 'green';
        }
        if(coeff > 100) {
            color = 'green';
            coeff = 100;
        }


        console.log("Coefficient: " + coeff);
    };

    dictionary(function (err, dict) {
        if (err) {
            throw err;
        }

        var spell = nspell(dict);
        var email = req.body.text;
        var punctuationless = email.replace(/[.,\/#!$%?\^&\*;:{}=\_`~()]/g,"");
        var finalString = punctuationless.replace(/\s{2,}/g," ");
        var words = finalString.split(" ");

        numWords = words.length;

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
        //console.log(words);

        words.forEach(function(obj) {
            if(spell.correct(obj) == false) {
                console.log(obj);
                numMisspelled++;
            }
        })
        ratio = numMisspelled/numWords;
    });

    tone_analyzer.tone({ text: req.body.text },

        function(err, tone) {
            if (err)
            console.log(err);
            else {
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

                calculateCoefficient(languageArray, socialArray, ratio);
                res.render('editor', { text: req.body.text, emotionArray: emotionArray,languageArray: languageArray, socialArray: socialArray, numMisspelled: numMisspelled,ratio: ratio, numWords: numWords, coeff: coeff, color: color});
            }
        });

    });

    module.exports = router;
