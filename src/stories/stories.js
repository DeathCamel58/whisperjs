const axios = require("axios");

class Stories {
    constructor(user) {
        this.user = user;
    }

    /**
     * Gets the latest Whispers
     * @returns {Promise<*>}
     */
    async get() {
        let config = {
            headers: {
                Publisher_version: 'android_9.68.0',
                Session_token: this.user.sessionToken
            },
            params: {
                uid: this.user.uid
            }
        }

        let response = await axios.get('https://prod-android.whisper.sh/stories', config);

        return response.data;
    }
}

module.exports = {
    Stories
};
