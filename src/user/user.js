const axios = require("axios");

class User {
    constructor(user) {
        this.user = user;
    }

    /**
     * Gets activity notifications
     * @returns {Promise<*>}
     */
    async activity() {
        let config = {
            headers: {
                Publisher_version: 'android_9.68.0',
                Session_token: this.user.sessionToken
            },
            params: {
                uid: this.user.uid
            }
        }

        let response = await axios.get('https://prod-android.whisper.sh/user/activity', config);

        return response.data;
    }

    /**
     * Gets feeds subscribed to and invited to
     * @returns {Promise<*>}
     */
    async feeds() {
        let config = {
            headers: {
                Publisher_version: 'android_9.68.0',
                Session_token: this.user.sessionToken
            },
            params: {
                uid: this.user.uid
            }
        }

        let response = await axios.get('https://prod-android.whisper.sh/user/feeds', config);

        return response.data;
    }

    /**
     * Sets the location of the user
     * @param latitude Latitude
     * @param longitude Longitude
     * @returns {Promise<*>}
     */
    async location(latitude, longitude) {
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

        let response = await axios.post('https://prod-android.whisper.sh/user/location', data, config);

        return response.data;
    }

    /**
     * Sets the PIN for the user
     * @param pin The user's new PIN
     * @param forced TODO: Document
     * @returns {Promise<*>}
     */
    async pin(pin, forced) {
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
            pin: pin,
            forced: forced
        };

        let response = await axios.post('https://prod-android.whisper.sh/user/pin', data, config);

        return response.data;
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
        let config = {
            headers: {
                Publisher_version: 'android_9.68.0',
                Session_token: this.user.sessionToken
            },
            params: {
                uid: this.user.uid
            }
        }

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
            config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
            response = await axios.post('https://prod-android.whisper.sh/user/settings', data, config).catch(function (e) {
                if (e.response.status === 409) {
                    console.log(`Can\'t update user settings: ${e.response.data.errors[0].body}`);
                    return(e.response);
                }
            });
        } else {
            response = await axios.get('https://prod-android.whisper.sh/user/settings', config);
        }

        return response.data;
    }

    /**
     * Sets the nickname for the user
     * @param nickname The user's new nickname
     * @returns {Promise<*>}
     */
    async update_nickname(nickname) {
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
            nickname: nickname
        };

        let response = await axios.post('https://prod-android.whisper.sh/user/update_nickname', data, config);

        return response.data;
    }

    /**
     * Check that the current user is valid
     * @returns {Promise<*>}
     */
    async validate() {
        let config = {
            headers: {
                Publisher_version: 'android_9.68.0',
                Session_token: this.user.sessionToken,
            },
            params: {
                uid: this.user.uid
            }
        }

        let response = await axios.get('https://prod-android.whisper.sh/user/validate', config).catch(function (e) {
            if (e.response.status === 403) {
                console.log('Can\'t validate user');
                return(e.response);
            }
        });

        return response.data;
    }

    /**
     * Gets current user's data
     * @returns {Promise<*>}
     */
    async verify() {
        let config = {
            headers: {
                Publisher_version: 'android_9.68.0',
                Session_token: this.user.sessionToken
            },
            params: {
                uid: this.user.uid,
                sessions: 0
            }
        }

        let response = await axios.get('https://prod-android.whisper.sh/user/verify/' + this.user.uid, config)

        return response.data;
    }

    // TODO: Add token (`registerPushTokenWithWhisper` in APK)
    // TODO: Add validate
    // TODO: Add create_places
    // TODO: Add xp_hide
    // TODO: Add significant_places
    // TODO: Add migrate
}

module.exports = {
    User
};
