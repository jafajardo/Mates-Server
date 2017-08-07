const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MateRequestSchema = new Schema({
  mateID: Schema.Types.ObjectId,
  requests: [String]
});

const ModelClass = mongoose.model('mateRequests', MateRequestSchema);

module.exports = ModelClass;