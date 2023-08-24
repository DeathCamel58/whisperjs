const axios = require("axios");

class Featured {
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
                Publisher_version: 'android_9.68.0'
            },
            params: {
                uid: this.user.uid
            }
        }

        let response = await axios.get(`https://prod-android.whisper.sh/featured/` + this.user.uid, config);

        return response.data;
    }
}

module.exports = {
    Featured
};
