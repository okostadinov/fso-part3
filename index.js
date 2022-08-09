require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Contact = require("./models/contact");
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

app.get("/api/contacts", (req, res) => {
  Contact.find({}).then((people) => {console.log(people); res.json(people)});
});

app.get("/info", (req, res) => {
  Contact.find({}).then((people) => {
    const entries = `Phonebook has info for ${people.length} people`;
    const today = new Date();

    res.send(`<p>${entries}</p> <p>${today}</p>`);
  });
});

app.get("/api/contacts/:id", (req, res) => {
  Contact.findById(req.params.id).then((person) => res.json(person));
});

app.delete("/api/contacts/:id", (req, res) => {
  persons = persons.filter((person) => person.id !== Number(req.params.id));

  res.status(204).end();
});

app.post("/api/contacts", (req, res) => {
  const body = req.body;

  if (!(body.name && body.number)) {
    return res.status(400).json({ error: "missing person name and/or number" });
  }

  const newContact = new Contact({
    name: body.name,
    number: body.number,
  });

  newContact.save().then((contact) => res.json(contact));
});

// use after routing
app.use(unknownEndpoint);

const PORT = process.env.PORT;
app.listen(PORT);
