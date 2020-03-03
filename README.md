# Box Webapp Integration Example
This project contains a [Box Webapp Integration](https://developer.box.com/guides/applications/web-app-integrations/) example using [React.js](https://reactjs.org/) and [Box React UI](https://opensource.box.com/box-ui-elements/) components for the front end implementation and [Express.js](https://expressjs.com/) and the [Box Node SDK](https://github.com/box/box-node-sdk) for the backend implementation.

## Pre-Requisites
1. Signup for a [Box Developer](https://account.box.com/signup/n/developer) account.
2. Signup for a [Salesforce Developer](https://developer.salesforce.com/signup) account.
3. Clone this github repo.
4. Install [Node.js](https://nodejs.org/en/).

## Server-side Instructions
1. Create a [Box JWT application](https://developer.box.com/guides/authentication/jwt/with-sdk/), rename the JWT config file to box_config.json, and place it under the [server](./server) root directory.
> Note: You may swap out the JWT implementation for three-legged OAuth 2.0. There is no hard requirement to use JWT.  

2. In the terminal, change directories to the [server](./server) directory and Install the server-side dependencies.
```
yarn install (or npm install)
```
3. Update the [.env](./server/.env) environment variables file with your Salesforce credentials and the endpoint for your client-side application.
4. If you have not generated a Salesforce security token, you can do so using the following [documentation](https://help.salesforce.com/articleView?id=user_security_token.htm).
5. Deploy the server-side code to your IaaS of choice. Below is the command for Google App Engine.
```
gcloud app deploy app.yaml
```
6. Continue to the Client-side instructions.

## Client-side Instructions
1. In the terminal, change directories to [client](./client) project and install the client-side dependencies
```
cd ../client
yarn install (or npm install)
```
2. Update the following variable:
* [sfdcLightningBaseURL](https://github.com/kylefernandadams/box-webapp-integration-example/blob/master/client/src/FileInfoForm.js#L13)
* [baseServerEnpoint](https://github.com/kylefernandadams/box-webapp-integration-example/blob/master/client/src/FileInfoForm.js#L14) in FileInfo.js with the server-side endpoint deployed in the previous section.
* [baseServerEnpoint](https://github.com/kylefernandadams/box-webapp-integration-example/blob/master/client/src/SfdcRecordInfoForm.js#L10) in SfdcRecordInfoForm.js with the server-side endpoint deployed in the previous section.
3. Create a product build of the project.
```
yarn build (or npm run build)
```

4. Deploy the client-side code to your IaaS of choice. Below is the command for Google App Engine.
```
gcloud app deploy app.yaml
```

5. Continue to the Webapp Integration Configuration instructions.

## Box Webapp Integration Configuration
1. Create a new [Webapp Integration](https://developer.box.com/guides/applications/web-app-integrations/configure/).
2. In the Callback Configuration section, set the Client Callback URL with `webapp-integration-example` at the end:
> Here is an example of a Google App Engine formatted URL: https://client-example-dot-my-gae-project.appspot.com/webapp-integration-example

3. Add a prompt message.
4. Select User experience option to open in a new window.
5. In the Callback Parameters section, Add the following GET parameters:
* Method = GET, Parameter Name = fileId, Parameter Value = #file_id#
* Method = GET, Parameter Name = userId, Parameter Value = #user_id#
6. Navigate to a test file, open the context menu, and click on your newly created Webapp Integration.


## Disclaimer
This project is a collection of open source examples and should not be treated as an officially supported product. Use at your own risk. If you encounter any problems, please log an [issue](https://github.com/kylefernandadams/box-webapp-integration-example/issues).

## License

The MIT License (MIT)

Copyright (c) 2020 Kyle Adams

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
