    /*
    |--------------------------------------------------------------------------
    | Rice Dashboard
    |--------------------------------------------------------------------------
    |
    | By Jozo_85
    | 2022-2023
    |
    */



console.log('###########   ###      ###     ###########')
console.log('#         #    #      #        ##')
console.log('#         #    #     #         ##')
console.log('###########    #     #         ###########')
console.log('#     #        #     #         ###########')
console.log('#      #       #     #         ##')
console.log('#       #      #      #        ##')
console.log('#        #    ###      ###     ##########')
//config
const webconfig = require('./config/website.json')
const database = require('./config/database.json')

//Mongoose
const mongoose = require('mongoose');
//Express
var express = require('express');
//Path
var path = require('path');
//App
var app = express();

//View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//App start(listen)
app.listen(webconfig.port, function () {
    console.log('Dashboard start on port ' + webconfig.port);
});

//Pages
app.get('/', function(req, res) {
    res.render('pages/login');
})

//Mongoose
mongoose.connect(database.url, {

    useNewUrlParser: database.useNewUrlParser,
    useUnifiedTopology: database.useUnifiedTopology
}).then(() => {
    console.log("Připojeno k databázi")
})

