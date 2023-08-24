const axios = require("axios");

class Feeds {
    constructor(user) {
        this.user = user;
    }

    /**
     * Creates a feed
     * @returns {Promise<*>}
     * @param image_url The URL of the header image
     * @param name The name of the feed
     * @param description The description of the feed
     * @param image_source The image source
     * @param crop_offset_x How to crop the image TODO: Clarify
     * @param crop_offset_y How to crop the image TODO: Clarify
     * @param crop_width How to crop the image TODO: Clarify
     * @param crop_height How to crop the image TODO: Clarify
     */
    async create(
        image_url = null,
        name = null,
        description = null,
        image_source = 'suggest',
        crop_offset_x = 0,
        crop_offset_y = 366,
        crop_width = 640,
        crop_height = 228
    ) {
        let config = {
            headers: {
                Publisher_version: 'android_9.68.0',
                Session_token: this.user.sessionToken,
                'Content-Type': 'application/json'
            },
            params: {
                uid: this.user.uid
            }
        }

        let data = {
            uid: this.user.uid,
            type: "tribe",
            image_url: image_url,
            image_source: image_source,
            name: name,
            crop_offset_x: crop_offset_x,
            crop_offset_y: crop_offset_y,
            crop_width: crop_width,
            crop_height: crop_height,
            description: description
        }

        let response = await axios.post('https://prod-android.whisper.sh/feeds/create', data, config).catch(function (e) {
            if (e.response.status === 403) {
                console.log(`Can\'t create feed: ${e.response.data.errors[0]}`);
                return(e.response);
            }
        });

        return response.data;
    }

    /**
     * Subscribes to a feed
     * @param feed_id The Feed ID
     * @returns {Promise<*>}
     */
    async subscribe(feed_id) {
        let config = {
            headers: {
                Publisher_version: 'android_9.68.0',
                Session_token: this.user.sessionToken,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            params: {
                uid: this.user.uid
            }
        }

        let data = {
            uid: this.user.uid,
            feed_id: feed_id
        }

        let response = await axios.post('https://prod-android.whisper.sh/feeds/subscribe', data, config);

        return response.data;
    }

    /**
     * Get a list of users in a feed
     * @param feed_id The Feed ID
     * @returns {Promise<*>}
     */
    async subscribers(feed_id) {
        let config = {
            headers: {
                Publisher_version: 'android_9.68.0',
                Session_token: this.user.sessionToken
            },
            params: {
                feed_id: feed_id,
                uid: this.user.uid,
                limit: 40
            }
        }

        let response = await axios.get('https://prod-android.whisper.sh/feeds/subscribers', config);

        return response.data;
    }

    /**
     * Unsubscribes to a feed
     * @param feed_id The Feed ID
     * @returns {Promise<*>}
     */
    async unsubscribe(feed_id) {
        let config = {
            headers: {
                Publisher_version: 'android_9.68.0',
                Session_token: this.user.sessionToken,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            params: {
                uid: this.user.uid
            }
        }

        let data = {
            uid: this.user.uid,
            feed_id: feed_id
        }

        let response = await axios.post('https://prod-android.whisper.sh/feeds/unsubscribe', data, config);

        return response.data;
    }

    /**
     * Gets Whispers in a feed
     * @param feed_id The Feed ID
     * @returns {Promise<*>}
     */
    async whispers(feed_id) {
        let config = {
            headers: {
                Publisher_version: 'android_9.68.0',
                Session_token: this.user.sessionToken
            },
            params: {
                feed_id: feed_id,
                uid: this.user.uid,
                sme: false,
                type: 'tribe'
            }
        }

        let response = await axios.get('https://prod-android.whisper.sh/feeds/whispers', config);

        return response.data;
    }

    // TODO: Add add
    // TODO: Add anonymous_invite
    // TODO: Add create
    // TODO: Add flag
    // TODO: Add invitation
    // TODO: Add invite_by_whisper
    // TODO: Add remove
    // TODO: Add request_notification
}

module.exports = {
    Feeds
};
