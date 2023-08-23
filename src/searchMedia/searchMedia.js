const {apiClient} = require("../util/apiClient");

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
    async get(query, wid = null) {
        let base64Query = (new Buffer(query).toString('base64'));
        console.log(`Base64 Encoding:\n\tQuery\t${query}\n\tBase64\t${base64Query}`);
        let params = {
            uid: this.user.uid,
            locale: 'en_us',
            parent_wid: wid,
            media_types: 'image',
            query: base64Query + '\n'
        };
        let response = await apiClient('android', '/search_media', 'get', params, null, null, this.user, false);
        return response;
    }

    /**
     * Runs a search for feeds
     * @param query What to search for
     * @param wid The parent Whisper ID
     * @returns {Promise<*>}
     */
    async suggest(query, wid = null) {
        let params = {
            media_types: 'image,video',
            uid: this.user.uid,
            locale: 'en_us',
            query: query,
            parent_wid: wid
        };
        let response = await apiClient('android', '/search/suggest/', 'get', params, null, null, this.user, false);
        return response;
    }
}

module.exports = {
    SearchMedia
};
