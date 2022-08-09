const mongoose = require("mongoose");

const url = process.env.NOTES_MONGODB_URL;

mongoose
  .connect(url)
  .then(() => console.log("successfully connected to database"))
  .catch((err) => console.log(`connection to database unsuccessful ${err}`));

const contactSchema = new mongoose.Schema({
  name: String,
  number: String,
});

contactSchema.set("toJSON", {
  transform: (document, obj) => {
    obj.id = obj._id.toString();
    delete obj._id;
    delete obj.__v;
  },
});

const Contact = mongoose.model("Contact", contactSchema);

module.exports = Contact;
