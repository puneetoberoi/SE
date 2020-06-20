const express = require("express");
var mysql = require("mysql");
const path = require("path");
const hbs = require("hbs");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const app = express();
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var settings = require("./mysql/settings.json");
const viewsPath = path.join(__dirname, './template/views')
const partialsPath = path.join(__dirname, './template/partials');
var urlencodedParser = bodyParser.urlencoded({ extended: true })
app.use(express.static('views'));  // set a static folder so we donthave to put in a command for every page(about, contact etc)
app.use(bodyParser.json()); //.use is to introduce middlewware
app.use(cookieParser());

app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

const atlastURL="mongodb+srv://puneet:02040204@nodeapi-etlso.mongodb.net/test?retryWrites=true&w=majority";

const databaseName = 'javamongo';
var db
var put
var methods = [];
MongoClient.connect('mongodb+srv://puneet:02040204@nodeapi-etlso.mongodb.net/test?retryWrites=true&w=majority', (err, database) => {
  if (err) return console.log(err)
  db = database.db(databaseName)
  console.log("connected");
  app.listen(process.env.PORT || 3000, () => {
    console.log('listening on 3000')
  })
})


app.get('/', function (req, res, next) {
  res.render("home", { title: 'Jaspreet Singh' });
})


app.get('/test/:query', function (req, res) {
  urls=[]
  notes = []
  body = []
  first = []
  db.collection('mongo').find({ $text: { $search: req.params.query } },
    { score: { $meta: "textScore" } })
    .sort({ score: { $meta: "textScore" } })
    .limit(6).toArray((error, data) => {
      if(error) throw error;
      var one = new Set();
      var two = new Set();
      data.map(element =>{
        var res = (element.url).split(" ")
        res.forEach(a=>{
          console.log(a)
          one.add(a)
        })
        
      })

      one.forEach(element=>{
      })
      
      console.log(one.size + " set size")
      if(one.size === 0){
        return res.send({
          "output": "no results found for your query"
        })
      }
      
      let result = one.forEach(element =>{
        console.log(element + " final url")
         urls.push(element)
      })
      
      res.render('test', {
        items: urls,
        title: 'Jaspreet Singh'
      })
    })

})


app.post('/test/', urlencodedParser, function (req, res, next) {
  var put = req.body.query;
  db.collection("query").insert({ body: put }, function (err, res) {
    if (err) throw err;
  });
  res.redirect('/test/' + put)
})