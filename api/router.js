const express = require('express')
const router = express.Router()
const model = require('./db/book-model')

router.get('/', async (req, res) => {
  res.send('Hello in the API!');
});

router.get('/list', async (req, res) => {
  const data = await model.read();
  res.json({status: 200, data});
});

router.get('/books', async (req, res) => {
  const data = await model.read({search: req.query.search || ''});
  res.json({status: 200, data});
});

router.put('/books/:id', async (req, res) => {
  const data = await model.update(req.params.id, req.body);
  res.status(data.status).json(data);
});

router.get('/book/:id', async (req, res) => {
  const data = await model.read({id: req.params.id});
  res.json({status: 200, data});
});

router.post('/add', async (req, res) => {
  const data = await model.create(req.body);
  res.status(data.status).json(data);
});

router.delete('/books/:id', async (req, res) => {
  await model.delete(req.params.id);
  res.json({status: 201});
});

module.exports = router
