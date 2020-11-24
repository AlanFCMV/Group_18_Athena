// Mongoose
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// bcrypt
const bcrypt = require('bcrypt');
SALT_WORK_FACTOR = 10;

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

UserSchema.pre('save', function (next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('Password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.Password, salt, function (err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.Password = hash;
            next();
        });
    });


});

UserSchema.methods.comparePassword = function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.Password);
};

// Export the User
const User = mongoose.model('user', UserSchema);
module.exports = User;