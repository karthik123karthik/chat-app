var RSA = require("hybrid-crypto-js").RSA;
var Crypt = require("hybrid-crypto-js").Crypt;

var crypt = new Crypt();
var rsa = new RSA();

/* 

code used to generate keys

function generateKey() {
  return new Promise(function(resolve, reject) {
    rsa.generateKeyPair(function(keyPair) {
      resolve(keyPair);
    });
  });
}

async function consolekey(){
  let keys = await generateKey()
  console.log(keys.privateKey, keys.publicKey);
}

consolekey();


*/

async function encryptMessage(message, publicKey) {
  let encryptedMessage = await crypt.encrypt(publicKey, message);
  return encryptedMessage;
}

async function decryptMessage(encryptedMessage, privateKey) {
  let decryptedMessage = await crypt.decrypt(privateKey, encryptedMessage);
  return decryptedMessage.message;
}

module.exports = {decryptMessage, encryptMessage };
