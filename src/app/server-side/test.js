const CryptoJS = require("crypto-js");
const data=CryptoJS.AES.encrypt('12341234', 'TheBest').toString()
console.log(data)
console.log(CryptoJS.AES.decrypt(data, 'TheBest').toString(CryptoJS.enc.Utf8))