const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const riderModel = new Schema({
  id: ObjectId,
  userId: String
},
{ 
    timestamps: true
});

const Rider = mongoose.model('Rider', riderModel);
module.exports = Rider;