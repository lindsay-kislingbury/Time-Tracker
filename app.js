//Express
var express = require('express')
var app = express()
var path = require('path')


//Set Views
app.use(express.static(__dirname + '/public'));
app.set('views', path.join(__dirname, '/views')); 
app.set('view engine', 'ejs')

//Home Page
app.get('/', function (req, res) {
    res.render('index')
})

app.post('/auth', function (req, res) {

})

app.listen(4000), () => {
    
}