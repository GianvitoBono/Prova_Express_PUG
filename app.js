const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

//Connessione a MongoDB
mongoose.connect('mongodb://localhost/node_primo_progetto');
let db = mongoose.connection;
// Controllo errori DB
db.on('error', (err) => {
  console.log(err);
});
//Controllo Connessione
db.once('open', () => {
  console.log('Connesso a MongoDB');
});

// Init App
const app = express();

//Importazione Modello
let Article = require('./models/article');

// Caricamento View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Body Parser Middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

//Set Cartella Pubblica
app.use(express.static(path.join(__dirname, 'public')));

// Home Route
app.get('/', (req, res) => {
  Article.find({}, (err, articles) => {
    if(err) {
      console.log(err);
    } else {
      res.render('index', {
        title:'Pagina iniziale',
        articles: articles
      });
    }
  });
});

// Aggiungi articolo Route
app.get('/articles/add', (req, res) => {
  res.render('add_article', {
    title:'Aggiungi articolo'
  });
});

// Aggiungi Articolo POST Route
app.post('/articles/add', (req, res) => {
  let article = new Article();
  article.title = req.body.title;
  article.author = req.body.author;
  article.body = req.body.body;

  article.save((err) => {
    if(err) {
      console.log(err);
      return;
    } else {
      res.redirect('/');
    }
  });
});

// GET Articolo
app.get('/article/:id', (req, res) => {
  Article.findById(req.params.id, (err, article) => {
    res.render('article', {
      article: article
    });
  });
});

// Avvio Server
app.listen(3000, () => {
  console.log('Server in ascolto sulla porta 3000');
});
