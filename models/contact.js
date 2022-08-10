const mongoose = require('mongoose');

const url = process.env.NOTES_MONGODB_URL;

mongoose
  .connect(url)
  .then(() => console.log('successfully connected to database'))
  .catch((err) => console.log(`connection to database unsuccessful ${err}`));

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    minLength: 8,
    validate: {
      validator: function (v) {
        return /\d{2,3}-\d{6,}/.test(v); // matches xx(x)-xxxxxx(...)
      },
      message: (props) => `${props.value} is not a valid phone number`,
    },
    required: true,
  },
});

contactSchema.set('toJSON', {
  transform: (document, obj) => {
    obj.id = obj._id.toString();
    delete obj._id;
    delete obj.__v;
  },
});

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;
