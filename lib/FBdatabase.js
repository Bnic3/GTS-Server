/**
 * Created by john.nana on 1/1/2018.
 */

var firebase = require("firebase"),
    admin = require("firebase-admin"),
    serviceAccount = require("../FCM/gts_service_account.json");


//configuring firebase
// Initialize Firebase
var config = {
    apiKey: process.env.FBDB_API_KEY,
    authDomain: process.env.FBDB_AUTH_DOMAIN,
    databaseURL: process.env.FBDB_DB_URL,
    projectId: process.env.FBDB_PROJ_ID,
    storageBucket: process.env.FBDB_BUCKET,
    messagingSenderId: process.env.FBDB_SENDER_ID
};
firebase.initializeApp(config);


//initailize firebase-admin sdk
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FBDB_DB_URL
});

module.exports = {firebase,
                    admin}
