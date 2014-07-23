var express = require('express');
var app     = express();
var exphbs  = require('express3-handlebars');
var request = require('request');
var api_key = '0984607e2222db7a1be6a5692741ca08';
var port    = process.env.PORT || 3000;

app.set('views', './views');
app.set('view engine', 'handlebars');
app.engine('handlebars', exphbs({ defaultLayout: 'layout' }));

app.use('/css', express.static(__dirname + '/css'));

app.route('/photos/:city').get(function (req, res, next) {
    var query = 'select * from flickr.photos.search where woe_id in ' +
            '(select woeid from geo.places where text="' + req.params.city + '" limit 1)' +
            ' AND api_key=' + api_key + ' limit 9';
    request('https://query.yahooapis.com/v1/public/yql', {
        qs: {
            q: query,
            format: 'json'
        }
    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var photos = (photos = JSON.parse(body).query.results) ? photos.photo : [];
            res.render('photos', {
                photos: photos
            });
        }
    });
});
app.route('/photo/:id').get(function (req, res, next) {
    var query = 'select * from flickr.photos.info where photo_id=' + req.params.id +
            ' AND api_key=' + api_key;
    request('https://query.yahooapis.com/v1/public/yql', {
        qs: {
            q: query,
            format: 'json'
        }
    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var photo = JSON.parse(body).query.results.photo;
            res.render('photo', photo);
        }
    });
});
app.route('/').get(function (req, res, next) {
    res.render('home', {
        cities: ['miami', 'sunnyvale']
    });
});

app.listen(port);
console.log('listening on port: %d', port);
