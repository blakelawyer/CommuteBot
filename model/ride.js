const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const rideModel = new Schema({
  id: ObjectId,
  driverId: String,
  riderId: String,
  gulidId: String,
  driverMessageId: String,
  requestMessageId: String,
  startLocation: String,
  endLocation: String,
  request: { type: Date, default: Date.now },
  ackTime: Date,
  pickupTime: Date,
  dropoffTime: Date
},
{ 
    timestamps: true
});

const Ride = mongoose.model('Ride', rideModel);
module.exports = Ride