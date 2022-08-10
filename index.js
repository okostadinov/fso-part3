require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Contact = require('./models/contact');
const app = express();

/***** MIDDLEWARE PRE-ROUTING *****/

app.use(express.json());
app.use(cors());
app.use(express.static('build'));

/***** UTILITIES *****/

// custom morgan token
morgan.token('custom-res-content', (req) => {
  return JSON.stringify(req.body);
});

app.use(
  morgan(
    ':method :url :res[content-length] - :response-time ms :custom-res-content'
  )
);

/***** ROUTES *****/

// fetch all
app.get('/api/contacts', (req, res) => {
  Contact.find({}).then((contacts) => {
    res.json(contacts);
  });
});

// display additional info
app.get('/info', (req, res, next) => {
  Contact.find({})
    .then((contacts) => {
      const entries = `Phonebook has info for ${contacts.length} contacts`;
      const today = new Date();

      res.send(`<p>${entries}</p> <p>${today}</p>`);
    })
    .catch((err) => next(err));
});

// fetch specific
app.get('/api/contacts/:id', (req, res, next) => {
  Contact.findById(req.params.id)
    .then((contact) => res.json(contact))
    .catch((err) => next(err));
});

// delete entry
app.delete('/api/contacts/:id', (req, res, next) => {
  Contact.findByIdAndRemove(req.params.id)
    .then(() => res.status(204).end())
    .catch((err) => next(err));
});

// add entry
app.post('/api/contacts', (req, res, next) => {
  if (!(req.body.name && req.body.number)) {
    return res
      .status(400)
      .json({ error: 'missing contact name and/or number' });
  }

  const newContact = new Contact({
    name: req.body.name,
    number: req.body.number,
  });

  newContact
    .save()
    .then((contact) => res.json(contact))
    .catch((err) => next(err));
});

// update entry
app.put('/api/contacts/:id', (req, res, next) => {
  const { name, number } = req.body;

  Contact.findByIdAndUpdate(
    req.params.id,
    { name, number },
    {
      new: true,
      runValidators: true,
      context: 'query',
    }
  )
    .then((updatedContact) => res.json(updatedContact))
    .catch((err) => next(err));
});

/***** MIDDLEWARE POST-ROUTING *****/

// handles unknown url endpoints
const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' });
};

app.use(unknownEndpoint);

// handles request catch block
const errorHandling = (err, req, res, next) => {
  console.log(err.message);

  if (err.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' });
  } else if (err.name === 'ValidationError') {
    return res.status(400).send({ error: err.message });
  }

  next(err);
};

app.use(errorHandling);

/***** START *****/

const PORT = process.env.PORT;
app.listen(PORT);
