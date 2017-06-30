var google = require('googleapis');
var sheets = google.sheets('v4');

function sendDataToSheet(auth, addr, count, id) {
    instertData(auth, addr, count, id)
    //addSheet(auth,'sss')
    console.log(data)
}
module.exports = sendDataToSheet;

function addSheet(auth, title) {
    return new Promise((resolve, reject) => {
        var request = {
            resource: {
                "properties": {
                    "title": title
                }
            },
            auth: auth
        }
        sheets.spreadsheets.create(request, function (err, response) {
            if (err) {
                console.log(err);
                reject('The API returned an error: ' + err);
                return;
            }
            console.log(JSON.stringify(response, null, 2));
            resolve(response.spreadsheetId)
        });
    });
}

function instertData(auth, addr, count, id) {
console.log(addr+"..."+count)
    var request = {
        spreadsheetId: id,
        range: 'Arkusz1!A1:B14',
        valueInputOption: 'RAW',
        resource: {
            "range": "Arkusz1!A1:B14",
            "values": [
                [addr, count]
            ],
        },
        auth: auth
    };
    sheets.spreadsheets.values.append(request, function (err, response) {
        if (err) {
            console.log(err)
            return;
        }
        console.log(response)
    });
    // console.log('s')
    //  return id;
}