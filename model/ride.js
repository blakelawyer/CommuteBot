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
  driverChannel: String,
  riderChannel: String,
  ticketChannelMsg: String,
  startLocation: String,
  endLocation: String,
  request: { type: Date, default: Date.now },
  ackTime: { type: Date, default: null },
  pickupTime: { type: Date, default: null },
  dropoffTime: { type: Date, default: null },
  cancelTime: { type: Date, default: null },
  ticketChannel: String
},
{ 
    timestamps: true
});

const Ride = mongoose.model('Ride', rideModel);
module.exports = Ride