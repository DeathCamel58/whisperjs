const axios = require("axios");

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
        let config = {
            headers: {
                Publisher_version: 'android_9.68.0',
                Session_token: this.user.sessionToken,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            params: {
                uid: this.user.uid,
                origin: 'nearby'
            }
        }

        let data = {
            uid: this.user.uid
        }

        let response = await axios.post(`https://prod-android.whisper.sh/messaging/conversation/${wid}/${this.user.uid}`, data, config);

        return response.data;
    }

    /**
     Gets conversation information by a group
     * @param group_token The group_id to get
     * @returns {Promise<*>}
     */
    async conversationByGroup(group_token) {
        let config = {
            headers: {
                Publisher_version: 'android_9.68.0',
                Session_token: this.user.sessionToken
            },
            params: {
                uid: this.user.uid,
                wid: wid
            }
        }

        let response = await axios.get(`https://prod-android.whisper.sh/messaging/conversation/by_group/${group_token}`, config);

        return response.data;
    }

    /**
     * Gets the conversation profile for given Whisper
     * @param wid The Whisper ID to get
     * @returns {Promise<*>}
     */
    async conversationProfile(wid) {
        let config = {
            headers: {
                Publisher_version: 'android_9.68.0',
                Session_token: this.user.sessionToken
            },
            params: {
                uid: this.user.uid,
                wid: wid
            }
        }

        let response = await axios.get('https://prod-android.whisper.sh/messaging/conversation/profile', config);

        return response.data;
    }

    /**
     * Gets the TigerText Authentication information
     * @returns {Promise<*>}
     */
    async conversationsTTAuth() {
        let config = {
            headers: {
                Publisher_version: 'android_9.68.0',
                Session_token: this.user.sessionToken
            },
            params: {
                uid: this.user.uid
            }
        }

        let response = await axios.get('https://prod-android.whisper.sh/messaging/conversations/tt_auth', config);

        return response.data;
    }

    /**
     * Gets the conversations
     * @returns {Promise<*>}
     */
    async conversationsV2() {
        let config = {
            headers: {
                Publisher_version: 'android_9.68.0',
                Session_token: this.user.sessionToken
            },
            params: {
                uid: this.user.uid
            }
        }

        let response = await axios.get('https://prod-android.whisper.sh/messaging/conversations_v2', config);

        return response.data;
    }

    /**
     * Gets the recommended Whispers
     * @returns {Promise<*>}
     */
    async recommendedWhispers() {
        let config = {
            headers: {
                Publisher_version: 'android_9.68.0',
                Session_token: this.user.sessionToken
            },
            params: {
                uid: this.user.uid
            }
        }

        let response = await axios.get('https://prod-android.whisper.sh/messaging/recommended_whispers', config);

        return response.data;
    }

    // TODO: Add conversation/by_group/{GROUPTOKEN}
    // TODO: Add conversation/profile_by_cid
    // TODO: Add conversation/profile
    // TODO: Add conversations/accept
    // TODO: Add conversations/delete/
    // TODO: Add conversations/tt_auth
    // TODO: Add rate
}

module.exports = {
    Messaging
};
