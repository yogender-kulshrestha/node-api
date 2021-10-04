const express = require('express');
const app = express();
//use bodyParser middleware
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

app.get('/',(req, res) => {
    res.send('Welcome To Express');
});

app.get('/about',(req, res) => {
    res.send('This is about page');
});

app.get('/get',(req, res) => {
    res.send(req.query.name);
    // res.end(JSON.stringify(req.query, null, 2));
});

app.post('/post',(req, res) => {
    res.send(req.body);
    // res.end(JSON.stringify(req.body, null, 2));
});

app.listen(8000, () => {
    console.log('Server is running at port 8000');
});