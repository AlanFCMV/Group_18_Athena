// Mongoose
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema for the Users
const UserSchema = new Schema({
    // True when user verifies email.
    Verified: {
        type: Boolean,
        default: false
    },
    // User's name, also serves as a login.
    Username: {
      type: String,
      required: [true, 'Username field is required']
    },
    // User's Password, hashed
    Password: {
      type: String,
      required: [true, 'Password field is required']
    },
    // User's email
    Email: { 
        type: String,
        required: [true, 'Email field is required']
    },
    // Total number of likes across your card sets.
    Score: {
        type: Number,
        default: 0
    },
    // Array of the user's created cardset IDs
    CreatedCardSets: {
        type: [Schema.Types.ObjectId],
        default: []
    },
    // Array of the user's liked cardset IDs
    LikedCardSets: {
        type: [Schema.Types.ObjectId],
        default: []
    },
    // List of people the user is following
    Following: {
        type: [Schema.Types.ObjectId],
        default: []
    },
    // List of people following the user
    Followers: {
        type: [Schema.Types.ObjectId],
        default: []
    },
    // List of people following the user
    CreatedAt: {
        type: Date,
        default: Date.now
    }    
});

const User = mongoose.model('user', UserSchema);

module.exports = User;