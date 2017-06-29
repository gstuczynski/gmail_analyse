var google = require('googleapis');
var gapi = google.gmail('v1');
var _ = require('underscore');

function listMails(auth, userId, query) {
    return new Promise((resolve, reject) => {
        var idsMsgs = [];
        var getPageOfMessages = function (reqParams) {
            gapi.users.messages.list(reqParams, function (err, response) {
                if (err) {
                    reject('The API returned an error: ' + err);
                    return;
                }
                response.messages.map(msg => {
                    idsMsgs.push(msg.threadId)
                });
                if (response.nextPageToken) {
                    getPageOfMessages({
                        auth: auth,
                        'userId': userId,
                        'pageToken': response.nextPageToken,
                        'q': query
                    });
                } else {
                    resolve(_.uniq(idsMsgs));
                }
            });
        };
        getPageOfMessages({
            auth: auth,
            'userId': userId,
            'q': query
        });
    });
}
module.exports = listMails;