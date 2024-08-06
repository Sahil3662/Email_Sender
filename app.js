const express = require('express');
var bodyParser = require('body-parser');
const app = express();

app.engine('.html', require("ejs").__express);
app.set('views', __dirname + "/views");
app.set('view engine', 'html');
app.use('/static', express.static(__dirname + "./public"))
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  res.header('Access-Control-Allow-Methods', ['POST', 'GET', 'PUT']);
  return next();
})


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", function (req, res) {
  console.log("server is running")
  res.render("index.html")
})

