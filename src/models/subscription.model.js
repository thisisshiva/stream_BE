const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
    subsciber: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    channel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    
},{timestamps: true});

const Subscription = mongoose.model('Subscription', subscriptionSchema);

module.exports = Subscription;