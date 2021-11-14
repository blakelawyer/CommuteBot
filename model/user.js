const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const userModel = new Schema({
    id: ObjectId,
    name: {
        first: String,
        last: String
    },
    email: {
        type: String,
        required: true,
        index: {
        unique: true,
        sparse: true
        }
    },
    discordUserId: String
},
{ 
    timestamps: true
});

const User = mongoose.model('User', userModel);
module.exports = User;