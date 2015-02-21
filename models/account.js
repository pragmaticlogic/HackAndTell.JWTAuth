var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  bcrypt = require('bcrypt'),
  SALT_FACTOR = 10;

var AccountSchema = new Schema({
  username: { type: String, required: true, index: { unique: true } },
  password: { type: String, required: true }
});

AccountSchema.methods.comparePasswords = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) cb(err, false);
    else cb(null, isMatch);
  });
};

AccountSchema.methods.toJSON = function() {
  var account = this.toObject();
  delete account.password;
  return account;
};

AccountSchema.pre('save', function(next) {
  var account = this;
  
  // only hash the password if it has been modified (or is new)
  if (!account.isModified('password')) return next();

  // generate a salt
  bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
    if (err) return next(err);

    // hash the password along with our new salt
    bcrypt.hash(account.password, salt, function(err, hash) {
      if (err) return next(err);

      // override the cleartext password with the hashed one
      account.password = hash;
      next();
    });
  });
});

module.exports = mongoose.model('Account', AccountSchema);