const {apiClient} = require("../util/apiClient");

class Share {
    constructor(user) {
        this.user = user;
    }

    /**
     * Gets a share link for a feed
     * @returns {Promise<*>}
     */
    async link(feed_id) {
        let params = {
            uid: this.user.uid,
            locale: 'en_us',
            id: feed_id,
            type: 'feed',
            link_type: 'invite',
            channel: 'copy'
        };
        let response = await apiClient('android', '/share/link', 'get', params, null, null, this.user, false);
        return response;
    }
}

module.exports = {
    Share
};
