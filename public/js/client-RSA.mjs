export let publicKey;
let privateKey;



crypto.subtle.generateKey(function (keyPair) {
  publicKey = keyPair.publicKey;
  privateKey = keyPair.privateKey;
}, 1024);

export function encryptMessage(message, publickey) {
  let encMessage = crypto.subtle.encrypt(publickey, message);
  return encMessage.message;
}

export function decryptMessage(message, privatekey) {
  let decMessage = crypto.subtle.decrypt(privateKey, encrypted);
  return decMessage.message;
}

