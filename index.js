var fs = require('fs');
var listMails = require('./listMails');
var authorize = require('./authorize');
var getSender = require('./getSender');
var _ = require('underscore');

fs.readFile('client_secret.json', function processClientSecrets(err, content) {
    if (err) {
        console.log('Error loading client secret file: ' + err);
        return;
    }
    authorize(JSON.parse(content), function (auth) {
        listMails(auth, 'me', 'from:(tentostertotester@gmail.com) after:2017/6/28 before:2017/6/30')
            .then(allMails => {
                allMails.forEach(m => {
                    getSender(auth, 'me', m)
                        .then(senders => {
                            console.log(senders)
                        })
                })
            })

    });
});