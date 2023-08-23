const {apiClient} = require("../util/apiClient");

class User {
    constructor(user) {
        this.user = user;
    }

    /**
     * Gets activity notifications
     * @returns {Promise<*>}
     */
    async activity() {
        let params = {
            uid: this.user.uid,
            locale: 'en_us'
        };
        let response = await apiClient('android', '/user/activity', 'get', params, null, null, this.user, false);
        return response;
    }

    /**
     * Gets feeds subscribed to and invited to
     * @returns {Promise<*>}
     */
    async feeds() {
        let params = {
            uid: this.user.uid,
            locale: 'en_us'
        };
        let response = await apiClient('android', '/user/feeds', 'get', params, null, null, this.user, false);
        return response;
    }

    /**
     * Sets the location of the user
     * @param latitude Latitude
     * @param longitude Longitude
     * @returns {Promise<*>}
     */
    async location(latitude, longitude) {
        let params = {
            uid: this.user.uid,
            locale: 'en_us'
        };
        let data = {
            "payload": [
                {
                    "extra_json": {
                        "altitude": 0,
                        "carrier": 310004,
                        // "connected_bssid": this.settings.wifi.bssid,
                        "connected_ssid": "<unknown ssid>",
                        "connection_type": "cellular",
                        "course": Math.floor(Math.random() * 359),
                        "horizontal_accuracy": 20,
                        "limit_ad_tracking": "false",
                        "location_context": "foreground",
                        "location_method": "fused",
                        "speed": 0
                    },
                    "lat": latitude,
                    "lon": longitude,
                    // "metadata": {
                    //     "seq_id:8,app_status:foreground,error_radius:20.0,ssid:\"" +this.settings.wifi.ssid + "\"",
                    // },
                    "ts": 1615404589000
                }
            ],
            "uid": this.user.uid
        };
        let response = await apiClient('whisper', '/user/location', 'post', params, null, data, this.user, true);
        return response;
    }

    /**
     * Sets the PIN for the user
     * @param pin The user's new PIN
     * @param forced TODO: Document
     * @returns {Promise<*>}
     */
    async pin(pin, forced) {
        let params = {
            uid: this.user.uid,
            locale: 'en_us'
        };
        let data = {
            uid: this.user.uid,
            pin: pin,
            forced: forced
        };
        let response = await apiClient('whisper', '/user/pin', 'post', params, null, data, this, false);
        return response;
    }

    /**
     * Gets or changes a user's settings
     * @param gender The user's gender (`male` observed)
     * @param age The user's age (`26` observed)
     * @param limited_ad_tracking TODO: Document
     * @param device_id TODO: Document
     * @param ifa TODO: Document
     * @param pin_enabled TODO: Document
     * @param sme User has "Clean Language" toggle off
     * @param system_locale TODO: Document
     * @param push_geo User gets push notifications for nearby Whispers
     * @param push_heart User gets push notifications for hearts on their Whispers
     * @param push_new_feed_post User gets push notifications for Whispers in feeds
     * @param push_reply User gets push notifications for replies to their Whispers
     * @returns {Promise<null>}
     */
    async settings(
        gender = null,
        age = null,
        limited_ad_tracking = null,
        device_id = null,
        ifa = null,
        pin_enabled = null,
        sme = null,
        system_locale = null,
        push_geo = null,
        push_heart = null,
        push_new_feed_post = null,
        push_reply = null
    ) {
        let params = {
            uid: this.user.uid,
            locale: 'en_us'
        };

        let data = {};
        if (gender != null) {
            data['gender'] = gender;
        }
        if (age != null) {
            data['age'] = age;
        }
        if (limited_ad_tracking != null) {
            data['limited_ad_tracking'] = limited_ad_tracking;
        }
        if (device_id != null) {
            data['device_id'] = device_id;
        }
        if (ifa != null) {
            data['ifa'] = ifa;
        }
        if (pin_enabled != null) {
            data['pin_enabled'] = pin_enabled;
        }
        if (sme != null) {
            data['sme'] = sme;
        }
        if (system_locale != null) {
            data['system_locale'] = system_locale;
        }
        if (push_geo != null) {
            data['push_geo'] = push_geo;
        }
        if (push_heart != null) {
            data['push_heart'] = push_heart;
        }
        if (push_new_feed_post != null) {
            data['push_new_feed_post'] = push_new_feed_post;
        }
        if (push_reply != null) {
            data['push_reply'] = push_reply;
        }
        let response = null;
        if (Object.keys(data).length !== 0) {
            data['uid'] = this.user.uid;
            response = await apiClient('android', '/user/settings', 'post', params, null, data, this.user, false);
        } else {
            response = await apiClient('android', '/user/settings', 'get', params, null, null, this.user, false);
        }
        return response;
    }

    /**
     * Sets the nickname for the user
     * @param nickname The user's new nickname
     * @returns {Promise<*>}
     */
    async update_nickname(nickname) {
        let params = {
            uid: this.user.uid,
            locale: 'en_us'
        };
        let data = {
            uid: this.user.uid,
            nickname: nickname
        };
        let response = await apiClient('whisper', '/user/update_nickname', 'post', params, null, data, this.user, false);
        return response;
    }

    // TODO: Add validate
    // TODO: Add verify
    // TODO: Add create_places
}

module.exports = {
    User
};
