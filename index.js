var fs = require('fs');
var listMails = require('./listMails');
var authorize = require('./authorize');
var getSender = require('./getSender');
var _ = require('underscore');
var createFile = require('./createFile');
var format = "both",
    separator = ",";

process.argv.forEach((val, index) => {
    switch (val) {
        case "--out-format":
            format = process.argv[index + 1];
            break;
        case "--csv-separator":
            separator = process.argv[index + 1];
            break;
    }
    if (["json", "csv", "both"].indexOf(format) < 0) {
        throw `Wrong --out-format parametr
        available options: json, csv, both`
    }
});

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
                createFile(sendersCount, format, separator)
            });
    })
});