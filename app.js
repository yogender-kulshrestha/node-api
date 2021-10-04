const http = require('http')
//use express req/res
const express = require('express');
// set up our express app
const app = express();
//use bodyParser middleware
const bodyParser = require('body-parser');
//use dotenv config
const dotenv = require('dotenv');
dotenv.config();
// use config db
const dbConfig = require("./config/db.js")
//use mongo database
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

/*{
    useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
}*/
// connect to mongodb
mongoose.connect(dbConfig.url).then(() => {
    console.log("Connected to the database!");
}).catch(err => {
    console.log("Cannot connect to the database!", err);
    process.exit();
});

// app.use(express.static('public'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

// initialize routes
app.use('/api', require('./routes/student'));

// error handling middleware
app.use(function(err,req,res,next){
    //console.log(err);
    res.status(422).send({error: err.message});
});

app.get('/',(req, res) => {
    res.end(JSON.stringify({"app" : "Welcome to Node Api"}, null, 4));
});

/*app.get('/about',(req, res) => {
    res.send('This is about page');
});

app.get('/get',(req, res) => {
    res.send(req.query.name);
    // res.end(JSON.stringify(req.query, null, 2));
});

app.post('/post',(req, res) => {
    res.send(req.body);
    // res.end(JSON.stringify(req.body, null, 2));
});*/

// set port, listen for requests
const hostname = process.env.HOST || '127.0.0.1'
const port = process.env.PORT || 8000
app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`)
})
