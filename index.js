var fs = require('fs');
var listMails = require('./listMails');
var authorize = require('./authorize');
var getSender = require('./getSender');
var _ = require('underscore');
var createFile = require('./createFile');
var ArgumentParser = require('argparse').ArgumentParser;

var parser = new ArgumentParser({
    version: '0.0.1',
    addHelp: true,
    description: 'Argparse example'
});
parser.addArgument(
    ['-cs', '--csv-separator'], {
        help: 'If you choised .csv as a output file format, you can set separator instead of ","',
        defaultValue: ','
    }
);
parser.addArgument(
    ['--query', '-q'], {
        help: 'You can select query for scpecified emails witch you would like select.',
        defaultValue: ''
    }
);
parser.addArgument(
    ['--format', '-f'], {
        help: 'Select output format',
        type: 'string',
        defaultValue: 'both'
    }
);
var args = parser.parseArgs();

var format = args.format,
separator = args.csv_separator,
query = args.query;

fs.readFile('client_secret.json', function processClientSecrets(err, content) {
    if (err) {
        console.log('Error loading client secret file: ' + err);
        return;
    }
    authorize(JSON.parse(content), function (auth) {
        listMails(auth, 'me', query)
            .then(allMails => Promise.all(
                allMails.map(m => getSender(auth, 'me', m))
            )).then(senders => {
                senders = _.filter(senders, x => x);
                //console.log(senders)
                //  console.log(senders)
                var sendersCount = {};
                senders.forEach(i => {

                    sendersCount[i] = (sendersCount[i] || 0) + 1;
                    //  console.log(i)
                });

                let sorted = sortProperties(sendersCount);

                createFile(sorted, format, separator)
            });
    })
});

const sortProperties = obj => _.chain(obj).pairs().sortBy(1).reverse().reduce((acc, x) => {
    acc[x[0]] = x[1];
    return acc;
}, {}).value()