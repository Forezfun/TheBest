const EXPRESS = require('express');
const ROUTER = EXPRESS.Router();
const USER = require('../models/user');
const PUBLICATION = require('../models/publication');
const CryptoJS = require("crypto-js");
const cryptoKey = 'TheBest'
const sendCheckCode = require('../sendcode');

ROUTER.put('/change/', async (request, result) => {
  try {
    const USER_ITEM = await USER.findOne({ email: request.body.email })
    console.log(request.body,request.body.resetPassword)
    if (request.body.resetPassword) {
      USER_ITEM.password = encryptPassword(request.query.resetPassword)
    } else {
      USER_ITEM.password = encryptPassword(request.query.password)
      USER_ITEM.email = request.query.email;
      USER_ITEM.nickname = request.query.nickname;
    }
    const UPDATED_USER = await USER_ITEM.save();
    result.json(UPDATED_USER);
  } catch (error) {
    result.status(500).json({ message: error.message });
  }
})
ROUTER.get('/', async (request, result) => {
  try {
    const USER_ITEM = await USER.findOne({ email: request.query.email })
    if (!USER_ITEM) {
      result.status(404).json({ message: 'User is not defined', status: 404 });
      return
    }
    console.log(USER_ITEM,USER_ITEM.password)
    const decryptedPassword = decryptPassword(USER_ITEM.password)
    console.log('Request: ',request.query.password,' Server: ',decryptedPassword)
    const matchPasswords = await checkUserAccess(USER_ITEM._id, request.query.password)
    if (!matchPasswords) {
      return result.status(403).json({ message: 'Password is not matched', status: 403 });
    }
    let USER_PUBLICATIONS = await PUBLICATION.find({ author: USER_ITEM._id });
    console.log(USER_PUBLICATIONS)
    let publicationDetails = await Promise.all(
      USER_PUBLICATIONS.map(async (publication) => {
        let pub = await PUBLICATION.findOne({ _id: publication._id });
        return { namePublication: pub.title, idPublication: pub._id };
      })
    )
    const response = {
      email: USER_ITEM.email,
      password: decryptedPassword,
      nickname: USER_ITEM.nickname,
      publications: publicationDetails.filter(publication => {
        return {
          namePublication: publication.namePublication,
          idPublication: publication.idPublication
        }
      }),
      _id: USER_ITEM._id
    }
    result.json(response);
  } catch (error) {
    result.status(500).json({ message: error.message });
  }
});

ROUTER.post('/code/', async (request, result) => {
  try {
    const authCode = sendCheckCode(request.body.email)
    result.json(authCode);
  } catch (error) {
    result.status(500).json({ message: error.message });
  }
});

ROUTER.post('/', async (request, result) => {
  try {
    const USER_ITEM = new USER({
      nickname: request.body.nickname,
      email: request.body.email,
      password: encryptPassword(request.body.password),
      publications: request.body.publications
    });
    const NEW_USER = await USER_ITEM.save();
    result.status(201).json(NEW_USER);
  } catch (err) {
    result.status(400).json({ message: err.message });
  }
});
ROUTER.put('/', async (request, result) => {
  try {
    const USER_ITEM = await USER.findOne({ email: request.body.email })
    if (!checkUserAccess(USER_ITEM._id, request.body.password)) {
      return result.status(403).json({ message: 'Password is not matched', status: 403 });
    }
    if (!USER_ITEM) {
      return result.status(404).json({ message: 'User not found' });
    }
    USER_ITEM.nickname = request.body.nickname
    USER_ITEM.email = request.body.email
    USER_ITEM.password = encryptPassword(request.body.password);
    const UPDATED_USER = await USER_ITEM.save();
    UPDATED_USER.password=decryptPassword(UPDATED_USER.password)
    result.json(UPDATED_USER);
  } catch (error) {
    result.status(400).json({ message: error.message });
  }
});
ROUTER.delete('/:id', async (request, result) => {
  try {
    const USER_ITEM = await USER.findById(request.params.id)
    if (!checkUserAccess(USER_ITEM._id, request.query.password)) {
      return result.status(403).json({ message: 'Password is not matched', status: 403 });
    }
    if (!USER_ITEM) {
      return result.status(404).json({ message: 'User not found' });
    }
    await USER_ITEM.remove();
    result.json({ message: 'User deleted' });
  } catch (error) {
    result.status(500).json({ message: error.message });
  }
});

function encryptPassword(password) {
  return CryptoJS.AES.encrypt(password, cryptoKey);
}
function decryptPassword(password) {
  return CryptoJS.AES.decrypt(password, cryptoKey).toString(CryptoJS.enc.Utf8)
}
async function checkUserAccess(userId, userPassword) {
  const USER_SERVER_DATA = await USER.findById(userId)
  console.log(decryptPassword(USER_SERVER_DATA.password) == userPassword)
  return decryptPassword(USER_SERVER_DATA.password) == userPassword ? true : false
}
module.exports = ROUTER;
