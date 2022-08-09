const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static("build"));

// custom middleware
const unknownEndpoint = (req, res, next) => {
  res.status(404).send({ error: "unknown endpoint" });
};

// custom morgan token
morgan.token("custom-res-content", (req) => {
  return JSON.stringify(req.body);
});

app.use(
  morgan(
    ":method :url :res[content-length] - :response-time ms :custom-res-content"
  )
);

//utils
const generateId = () => {
  const idRange = 100;

  const getRandomInt = () => Math.floor(Math.random() * idRange);

  let newId = getRandomInt();

  while (persons.find((person) => person.id === newId)) {
    newId = getRandomInt();
  }

  return newId;
};

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/info", (req, res) => {
  const entries = `Phonebook has info for ${persons.length} people`;
  const today = new Date();

  res.send(`<p>${entries}</p> <p>${today}</p>`);
});

app.get("/api/persons/:id", (req, res) => {
  const person = persons.find((person) => person.id === Number(req.params.id));

  if (person) res.json(person);
  else res.status(404).end();
});

app.delete("/api/persons/:id", (req, res) => {
  persons = persons.filter((person) => person.id !== Number(req.params.id));

  res.status(204).end();
});

app.post("/api/persons", (req, res) => {
  const body = req.body;

  if (!(body.name && body.number)) {
    return res.status(400).json({ error: "missing person name and/or number" });
  }

  if (persons.find((person) => person.name === body.name)) {
    return res.status(400).json({ error: "this person already exists" });
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  };

  persons = persons.concat(person);

  res.json(person);
});

// use after routing
app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT);
