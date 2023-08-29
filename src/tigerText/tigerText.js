const axios = require("axios");

class TigerText {
    constructor(user) {
        this.user = user;
    }

    /**
     * TODO: Document, likely a list of new messages
     * @returns {Promise<*>}
     */
    async events() {
        let config = {
            headers: {
                Authorization: "Basic " + btoa(`${this.user.tt_key}:${this.user.tt_secret}`),
                "User-Agent": "WhisperV9.68.0Android14"
            },
            params: {}
        }

        let response = await axios.get('https://whisper.api.tigertext.me/v1/events', config);

        return response.data;
    }

    /**
     * TODO: Document, likely an ack for receiving a message or something
     * @param events TODO: Document
     * @returns {Promise<*>}
     */
    async eventsAck(events) {
        let config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: "Basic " + btoa(`${this.user.tt_key}:${this.user.tt_secret}`)
            },
            params: {}
        }

        let data = {
            events: events
        }

        let response = await axios.post('https://whisper.api.tigertext.me/v1/events/ack', data, config);

        return response.data;
    }

    /**
     * Sends a message
     * @param group_token The Group Token
     * @param message The message to send
     * @returns {Promise<*>}
     */
    async message(group_token, message) {
        let config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: "Basic " + btoa(`${this.user.tt_key}:${this.user.tt_secret}`)
            },
            params: {
                response_format: 'message'
            }
        }

        let data = {
            recipient: group_token,
            ttl: 2880,
            body: message
        }

        let response = await axios.post('https://whisper.api.tigertext.me/v1/message', data, config);

        return response.data;
    }

    /**
     * TODO: Document
     * @param read TODO: Document
     * @param delivered TODO: Document
     * @returns {Promise<*>}
     */
    async messageStatus(read, delivered) {
        let config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: "Basic " + btoa(`${this.user.tt_key}:${this.user.tt_secret}`)
            },
            params: {
                response_format: 'message'
            }
        }

        let data = {
            read: read,
            delivered: delivered
        }

        let response = await axios.post('https://whisper.api.tigertext.me/v1/message/status', data, config);

        return response.data;
    }

    /**
     * Register a push token with TigerText
     * @param service The push token service
     * @param token The push token
     * @returns {Promise<*>}
     */
    async push(
        service = 'GCM',
        token = null
    ) {
        if (token === null) {
            token = 'fo4QBNmzSrC2zMnDB3LJLp:APA91bGLwgsM5qhiPcJwn0AvxGgbYWAhvSTozwOOnJYdKGoHg2TlBakYKhdx6lXkPqNpJ9yZm0JtUxdhHJyOoz1cxm0iguOoiQLNLVsIjjXzOEO_67CO_2osZrmHTdponSAOuAO63rP1';
            // token = Crypto.getRandomChars(165);
        }

        let config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: "Basic " + btoa(`${this.user.tt_key}:${this.user.tt_secret}`)
            },
            params: {}
        }

        let data = {
            service: service,
            token: token
        }

        let response = await axios.post('https://whisper.api.tigertext.me/v1/push', data, config);

        return response.data;
    }

    // TODO: Add /v1/message/{??MID??}/attachment/1
}

module.exports = {
    TigerText
};
