const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const matesSchema = new Schema({
  name: String,
  hobby: String
});

const ModelClass = mongoose.model('mates', matesSchema);

module.exports = ModelClass;
