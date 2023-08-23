const {apiClient} = require("../util/apiClient");

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
        let params = {
            query_type: 'tribe,whisper',
            uid: this.user.uid,
            locale: 'en_us',
            query: base64Query + '\n',
            sme: true,
            limit: 40
        };
        let response = await apiClient('android', '/search', 'get', params, null, null, this.user, false);
        return response;
    }

    /**
     * Runs a search for feeds
     * @param query What to search for
     * @returns {Promise<*>}
     */
    async suggest(query) {
        let params = {
            types: 'place',
            uid: this.user.uid,
            locale: 'en_us',
            query: query
        };
        let response = await apiClient('android', '/search/suggest/', 'get', params, null, null, this.user, false);
        return response;
    }

    /**
     * Gets autocomplete suggestions for a query
     * @param query What to search for
     * @returns {Promise<*>}
     */
    async autocomplete(query) {
        let params = {
            query: query,
            uid: this.user.uid,
            locale: 'en_us'
        };
        let response = await apiClient('android', '/search/suggest/autocomplete', 'get', params, null, null, this.user, false);
        return response;
    }
}

module.exports = {
    Search
};
