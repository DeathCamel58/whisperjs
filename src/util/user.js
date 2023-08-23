let Crypto = require('./crypto');
const {apiClient} = require("./apiClient");
const fs = require("fs");
const {Messaging} = require("../messaging/messaging");

class WhisperUser {
    constructor() {
        this.serialNumber = Crypto.getRandomChars(16);

        this.uid = null;
        this.pin = null;
        this.keyPair = null;
        this.sessionToken = null;
        this.userData = null;

        this.tt_token = null;
        this.tt_key = null;
        this.tt_secret = null;

        this.messaging = new Messaging(this);
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
            userData: this.userData,
            tt_token: this.tt_token,
            tt_key: this.tt_key,
            tt_secret: this.tt_secret
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
        // Get `token` and `expected`
        let response = await apiClient('whisper', '/user/new', 'get');
        let token = response.token;
        let expected = response.expected;
        console.log(`Got 1st challenge:\n\tToken\t${token}\n\tExpected\t${expected}`);

        // Solve the first challenge
        let work = Crypto.generateWork(token, expected);
        this.keyPair = Crypto.generateKeyPair();
        let nonce = Crypto.generateNonce();
        let params = {
            device_id: this.serialNumber,
            work: work,
            hmac: Crypto.generateHmac(nonce),
            nonce: nonce,
            token: token
        };
        let data = {
            public_key: this.keyPair.public.der,
            locale: 'en_us'
        };
        response = await apiClient('whisper', '/user/new', 'post', params, null, data, this);
        this.uid = response.uid;
        this.pin = response.pin;
        console.log(`Solved first challenge:\n\tUID\t${this.uid}\n\tPIN\t${this.pin}`);

        // Compute and send `auth_token`, get `nonce`
        nonce = Crypto.generateNonce();
        params = {
            uid: this.uid,
            nonce: nonce,
            auth_token: Crypto.generateAuthToken(this.uid, nonce)
        };
        response = await apiClient('whisper', '/user/authenticate', 'get', params, null, null, this);
        let nonce2 = response.nonce;
        console.log(`Got nonce:\n\tNONCE\t${nonce2}`);

        // Sign and send received `nonce`, get `session_token`
        params = {
            uid: this.uid,
            nonce: nonce,
            auth_token: Crypto.generateAuthToken(this.uid, nonce)
        };
        data = {
            sig: Crypto.signNonce(this.keyPair.private.pem, nonce2)
        };
        response = await apiClient('whisper', '/user/authenticate', 'post', params, null, data, this);
        this.sessionToken = response.session_token;
        console.log(`Got session token:\n\tSession Token\t${this.sessionToken}`);


        // Compute and send `auth_token`, get `nonce`
        nonce = Crypto.generateNonce();
        params = {
            locale: 'en_us',
            uid: this.uid,
            sessions: 0,
        };
        response = await apiClient('android', `/user/verify/${this.uid}`, 'get', params, null, null, this);
        console.log(`Verified user`);
        this.userData = response;

        // Set the user's PIN
        this.pin = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
        data = {
            uid: this.uid,
            pin: this.pin,
            forced: true
        }
        params = {
            uid: this.uid,
            locale: 'en_us'
        }
        response = await apiClient('android', '/user/settings', 'post', params, null, data, this, false);

        // Get TigerText authentication stuff
        params = {
            uid: this.uid
        }
        response = await apiClient('whisper', `/messaging/conversations/tt_auth`, 'get', params, null, null, this);
        this.tt_key = response.tt_key;
        this.tt_secret = response.tt_secret;
        this.tt_token = response.tt_token;

        this.saveUser();
    }

    /**
     * Signs into an existing user
     * @param uid The UID in `data/users/` to log in with
     * @returns {Promise<*>}
     */
    async signIn(uid) {
        console.log(`Signing in as ${uid}`)

        this.loadUser(uid);

        // Catch users without TigerText authentication info, and get new auth data
        if (this.tt_token === null || this.tt_secret === null || this.tt_key === null) {
            let params = {
                uid: this.uid
            }
            let response = await apiClient('whisper', `/messaging/conversations/tt_auth`, 'get', params, null, null, this);
            this.tt_key = response.tt_key;
            this.tt_secret = response.tt_secret;
            this.tt_token = response.tt_token;

            this.saveUser();
        }

        console.log(`User data loaded from data/users/${this.uid}.json`);

        let params = {
            uid: this.uid,
            locale: 'en_us',
            sessions: 0
        }
        let response = await apiClient('android', `/user/verify/${uid}`, 'get', params, null, null, this);
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
        let params = {
            uid: this.uid
        };
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
        let response = await apiClient('whisper', '/user/location', 'post', params, null, data, this, true);
        return response;
    }
}

module.exports = {
    WhisperUser
};
