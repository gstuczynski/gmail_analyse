var fs = require('fs');

function createFile(sendersCount, outFormat, separator) {

    try {
        fs.mkdirSync('output')
        console.log("Created output directory")
    } catch (err) {
        if (err.code !== 'EEXIST') throw err
    }

    if (outFormat == "json" || outFormat == "both") {
        fs.writeFile('output/senders.json', JSON.stringify(sendersCount), 'utf8', (err, data) => {
            if (err) {
                console.log(err);
            } else {
                console.log("Created file output/senders.json");
            }
        });
    }

    if (outFormat == "csv" || outFormat == "both") {
        var csvsfsdfasd = Object.keys(sendersCount).map(key => (key + separator + sendersCount[key]));
        fs.writeFile('output/senders.csv', csvsfsdfasd.join('\n'), 'utf8', (err, data) => {
            if (err) {
                console.log(err);
            } else {
                console.log("Created file output/senders.csv");
            }
        });
    }
}
module.exports = createFile;