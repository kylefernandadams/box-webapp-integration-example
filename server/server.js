const express = require('express');
const cors = require('cors');
const BoxSDK = require('box-node-sdk');
const boxConfig = require('./box_config.json');
const sdk = BoxSDK.getPreconfiguredInstance(boxConfig);
const jsforce = require('jsforce');
require('dotenv').config()


let corsOrigin;
if(process.env.NODE_ENV === 'production') {
    const { CLIENT_BASE_ENDPOINT } = process.env;
    corsOrigin = CLIENT_BASE_ENDPOINT;

} else {
    corsOrigin = 'http://localhost:3000';
}

const { SFDC_LOGIN_URL, SFDC_USERNAME, SFDC_PASSWORD, SFDC_SECURITY_TOKEN } = process.env;
const connection = new jsforce.Connection({
    loginUrl: SFDC_LOGIN_URL
});


console.log('Starting server...')
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({ origin: corsOrigin }));

const port = process.env.PORT || 8080;
const server = app.listen(port, () => {
    const host = server.address().address;
    const port = server.address().port;
    console.log(`Express app listening at http://${host}:${port}`);
});

app.post('/box/file-info', (req, res) => {
    const { fileId, userId } = req.body;
    const client = sdk.getAppAuthClient('user', userId);
    const fields = 'id,type,name,owned_by';
    client.files.get(fileId, { fields: fields })
    .then(fileInfo => {
        console.log('Found file info with id: ', fileInfo.id);

        if(!fileInfo.shared_link) {
            return client.files.update(fileId, { shared_link: client.accessLevels.DEFAULT, fields: fields });
        } else {
            return fileInfo;
        }
    })
    .then(fileInfo => {
        console.log('Returning file info with shared_link: ', fileInfo.shared_link.url);
        res.setHeader('Content-Type', 'application/json');
        res.status(200).send(JSON.stringify(fileInfo, null, 2));
    })
    .catch(err => {
        console.log('Failed to get file info: ', err)
        res.status(500).send({ error: err.mesage });
    });
});

app.get('/sfdc/record-info', (req, res) => {
    const { recordId, sobject } = req.query;

    connection.login(SFDC_USERNAME, SFDC_PASSWORD + SFDC_SECURITY_TOKEN)
    .then(userInfo => {
        console.log('Access token: ', connection.accessToken);
        console.log('Instance url: ', connection.instanceUrl);
        console.log('User id: ', userInfo.id);
        console.log('Org Id: ', userInfo.organizationId);

        return connection.sobject(sobject).retrieve(recordId);
    })
    .then(recordInfo => {
        console.log('Found record info: ', recordInfo)

        res.setHeader('Content-Type', 'application/json');
        res.status(200).send(JSON.stringify(recordInfo, null, 2));
    })
    .catch(err => {
        console.log('Failed to get record info: ', err)
        res.status(500).send({ error: err.mesage });
    });

});

app.post('/sfdc/feed-item', (req, res) => {
    const { recordId, text } = req.body;

    connection.login(SFDC_USERNAME, SFDC_PASSWORD + SFDC_SECURITY_TOKEN)
    .then(userInfo => {
        console.log('Access token: ', connection.accessToken);
        console.log('Instance url: ', connection.instanceUrl);
        console.log('User id: ', userInfo.id);
        console.log('Org Id: ', userInfo.organizationId);
        return connection.chatter.resource('/feed-elements').create({
            body: {
              messageSegments: [{
                type: 'Text',
                text: text
                }]
            },
            feedElementType : 'FeedItem',
            subjectId: recordId
          });
    })
    .then(feedItem => {
        console.log('Found feed item info: ', feedItem);

        res.setHeader('Content-Type', 'application/json');
        res.status(200).send(JSON.stringify(feedItem.body, null, 2));
    })
    .catch(err => {
        console.log('Failed to post feed item: ', err)
        res.status(500).send({ error: err.mesage });
    });
});

