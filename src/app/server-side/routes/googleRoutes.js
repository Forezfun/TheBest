const EXPRESS = require('express');
const ROUTER = EXPRESS.Router();
const { v4: uuidv4 } = require('uuid');
const { google } = require('googleapis');
const CLIENT_ID = '489517403439-lh4gtbv6eden8pcof5lrflho24bdcbpv.apps.googleusercontent.com'
const CLIENT_SECRET = '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'
const REDIRECT_URL = 'http://localhost:4200/login'
const GOOGLE_USER = require('../models/google');
const PUBLICATION = require('../models/publication');
let oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URL
);

ROUTER.get('/geturl', async (request, result) => {
  console.log('Request received for authorization route');
  try {
    const scopes = ['profile', 'email']
    const url = oauth2Client.generateAuthUrl({
      scope: scopes,
      access_type: 'offline'
    });
    result.json({ authURL: url });
  } catch (error) {
    console.error('Error generating Google auth URL:', error);
    result.status(500).json({ message: error.message });
  }
});
ROUTER.get('/auth', async (request, result) => {
  try {
    const { code } = request.query;
    console.log(code)
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    const oauth2 = google.oauth2({
      version: 'v2',
      auth: oauth2Client,
    });
    const { data: userInfo } = await oauth2.userinfo.get();
    console.log('UserInfo:', userInfo);
    const FIND_USER = await GOOGLE_USER.findOne({ googleId: userInfo.id })
    let USER_BASE_DATA
    if (FIND_USER) {
      FIND_USER.sessionId = uuidv4()
      const UPDATED_USER = await FIND_USER.save()
      USER_BASE_DATA = {
        _id: UPDATED_USER._id,
        sessionId: UPDATED_USER.sessionId
      }
    } else {
      const USER_DATA = new GOOGLE_USER({
        googleId: userInfo.id,
        email: userInfo.email,
        nickname: userInfo.name,
        publications: [],
        sessionId: uuidv4()
      })
      const NEW_GOOGLE_USER = await USER_DATA.save()
      USER_BASE_DATA = {
        _id: NEW_GOOGLE_USER._id,
        sessionId: NEW_GOOGLE_USER.sessionId
      }
    }
    result.json(USER_BASE_DATA)
  } catch (error) {
    console.error('Error handling Google callback:', error);
    result.status(500).json({ message: error.message });
  }
});
ROUTER.get('/', async (request, result) => {
  try {
    const USER_ITEM = await GOOGLE_USER.findById(request.query.userId)
    console.log(USER_ITEM)
    if (!USER_ITEM) {
      result.status(404).json({ message: 'User is not defined' })
      return
    }
    console.log('SERVER SESSION ID:',USER_ITEM.sessionId)
    console.log('USER SESSION ID:',request.query.sessionId)
    if (USER_ITEM.sessionId !== request.query.sessionId) {
      result.status(409).json({ message: 'No access' })
      return
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
ROUTER.put('/changeinformation', async (request, result) => {
  try {
    console.log(request)
    const USER_ITEM = await GOOGLE_USER.findById(request.body._id)
    console.log(USER_ITEM)
    if (!USER_ITEM) {
      result.status(404).json({ message: 'User is not defined' })
      return
    }
    if (USER_ITEM.sessionId !== request.body.sessionId) {
      result.status(409).json({ message: 'No access' })
      return
    }
    USER_ITEM.nickname = request.body.nickname
    const UPDATED_USER = await USER_ITEM.save();
    result.json(UPDATED_USER);
  } catch (error) {
    result.status(400).json({ message: error.message });
  }
});
ROUTER.delete('/', async (request, result) => {
  try {
    const USER_ITEM = await GOOGLE_USER.findById(request.query.userId)
    if (!USER_ITEM) {
      result.status(404).json({ message: 'User is not defined' })
      return
    }
    if (USER_ITEM.sessionId !== request.query.sessionId) {
      result.status(409).json({ message: 'No access' })
      return
    }
    await GOOGLE_USER.deleteOne({ _id: USER_ITEM._id });
    result.json({ message: 'User delete successful' })
  } catch (error) {
    result.status(500).json({ message: error.message });
  }
});

module.exports = ROUTER;

