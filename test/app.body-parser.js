const express = require('express');
const app = express();
//use bodyParser middleware
const bodyParser = require('body-parser');

// create application/json parser
var jsonParser = bodyParser.json()
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

// POST /login gets urlencoded bodies
app.post('/login', urlencodedParser, function (req, res) {
    res.send('data, ' + req.body.username)
})

// POST /api/users gets JSON bodies
app.post('/json-data', jsonParser, function (req, res) {
    res.send(req.body);
})

app.listen(8000, () => {
    console.log('Server is running at port 8000');
});