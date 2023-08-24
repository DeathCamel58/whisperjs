const axios = require("axios");

class SearchMedia {
    constructor(user) {
        this.user = user;
    }

    /**
     * Search for feeds
     * @param query What to search for
     * @param wid The parent Whisper ID
     * @returns {Promise<*>}
     */
    async suggest(query, wid = null) {
        let base64Query = (new Buffer(query).toString('base64'));
        console.log(`Base64 Encoding:\n\tQuery\t${query}\n\tBase64\t${base64Query}`);

        let config = {
            headers: {
                Publisher_version: 'android_9.68.0',
                Session_token: this.user.sessionToken,
                'Content-Type': 'x-www-form-urlencoded'
            },
            params: {
                uid: this.user.uid,
                parent_wid: wid,
                media_types: 'image',
                query: base64Query + '\n'
            }
        }

        let response = await axios.get('https://prod-android.whisper.sh/search_media', config);

        return response.data;
    }
}

module.exports = {
    SearchMedia
};
