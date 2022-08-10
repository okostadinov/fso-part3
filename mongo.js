const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log(
    'Please provide the password as an argument: node mongo.js <password>'
  );
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://okostadinov:${password}@cluster0.r7npmz3.mongodb.net/phonebookApp?retryWrites=true&w=majority`;

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Person', personSchema);

if (process.argv.length < 4) {
  mongoose.connect(url).then(() => {
    Person.find({}).then((result) => {
      console.log('phonebook:');
      result.forEach((person) => {
        console.log(`${person.name} ${person.number}`);
      });
      return mongoose.connection.close();
    });
  });
} else if (process.argv.length === 5) {
  mongoose
    .connect(url)
    .then(() => {
      const person = new Person({
        name: process.argv[3],
        number: process.argv[4],
      });

      return person.save();
    })
    .then((person) => {
      console.log(`added ${person.name} number ${person.number} to phonebook`);
      return mongoose.connection.close();
    });
} else {
  console.log(`Incorrect argument count (${process.argv.length})`);
  console.log(
    '************\nIn case that you would like to fetch all contacts: `node mongo.js <password>`'
  );
  console.log(
    '************\nIn case that you would like to add a new contact: `node mongo.js <password> <name> <number>`'
  );
  console.log(
    '************\nIf you are trying to add a new contact and the name consists of more than one word, make sure to put it in quotes: e.g. "John Doe"'
  );
}
