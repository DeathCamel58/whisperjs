const {apiClient} = require("../util/apiClient");

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
        let params = {
            type: 'tribe',
            uid: this.user.uid,
            locale: 'en_us',
            query: query
        };
        let response = await apiClient('android', '/search_images/suggest/', 'get', params, null, null, this.user, false);
        return response;
    }
}

module.exports = {
    SearchImages
};
