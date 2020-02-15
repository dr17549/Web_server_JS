const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
    res.render('index', { title: 'Graphite', home: 'active'});
  });

router.get('/login', (req, res) => {
  res.render('login', { title: 'Graphite', login: 'active'});
});

router.post('/login', (req, res) => {
  console.log(req.body);
  res.render('login', { title: 'Graphite', login: 'active'});
});

router.get('/account', (req, res) => {
  res.render('account', { title: 'Graphite', account: 'active'});
});

router.get('/stories', (req, res) => {
  res.render('stories', { title: 'Graphite', stories: 'active'});
});

router.get('/new_story', (req, res) => {
  res.render('new_story', { title: 'Graphite', stories: 'active'});
});

router.post('/new_story', (req, res) => {
  console.log(req.body);
  res.render('new_story', { title: 'Graphite', stories: 'active'});
});

router.get('/graphs', (req, res) => {
  res.render('graphs', { title: 'Graphite', graphs: 'active'});
});

module.exports = router;