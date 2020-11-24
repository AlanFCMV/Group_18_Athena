// Mongoose
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CardSetSchema = new Schema({
    Creator: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    Name: {
        type: String,
        required: true
    },   
    LikedBy: {
        type: [Schema.Types.ObjectId],
        default: []
    },
    Cards: {
        type: [{
            Question: String,
            Answer: String
        }],
        default: []
    },
    CreatedAt: {
        type: Date,
        default: Date.now
    }
});

// Export the Token
const CardSet = mongoose.model('cardset', CardSetSchema);
module.exports = CardSet;