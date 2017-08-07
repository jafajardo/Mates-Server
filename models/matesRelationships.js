const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MyMatesSchema = new Schema({
  mateID: Schema.Types.ObjectId,
  mates: [String]
});

const ModelClass = mongoose.model('matesrelationships', MyMatesSchema);

module.exports = ModelClass;