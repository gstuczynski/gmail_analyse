var google = require('googleapis');
var gapi = google.gmail('v1');
var fs = require('fs');
const util = require('util')
var _ = require('underscore');

function getSender(auth, userId, threadId) {
    return new Promise((resolve, reject) => {
        var result = [];
        var request = gapi.users.threads.get({
            auth: auth,
            'userId': userId,
            'id': threadId,
        }, function (err, response) {
            if (err) {
                reject('The API returned an error: ' + err);
                return;
            }
            response.messages[0].payload.headers.map(header => {
                if (header.name == "From") {
                    resolve(header.value.replace(/"/, ''))
                }
            })
        });
    });
}

module.exports = getSender;