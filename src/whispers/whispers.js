const {apiClient} = require("../util/apiClient");

class Whispers {
    constructor(user) {
        this.user = user;
    }

    /**
     * Gets the latest Whispers
     * @returns {Promise<*>}
     */
    async latest() {
        let params = {
            uid: this.user.uid,
            locale: 'en_us',
            sme: false
        };
        let response = await apiClient('android', '/whispers/latest', 'get', params, null, null, this.user, false);
        return response;
    }

    /**
     * Gets current user's Whispers
     * @returns {Promise<*>}
     */
    async me() {
        let params = {
            include_me2: false,
            uid: this.user.uid,
            type: 'top_level',
            locale: 'en_us'
        };
        let response = await apiClient('android', '/whispers/me', 'get', params, null, null, this.user, false);
        return response;
    }

    /**
     * Get the most popular Whispers
     * @returns {Promise<*>}
     */
    async popular() {
        let params = {
            uid: this.user.uid,
            sme: false,
            locale: 'en_us'
        };
        let response = await apiClient('android', '/whispers/popular', 'get', params, null, null, this.user, false);
        return response;
    }

    /**
     * Get the replies to a Whisper
     * @param wid Whisper ID to get replies for
     * @returns {Promise<*>}
     */
    async replies(wid) {
        let params = {
            uid: this.user.uid,
            sme: false,
            locale: 'en_us',
            wid: wid
        };
        let response = await apiClient('android', '/whispers/replies', 'get', params, null, null, this.user, false);
        return response;
    }

    /**
     * Get Whispers the user liked
     * @returns {Promise<*>}
     */
    async me2() {
        let params = {
            uid: this.user.uid,
            sme: false,
            locale: 'en_us'
        };
        let response = await apiClient('android', '/whispers/me/me2', 'get', params, null, null, this.user, false);
        return response;
    }

    // NOTE: The `/whispers/viewed` URL isn't added, as my app's requests always error out
}

module.exports = {
    Whispers
};
