const axios = require("axios");

class SearchImages {
    constructor(user) {
        this.user = user;
    }

    /**
     * Runs a search for feeds
     * @param query What to search for
     * @returns {Promise<*>}
     */
    async suggest(query) {
        let config = {
            headers: {
                Publisher_version: 'android_9.68.0',
                Session_token: this.user.sessionToken
            },
            params: {
                type: 'tribe',
                uid: this.user.uid,
                query: query
            }
        }

        let response = await axios.get('https://prod-android.whisper.sh/search_images/suggest/', config);

        return response.data;
    }
}

module.exports = {
    SearchImages
};
