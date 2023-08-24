const axios = require("axios");

class Whispers {
    constructor(user) {
        this.user = user;
    }

    /**
     * Gets the latest Whispers
     * @returns {Promise<*>}
     */
    async latest() {
        let config = {
            headers: {
                Publisher_version: 'android_9.68.0',
                Session_token: this.user.sessionToken,
                'Content-Type': 'x-www-form-urlencoded'
            },
            params: {
                uid: this.user.uid,
                sme: false
            }
        }

        let response = await axios.get('https://prod-android.whisper.sh/whispers/latest', config);

        return response.data;
    }

    /**
     * Gets current user's Whispers
     * @returns {Promise<*>}
     */
    async me() {
        let config = {
            headers: {
                Publisher_version: 'android_9.68.0',
                Session_token: this.user.sessionToken,
                'Content-Type': 'x-www-form-urlencoded'
            },
            params: {
                include_me2: false,
                uid: this.user.uid,
                type: 'top_level'
            }
        }

        let response = await axios.get('https://prod-android.whisper.sh/whispers/me', config);

        return response.data;
    }

    /**
     * Get the most popular Whispers
     * @returns {Promise<*>}
     */
    async popular() {
        let config = {
            headers: {
                Publisher_version: 'android_9.68.0',
                Session_token: this.user.sessionToken,
                'Content-Type': 'x-www-form-urlencoded'
            },
            params: {
                uid: this.user.uid,
                sme: false
            }
        }

        let response = await axios.get('https://prod-android.whisper.sh/whispers/popular', config);

        return response.data;
    }

    /**
     * Get the replies to a Whisper
     * @param wid Whisper ID to get replies for
     * @returns {Promise<*>}
     */
    async replies(wid) {
        let config = {
            headers: {
                Publisher_version: 'android_9.68.0',
                Session_token: this.user.sessionToken,
                'Content-Type': 'x-www-form-urlencoded'
            },
            params: {
                uid: this.user.uid,
                sme: false,
                wid: wid
            }
        }

        let response = await axios.get('https://prod-android.whisper.sh/whispers/replies', config);

        return response.data;
    }

    /**
     * Get Whispers the user liked
     * @returns {Promise<*>}
     */
    async me2() {
        let config = {
            headers: {
                Publisher_version: 'android_9.68.0',
                Session_token: this.user.sessionToken,
                'Content-Type': 'x-www-form-urlencoded'
            },
            params: {
                uid: this.user.uid,
                sme: false
            }
        }

        let response = await axios.get('https://prod-android.whisper.sh/whispers/me/me2', config);

        return response.data;
    }

    // NOTE: The `/whispers/viewed` URL isn't added, as my app's requests always error out
}

module.exports = {
    Whispers
};
