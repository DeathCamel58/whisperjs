const {apiClient} = require("../util/apiClient");

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
        let params = {
            uid: this.user.uid,
            locale: 'en_us'
        };
        let response = await apiClient('android', '/feeds/create', 'post', params, null, data, this.user, true);
        return response;
    }

    /**
     * Subscribes to a feed
     * @param feed_id The Feed ID
     * @returns {Promise<*>}
     */
    async subscribe(feed_id) {
        let data = {
            uid: this.user.uid,
            feed_id: feed_id
        }
        let params = {
            uid: this.user.uid,
            locale: 'en_us'
        };
        let response = await apiClient('android', '/feeds/subscribe', 'post', params, null, data, this.user, false);
        return response;
    }

    /**
     * Get a list of users in a feed
     * @param feed_id The Feed ID
     * @returns {Promise<*>}
     */
    async subscribers(feed_id) {
        let params = {
            feed_id: feed_id,
            uid: this.user.uid,
            locale: 'en_us',
            limit: 40
        };
        let response = await apiClient('android', '/search/subscribers', 'get', params, null, null, this.user, false);
        return response;
    }

    /**
     * Unsubscribes to a feed
     * @param feed_id The Feed ID
     * @returns {Promise<*>}
     */
    async unsubscribe(feed_id) {
        let data = {
            uid: this.user.uid,
            feed_id: feed_id
        }
        let params = {
            uid: this.user.uid,
            locale: 'en_us'
        };
        let response = await apiClient('android', '/feeds/unsubscribe', 'post', params, null, data, this.user, false);
        return response;
    }

    /**
     * Gets Whispers in a feed
     * @param feed_id The Feed ID
     * @returns {Promise<*>}
     */
    async whispers(feed_id) {
        let params = {
            feed_id: feed_id,
            uid: this.user.uid,
            locale: 'en_us',
            sme: false,
            type: 'tribe'
        };
        let response = await apiClient('android', '/feeds/whispers', 'get', params, null, null, this.user, false);
        return response;
    }
}

module.exports = {
    Feeds
};
