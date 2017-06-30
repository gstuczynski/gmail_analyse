var fs = require('fs');
var listMails = require('./listMails');
var authorize = require('./authorize');
var getSender = require('./getSender');
var sendDataToSheet = require('./sendDataToSheet')
var _ = require('underscore');

fs.readFile('client_secret.json', function processClientSecrets(err, content) {
    if (err) {
        console.log('Error loading client secret file: ' + err);
        return;
    }

    authorize(JSON.parse(content), function (auth) {
        listMails(auth, 'me', 'after:2017/6/28 before:2017/6/30')
            .then(allMails => Promise.all(
                allMails.map(m => getSender(auth, 'me', m))
            )).then(senders => {
                var sendersCount = {};
                senders.forEach(i => {
                    sendersCount[i] = (sendersCount[i] || 0) + 1;
                });
                console.log(sendersCount)
                Object.keys(sendersCount).map(addr => {
                    console.log(addr)
                    sendDataToSheet(auth, addr, sendersCount[addr], "1Uuw0vIt1TatNidUQqsMVXf7qp4P_gMLzVL5NHtejHjk");
                })
            });
    })
});