const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const _ = require('lodash');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const TodoTask = require('./models/db');


app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(expressLayouts);


const mongoURI = process.env.DB_CONNECT;
const connectionParams = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};


mongoose
  .connect(mongoURI, connectionParams)
  .then(app.listen(3000, () => console.log('Server is running on 3000')))
  .catch((error) => handleError(error));


app.get('/', async (req, res) => {
  try {
    const tasks = await TodoTask.find({});
    res.render('index.ejs', { todoTasks: tasks });
  } catch (err) {
    console.log(err);
  }
});


app.post('/', async (req, res) => {
  const todoTask = new TodoTask({
    content: req.body.content,
  });
  try {
    await todoTask.save();
    res.redirect('/');
  } catch (err) {
    res.redirect('/');
  }
});


app
  .route('/edit/:id')
  .get(async (req, res) => {
    const id = req.params.id;
    try {
      const tasks = await TodoTask.find({});
      res.render('todoEdit.ejs', { todoTasks: tasks, idTask: id });
    } catch (err) {
      console.log(err);
    }
  })
  .post(async (req, res) => {
    const id = req.params.id;
    try {
      await TodoTask.findByIdAndUpdate(id, { content: req.body.content });
      res.redirect('/');
    } catch (err) {
      console.log(err);
    }
  });


app.get('/remove/:id', async (req, res) => {
  const id = req.params.id;
  try {
    await TodoTask.findByIdAndRemove(id);
    res.redirect('/');
  } catch (err) {
    console.log(err);
  }
});
