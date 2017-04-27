var express = require('express');
var fs = require('fs');
var writeJsonFile = require('write-json-file')
var router = express.Router();

let getScores = function(cb){fs.readFile('./highscores.json', 'utf8', function (err, data){
    if (err) throw err;
    console.log(JSON.parse(data));
    cb(JSON.parse(data))
})};

/* GET home page. */
router.get('/saveScores', function(req, res, next) {
    // read in the file
    getScores(function (cb) {
        if (!cb.error) {
            // send JSON object
            res.json(cb);
        }
    });
});

router.post('/saveScores', function(req,res){
    getScores(function (cb) {
        if (!cb.error) {
            // put all of the scores into one array
            let scores = [];
            let keys = Object.keys(cb);
            for (let i = 0; i < keys.length; i++){
                scores.push(cb[keys[i]]);
            }
            scores.push(parseInt(req.body.score));
            // sort the array
            scores.sort(function(a, b){return b-a;});
            // put into JSON object
            let obj = {
                "first": scores[0],
                "second": scores[1],
                "third": scores[2],
                "fourth": scores[3],
                "fifth": scores[4]
            }
            // write the top 5 in array to the file as a JSON object
            writeJsonFile('highscores.json', obj).then(function(){
                res.json(cb);
            });
        }
    });
});

router.get('/clearScores', function(req, res){
    let obj = {
        "first": 0,
        "second": 0,
        "third": 0,
        "fourth": 0,
        "fifth": 0
    }

    writeJsonFile('highscores.json', obj).then(function(){
        res.json(obj);
    });
});

module.exports = router;
