const axios = require("axios");

class Share {
    constructor(user) {
        this.user = user;
    }

    /**
     * Gets a share link for a feed
     * @returns {Promise<*>}
     */
    async link(feed_id) {
        let config = {
            headers: {
                Publisher_version: 'android_9.68.0',
                Session_token: this.user.sessionToken,
                'Content-Type': 'x-www-form-urlencoded'
            },
            params: {
                uid: this.user.uid,
                id: feed_id,
                type: 'feed',
                link_type: 'invite',
                channel: 'copy'
            }
        }

        let response = await axios.get('https://prod-android.whisper.sh/share/link', config);

        return response.data;
    }
}

module.exports = {
    Share
};
