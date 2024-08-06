const MONGOOSE = require('mongoose');
const USER_SCHEM = new MONGOOSE.Schema({
    nickname: String,
    email: String,
    password: String,
    publications:[{namePublication:String,idPublication:String}],
    sessionId:String
  })

const USER = MONGOOSE.model('User', USER_SCHEM);

module.exports = USER;
