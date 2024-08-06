const MONGOOSE = require('mongoose');
const GOOGLE_USER_SCHEM = new MONGOOSE.Schema({
    googleId:String,
    nickname: String,
    email: String,
    publications:[{namePublication:String,idPublication:String}],
    sessionId:String
  })

const GOOGLE_USER = MONGOOSE.model('GoogleUser', GOOGLE_USER_SCHEM);

module.exports = GOOGLE_USER;
