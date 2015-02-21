var Account = require('../models/account.js');

module.exports = function(username, password, cb) {
  var searchAccount = {
    username: username
	};
  
  Account.findOne(searchAccount, function(err, foundAccount) {
    if (err) return cb(err, false);
    if (!foundAccount) return cb(null, false);
    
    foundAccount.comparePasswords(password, function(err, isMatch) {
      if (err) return cb(err, false);
      if (!isMatch) return cb(null, false);
      return cb(null, true);
    });
  });
}; 