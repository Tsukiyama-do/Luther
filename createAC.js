/*
 * createAC.js - generate keypair and account number, then save them to files.
 *
 * Copyright (c) 2018 Yuichi
 *
 * This software is licensed under the terms of the MIT License.
 * https://kjur.github.io/jsrsasign/license
 *
 * The above copyright and license notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * Please use '-h' option for this script usage.
 * ---------------------------------------------------------
 * DESCRIPTION
 *   This script generates RSA and EC public key pair and
 *   CSR(Certificate Signing Request), then save them as:
 *   - PKCS#8 PEM public key file
 *   - PKCS#8 PEM encrypted private key file
 *   - PEM CSR file
 *
 * USAGE
 *   $ nodemon createAC.js (Name of Account nickname) (password)
 *     example : $ nodemon createAC.js HRC999801 hello
 *
 */


var program = require('commander');
var rs = require('jsrsasign');
var rsu = require('jsrsasign-util');
var path = require('path');
var fs = require('fs');
const createKeccakHash = require('keccak');

program
  .version('1.0.3 (2018-Aug-11)')
  .description('generate keypair and account number of 40 hex, then save them to nickname.{pub,prv,csr} nickname.{hash}')
  .usage('[account nick name]')
  .parse(process.argv);

var nickname = program.args[0];
var pass = program.args[1];
// var pass = "hello";

var dn = "/C=US/O=TEST";
var keyalg = "EC";      // ECDSA is chosen.
var keyopt, sigalg;
if (keyalg === "RSA") {
   keyopt = parseInt(2048);
   sigalg = "SHA256withRSA";
} else {
   keyopt = "secp256r1";
   sigalg = "SHA256withECDSA";
}

var pubFile = "./master/" + nickname + ".pub";
var prvFile = "./master/" + nickname + ".prv";
var csrFile = "./master/" + nickname + ".csr";
var actFile = "./master/" + nickname + ".hash";

// debug console.log("program.args.length=" + program.args.length);
// debug console.log("program.args are nickname : " + program.args[0] + " dn : " + dn + " keyalg : " + keyalg + " curve : " + keyopt + " pass : " + pass );

console.log("generating keypair of ... " + program.args[0]);
var kp = rs.KEYUTIL.generateKeypair(keyalg, keyopt);
console.log("done.");     // private and public key gets generated.
var prvKey = kp.prvKeyObj;     //  private key
var pubKey = kp.pubKeyObj;     // public key

var csr = rs.asn1.csr.CSRUtil.newCSRPEM({
    subject: {str: dn},
    sbjpubkey: pubKey,
    sigalg: sigalg,
    sbjprvkey: prvKey
});    // create csr data

//  belows are to put keys to files
rsu.saveFile(pubFile, rs.KEYUTIL.getPEM(pubKey));
rsu.saveFile(prvFile, rs.KEYUTIL.getPEM(prvKey, "PKCS8PRV", pass));
rsu.saveFile(csrFile, csr);
console.log("Keypair is saved.")
const buffer1 = new Buffer(fs.readFileSync(pubFile));
const buffpk = Buffer.allocUnsafe(127);

buffer1.copy(buffpk, 0, 28,92)
buffer1.copy(buffpk, 64, 94,154)


// console.log("result is " + buffpk);

// console.log("hash is 256 " + createKeccakHash('keccak256').update(buffpk).digest('hex'));

console.log("get hash with 256 and get the end of 20 bytes  : " + createKeccakHash('keccak256').update(buffpk).digest('hex').slice(-40));

rsu.saveFile(actFile,createKeccakHash('keccak256').update(buffpk).digest('hex').slice(-40));  // get account number

console.log("all save done.");

/*  Example of execution

yuichi@yuichi-linux:~/github.com/Tsukiyama-do/Luther$ nodemon createAC.js HRC7774441 hello
[nodemon] 1.15.0
[nodemon] to restart at any time, enter `rs`
[nodemon] watching: *.*
[nodemon] starting `node createAC.js HRC7774441 hello`
generating keypair of ... HRC7774441
done.
Keypair is saved.
get hash with 256 and get the end of 20 bytes  : bb9e1598910b61fb0df382d6cdfa6fa43ce62876
all save done.

[nodemon] clean exit - waiting for changes before restart

*/
