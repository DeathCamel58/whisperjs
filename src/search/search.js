const axios = require("axios");

class Search {
    constructor(user) {
        this.user = user;
    }

    /**
     * Search for feeds
     * @param query What to search for
     * @returns {Promise<*>}
     */
    async get(query) {
        let base64Query = (new Buffer(query).toString('base64'));
        console.log(`Base64 Encoding:\n\tQuery\t${query}\n\tBase64\t${base64Query}`);
        let config = {
            headers: {
                Publisher_version: 'android_9.68.0',
                Session_token: this.user.sessionToken
            },
            params: {
                query_type: 'tribe,whisper',
                uid: this.user.uid,
                query: base64Query + '\n',
                sme: true,
                limit: 40
            }
        }

        let response = await axios.get('https://prod-android.whisper.sh/search', config);

        return response.data;
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
                types: 'place',
                query: query,
                uid: this.user.uid
            }
        }

        let response = await axios.get('https://prod-android.whisper.sh/search/suggest/', config);

        return response.data;
    }

    /**
     * Gets autocomplete suggestions for a query
     * @param query What to search for
     * @returns {Promise<*>}
     */
    async autocomplete(query) {
        let config = {
            headers: {
                Publisher_version: 'android_9.68.0',
                Session_token: this.user.sessionToken
            },
            params: {
                query: query,
                uid: this.user.uid
            }
        }

        let response = await axios.get('https://prod-android.whisper.sh/search/suggest/autocomplete', config);

        return response.data;
    }
}

module.exports = {
    Search
};
