const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const ridesCategoryModel = new Schema({
  id: ObjectId,
  categoryId: String,
  guildId: String
},
{ 
    timestamps: true
});

const RidesCategory = mongoose.model('RidesCategory', ridesCategoryModel);
module.exports = RidesCategory