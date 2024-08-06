const EXPRESS = require('express');
const ROUTER = EXPRESS.Router();
const USER = require('../models/user');
const PUBLICATION = require('../models/publication');
const { v4: uuidv4 } = require('uuid');
const CryptoJS = require("crypto-js");
const cryptoKey = 'TheBest'
const sendCheckCode = require('../sendcode');

ROUTER.put('/changepassword', async (request, result) => {
  try {
    const USER_ITEM = await USER.findOne({ email: request.body.email })
    if (!USER_ITEM) {
      return result.status(404).json({ message: 'User is not defined', status: 404 });
    }
    USER_ITEM.password = encryptPassword(request.body.password)
    const UPDATED_USER = await USER_ITEM.save();
    result.json(UPDATED_USER);
  } catch (error) {
    result.status(500).json({ message: error.message });
  }
})
ROUTER.put('/changeinformation', async (request, result) => {
  try {
    const USER_ITEM = await USER.findById(request.body._id)
    if (!checkUserAccess(USER_ITEM._id, request.body.password)) {
      return result.status(403).json({ message: 'No access', status: 403 });
    }
    if (!USER_ITEM) {
      return result.status(404).json({ message: 'User not found'});
    }
    USER_ITEM.nickname = request.body.nickname
    USER_ITEM.password = encryptPassword(request.body.password);
    const UPDATED_USER = await USER_ITEM.save();
    UPDATED_USER.password = decryptPassword(UPDATED_USER.password)
    result.json(UPDATED_USER);
  } catch (error) {
    result.status(400).json({ message: error.message });
  }
});

ROUTER.get('/auth', async (request, result) => {
  try {
    const USER_ITEM = await USER.findOne({ email: request.query.email })
    if (!USER_ITEM) {
      return result.status(404).json({ message: 'User is not defined', status: 404 });
    }
    const matchPasswords = await checkUserAccess(USER_ITEM._id, request.query.password)
    if (!matchPasswords) {
      return result.status(403).json({ message: 'Password is not matched', status: 403 });
    }
    USER_ITEM.sessionId= uuidv4()
    const UPDATED_USER = await USER_ITEM.save()
    const USER_ID = UPDATED_USER._id
    const SESSION_ID = UPDATED_USER.sessionId
    const USER_BASE_DATA = {
      _id:USER_ID,
      sessionId:SESSION_ID
    }
    result.json(USER_BASE_DATA);
  } catch (error) {
    result.status(500).json({ message: error.message });
  }
});
ROUTER.get('/', async (request, result) => {
  try {
    const USER_ITEM = await USER.findById(request.query.userId)
    console.log(request.query.userId,USER_ITEM)
    if (!USER_ITEM) {
      return result.status(404).json({ message: 'User is not defined', status: 404 });
    }
    if (USER_ITEM.sessionId!==request.query.sessionId) {
      return result.status(403).json({ message: 'No access', status: 403 });
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
      nickname: USER_ITEM.nickname,
      password:decryptPassword(USER_ITEM.password),
      publications: publicationDetails.filter(publication => {
        return {
          namePublication: publication.namePublication,
          idPublication: publication.idPublication
        }
      }),
      _id: USER_ITEM._id
    }
    result.json(response)
  } catch (error) {
    result.status(500).json({ message: error.message });
  }
});
ROUTER.post('/code', async (request, result) => {
  try {
    const authCode = sendCheckCode(request.body.email)
    result.json(authCode);
  } catch (error) {
    result.status(500).json({ message: error.message });
  }
});

ROUTER.post('/', async (request, result) => {
  try {
    const USER_ITEM_CHECK = await USER.findOne({email:request.body.email})
    console.log(USER_ITEM_CHECK)
    if(USER_ITEM_CHECK){
      result.status(409).json({ message: 'User already exists'});
      return
    }
    const USER_ITEM = new USER({
      nickname: request.body.nickname,
      email: request.body.email,
      password: encryptPassword(request.body.password),
      publications: request.body.publications,
      sessionId:uuidv4()
    });
    const NEW_USER = await USER_ITEM.save();
    const USER_BASE_DATA={
      sessionId:NEW_USER.sessionId,
      _id:NEW_USER._id
    }
    result.status(201).json(USER_BASE_DATA);
  } catch (err) {
    result.status(400).json({ message: err.message });
  }
});

ROUTER.delete('/', async (request, result) => {
  try {
    const USER_ITEM = await USER.findById(request.query.userId)
    if (!USER_ITEM) {
      return result.status(404).json({ message: 'User not found' });
    }
    if (USER_ITEM.sessionId!==request.query.sessionId) {
      return result.status(409).json({ message: 'No access', status: 403 });
    }
    const DELETED_USER = await USER.deleteOne({ _id: USER_ITEM._id });
    result.json(DELETED_USER)
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
  return decryptPassword(USER_SERVER_DATA.password) == userPassword ? true : false
}
module.exports = ROUTER;
