/**
 * Created by john.nana on 12/30/2017.
 */
 var rek = require("rekuire");

var {firebase,admin} = rek("FBdatabase");


/*
var admin = require("firebase-admin"),
    firebase = require("firebase"),
    serviceAccount = require("../FCM/gts_service_account.json");



admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://gtsredmagnolia-180010.firebaseio.com"
});
*/

//Now Notification details from FB

var ref = firebase.database().ref("estate_notifications");



function listenForNotificationRequests() {
    /*var requests = ref.child('notificationRequests');*/
    ref.on('child_added', function(requestSnapshot) {
        var request = requestSnapshot.val();
        sendNotificationToUser(
            request.topic,
            request.subject,
            request.message,
            function() {
                console.log("i am in fb notifications remove")
                requestSnapshot.ref.remove();
            }
        );
    }, function(error) {
        console.error(error);
    });
};


function sendNotificationToUser(topic, subject ,message, removeCallback ){

    //var topic = "estate_11";

    var payload = {
        notification: {
            title: subject,
            body: message
        }
    };

    admin.messaging().sendToTopic(topic, payload)
        .then(function(response) {

            console.log("Successfully sent message:", response);
            removeCallback();
            /*res.json({ success: true, message:'Notification was sent  successful', payload:payload,status:"OK" });*/

        })
        .catch(function(error) {
            console.log("Error sending message:", error);
            /*res.json({error:true, message:"there was an error in checking if this entry exists", status:"OK"});*/
        });

}



/*function sendNotificationToUser(username, message, onSuccess) {
    request({
        url: 'https://fcm.googleapis.com/fcm/send',
        method: 'POST',
        headers: {
            'Content-Type' :' application/json',
            'Authorization': 'key='+API_KEY
        },
        body: JSON.stringify({
            notification: {
                title: message
            },
            to : '/topics/user_'+username
        })
    }, function(error, response, body) {
        if (error) { console.error(error); }
        else if (response.statusCode >= 400) {
            console.error('HTTP Error: '+response.statusCode+' - '+response.statusMessage);
        }
        else {
            onSuccess();
        }
    });
}*/

module.exports= listenForNotificationRequests;



