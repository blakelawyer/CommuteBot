const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const driverModel = new Schema({
  id: ObjectId,
  userId: String,
  car: { 
    make: String,
    model: String,
    licensePlate: String,
    color: String,
    seats: Number
  }
},
{ 
    timestamps: true
});

const Driver = mongoose.model('Driver', driverModel);
module.exports = Driver;