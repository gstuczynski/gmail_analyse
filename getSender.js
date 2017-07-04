var google = require('googleapis');
var gapi = google.gmail('v1');
var fs = require('fs');
const util = require('util');
var _ = require('underscore');

function getSender(auth, userId, threadId) {
    return new Promise((resolve, reject) => {
        gapi.users.threads.get({
            auth: auth,
            'userId': userId,
            'id': threadId,
        }, function (err, response) {
            if (err) {
                reject('The API returned an error: ' + err);
                return;
            }
            var h = {}
            response.messages[0].payload.headers.forEach(header => {
                if (header.name == "Reply-To") h["replyto"] = header.value;
                if (header.name == "From") h["from"] = header.value;
                if (header.name == "To") h["to"] = header.value;
            })
            var sender;
            
            if (!h.to || !h.from){
                sender = null;
                console.log(h)
            }else if (h.to.includes("gdt@evidenceprime.com") || h.from.includes("no-reply@guidelinedevelopment.org") || h.to.includes("support@evidenceprime.com")) sender = h.replyto;
            else sender = h.from;
 

            resolve(sender);
        });
    });
}

module.exports = getSender;