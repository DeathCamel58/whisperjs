const axios = require("axios");

const WHISPER_ENDPOINT = 'https://prod.whisper.sh';
const WHISPER_ANDROID_ENDPOINT = 'https://prod-android.whisper.sh';
const TIGERTEXT_ENDPOINT = 'https://whisper.api.tigertext.me';

async function apiClient(
    endpoint = null,
    path = null,
    type = 'get',
    params = null,
    customHeaders = null,
    data = null,
    user = null,
    postAsJson = false
)
{
    if (endpoint === 'whisper' || endpoint === null) {
        endpoint = WHISPER_ENDPOINT;
    } else if (endpoint === 'android') {
        endpoint = WHISPER_ANDROID_ENDPOINT;
    } else if (endpoint === 'tigertext') {
        endpoint = TIGERTEXT_ENDPOINT;
    }

    if (path === null) {
        console.log("Can't send a request to no path")
    }

    let headers = {
        'Publisher_version': 'android_9.68.0',
        'Timezone': '-5',
        'Ah': 'c2686a7f00fd1e2320dd43a4921f81c59726702c',
        'Is': 'null',
        'Lib_version': 'android_1.6.2',
        'Locale': 'en_us',
        'Input_language': '',
        'App_id': 'sh.whisper',
        'System_language': 'en',
        'Accept-Encoding': 'gzip, deflate',
        'User-Agent': 'okhttp/4.9.1',
    }

    if (customHeaders !== null) {
        if (Object.keys(customHeaders).length !== 0) {
            for (const key in customHeaders) {
                headers[key] = customHeaders[key];
            }
        }
    }

    if (user != null) {
        if (user.sessionToken != null) {
            headers['Session_token'] = user.sessionToken;
        }
    }

    let request = null;
    if (type === "get") {
        request = axios.get(`${endpoint}${path}`, {
            headers: headers,
            params: params
        })
    } else if (type === "post") {
        if (data) {
            if (!postAsJson) {
                headers['Content-Type'] = 'application/x-www-form-urlencoded';
                request = axios.post(`${endpoint}${path}`, data, {
                    headers: headers,
                    params: params
                });
            } else {
                headers['Content-Type'] = 'application/json';
                request = axios.post(`${endpoint}${path}`, data, {
                    headers: headers,
                    params: params
                });
            }
        }
    }

    let response = await request;

    return response.data;
}

module.exports = {
    apiClient
};
