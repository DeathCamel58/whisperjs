const {apiClient} = require("../util/apiClient");

class Stories {
    constructor(user) {
        this.user = user;
    }

    /**
     * Gets the latest Whispers
     * @returns {Promise<*>}
     */
    async get() {
        let params = {
            uid: this.user.uid,
            locale: 'en_us'
        };
        let response = await apiClient('android', '/stories', 'get', params, null, null, this.user, false);
        return response;
    }
}

module.exports = {
    Stories
};
