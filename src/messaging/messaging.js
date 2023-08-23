const {apiClient} = require("../util/apiClient");

class Messaging {
    constructor(user) {
        this.user = user;
    }

    /**
     Gets conversation information
     * @param wid The Whisper ID to get
     * @returns {Promise<*>}
     */
    async conversation(wid) {
        let data = {
            uid: this.user.uid
        }
        let params = {
            uid: this.user.uid,
            locale: 'en_us',
            origin: 'other'
        };
        let response = await apiClient('android', `/messaging/conversation/${wid}/${this.user.uid}`, 'post', params, null, data, this.user, false);
        return response;
    }

    /**
     * Gets the conversation profile for given Whisper
     * @param wid The Whisper ID to get
     * @returns {Promise<*>}
     */
    async conversationProfile(wid) {
        let params = {
            uid: this.user.uid,
            wid: wid,
            locale: 'en_us'
        };
        let response = await apiClient('android', '/messaging/conversation/profile', 'get', params, null, null, this.user, false);
        return response;
    }

    /**
     * Gets the TigerText Authentication information
     * @returns {Promise<*>}
     */
    async conversationsTTAuth() {
        let params = {
            uid: this.user.uid,
            locale: 'en_us'
        };
        let response = await apiClient('android', '/messaging/conversations/tt_auth', 'get', params, null, null, this.user, false);
        return response;
    }

    // TODO: Add conversations_v2

    /**
     * Gets the recommended Whispers
     * @returns {Promise<*>}
     */
    async recommendedWhispers() {
        let params = {
            uid: this.user.uid,
            locale: 'en_us'
        };
        let response = await apiClient('android', '/messaging/recommended_whispers', 'get', params, null, null, this.user, false);
        return response;
    }
}

module.exports = {
    Messaging
};
