const forge = require('node-forge');

// Generate a new RSA key pair
//const keyPair = forge.pki.rsa.generateKeyPair({bits: 2048});


// Convert the public key to PEM format
//const publicKeyPem = forge.pki.publicKeyToPem(keyPair.publicKey);
//const privateKeyPem = forge.pki.privateKeyToPem(keyPair.privateKey);

//console.log(privateKeyPem)
//console.log(publicKeyPem);

function encryptMessage(message, publicKey) {
  const encryptedMessage = forge.pki.publicKeyFromPem(publicKey).encrypt(message);  
  return encryptedMessage;
}

function decryptMessage(encryptedMessage, privateKey) {
   const decryptedMessage = forge.pki.privateKeyFromPem(privateKey).decrypt(encryptedMessage);  
  return decryptedMessage;
}

module.exports = {decryptMessage, encryptMessage };
