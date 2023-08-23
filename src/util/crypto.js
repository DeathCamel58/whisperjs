const crypto = require('crypto');
const base32 = require('base32');
const fs = require("fs");

const salt = "wttMSbTVPozTne8wLzWoqdRuRRbdlf0o6j5b0+BCLKn2mH1Q5INw48n3bgibG1sV";

function countZeroes(string) {
    return string.split("0").length - 1;
}

function getSha(string) {
    const shasum = crypto.createHash('sha1');
    shasum.update(string);
    return shasum.digest('hex');
}

function getRandomChars(number) {
    return crypto.randomBytes(number).toString('hex');
}

function generateNonce() {
    return base32.encode(getRandomChars(16)).toUpperCase();
}

function generateHmac(nonce) {
    return crypto.createHash('sha1').update(nonce + salt).digest('hex');
}

function generateWork(token, expected) {
    let work = token;

    while (countZeroes(getSha(work)) !== expected) {
        work += crypto.randomBytes(4).toString('hex');
    }

    return work;
}

function generateKeyPair(path) {
    console.log("Generating a key pair");
    const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 1024,
        publicKeyEncoding: {
            type: 'spki',
            format: 'der'
        },
        privateKeyEncoding: {
            type: 'pkcs8',
            format: 'der',
        }
    });
    console.log(`\tGenerated Key pair!`);

    // Generate different formats
    const d='-----'
    const h=(p,e)=>(e?'\n':'')+d+(e?'END':'BEGIN')+' '+(p?'PUBLIC':'PRIVATE')+' KEY'+d+(!e?'\n':'');
    const pubBase64 = publicKey.toString('base64');
    const priBase64 = privateKey.toString('base64');
    const keyPair = {
        public: {
            der: pubBase64,
            pem: h(1)+pubBase64+h(1,1)
        },
        private: {
            der: priBase64,
            pem: h()+priBase64+h(0,1)
        }
    }

    // Save keypair to file
    fs.writeFileSync(`${path}.pem`, privateKey);
    fs.writeFileSync(`${path}.pub`, publicKey);
    console.log(`\tSaved to ${path}`);

    return keyPair;
}

function generateAuthToken(uid, nonce) {
    const key = crypto.createHash("md5").update("iNaKa/:" + uid + "/whisp3r").digest('hex');
    const hmac = crypto.createHmac('sha1', key);
    return hmac.update(Buffer.from(nonce, 'utf-8')).digest('hex');
}

function signNonce(key, nonce) {
    const sign = crypto.createSign('SHA256');
    sign.update(Buffer.from(nonce, 'hex'));
    sign.end();
    const signature = sign.sign(key, 'base64');
    return signature;
}

module.exports = {
    getSha,
    getRandomChars,
    generateNonce,
    generateHmac,
    generateKeyPair,
    generateWork,
    generateAuthToken,
    signNonce
};
