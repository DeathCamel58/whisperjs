let Crypto = require('./crypto');
const fs = require("fs");
const axios = require("axios");

class WhisperUser {
    constructor() {
        this.serialNumber = null;

        this.uid = null;
        this.pin = null;
        this.keyPair = null;
        this.sessionToken = null;
        this.ah = null;
        this.userData = null;

        this.tt_token = null;
        this.tt_key = null;
        this.tt_secret = null;
    }

    saveUser() {
        // Ensure directories exist before saving
        if (!fs.existsSync('data')) {
            fs.mkdirSync('data');
        }
        if (!fs.existsSync('data/users')) {
            fs.mkdirSync('data/users');
        }

        // Save the user's information for later
        const userData = JSON.stringify({
            serialNumber: this.serialNumber,
            uid: this.uid,
            pin: this.pin,
            keyPair: this.keyPair,
            sessionToken: this.sessionToken,
            ah: this.ah,
            userData: this.userData,
            tt_token: this.tt_token,
            tt_key: this.tt_key,
            tt_secret: this.tt_secret,
        })
        fs.writeFileSync(`data/users/${this.uid}.json`, userData);
        console.log(`User data saved to data/users/${this.uid}.json`);
    }

    loadUser(uid) {
        // Load the user's information
        const userData = JSON.parse(fs.readFileSync(`data/users/${uid}.json`, 'utf8'));

        this.uid = userData.uid;
        this.pin = userData.pin;
        this.keyPair = userData.keyPair;
        this.sessionToken = userData.sessionToken;
        this.ah = userData.ah;
        this.userData = userData.userData;
        this.tt_token = userData.tt_token;
        this.tt_key = userData.tt_key;
        this.tt_secret = userData.tt_secret;
    }

    /**
     * Creates a new user
     * @returns {Promise<void>}
     */
    async newAccount() {
        this.ah = Crypto.getRandomChars(40);
        this.serialNumber = Crypto.getRandomChars(16);

        // Get `token` and `expected`
        let config = {
            headers: {
                Publisher_version: 'android_9.68.0',
                Ah: '4d39dad5e03ae91ddeac31647e8ea10e814e5415',
                Is: 'null'
            }
        }

        let response = await axios.get('https://prod.whisper.sh/user/new', config);
        let token = response.data.token;
        let expected = response.data.expected;
        console.log(`Got 1st challenge:\n\tToken\t${token}\n\tExpected\t${expected}`);

        // Solve the first challenge
        let work = Crypto.generateWork(token, expected);
        this.keyPair = Crypto.generateKeyPair();
        let nonce = Crypto.generateNonce();
        config = {
            headers: {
                // TODO: Check which ones of these can be removed
                Publisher_version: 'android_9.68.0',
                'Content-Type': 'application/x-www-form-urlencoded',
                // Timezone: '-5',
                Ah: '4d39dad5e03ae91ddeac31647e8ea10e814e5415',
                Is: 'null',
                Lib_version: 'android_1.5.2',
                // Locale: 'en_us',
                Input_language: 'en',
                App_id: 'sh.whisper',
                // System_language: 'en'
            },
            params: {
                device_id: this.serialNumber,
                work: work,
                hmac: Crypto.generateHmac(nonce),
                nonce: nonce,
                token: token
            }
        }

        let data = {
            public_key: this.keyPair.public.der,
            locale: 'en_us'
        }

        response = await axios.post('https://prod.whisper.sh/user/new', data, config);
        this.uid = response.data.uid;
        this.pin = response.data.pin;
        console.log(`Solved first challenge:\n\tUID\t${this.uid}\n\tPIN\t${this.pin}`);

        // Compute and send `auth_token`, get `nonce`
        nonce = Crypto.generateNonce();
        config = {
            headers: {
                Publisher_version: 'android_9.68.0',
                Session_token: this.sessionToken
            },
            params: {
                uid: this.uid,
                nonce: nonce,
                auth_token: Crypto.generateAuthToken(this.uid, nonce)
            }
        }

        response = await axios.get('https://prod.whisper.sh/user/authenticate', config);
        let nonce2 = response.data.nonce;
        console.log(`Got nonce:\n\tNONCE\t${nonce2}`);

        // Sign and send received `nonce`, get `session_token`
        config = {
            headers: {
                Publisher_version: 'android_9.68.0',
                Session_token: this.sessionToken,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            params: {
                uid: this.uid,
                nonce: nonce,
                auth_token: Crypto.generateAuthToken(this.uid, nonce)
            }
        }

        data = {
            sig: Crypto.signNonce(this.keyPair.private.pem, nonce2)
        };

        response = await axios.post('https://prod.whisper.sh/user/authenticate', data, config);
        this.sessionToken = response.data.session_token;
        console.log(`Got session token:\n\tSession Token\t${this.sessionToken}`);


        // Send the verify request
        config = {
            headers: {
                Publisher_version: 'android_9.68.0',
                Session_token: this.sessionToken
            },
            params: {
                uid: this.uid,
                sessions: 0,
            }
        }

        response = await axios.get(`https://prod-android.whisper.sh/user/verify/${this.uid}`, config);
        console.log(`Verified user`);
        this.userData = response.data;

        // Set the user's PIN
        this.pin = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
        config = {
            headers: {
                Publisher_version: 'android_9.68.0',
                Session_token: this.sessionToken,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            params: {
                uid: this.uid,
                locale: 'en_us'
            }
        }

        data = {
            uid: this.uid,
            pin: this.pin,
            forced: true
        };

        response = await axios.post('https://prod.whisper.sh/user/settings', data, config);

        // Get TigerText authentication stuff
        config = {
            headers: {
                Publisher_version: 'android_9.68.0',
                Session_token: this.sessionToken
            },
            params: {
                uid: this.uid
            }
        }

        response = await axios.get('https://prod.whisper.sh/messaging/conversations/tt_auth', config);
        this.tt_key = response.data.tt_key;
        this.tt_secret = response.data.tt_secret;
        this.tt_token = response.data.tt_token;

        this.saveUser();
    }

    /**
     * Signs into an existing user
     * @param uid The UID in `data/users/` to log in with
     * @returns {Promise<*>}
     */
    async signIn(uid) {
        console.log(`User data loaded from data/users/${this.uid}.json`);
        console.log(`Signing in as ${uid}`)

        this.loadUser(uid);

        // Catch users without TigerText authentication info, and get new auth data
        if (this.tt_token === null || this.tt_secret === null || this.tt_key === null) {
            let config = {
                headers: {
                    Publisher_version: 'android_9.68.0',
                    Session_token: this.user.sessionToken
                },
                params: {
                    uid: this.uid
                }
            }

            let response = await axios.get('https://prod-android.whisper.sh/messaging/conversations/tt_auth', config);
            this.tt_key = response.data.tt_key;
            this.tt_secret = response.data.tt_secret;
            this.tt_token = response.data.tt_token;

            this.saveUser();
        }

        let config = {
            headers: {
                Publisher_version: 'android_9.68.0',
                Session_token: this.sessionToken
            },
            params: {
                uid: this.uid,
                sessions: 0
            }
        }

        let response = await axios.get(`https://prod-android.whisper.sh/user/verify/${uid}`, config);
        console.log(`Logged in successfully to ${uid}`);
        return response;
    }

    // TODO: Remove this from here and put it in `user/user.js`
    /**
     * Sets the location of the user
     * @param latitude Latitude
     * @param longitude Longitude
     * @returns {Promise<*>}
     */
    async setLocation(latitude, longitude) {
        let config = {
            headers: {
                Publisher_version: 'android_9.68.0',
                Session_token: this.sessionToken,
                'Content-Type': 'application/json'
            },
            params: {
                uid: this.uid
            }
        }

        let data = {
            "payload": [
                {
                    "extra_json": {
                        "altitude": 0,
                        "carrier": 310004,
                        // "connected_bssid": this.settings.wifi.bssid,
                        // "connected_ssid": "\"" + this.settings.wifi.ssid + "\"",
                        "connection_type": "wifi",
                        "course": Math.floor(Math.random() * 359),
                        "horizontal_accuracy": 20,
                        "limit_ad_tracking": "false",
                        "location_context": "foreground",
                        "location_method": "fused",
                        "speed": 0
                    },
                    "lat": latitude,
                    "lon": longitude,
                    // "metadata": {
                    //     "seq_id:8,app_status:foreground,error_radius:20.0,ssid:\"" +this.settings.wifi.ssid + "\"",
                    // },
                    "ts": 1615404589000
                }
            ],
            "uid": this.uid
        };

        let response = await axios.post('https://prod-android.whisper.sh/user/location', data, config);

        return response;
    }
}

module.exports = {
    WhisperUser
};
