const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient

var db;
var mysort;

MongoClient.connect('mongodb://localhost:27017/examen',  { useNewUrlParser: true }, (err, database) => {
  if (err) return console.log(err)
  db = database.db('examen')
   mysort = { reason: 1 };
  app.listen(process.env.PORT || 3000, () => {
    console.log('Listening on port 3000')
  })
})

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.static('public'))

// Redirect to list
app.get('/', (req, res) => {
   res.redirect('/list')
})

// List all inhaalexamens
app.get('/list', (req, res) => {
  db.collection('inhaal').find().sort(mysort).toArray((err, result) => {
    if (err) return console.log(err)
    res.render('list.ejs', { inhaal: result })
  })
})

// Show the add inhaalexamen form
app.get('/add', (req, res) => {
   res.render('add.ejs', {})
})

// Add a inhaalexamen to the db
app.post('/add', (req, res) => {
  db.collection('inhaal').insertOne(req.body, (err, result) => {
    if (err) return console.log(err)
     res.redirect('/list')
  })
})