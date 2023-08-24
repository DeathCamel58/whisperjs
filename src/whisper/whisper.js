const axios = require("axios");

class Whisper {
    constructor(user) {
        this.user = user;
    }

    /**
     * Gets a given Whisper
     * @param wid Whisper ID to get
     * @returns {Promise<*>}
     */
    async get(wid) {
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

        let response = await axios.get('https://prod-android.whisper.sh/whisper', config);

        return response.data;
    }

    /**
     * Posts a new Whisper
     * @param text The text on the Whisper
     * @param is_client_rendered TODO: Document
     * @param text_offset_y The offset up or down from the center
     * @param selected_image TODO: Document
     * @param image_url The URL of the image to use
     * @param source TODO: Document
     * @param font TODO: Figure out the font options
     * @param lat The latitude
     * @param lon The longitude
     * @param original_poster TODO: Document
     * @param media_type TODO: Document options
     * @param ts TODO: Document
     * @param new_crossed_paths TODO: Document
     * @param background_upload TODO: Document
     * @param widToReply The Whisper ID to make this a reply to
     * @returns {Promise<*>}
     */
    async add(
        text,
        is_client_rendered = false,
        text_offset_y = 0,
        selected_image = 0,
        image_url,
        source = 'suggest',
        font = 'Upright.otf',
        lat = 0,
        lon = 0,
        original_poster = false,
        media_type = 'image',
        ts = 0,
        new_crossed_paths = false,
        background_upload = true,
        widToReply = null
    ) {
        let config = {
            headers: {
                Publisher_version: 'android_9.68.0',
                Session_token: this.user.sessionToken,
                'Content-Type': 'Application/json'
            },
            params: {
                include_me2: false,
                uid: this.user.uid,
                type: 'top_level'
            }
        }

        let data = {
            "text": text,
            "is_client_rendered": is_client_rendered,
            "text_offset_y": text_offset_y,
            "selected_image": selected_image,
            "image_url": image_url,
            "source": source,
            "font": font,
            "geo_lat": lat,
            "geo_lon": lon,
            "original_poster": original_poster,
            "media_type": media_type,
            "meta": {"ts": ts, "new_crossed_paths": new_crossed_paths},
            "background_upload": background_upload,
            "uid": this.user.uid,
            "locale": "en_us",
            "system_language": "en",
            "input_language": "",
            "timezone": "-5"
        };
        if (widToReply != null) {
            data['parent_wid'] = widToReply;
            data['in_reply_to'] = widToReply;
        }

        let response = await axios.post('https://prod-android.whisper.sh/whisper/add', data, config);

        return response.data;
    }

    /**
     * Flags a given whisper
     * @param wid Whisper ID to flag
     * @param origin TODO: Document
     * @param reason The flag reason TODO: Get all options
     * @param sub_reason The subreason TODO: Get all options
     * @returns {Promise<*>}
     */
    async flag(
        wid,
        origin = 'other',
        reason = 'other',
        sub_reason = 'dont_want_to_see_it'
    ) {
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
            wid: wid,
            origin: origin,
            reason: reason,
            sub_reason: sub_reason
        }

        let response = await axios.post('https://prod-android.whisper.sh/whisper/flag', data, config);

        return response.data;
    }

    /**
     * Likes a given whisper
     * @param wid Whisper ID to like
     * @returns {Promise<*>}
     */
    async me2(wid) {
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
            wid: wid,
            origin: 'other'
        }

        let response = await axios.post('https://prod-android.whisper.sh/whisper/me2', data, config);

        return response.data;
    }

    /**
     * Gets a given Whisper's short URL
     * @param wid Whisper ID to get
     * @returns {Promise<*>}
     */
    async shortened(wid) {
        let config = {
            headers: {
                Publisher_version: 'android_9.68.0',
                Session_token: this.user.sessionToken,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            params: {
                uid: this.user.uid,
                wid: wid
            }
        }

        let response = await axios.get('https://prod-android.whisper.sh/whisper/shortened/' + wid, config);

        return response.data;
    }

    // TODO: Add related
}

module.exports = {
    Whisper
};
