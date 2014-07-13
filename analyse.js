var request = require('request'),
	extractor = require('unfluff'),
	natural = require('natural'),
	sentiment = require('Sentimental'),
    mongodb = require('mongodb');

var AlchemyAPI = require('./alchemy/alchemyapi');
var alchemyapi = new AlchemyAPI();

var url = "http://www.bbc.com/news/uk-28181045",
	TfIdf = natural.TfIdf,
    tfidf = new TfIdf(),
    analyze = sentiment.analyze;
/*
request(url, function(error, response, html){

        // First we'll check to make sure no errors occurred when making the request
        var data = extractor(html);
        tfidf.addDocument(data.title);
        tfidf.listTerms(0 ).forEach(function(item) {
    		console.log(item.term + ': ' + item.tfidf);
		});
		console.log(analyze(data.title));
        //console.log(data.text);
        
});
*/

var commandLineParameters = {};

for(var i = 0; i < process.argv.length; i++) {
    var parameter = process.argv[i].split("=");
    if(parameter.length > 1) {
        commandLineParameters[parameter[0]] = parameter[1];
    }
}

var feedSource = "http://feeds.bbci.co.uk/news/uk/rss.xml";
var parseString = require('xml2js').parseString;
var DBuri = 'mongodb://'+commandLineParameters.user+':'+commandLineParameters.password+'@ds061228.mongolab.com:61228/newswatch';


request(feedSource, function(error, response, xml){

        parseString(xml, function (err, result) {
            analyseArticles(result.rss.channel[0].item)
        });
        
});



var analyseArticles = function(articles) {
    var limit = articles.length > 5 ? 5 : articles.length;
    var concepts = [];
    for(var i = 0; i < limit; i++) {
        (function(i, concepts, title) {
            alchemyapi.keywords('text', title, { 'showSourceText':1 }, function(response) {
                for(var j = 0; j < response.keywords.length; j++) {
                    concepts.push(response.keywords[j].text);    
                }
                if(i === 4) {
                    storeConcepts(concepts);
                }
            });
        }(i, concepts, articles[i].title[0]));


    };
};

var storeConcepts = function(concepts) {
    mongodb.MongoClient.connect(DBuri, function(err, db) {
        if(err) throw err;

        var newsSources = db.collection('newsSources');
        for(var i = 0; i < concepts.length; i++) {
            (function(newsSources, concepts, i) {
                var concept = concepts[i];
                newsSources.update({name : "BBC UK", headlineTopics : { "$elemMatch": { "topic": concept} }}, { $inc:   { "headlineTopics.$.recurrance" : 1}}, function(err) {
                            if (err)  {
                                console.warn(err.message);
                            } else {
                                console.log('successfully updated');
                            }
                });
            }(newsSources, concepts, i));

        }
        setTimeout(function() {
            db.close(function (err) {
              if(err) throw err;
            });
        }, 2000);
    });

    console.log(concepts);
};