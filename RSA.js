var RSA = require('hybrid-crypto-js').RSA;
var Crypt = require('hybrid-crypto-js').Crypt;

var crypt = new Crypt();
var rsa = new RSA();

let publicKey;
let privateKey;

rsa.generateKeyPair(function(keyPair) {
     publicKey = keyPair.publicKey;
     privateKey = keyPair.privateKey;
}, 1024);

function encryptMessage(message, publickey){
    let encMessage = crypt.encrypt(publickey, message);
    return encMessage.message;
}

function decryptMessage(message, privatekey){
    let decMessage =  crypt.decrypt(privateKey, encrypted);
    return decMessage.message;
}

module.exports = {publicKey, encryptMessage, decryptMessage};