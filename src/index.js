const crypto = require('./util/crypto');

const {WhisperUser} = require("./util/user");
const {Whispers} = require("./whispers/whispers");
const {Whisper} = require("./whisper/whisper");
const {Stories} = require("./stories/stories");
const {Search} = require("./search/search");
const {SearchImages} = require("./searchImages/searchImages");
const {SearchMedia} = require("./searchMedia/searchMedia");
const {Featured} = require("./featured/featured");
const {User} = require("./user/user");
const {Feeds} = require("./feeds/feeds");
const {Share} = require("./share/share");
const {Messaging} = require("./messaging/messaging");

class WhisperClient {
    constructor() {
        this.user = new WhisperUser();
    }

    async newUser() {
        // Create the new user
        await this.user.newAccount();

        // Set the location
        const lat = '33.5292485';
        const lon = '-84.3562718';
        await this.user.setLocation(lat, lon);
    }

    async login(uid) {
        await this.user.signIn(uid);
    }

    get Whispers() {
        return new Whispers(this.user);
    }

    get Whisper() {
        return new Whisper(this.user);
    }

    get Stories() {
        return new Stories(this.user);
    }

    get Search() {
        return new Search(this.user);
    }

    get SearchImages() {
        return new SearchImages(this.user);
    }

    get SearchMedia() {
        return new SearchMedia(this.user);
    }

    get Feeds() {
        return new Feeds(this.user);
    }

    get Featured() {
        return new Featured(this.user);
    }

    get User() {
        return new User(this.user);
    }

    get Share() {
        return new Share(this.user);
    }

    get Messaging() {
        return new Messaging(this.user);
    }
}

async function main() {
    let Client = new WhisperClient();
    // await Client.newUser();
    await Client.login("060386f7890bdc816050ae5b0456a43aceece3");

    console.log(`TigerText debugging:\n\ttt_key\t\t${Client.user.tt_key}\n\ttt_secret\t${Client.user.tt_secret}\n\ttt_token\t${Client.user.tt_token}`);
    let ttlogin = (new Buffer(`${Client.user.tt_key}:${Client.user.tt_secret}`).toString('base64'));
    console.log(`\ttt_login\t${ttlogin}`);

    // Test `whispers`
    let latest = await Client.Whispers.latest();
    let me = await Client.Whispers.me();
    let popular = await Client.Whispers.popular();
    let replies = await Client.Whispers.replies(popular.popular[0].wid);
    let whispersMe2 = await Client.Whispers.me2();

    // Test `whisper`
    let me2 = await Client.Whisper.me2("060385890f81636a81d08229ba57b9b2ec1e90");
    let whisper = await Client.Whisper.get("060385890f81636a81d08229ba57b9b2ec1e90");
    let add = await Client.Whisper.add(
        "Test2",
        undefined,
        undefined,
        undefined,
        "http:\/\/repo.wimages.net\/static\/b098ca4d490d23d4ab40d06b52adb6cb.jpg",
        undefined,
        undefined,
        "33.5292485",
        "-84.3562718",
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
    );

    // Test Stories
    let stories = await Client.Stories.get();

    // Test Search
    let search = await Client.Search.get("test");
    let suggest = await Client.Search.suggest("cal");
    let autocomplete = await Client.Search.autocomplete("Star");

    // Test Search Images
    let suggestImage = await Client.SearchImages.suggest("cal");

    // Test Search Media
    let searchMedia = await Client.SearchMedia.get("test", "060389d140277b4a0bb25c4b37b36c17ae62ba");
    let suggestMedia = await Client.SearchMedia.suggest("cal", undefined);

    // Test Feeds
    let createFeed = await Client.Feeds.create(
        "http://repo.wimages.net/static/e1a069fe6f6a53e05af89091471696a2.jpg",
        crypto.getRandomChars(64),
        "Test description here!"
    );
    let subscribe = await Client.Feeds.subscribe("c24bf0a0-aa7f-4661-b40f-9231fab6f220");
    // TODO: Fix subscribers
    // let subscribers = await Client.Feeds.subscribers("c24bf0a0-aa7f-4661-b40f-9231fab6f220");
    let feedWhispers = await Client.Feeds.whispers("c24bf0a0-aa7f-4661-b40f-9231fab6f220");
    let unsubscribe = await Client.Feeds.unsubscribe("c24bf0a0-aa7f-4661-b40f-9231fab6f220");

    // Test Featured
    let featured = await Client.Featured.get();

    // Test User
    let activity = await Client.User.activity();
    let feeds = await Client.User.feeds();
    let location = await Client.User.location(33.5292433, -84.35369);
    let pin = await Client.User.pin(1234, true);
    let settings = await Client.User.settings();
    let setSettings = await Client.User.settings(undefined, undefined, true);
    let update_nickname = await Client.User.update_nickname("Test nickname!");
    // let validate = await Client.User.validate();
    // let verify = await Client.User.verify();

    // Test share
    let shareFeed = await Client.Share.link("c24bf0a0-aa7f-4661-b40f-9231fab6f220");

    // TODO: Add categories

    // Test messaging
    let conversation = await Client.Messaging.conversation("060389d140277b4a0bb25c4b37b36c17ae62ba");
    let conversationProfile = await Client.Messaging.conversationProfile("060389d140277b4a0bb25c4b37b36c17ae62ba");
    let conversationTTAuth = await Client.Messaging.conversationsTTAuth();
    // TODO: Add conversations_v2
    let recommendedConversation = await Client.Messaging.recommendedWhispers();

    console.log("DONE!");
}

main()
