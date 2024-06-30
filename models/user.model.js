const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true // Ensures email is unique
    },
    password: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true // Adds createdAt and updatedAt fields
  }
);

// Middleware to hash the password before saving (requires bcrypt or a similar library)
// Uncomment and complete the following block if using bcrypt for password hashing
/*
const bcrypt = require('bcrypt');
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});
*/

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;