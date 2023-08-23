const {apiClient} = require("../util/apiClient");

class Featured {
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
        let response = await apiClient('android', `/featured/${this.user.uid}`, 'get', params, null, null, this.user, false);
        return response;
    }
}

module.exports = {
    Featured
};
